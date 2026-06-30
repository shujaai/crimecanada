import type { ExplorerFilters } from "./filters";
import type { TorontoFacetNeighbourhood } from "./tps";

interface AskParserContext {
  divisions: string[];
  neighbourhoods: TorontoFacetNeighbourhood[];
  legacyNeighbourhoods: TorontoFacetNeighbourhood[];
}

export interface AskParseResult {
  filters: ExplorerFilters;
  understood: string[];
  notUsed: string[];
}

interface OffenceRule {
  slug: string;
  label: string;
  aliases: string[];
}

const OFFENCE_RULES: OffenceRule[] = [
  {
    slug: "theft-from-motor-vehicle-open-data",
    label: "Theft From Motor Vehicle",
    aliases: [
      "theft from motor vehicle",
      "theft from a motor vehicle",
      "theft from vehicle",
      "theft from a vehicle",
    ],
  },
  {
    slug: "break-and-enter-open-data",
    label: "Break and Enter",
    aliases: ["break and enter", "break ins", "break in", "b and e"],
  },
  {
    slug: "auto-theft-open-data",
    label: "Auto Theft",
    aliases: ["auto theft", "car theft", "stolen car", "stolen cars"],
  },
  {
    slug: "theft-over-open-data",
    label: "Theft Over",
    aliases: ["theft over"],
  },
  {
    slug: "robbery-open-data",
    label: "Robbery",
    aliases: ["robbery", "robberies"],
  },
  {
    slug: "assault-open-data",
    label: "Assault",
    aliases: ["assault", "assaults"],
  },
];

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "crime",
  "crimes",
  "during",
  "for",
  "from",
  "in",
  "incident",
  "incidents",
  "me",
  "of",
  "please",
  "record",
  "records",
  "show",
  "the",
  "toronto",
]);

const LEGACY_ALIASES: Record<string, string[]> = {
  "131": ["rouge"],
  "077": ["waterfront communities"],
};

function words(value: string): string[] {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function nameWithoutCode(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function findSequence(
  tokens: string[],
  needle: string[],
  consumed: boolean[],
): number {
  if (!needle.length || needle.length > tokens.length) return -1;
  for (let start = 0; start <= tokens.length - needle.length; start += 1) {
    let matches = true;
    for (let offset = 0; offset < needle.length; offset += 1) {
      if (consumed[start + offset] || tokens[start + offset] !== needle[offset]) {
        matches = false;
        break;
      }
    }
    if (matches) return start;
  }
  return -1;
}

function consumeSequence(
  tokens: string[],
  phrase: string,
  consumed: boolean[],
): boolean {
  const needle = words(phrase);
  const start = findSequence(tokens, needle, consumed);
  if (start < 0) return false;
  for (let offset = 0; offset < needle.length; offset += 1) {
    consumed[start + offset] = true;
  }
  return true;
}

function unusedPhrases(tokens: string[], consumed: boolean[]): string[] {
  const phrases: string[] = [];
  let current: string[] = [];

  function flush() {
    if (current.length) phrases.push(current.join(" "));
    current = [];
  }

  tokens.forEach((token, index) => {
    if (consumed[index] || STOP_WORDS.has(token)) {
      flush();
    } else {
      current.push(token);
    }
  });
  flush();
  return phrases;
}

/** Compile a plain question into the shared, URL-serializable filter state. */
export function parseAskQuestion(
  question: string,
  context: AskParserContext,
): AskParseResult {
  const tokens = words(question);
  const consumed = tokens.map(() => false);
  const filters: ExplorerFilters = { offence: [], geocodable: "any" };
  const understood: string[] = [];

  for (const rule of OFFENCE_RULES) {
    let matched = false;
    const aliases = [...rule.aliases].sort(
      (a, b) => words(b).length - words(a).length,
    );
    for (const alias of aliases) {
      while (consumeSequence(tokens, alias, consumed)) matched = true;
    }
    if (matched) {
      filters.offence.push(rule.slug);
      understood.push(`Offence · ${rule.label}`);
    }
  }

  const years: number[] = [];
  tokens.forEach((token, index) => {
    if (!consumed[index] && /^(?:19|20)\d{2}$/.test(token)) {
      years.push(Number(token));
      consumed[index] = true;
    }
  });
  if (years.length) {
    const first = Math.min(...years);
    const last = Math.max(...years);
    filters.dateFrom = `${first}-01-01`;
    filters.dateTo = `${last}-12-31`;
    understood.push(
      first === last ? `Year · ${first}` : `Years · ${first}–${last}`,
    );
  }

  for (const division of context.divisions) {
    const number = division.replace(/^D/i, "");
    if (
      consumeSequence(tokens, division, consumed)
      || consumeSequence(tokens, `${number} division`, consumed)
    ) {
      filters.division = division;
      understood.push(`Division · ${division}`);
      break;
    }
  }

  const neighbourhoodCandidates = [
    ...context.neighbourhoods.map((item) => ({
      ...item,
      system: "158" as const,
      aliases: [nameWithoutCode(item.name)],
    })),
    ...context.legacyNeighbourhoods.map((item) => ({
      ...item,
      system: "140" as const,
      aliases: [
        nameWithoutCode(item.name),
        ...(LEGACY_ALIASES[item.code] ?? []),
      ],
    })),
  ].sort((a, b) => {
    const aLength = Math.max(...a.aliases.map((alias) => words(alias).length));
    const bLength = Math.max(...b.aliases.map((alias) => words(alias).length));
    return bLength - aLength;
  });

  let neighbourhoodMatched = false;
  for (const candidate of neighbourhoodCandidates) {
    const aliases = [...candidate.aliases].sort(
      (a, b) => words(b).length - words(a).length,
    );
    for (const alias of aliases) {
      if (!consumeSequence(tokens, alias, consumed)) continue;
      if (candidate.system === "158") {
        filters.neighbourhood = candidate.code;
        understood.push(
          `Neighbourhood · ${nameWithoutCode(candidate.name)} (HOOD_158 ${candidate.code})`,
        );
      } else {
        filters.legacyNeighbourhood = candidate.code;
        understood.push(
          `Neighbourhood · ${nameWithoutCode(candidate.name)} (legacy HOOD_140 ${candidate.code})`,
        );
      }
      neighbourhoodMatched = true;
      break;
    }
    if (neighbourhoodMatched) break;
  }

  return {
    filters,
    understood,
    notUsed: unusedPhrases(tokens, consumed),
  };
}
