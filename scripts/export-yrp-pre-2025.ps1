<#
.SYNOPSIS
  Export YRP historical community-safety occurrences (pre-2025) from ArcGIS FeatureServer.

.DESCRIPTION
  CrimeCanada.io raw collection helper. Writes ONLY to:
    data/raw/yrp/community-safety/incidents/pre-2025/{FreezeDate}/

  DryRun is the default. No network calls and no file writes occur in DryRun mode.
  To export, you must explicitly pass -DryRun:$false AND say RUN EXPORT out of band.

  Does not overwrite existing files. Does not touch the 2026-07-01 freeze.

.PARAMETER FreezeDate
  Source-freeze folder token (default: 2026-07-02).

.PARAMETER DryRun
  When true (default), prints the planned actions only.

.PARAMETER LayerUrl
  ArcGIS FeatureServer layer URL. Defaults to primary historical candidate Occurrence_Data_2020_to_2023.

.PARAMETER WhereClause
  ArcGIS SQL where clause for pre-2025 filter.

.PARAMETER PageSize
  Records per paginated query (capped by service maxRecordCount).

.EXAMPLE
  # Safe default — prints plan only
  powershell -File scripts/export-yrp-pre-2025.ps1

.EXAMPLE
  # Live export (only after RUN EXPORT approval)
  powershell -File scripts/export-yrp-pre-2025.ps1 -FreezeDate 2026-07-02 -LayerUrl "https://..." -DryRun:$false
#>

[CmdletBinding()]
param(
    [string] $FreezeDate = "2026-07-02",
    [switch] $DryRun = $true,
    [string] $LayerUrl = "https://services8.arcgis.com/lYI034SQcOoxRCR7/arcgis/rest/services/Occurrence_Data_2020_to_2023/FeatureServer/0",
    [string] $WhereClause = "occ_date < DATE '2025-01-01'",
    [int] $PageSize = 2000
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$YrpRoot = Join-Path $RepoRoot "data\raw\yrp\community-safety"
$OutDir = Join-Path $YrpRoot "incidents\pre-2025\$FreezeDate"
$OutFileName = "yrp-community-safety-occurrences-historical-pre-2025-$FreezeDate-with-geometry.csv"
$OutPath = Join-Path $OutDir $OutFileName
$ManifestPath = Join-Path $OutDir "yrp-pre-2025-export-manifest.json"
$SchemaAuditPath = Join-Path $YrpRoot "source-freeze-$FreezeDate\reports\yrp-historical-export-schema-audit.json"

$OfficialPortalUrl = "https://community-safety-portal-datayrp.hub.arcgis.com/"
$BaselineLayerUrl = "https://services8.arcgis.com/lYI034SQcOoxRCR7/arcgis/rest/services/Occurrence_Data_View/FeatureServer/0"
# Secondary comparison candidate only — not the default export target:
# https://services8.arcgis.com/lYI034SQcOoxRCR7/arcgis/rest/services/Occurrence_2016_to_2019/FeatureServer/0
$BaselineFieldsPath = Join-Path $YrpRoot "_audit\2026-07-01\yrp-occurrence-fields.csv"

function Write-PlanLine {
    param([string] $Message)
    Write-Host "[plan] $Message"
}

function Write-StepLine {
    param([string] $Message)
    Write-Host "[step] $Message"
}

function Get-FileSha256 {
    param([string] $Path)
    $hash = Get-FileHash -Path $Path -Algorithm SHA256
    return $hash.Hash.ToLowerInvariant()
}

function Invoke-ArcGisJson {
    param([string] $Url)
    return Invoke-RestMethod -Uri $Url -Method Get -Headers @{ Accept = "application/json" }
}

function Get-LayerMetadata {
    param([string] $Url)
    $metaUrl = if ($Url -match '\?\$') { "$Url&" } elseif ($Url -match '\?') { "$Url&" } else { "$Url?" }
    $metaUrl = "$metaUrl" + "f=json"
    return Invoke-ArcGisJson -Url $metaUrl
}

function Get-FeatureCount {
    param(
        [string] $Url,
        [string] $Where
    )
    $encodedWhere = [uri]::EscapeDataString($Where)
    $countUrl = "$Url/query?where=$encodedWhere&returnCountOnly=true&f=json"
    $resp = Invoke-ArcGisJson -Url $countUrl
    return [int]$resp.count
}

function Export-PaginatedFeaturesToCsv {
    param(
        [string] $Url,
        [string] $Where,
        [int] $BatchSize,
        [string] $Destination
    )

    $encodedWhere = [uri]::EscapeDataString($Where)
    $total = Get-FeatureCount -Url $Url -Where $Where
    Write-StepLine "Total matching features: $total"

    $offset = 0
    $headerWritten = $false
    $rowsWritten = 0

    while ($offset -lt $total) {
        $queryUrl = "$Url/query?where=$encodedWhere&outFields=*&returnGeometry=true&outSR=4326&f=json&resultOffset=$offset&resultRecordCount=$BatchSize"
        Write-StepLine "Fetching offset=$offset batchSize=$BatchSize"
        $page = Invoke-ArcGisJson -Url $queryUrl

        if (-not $page.features -or $page.features.Count -eq 0) {
            break
        }

        $rows = foreach ($feature in $page.features) {
            $row = [ordered]@{}
            foreach ($prop in $feature.attributes.PSObject.Properties) {
                $row[$prop.Name] = $prop.Value
            }
            if ($feature.geometry) {
                if ($feature.geometry.x -ne $null) { $row["Longitude"] = $feature.geometry.x }
                if ($feature.geometry.y -ne $null) { $row["Latitude"] = $feature.geometry.y }
            }
            [pscustomobject]$row
        }

        if (-not $headerWritten) {
            $rows | Export-Csv -Path $Destination -NoTypeInformation -Encoding UTF8
            $headerWritten = $true
        }
        else {
            $rows | Export-Csv -Path $Destination -NoTypeInformation -Encoding UTF8 -Append
        }

        $rowsWritten += $rows.Count
        $offset += $BatchSize
    }

    return $rowsWritten
}

function Compare-SchemaFields {
    param(
        [object[]] $LayerFields,
        [string] $BaselineCsvPath
    )

    $baselineNames = @()
    if (Test-Path -LiteralPath $BaselineCsvPath) {
        $baselineNames = Import-Csv -LiteralPath $BaselineCsvPath | ForEach-Object { $_.name }
    }

    $layerNames = @($LayerFields | ForEach-Object { $_.name })
    $missingInLayer = @($baselineNames | Where-Object { $_ -notin $layerNames })
    $extraInLayer = @($layerNames | Where-Object { $_ -notin $baselineNames })

    return [pscustomobject]@{
        baseline_field_count = $baselineNames.Count
        layer_field_count    = $layerNames.Count
        missing_in_layer     = $missingInLayer
        extra_in_layer       = $extraInLayer
        match                = ($missingInLayer.Count -eq 0 -and $extraInLayer.Count -eq 0)
    }
}

Write-Host ""
Write-Host "=== YRP Pre-2025 Export ==="
Write-Host "DryRun: $DryRun"
Write-Host "FreezeDate: $FreezeDate"
Write-Host "Output dir: $OutDir"
Write-Host "Output file: $OutPath"
Write-Host "Official portal: $OfficialPortalUrl"
Write-Host "Baseline layer (2025+): $BaselineLayerUrl"
Write-Host "Layer URL: $LayerUrl"
Write-Host "Where clause: $WhereClause"
Write-Host ""

Write-PlanLine "Candidate audit: data/raw/yrp/community-safety/source-freeze-$FreezeDate/reports/yrp-pre-2025-source-candidate-audit.csv"
Write-PlanLine "Would ensure output directory exists: $OutDir"
Write-PlanLine "Would refuse to overwrite if file already exists: $OutPath"
Write-PlanLine "Would refuse to overwrite if manifest already exists: $ManifestPath"

if ($DryRun) {
    Write-PlanLine "DryRun mode — no network requests and no file writes."
    Write-PlanLine "Pagination hook: query with resultOffset/resultRecordCount (page size $PageSize)."
    Write-PlanLine "Count hook: query?returnCountOnly=true for where=[$WhereClause]."
    Write-PlanLine "Schema hook: compare layer fields vs $BaselineFieldsPath."
    Write-PlanLine "Checksum hook: SHA-256 of output CSV written to manifest."
    Write-PlanLine "Source URL hook: official_url + endpoint_url stored in manifest."
    Write-PlanLine ""
    Write-PlanLine "To run live export after RUN EXPORT approval:"
    Write-PlanLine "  powershell -File scripts/export-yrp-pre-2025.ps1 -FreezeDate $FreezeDate -DryRun:`$false"
    Write-Host ""
    exit 0
}

if ([string]::IsNullOrWhiteSpace($LayerUrl)) {
    throw "LayerUrl is required when -DryRun:`$false. Complete discovery first."
}

if (Test-Path -LiteralPath $OutPath) {
    throw "Refusing to overwrite existing file: $OutPath"
}

if (Test-Path -LiteralPath $ManifestPath) {
    throw "Refusing to overwrite existing manifest: $ManifestPath"
}

if (-not (Test-Path -LiteralPath $OutDir)) {
    New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
}

Write-StepLine "Fetching layer metadata from: $LayerUrl"
$layerMeta = Get-LayerMetadata -Url $LayerUrl
$maxRecordCount = [int]$layerMeta.maxRecordCount
if ($maxRecordCount -gt 0 -and $PageSize -gt $maxRecordCount) {
    Write-StepLine "Capping PageSize $PageSize to service maxRecordCount $maxRecordCount"
    $PageSize = $maxRecordCount
}

Write-StepLine "Running pre-export count proof for: $WhereClause"
$matchCount = Get-FeatureCount -Url $LayerUrl -Where $WhereClause
if ($matchCount -le 0) {
    throw "Pre-2025 count proof failed: count=$matchCount for where=[$WhereClause]"
}

Write-StepLine "Comparing schema against baseline fields CSV"
$schemaDiff = Compare-SchemaFields -LayerFields $layerMeta.fields -BaselineCsvPath $BaselineFieldsPath
$schemaAudit = [ordered]@{
    generated_at_utc = (Get-Date).ToUniversalTime().ToString("o")
    layer_url        = $LayerUrl
    where_clause     = $WhereClause
    schema_diff      = $schemaDiff
}
$schemaDir = Split-Path -Parent $SchemaAuditPath
if (-not (Test-Path -LiteralPath $schemaDir)) {
    New-Item -ItemType Directory -Path $schemaDir -Force | Out-Null
}
$schemaAudit | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $SchemaAuditPath -Encoding UTF8

Write-StepLine "Exporting paginated features to: $OutPath"
$exportedRows = Export-PaginatedFeaturesToCsv -Url $LayerUrl -Where $WhereClause -BatchSize $PageSize -Destination $OutPath

Write-StepLine "Computing SHA-256 checksum"
$checksum = Get-FileSha256 -Path $OutPath

$manifest = [ordered]@{
    jurisdiction_id     = "yrp"
    dataset_group       = "yrp_community_safety_incidents_historical_pre_2025"
    freeze_date         = $FreezeDate
    official_url        = $OfficialPortalUrl
    endpoint_url        = $LayerUrl
    where_clause        = $WhereClause
    source_file         = $OutFileName
    output_path         = ($OutPath -replace [regex]::Escape($RepoRoot + "\"), "" -replace "\\", "/")
    row_count           = $exportedRows
    pre_export_count    = $matchCount
    file_checksum_sha256 = $checksum
    exported_at_utc     = (Get-Date).ToUniversalTime().ToString("o")
    schema_audit_path   = ($SchemaAuditPath -replace [regex]::Escape($RepoRoot + "\"), "" -replace "\\", "/")
    schema_match        = $schemaDiff.match
    pagination_page_size = $PageSize
    notes               = "Historical pre-2025 export; separate from 2026-07-01 Occurrence_Data_View freeze."
}
$manifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $ManifestPath -Encoding UTF8

Write-Host ""
Write-Host "Export complete."
Write-Host "Rows written: $exportedRows"
Write-Host "SHA-256: $checksum"
Write-Host "Manifest: $ManifestPath"
Write-Host ""
