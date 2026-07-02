/**
 * Researcher Mode is a pure client-side presentation preference: off by
 * default, it reveals technical labels/field names that already exist in the
 * UI (e.g. neighbourhood HOOD_158 codes) instead of hiding them behind
 * plain-language text.
 *
 * Deliberately implemented with `window.history.replaceState` (not the
 * Next.js router) so toggling it never triggers navigation, a data refetch,
 * or any change to query semantics — it only changes what is rendered.
 * State is shared between independent components (the toggle in
 * ExplorerShell and FilterBar) via the URL plus a same-window custom event,
 * avoiding any global state store.
 */

import { useSyncExternalStore } from "react";

const PARAM = "researcher";
const CHANGE_EVENT = "crimecanada:researcher-mode-change";

export function isResearcherModeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get(PARAM) === "1";
}

export function setResearcherModeEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (enabled) {
    url.searchParams.set(PARAM, "1");
  } else {
    url.searchParams.delete(PARAM);
  }
  window.history.replaceState(null, "", url.toString());
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeToResearcherMode(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

function getServerSnapshot(): boolean {
  return false;
}

/** Subscribes a component to the shared researcher-mode flag. */
export function useResearcherMode(): boolean {
  return useSyncExternalStore(
    subscribeToResearcherMode,
    isResearcherModeEnabled,
    getServerSnapshot,
  );
}
