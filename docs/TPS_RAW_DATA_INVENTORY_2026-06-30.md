# TPS Raw Data Inventory — 2026-06-30

Read-only structural inventory of CSV files under `data/raw/tps/_downloads/2026-06-30`.

## Executive summary

- **Directory inspected:** `data/raw/tps/_downloads/2026-06-30`
- **File count:** 74 CSV files
- **Total size:** ~1,034.5 MB (1,084,517,789 bytes; includes relocated Major Crime Indicators file)
- **Inspection date:** 2026-06-30
- **Aggregate / non-incident datasets (classification below):** 51
- **Other datasets (event-level, open data, or participant-level):** 23

### Relocated file (2026-06-30)

`Major_Crime_Indicators_Open_Data.csv` was moved from `data/raw/tps/major-crime-indicators/2026-06-30/original-file.csv` into `_downloads/2026-06-30/`. Empty `major-crime-indicators/` folders were removed. File contents unchanged (SHA-256: `163D9F39EA22659BA0BDF740495CFEED0D23F5C3A0E20D0A3038BC47EE74FBE1`).

### Duplicate-sized file pairs

- 145.86 MB: `Traffic_Collisions_Open_Data_8128730402587031536 (1).csv`, `Traffic_Collisions_Open_Data_8128730402587031536.csv`
- 304.3 KB: `Homicides_Open_Data_ASR_RC_TBL_002_8369086210015881422 (1).csv`, `Homicides_Open_Data_ASR_RC_TBL_002_8369086210015881422.csv`

### Schema families

| Family | Column count | Representative files |
|--------|-------------:|----------------------|
| Major Crime Open Data | 31 | Assault, Auto Theft, Break and Enter, Robbery, Theft From Motor Vehicle, Theft Over, Major Crime Indicators (combined) |
| KSI / collision participant | 54 | AUTOMOBILE_KSI, CYCLIST_KSI, FATALS_KSI, MOTORCYCLIST_KSI, PASSENGER_KSI, PEDESTRIAN_KSI, TOTAL_KSI |
| FIRS contact records | 15 | 2008_FIRS through 2013_FIRS |
| Annual Report aggregate (ASR_*) | varies | Reported_Crimes, Arrested_and_Charged_Persons, Tickets_Issued, etc. |
| Budget line items | 12 | Budget_2020 through Budget_2026, Budget_by_Command |
| Traffic Collisions Open Data | 23 | Traffic_Collisions_Open_Data (2 copies) |
| Neighbourhood crime rates matrix | 222 | Neighbourhood_Crime_Rates_Open_Data |

### Identifier facts (cross-file)

- **`OBJECTID` / `ObjectId` / `OBJECTID_1`:** Present in most open-data and ASR tables. Open-data files use uppercase `OBJECTID` (unique within file). ASR/Budget/RBDC files use camelCase `ObjectId` (unique within file). Reference layers use `OBJECTID_1`.
- **`EVENT_UNIQUE_ID`:** Present in Major Crime Open Data, Bicycle Thefts, Homicides, Hate Crime, Mental Health Act Apprehensions, Shooting and Firearm Discharges, Traffic Collisions. **Not unique** in most Major Crime files (multiple rows per event). **Unique** in Hate Crime, Shooting and Firearm Discharges, and Traffic Collisions.
- **FIRS files:** Use `CONTACTID`; no OBJECTID or EVENT_UNIQUE_ID.
- **Persons in Crisis:** Uses `EVENT_ID` (unique) instead of EVENT_UNIQUE_ID.

### Coordinate facts (cross-file)

- **WGS84 via `LAT_WGS84` / `LONG_WGS84`:** Major Crime Open Data (6 per-offence files + Major Crime Indicators combined export), Homicides (2), Shooting, Bicycle Thefts, Traffic Collisions (2).
- **WGS84 via `LATITUDE` / `LONGITUDE`:** All KSI files (7), Police Facilities.
- **No WGS84 lat/lng columns:** Hate Crime, Mental Health Act Apprehensions, Persons in Crisis, Intimate Partner and Family Violence, all ASR/Budget/RBDC/FIRS files.
- **Rows with 0,0 coordinates (where WGS84 pair exists):** Assault 4,125; Auto Theft 858; Bicycle Thefts 347; Break and Enter 569; Homicides 0; Robbery 1,105; Shooting 63; Theft From MV 1,250; Theft Over 295; Traffic Collisions **131,978** (each copy).

### Personal-name-like field scan

- No columns matching first name, last name, surname, or given name patterns were found in any file.
- Budget files (2020–2023 schema) contain organizational name fields: `Command Name`, `Pillar Name`, `District Name`, `Unit Name`, `Cost Element Long Name`.
- Budget files (2024+ schema) use underscore variants: `Command_Name`, `Pillar_Name`, `District_Name`, `Unit_Name`, `Cost_Element_Long_Name`.
- FIRS files contain `UNIQUE_PERSON_ID` (identifier, not a personal name). RBDC Arrests contains `PersonID`.

### Non-incident / aggregate classification

Files classified **yes** under aggregate/non-incident based on filename patterns, presence of summary COUNT columns without event identifiers, or reference/geometry role:

- `2008_FIRS_-2679553021179060779.csv` — 2008 FIRS
- `2009_FIRS_-5907723437875695368.csv` — 2009 FIRS
- `2010_FIRS_-2517232609472490769.csv` — 2010 FIRS
- `2011_FIRS_-4422831101139071978.csv` — 2011 FIRS
- `2012_FIRS_7370968145260043353.csv` — 2012 FIRS
- `2013_FIRS_8501434035380412761.csv` — 2013 FIRS
- `Administrative_(ASR_AD_TBL_001)_1478935144902378667.csv` — Administrative (ASR AD TBL 001)
- `Arrested_and_Charged_Persons_(ASR_ENF_TBL_001)_548544473732615405.csv` — Arrested and Charged Persons (ASR ENF TBL 001)
- `Budget_2020_8087021416505284746.csv` — Budget 2020
- `Budget_2021_2456030383083920061.csv` — Budget 2021
- `Budget_2022_-2655320733178210418.csv` — Budget 2022
- `Budget_2023_1284559222086023539.csv` — Budget 2023
- `Budget_2024 (1).csv` — Budget
- `Budget_2024.csv` — Budget
- `Budget_2025.csv` — Budget
- `Budget_2026.csv` — Budget
- `Budget_by_Command.csv` — Budget by Command
- `Calls_for_Service_Attended_(ASR_CS_TBL_003)_8360330772672605309.csv` — Calls for Service Attended (ASR CS TBL 003)
- `Complaint_Dispositions_(ASR_PCF_TBL_003)_-5877412472568242550.csv` — Complaint Dispositions (ASR PCF TBL 003)
- `Dispatched_Calls_by_Division_(ASR_CS_TBL_001)_-2648219355645136891.csv` — Dispatched Calls by Division (ASR CS TBL 001)
- `Firearms_Top_Calibres_(ASR_F_TBL_001)_-5421012277072395013.csv` — Firearms Top Calibres (ASR F TBL 001)
- `Gross_Expenditures_by_Division_(ASR_PB_TBL_001)_3825889777885479982.csv` — Gross Expenditures by Division (ASR PB TBL 001)
- `Gross_Operating_Budget_(ASR_PB_TBL_005)_-1923772532052292360.csv` — Gross Operating Budget (ASR PB TBL 005)
- `Intimate_Partner_and_Family_Violence_open_data_-3830886989670353627.csv` — Intimate Partner and Family Violence open data
- `Investigated_Alleged_Misconduct_(ASR_PCF_TBL_002)_-2085696945410791167.csv` — Investigated Alleged Misconduct (ASR PCF TBL 002)
- `Miscellaneous_Calls_for_Service_(ASR_CS_TBL_002)_-4714122475863368795.csv` — Miscellaneous Calls for Service (ASR CS TBL 002)
- `Miscellaneous_Data_(ASR_MISC_TBL_001)_2360693627772460444.csv` — Miscellaneous Data (ASR MISC TBL 001)
- `Miscellaneous_Firearms_(ASR_F_TBL_003)_5714712306071097312.csv` — Miscellaneous Firearms (ASR F TBL 003)
- `Neighbourhood_Crime_Rates_Open_Data_5187007239983414201.csv` — Neighbourhood Crime Rates Open Data
- `Patrol_Zone_-3288783031102167883.csv` — Patrol Zone
- `Personnel_by_Command_(ASR_PB_TBL_004)_8734482224623258744.csv` — Personnel by Command (ASR PB TBL 004)
- `Personnel_by_Rank_(ASR_PB_TBL_002)_4327912300163850055.csv` — Personnel by Rank (ASR PB TBL 002)
- `Personnel_by_Rank_by_Division_(ASR_PB_TBL_003)_5370263291996234710.csv` — Personnel by Rank by Division (ASR PB TBL 003)
- `Police_Facilities_6911054687584621728.csv` — Police Facilities
- `RBDC_ARR_TBL_001_4032986751229720343.csv` — RBDC ARR TBL 001
- `RBDC_UOF_TBL_001_8718036773732049598.csv` — RBDC UOF TBL 001
- `RBDC_UOF_TBL_002_2114656744363348377.csv` — RBDC UOF TBL 002
- `RBDC_UOF_TBL_003_7983536065313291159.csv` — RBDC UOF TBL 003
- `RBDC_UOF_TBL_004_-3558409208154542082.csv` — RBDC UOF TBL 004
- `RBDC_UOF_TBL_005_1242716001725294161.csv` — RBDC UOF TBL 005
- `RBDC_UOF_TBL_006_4119402934590759753.csv` — RBDC UOF TBL 006
- `RBDC_UOF_TBL_007_8618837934118874435.csv` — RBDC UOF TBL 007
- `Regulated_Interactions_(ASR_RI_TBL_001)_3915709414202984778.csv` — Regulated Interactions (ASR RI TBL 001)
- `Reported_Crimes_(ASR_RC_TBL_001)_-3089647980937589388.csv` — Reported Crimes (ASR RC TBL 001)
- `Search_of_Persons_(ASR_SP_TBL_001)_4815884241870621834.csv` — Search of Persons (ASR SP TBL 001)
- `Staffing_by_Command.csv` — Staffing by Command
- `Tickets_Issued_(ASR_ENF_TBL_002)_6312647708442498473.csv` — Tickets Issued (ASR ENF TBL 002)
- `Top_20_Offences_of_Firearm_Seizures_(ASR_F_TBL_002)_3169920589327387274.csv` — Top 20 Offences of Firearm Seizures (ASR F TBL 002)
- `Total_Public_Complaints(ASR_PCF_TBL_001)_-5426935284038049601.csv` — Total Public Complaints(ASR PCF TBL 001)
- `TPS_POLICE_DIVISIONS_-3160015003731132608.csv` — TPS POLICE DIVISIONS
- `Victims_of_Crime_(ASR_VC_TBL_001)_3114193774591085696.csv` — Victims of Crime (ASR VC TBL 001)

Files classified **no** (event-level, participant-level, or open-data incident records) include all Major Crime Open Data, KSI, Hate Crime, Mental Health, Persons in Crisis, Shooting, Traffic Collisions, Intimate Partner (has `COUNT` but row-level dimensional breakdown), and similar.

---

## Per-file inventory

### `2008_FIRS_-2679553021179060779.csv`

- **Detected dataset name:** 2008 FIRS
- **File type:** CSV
- **File size:** 31.96 MB (33,512,940 bytes)
- **Row count:** 323,457 (excluding header)
- **Column count:** 15

**Columns:** `CONTACTID`, `TPS_PATROL_ZONE`, `NATURE_OF_CONTACT`, `CONTACT_DATE`, `CONTACT_TIME`, `CONTACT_YEAR`, `AGE`, `SEX`, `BIRTH_PLACE`, `SKIN_COLOUR`, `YEAR_MONTH_OF_BIRTH`, `UNIQUE_PERSON_ID`, `HOME_CITY`, `HOME_PATROL_ZONE`, `FID`

**First 3 rows (important fields):**

1. `{"CONTACTID": "1761", "CONTACT_DATE": "2008.01.01", "CONTACT_TIME": "19:25:00", "CONTACT_YEAR": "2008", "YEAR_MONTH_OF_BIRTH": "1986 SEP"}`
2. `{"CONTACTID": "1761", "CONTACT_DATE": "2008.01.01", "CONTACT_TIME": "19:25:00", "CONTACT_YEAR": "2008", "YEAR_MONTH_OF_BIRTH": "1986 JUL"}`
3. `{"CONTACTID": "1761", "CONTACT_DATE": "2008.01.01", "CONTACT_TIME": "19:25:00", "CONTACT_YEAR": "2008", "YEAR_MONTH_OF_BIRTH": "1985 JUN"}`

**Blank/null counts per column:**

- `CONTACTID`: 0
- `TPS_PATROL_ZONE`: 0
- `NATURE_OF_CONTACT`: 5
- `CONTACT_DATE`: 0
- `CONTACT_TIME`: 0
- `CONTACT_YEAR`: 0
- `AGE`: 0
- `SEX`: 8,677
- `BIRTH_PLACE`: 201,750
- `SKIN_COLOUR`: 25,862
- `YEAR_MONTH_OF_BIRTH`: 2,639
- `UNIQUE_PERSON_ID`: 364
- `HOME_CITY`: 156,970
- `HOME_PATROL_ZONE`: 106,854
- `FID`: 0

**Identifiers and geography:**

- Likely row ID column(s): none detected
- OBJECTID exists: no
- OBJECTID unique: N/A
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `CONTACT_DATE`, `CONTACT_TIME`, `CONTACT_YEAR`, `YEAR_MONTH_OF_BIRTH`
- Offence/category columns: none
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- FIRS contact record layout; uses `CONTACTID` without OBJECTID/EVENT_UNIQUE_ID; no coordinates.

### `2009_FIRS_-5907723437875695368.csv`

- **Detected dataset name:** 2009 FIRS
- **File type:** CSV
- **File size:** 33.96 MB (35,614,760 bytes)
- **Row count:** 344,981 (excluding header)
- **Column count:** 15

**Columns:** `CONTACTID`, `TPS_PATROL_ZONE`, `NATURE_OF_CONTACT`, `CONTACT_DATE`, `CONTACT_TIME`, `CONTACT_YEAR`, `AGE`, `SEX`, `BIRTH_PLACE`, `SKIN_COLOUR`, `YEAR_MONTH_OF_BIRTH`, `UNIQUE_PERSON_ID`, `HOME_CITY`, `HOME_PATROL_ZONE`, `FID`

**First 3 rows (important fields):**

1. `{"CONTACTID": "258006", "CONTACT_DATE": "2009.01.01", "CONTACT_TIME": "01:23:00", "CONTACT_YEAR": "2009", "YEAR_MONTH_OF_BIRTH": "1978 OCT"}`
2. `{"CONTACTID": "258007", "CONTACT_DATE": "2009.01.01", "CONTACT_TIME": "01:19:00", "CONTACT_YEAR": "2009", "YEAR_MONTH_OF_BIRTH": "1960 DEC"}`
3. `{"CONTACTID": "258009", "CONTACT_DATE": "2009.01.01", "CONTACT_TIME": "00:13:00", "CONTACT_YEAR": "2009", "YEAR_MONTH_OF_BIRTH": "1970 AUG"}`

**Blank/null counts per column:**

- `CONTACTID`: 0
- `TPS_PATROL_ZONE`: 0
- `NATURE_OF_CONTACT`: 2
- `CONTACT_DATE`: 0
- `CONTACT_TIME`: 0
- `CONTACT_YEAR`: 0
- `AGE`: 0
- `SEX`: 4,716
- `BIRTH_PLACE`: 220,303
- `SKIN_COLOUR`: 20,529
- `YEAR_MONTH_OF_BIRTH`: 3,712
- `UNIQUE_PERSON_ID`: 1,627
- `HOME_CITY`: 146,782
- `HOME_PATROL_ZONE`: 103,019
- `FID`: 0

**Identifiers and geography:**

- Likely row ID column(s): none detected
- OBJECTID exists: no
- OBJECTID unique: N/A
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `CONTACT_DATE`, `CONTACT_TIME`, `CONTACT_YEAR`, `YEAR_MONTH_OF_BIRTH`
- Offence/category columns: none
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- FIRS contact record layout; uses `CONTACTID` without OBJECTID/EVENT_UNIQUE_ID; no coordinates.

### `2010_FIRS_-2517232609472490769.csv`

- **Detected dataset name:** 2010 FIRS
- **File type:** CSV
- **File size:** 36.94 MB (38,729,944 bytes)
- **Row count:** 373,297 (excluding header)
- **Column count:** 15

**Columns:** `CONTACTID`, `TPS_PATROL_ZONE`, `NATURE_OF_CONTACT`, `CONTACT_DATE`, `CONTACT_TIME`, `CONTACT_YEAR`, `AGE`, `SEX`, `BIRTH_PLACE`, `SKIN_COLOUR`, `YEAR_MONTH_OF_BIRTH`, `UNIQUE_PERSON_ID`, `HOME_CITY`, `HOME_PATROL_ZONE`, `FID`

**First 3 rows (important fields):**

1. `{"CONTACTID": "530607", "CONTACT_DATE": "2010.01.01", "CONTACT_TIME": "17:09:00", "CONTACT_YEAR": "2010", "YEAR_MONTH_OF_BIRTH": "1948 MAY"}`
2. `{"CONTACTID": "530607", "CONTACT_DATE": "2010.01.01", "CONTACT_TIME": "17:09:00", "CONTACT_YEAR": "2010", "YEAR_MONTH_OF_BIRTH": "1995 MAR"}`
3. `{"CONTACTID": "530607", "CONTACT_DATE": "2010.01.01", "CONTACT_TIME": "17:09:00", "CONTACT_YEAR": "2010", "YEAR_MONTH_OF_BIRTH": "1990 FEB"}`

**Blank/null counts per column:**

- `CONTACTID`: 0
- `TPS_PATROL_ZONE`: 0
- `NATURE_OF_CONTACT`: 0
- `CONTACT_DATE`: 0
- `CONTACT_TIME`: 0
- `CONTACT_YEAR`: 0
- `AGE`: 0
- `SEX`: 6,032
- `BIRTH_PLACE`: 254,047
- `SKIN_COLOUR`: 30,395
- `YEAR_MONTH_OF_BIRTH`: 4,913
- `UNIQUE_PERSON_ID`: 1,955
- `HOME_CITY`: 133,082
- `HOME_PATROL_ZONE`: 126,065
- `FID`: 0

**Identifiers and geography:**

- Likely row ID column(s): none detected
- OBJECTID exists: no
- OBJECTID unique: N/A
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `CONTACT_DATE`, `CONTACT_TIME`, `CONTACT_YEAR`, `YEAR_MONTH_OF_BIRTH`
- Offence/category columns: none
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- FIRS contact record layout; uses `CONTACTID` without OBJECTID/EVENT_UNIQUE_ID; no coordinates.

### `2011_FIRS_-4422831101139071978.csv`

- **Detected dataset name:** 2011 FIRS
- **File type:** CSV
- **File size:** 38.33 MB (40,195,271 bytes)
- **Row count:** 386,315 (excluding header)
- **Column count:** 15

**Columns:** `CONTACTID`, `TPS_PATROL_ZONE`, `NATURE_OF_CONTACT`, `CONTACT_DATE`, `CONTACT_TIME`, `CONTACT_YEAR`, `AGE`, `SEX`, `BIRTH_PLACE`, `SKIN_COLOUR`, `YEAR_MONTH_OF_BIRTH`, `UNIQUE_PERSON_ID`, `HOME_CITY`, `HOME_PATROL_ZONE`, `FID`

**First 3 rows (important fields):**

1. `{"CONTACTID": "807313", "CONTACT_DATE": "2011.01.01", "CONTACT_TIME": "06:45:00", "CONTACT_YEAR": "2011", "YEAR_MONTH_OF_BIRTH": "1990 JUL"}`
2. `{"CONTACTID": "807316", "CONTACT_DATE": "2011.01.01", "CONTACT_TIME": "09:53:00", "CONTACT_YEAR": "2011", "YEAR_MONTH_OF_BIRTH": "1972 APR"}`
3. `{"CONTACTID": "807318", "CONTACT_DATE": "2011.01.01", "CONTACT_TIME": "10:28:00", "CONTACT_YEAR": "2011", "YEAR_MONTH_OF_BIRTH": "1988 AUG"}`

**Blank/null counts per column:**

- `CONTACTID`: 0
- `TPS_PATROL_ZONE`: 0
- `NATURE_OF_CONTACT`: 0
- `CONTACT_DATE`: 0
- `CONTACT_TIME`: 0
- `CONTACT_YEAR`: 0
- `AGE`: 0
- `SEX`: 6,631
- `BIRTH_PLACE`: 277,201
- `SKIN_COLOUR`: 36,161
- `YEAR_MONTH_OF_BIRTH`: 5,586
- `UNIQUE_PERSON_ID`: 1,583
- `HOME_CITY`: 110,497
- `HOME_PATROL_ZONE`: 179,330
- `FID`: 0

**Identifiers and geography:**

- Likely row ID column(s): none detected
- OBJECTID exists: no
- OBJECTID unique: N/A
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `CONTACT_DATE`, `CONTACT_TIME`, `CONTACT_YEAR`, `YEAR_MONTH_OF_BIRTH`
- Offence/category columns: none
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- FIRS contact record layout; uses `CONTACTID` without OBJECTID/EVENT_UNIQUE_ID; no coordinates.

### `2012_FIRS_7370968145260043353.csv`

- **Detected dataset name:** 2012 FIRS
- **File type:** CSV
- **File size:** 40.33 MB (42,293,561 bytes)
- **Row count:** 404,293 (excluding header)
- **Column count:** 15

**Columns:** `CONTACTID`, `TPS_PATROL_ZONE`, `NATURE_OF_CONTACT`, `CONTACT_DATE`, `CONTACT_TIME`, `CONTACT_YEAR`, `AGE`, `SEX`, `BIRTH_PLACE`, `SKIN_COLOUR`, `YEAR_MONTH_OF_BIRTH`, `UNIQUE_PERSON_ID`, `HOME_CITY`, `HOME_PATROL_ZONE`, `FID`

**First 3 rows (important fields):**

1. `{"CONTACTID": "1089053", "CONTACT_DATE": "2012.01.01", "CONTACT_TIME": "00:17:00", "CONTACT_YEAR": "2012", "YEAR_MONTH_OF_BIRTH": "1973 DEC"}`
2. `{"CONTACTID": "1089054", "CONTACT_DATE": "2012.01.01", "CONTACT_TIME": "00:20:00", "CONTACT_YEAR": "2012", "YEAR_MONTH_OF_BIRTH": "1975 AUG"}`
3. `{"CONTACTID": "1089056", "CONTACT_DATE": "2012.01.01", "CONTACT_TIME": "00:36:00", "CONTACT_YEAR": "2012", "YEAR_MONTH_OF_BIRTH": "1949 MAY"}`

**Blank/null counts per column:**

- `CONTACTID`: 0
- `TPS_PATROL_ZONE`: 0
- `NATURE_OF_CONTACT`: 0
- `CONTACT_DATE`: 0
- `CONTACT_TIME`: 0
- `CONTACT_YEAR`: 0
- `AGE`: 0
- `SEX`: 7,533
- `BIRTH_PLACE`: 303,513
- `SKIN_COLOUR`: 42,952
- `YEAR_MONTH_OF_BIRTH`: 6,768
- `UNIQUE_PERSON_ID`: 1,195
- `HOME_CITY`: 120,227
- `HOME_PATROL_ZONE`: 198,617
- `FID`: 0

**Identifiers and geography:**

- Likely row ID column(s): none detected
- OBJECTID exists: no
- OBJECTID unique: N/A
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `CONTACT_DATE`, `CONTACT_TIME`, `CONTACT_YEAR`, `YEAR_MONTH_OF_BIRTH`
- Offence/category columns: none
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- FIRS contact record layout; uses `CONTACTID` without OBJECTID/EVENT_UNIQUE_ID; no coordinates.

### `2013_FIRS_8501434035380412761.csv`

- **Detected dataset name:** 2013 FIRS
- **File type:** CSV
- **File size:** 18.66 MB (19,568,299 bytes)
- **Row count:** 189,564 (excluding header)
- **Column count:** 15

**Columns:** `CONTACTID`, `TPS_PATROL_ZONE`, `NATURE_OF_CONTACT`, `CONTACT_DATE`, `CONTACT_TIME`, `CONTACT_YEAR`, `AGE`, `SEX`, `BIRTH_PLACE`, `SKIN_COLOUR`, `YEAR_MONTH_OF_BIRTH`, `UNIQUE_PERSON_ID`, `HOME_CITY`, `HOME_PATROL_ZONE`, `FID`

**First 3 rows (important fields):**

1. `{"CONTACTID": "1374702", "CONTACT_DATE": "2013.01.01", "CONTACT_TIME": "00:13:00", "CONTACT_YEAR": "2013", "YEAR_MONTH_OF_BIRTH": "1994 SEP"}`
2. `{"CONTACTID": "1374702", "CONTACT_DATE": "2013.01.01", "CONTACT_TIME": "00:13:00", "CONTACT_YEAR": "2013", "YEAR_MONTH_OF_BIRTH": "1992 JUN"}`
3. `{"CONTACTID": "1374703", "CONTACT_DATE": "2013.01.01", "CONTACT_TIME": "00:24:00", "CONTACT_YEAR": "2013", "YEAR_MONTH_OF_BIRTH": "1951 FEB"}`

**Blank/null counts per column:**

- `CONTACTID`: 0
- `TPS_PATROL_ZONE`: 0
- `NATURE_OF_CONTACT`: 0
- `CONTACT_DATE`: 0
- `CONTACT_TIME`: 0
- `CONTACT_YEAR`: 0
- `AGE`: 0
- `SEX`: 4,148
- `BIRTH_PLACE`: 151,909
- `SKIN_COLOUR`: 23,192
- `YEAR_MONTH_OF_BIRTH`: 4,236
- `UNIQUE_PERSON_ID`: 645
- `HOME_CITY`: 52,890
- `HOME_PATROL_ZONE`: 92,430
- `FID`: 0

**Identifiers and geography:**

- Likely row ID column(s): none detected
- OBJECTID exists: no
- OBJECTID unique: N/A
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `CONTACT_DATE`, `CONTACT_TIME`, `CONTACT_YEAR`, `YEAR_MONTH_OF_BIRTH`
- Offence/category columns: none
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- FIRS contact record layout; uses `CONTACTID` without OBJECTID/EVENT_UNIQUE_ID; no coordinates.

### `Administrative_(ASR_AD_TBL_001)_1478935144902378667.csv`

- **Detected dataset name:** Administrative (ASR AD TBL 001)
- **File type:** CSV
- **File size:** 33.9 KB (34,695 bytes)
- **Row count:** 416 (excluding header)
- **Column count:** 7

**Columns:** `INDEX`, `YEAR`, `SECTION`, `CATEGORY`, `SUBTYPE`, `COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"YEAR": "2014", "CATEGORY": "Lectures/Presentations", "SUBTYPE": "Presentations to community members, organizations, agencies or groups", "ObjectId": "1"}`
2. `{"YEAR": "2014", "CATEGORY": "Lectures/Presentations", "SUBTYPE": "Police Officer lectures/presentations (platoons, divisions, or units)", "ObjectId": "2"}`
3. `{"YEAR": "2014", "CATEGORY": "Lectures/Presentations", "SUBTYPE": "School lectures / presentations", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `YEAR`: 0
- `SECTION`: 0
- `CATEGORY`: 0
- `SUBTYPE`: 0
- `COUNT`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `YEAR`
- Offence/category columns: `CATEGORY`, `SUBTYPE`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Arrested_and_Charged_Persons_(ASR_ENF_TBL_001)_548544473732615405.csv`

- **Detected dataset name:** Arrested and Charged Persons (ASR ENF TBL 001)
- **File type:** CSV
- **File size:** 17.08 MB (17,911,623 bytes)
- **Row count:** 163,738 (excluding header)
- **Column count:** 12

**Columns:** `INDEX`, `ARREST_YEAR`, `DIVISION`, `HOOD_158`, `NEIGHBOURHOOD_158`, `SEX`, `AGE_COHORT`, `AGE_GROUP`, `CATEGORY`, `SUBTYPE`, `ARREST_COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"ARREST_YEAR": "2014", "DIVISION": "D11", "HOOD_158": "087", "NEIGHBOURHOOD_158": "High Park-Swansea (87)", "CATEGORY": "Total Arrests", "SUBTYPE": "Total Arrests", "ObjectId": "1"}`
2. `{"ARREST_YEAR": "2014", "DIVISION": "D11", "HOOD_158": "087", "NEIGHBOURHOOD_158": "High Park-Swansea (87)", "CATEGORY": "Controlled Drugs and Substances Act", "SUBTYPE": "Other", "ObjectId": "2"}`
3. `{"ARREST_YEAR": "2014", "DIVISION": "D11", "HOOD_158": "087", "NEIGHBOURHOOD_158": "High Park-Swansea (87)", "CATEGORY": "Other Criminal Code Violations", "SUBTYPE": "Other", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `ARREST_YEAR`: 0
- `DIVISION`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `SEX`: 0
- `AGE_COHORT`: 0
- `AGE_GROUP`: 0
- `CATEGORY`: 0
- `SUBTYPE`: 0
- `ARREST_COUNT`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `ARREST_YEAR`
- Offence/category columns: `CATEGORY`, `SUBTYPE`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`
- Division columns: `DIVISION`
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Assault_Open_Data_4176353985444773481.csv`

- **Detected dataset name:** Assault Open Data
- **File type:** CSV
- **File size:** 81.99 MB (85,976,861 bytes)
- **Row count:** 254,378 (excluding header)
- **Column count:** 31

**Columns:** `OBJECTID`, `EVENT_UNIQUE_ID`, `REPORT_DATE`, `OCC_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DAY`, `REPORT_DOY`, `REPORT_DOW`, `REPORT_HOUR`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DAY`, `OCC_DOY`, `OCC_DOW`, `OCC_HOUR`, `DIVISION`, `LOCATION_TYPE`, `PREMISES_TYPE`, `UCR_CODE`, `UCR_EXT`, `OFFENCE`, `CSI_CATEGORY`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `LONG_WGS84`, `LAT_WGS84`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "EVENT_UNIQUE_ID": "GO-20141260537", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "4", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOY": "1"}`
2. `{"OBJECTID": "2", "EVENT_UNIQUE_ID": "GO-20141261368", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "7", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOY": "1"}`
3. `{"OBJECTID": "3", "EVENT_UNIQUE_ID": "GO-20141261370", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "7", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOY": "1"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `EVENT_UNIQUE_ID`: 0
- `REPORT_DATE`: 0
- `OCC_DATE`: 0
- `REPORT_YEAR`: 0
- `REPORT_MONTH`: 0
- `REPORT_DAY`: 0
- `REPORT_DOY`: 0
- `REPORT_DOW`: 0
- `REPORT_HOUR`: 0
- `OCC_YEAR`: 141
- `OCC_MONTH`: 141
- `OCC_DAY`: 141
- `OCC_DOY`: 141
- `OCC_DOW`: 141
- `OCC_HOUR`: 0
- `DIVISION`: 0
- `LOCATION_TYPE`: 0
- `PREMISES_TYPE`: 0
- `UCR_CODE`: 0
- `UCR_EXT`: 0
- `OFFENCE`: 0
- `CSI_CATEGORY`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `LONG_WGS84`: 0
- `LAT_WGS84`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: yes
- EVENT_UNIQUE_ID unique: no (216,653 distinct / 254,378 non-blank)
- Date/time columns: `REPORT_DATE`, `OCC_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DOY`, `REPORT_DOW`, `REPORT_HOUR`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DOY`, `OCC_DOW`, `OCC_HOUR`
- Offence/category columns: `LOCATION_TYPE`, `PREMISES_TYPE`, `OFFENCE`, `CSI_CATEGORY`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DIVISION`
- Coordinate columns: `LONG_WGS84`, `LAT_WGS84`, `x`, `y`
- WGS84 lat/lng present: yes (`LAT_WGS84`, `LONG_WGS84`)
- Rows with 0,0 coordinates: 4,125
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LAT_WGS84` and `LONG_WGS84`.
- Has `EVENT_UNIQUE_ID`; uniqueness within file: no (216,653 distinct / 254,378 non-blank).
- Has `OBJECTID`; uniqueness within file: yes.

### `Auto_Theft_Open_Data_4481082360476864088.csv`

- **Detected dataset name:** Auto Theft Open Data
- **File type:** CSV
- **File size:** 27.08 MB (28,390,690 bytes)
- **Row count:** 78,714 (excluding header)
- **Column count:** 31

**Columns:** `OBJECTID`, `EVENT_UNIQUE_ID`, `REPORT_DATE`, `OCC_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DAY`, `REPORT_DOY`, `REPORT_DOW`, `REPORT_HOUR`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DAY`, `OCC_DOY`, `OCC_DOW`, `OCC_HOUR`, `DIVISION`, `LOCATION_TYPE`, `PREMISES_TYPE`, `UCR_CODE`, `UCR_EXT`, `OFFENCE`, `CSI_CATEGORY`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `LONG_WGS84`, `LAT_WGS84`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "EVENT_UNIQUE_ID": "GO-20141262837", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "12/25/2013 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "15", "OCC_YEAR": "2013", "OCC_MONTH": "December", "OCC_DOY": "359"}`
2. `{"OBJECTID": "2", "EVENT_UNIQUE_ID": "GO-20141262914", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "15", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOY": "1"}`
3. `{"OBJECTID": "3", "EVENT_UNIQUE_ID": "GO-20141263217", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "12/31/2013 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "16", "OCC_YEAR": "2013", "OCC_MONTH": "December", "OCC_DOY": "365"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `EVENT_UNIQUE_ID`: 0
- `REPORT_DATE`: 0
- `OCC_DATE`: 0
- `REPORT_YEAR`: 0
- `REPORT_MONTH`: 0
- `REPORT_DAY`: 0
- `REPORT_DOY`: 0
- `REPORT_DOW`: 0
- `REPORT_HOUR`: 0
- `OCC_YEAR`: 6
- `OCC_MONTH`: 6
- `OCC_DAY`: 6
- `OCC_DOY`: 6
- `OCC_DOW`: 6
- `OCC_HOUR`: 0
- `DIVISION`: 0
- `LOCATION_TYPE`: 0
- `PREMISES_TYPE`: 0
- `UCR_CODE`: 0
- `UCR_EXT`: 0
- `OFFENCE`: 0
- `CSI_CATEGORY`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `LONG_WGS84`: 0
- `LAT_WGS84`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: yes
- EVENT_UNIQUE_ID unique: no (71,242 distinct / 78,714 non-blank)
- Date/time columns: `REPORT_DATE`, `OCC_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DOY`, `REPORT_DOW`, `REPORT_HOUR`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DOY`, `OCC_DOW`, `OCC_HOUR`
- Offence/category columns: `LOCATION_TYPE`, `PREMISES_TYPE`, `OFFENCE`, `CSI_CATEGORY`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DIVISION`
- Coordinate columns: `LONG_WGS84`, `LAT_WGS84`, `x`, `y`
- WGS84 lat/lng present: yes (`LAT_WGS84`, `LONG_WGS84`)
- Rows with 0,0 coordinates: 858
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LAT_WGS84` and `LONG_WGS84`.
- Has `EVENT_UNIQUE_ID`; uniqueness within file: no (71,242 distinct / 78,714 non-blank).
- Has `OBJECTID`; uniqueness within file: yes.

### `AUTOMOBILE_KSI_-3713167661214258977.csv`

- **Detected dataset name:** AUTOMOBILE KSI
- **File type:** CSV
- **File size:** 6.59 MB (6,911,109 bytes)
- **Row count:** 17,230 (excluding header)
- **Column count:** 54

**Columns:** `OBJECTID`, `INDEX`, `ACCNUM`, `DATE`, `TIME`, `STREET1`, `STREET2`, `OFFSET`, `ROAD_CLASS`, `DISTRICT`, `LATITUDE`, `LONGITUDE`, `ACCLOC`, `TRAFFCTL`, `VISIBILITY`, `LIGHT`, `RDSFCOND`, `ACCLASS`, `IMPACTYPE`, `INVTYPE`, `INVAGE`, `INJURY`, `FATAL_NO`, `INITDIR`, `VEHTYPE`, `MANOEUVER`, `DRIVACT`, `DRIVCOND`, `PEDTYPE`, `PEDACT`, `PEDCOND`, `CYCLISTYPE`, `CYCACT`, `CYCCOND`, `PEDESTRIAN`, `CYCLIST`, `AUTOMOBILE`, `MOTORCYCLE`, `TRUCK`, `TRSN_CITY_VEH`, `EMERG_VEH`, `PASSENGER`, `SPEEDING`, `AG_DRIV`, `REDLIGHT`, `ALCOHOL`, `DISABILITY`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `DIVISION`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "ACCNUM": "893184", "DATE": "1/1/2006 5:00:00 AM", "TIME": "236", "DISTRICT": "Toronto and East York", "LATITUDE": "43.699595", "LONGITUDE": "-79.318797", "IMPACTYPE": "Approaching", "INVTYPE": "Passenger", "VEHTYPE": "", "PEDTYPE": "", "CYCLISTYPE": ""}`
2. `{"OBJECTID": "2", "ACCNUM": "893184", "DATE": "1/1/2006 5:00:00 AM", "TIME": "236", "DISTRICT": "Toronto and East York", "LATITUDE": "43.699595", "LONGITUDE": "-79.318797", "IMPACTYPE": "Approaching", "INVTYPE": "Passenger", "VEHTYPE": "", "PEDTYPE": "", "CYCLISTYPE": ""}`
3. `{"OBJECTID": "3", "ACCNUM": "893184", "DATE": "1/1/2006 5:00:00 AM", "TIME": "236", "DISTRICT": "Toronto and East York", "LATITUDE": "43.699595", "LONGITUDE": "-79.318797", "IMPACTYPE": "Approaching", "INVTYPE": "Driver", "VEHTYPE": "Automobile, Station Wagon", "PEDTYPE": "", "CYCLISTYPE": ""}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `INDEX`: 0
- `ACCNUM`: 4,518
- `DATE`: 0
- `TIME`: 0
- `STREET1`: 0
- `STREET2`: 1,555
- `OFFSET`: 13,791
- `ROAD_CLASS`: 451
- `DISTRICT`: 210
- `LATITUDE`: 0
- `LONGITUDE`: 0
- `ACCLOC`: 4,923
- `TRAFFCTL`: 70
- `VISIBILITY`: 18
- `LIGHT`: 2
- `RDSFCOND`: 25
- `ACCLASS`: 1
- `IMPACTYPE`: 24
- `INVTYPE`: 11
- `INVAGE`: 0
- `INJURY`: 8,072
- `FATAL_NO`: 16,507
- `INITDIR`: 4,835
- `VEHTYPE`: 3,113
- `MANOEUVER`: 7,153
- `DRIVACT`: 8,321
- `DRIVCOND`: 8,322
- `PEDTYPE`: 14,414
- `PEDACT`: 14,416
- `PEDCOND`: 14,398
- `CYCLISTYPE`: 16,553
- `CYCACT`: 16,558
- `CYCCOND`: 16,560
- `PEDESTRIAN`: 10,521
- `CYCLIST`: 15,548
- `AUTOMOBILE`: 0
- `MOTORCYCLE`: 15,879
- `TRUCK`: 16,671
- `TRSN_CITY_VEH`: 16,741
- `EMERG_VEH`: 17,195
- `PASSENGER`: 10,359
- `SPEEDING`: 14,658
- `AG_DRIV`: 7,887
- `REDLIGHT`: 15,669
- `ALCOHOL`: 16,434
- `DISABILITY`: 16,738
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `DIVISION`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `DATE`, `TIME`
- Offence/category columns: `IMPACTYPE`, `INVTYPE`, `VEHTYPE`, `PEDTYPE`, `CYCLISTYPE`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DISTRICT`, `DIVISION`
- Coordinate columns: `LATITUDE`, `LONGITUDE`, `x`, `y`
- WGS84 lat/lng present: yes (`LATITUDE`, `LONGITUDE`)
- Rows with 0,0 coordinates: 0
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LATITUDE` and `LONGITUDE`.
- Has `OBJECTID`; uniqueness within file: yes.
- Participant- or collision-level rows; may share `ACCNUM` or `EVENT_UNIQUE_ID` across multiple rows.

### `Bicycle_Thefts_Open_Data_-8919999175893776292.csv`

- **Detected dataset name:** Bicycle Thefts Open Data
- **File type:** CSV
- **File size:** 13.56 MB (14,221,512 bytes)
- **Row count:** 39,969 (excluding header)
- **Column count:** 35

**Columns:** `OBJECTID`, `EVENT_UNIQUE_ID`, `PRIMARY_OFFENCE`, `OCC_DATE`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DOW`, `OCC_DAY`, `OCC_DOY`, `OCC_HOUR`, `REPORT_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DOW`, `REPORT_DAY`, `REPORT_DOY`, `REPORT_HOUR`, `DIVISION`, `LOCATION_TYPE`, `PREMISES_TYPE`, `BIKE_MAKE`, `BIKE_MODEL`, `BIKE_TYPE`, `BIKE_SPEED`, `BIKE_COLOUR`, `BIKE_COST`, `STATUS`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `LONG_WGS84`, `LAT_WGS84`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "EVENT_UNIQUE_ID": "GO-20141261431", "PRIMARY_OFFENCE": "THEFT UNDER", "OCC_DATE": "1/1/2014 5:00:00 AM", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOW": "Wednesday", "OCC_DOY": "1", "OCC_HOUR": "7", "REPORT_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January"}`
2. `{"OBJECTID": "2", "EVENT_UNIQUE_ID": "GO-20141263784", "PRIMARY_OFFENCE": "PROPERTY - FOUND", "OCC_DATE": "1/1/2014 5:00:00 AM", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOW": "Wednesday", "OCC_DOY": "1", "OCC_HOUR": "18", "REPORT_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January"}`
3. `{"OBJECTID": "3", "EVENT_UNIQUE_ID": "GO-20141263544", "PRIMARY_OFFENCE": "B&E", "OCC_DATE": "12/26/2013 5:00:00 AM", "OCC_YEAR": "2013", "OCC_MONTH": "December", "OCC_DOW": "Thursday", "OCC_DOY": "360", "OCC_HOUR": "19", "REPORT_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `EVENT_UNIQUE_ID`: 0
- `PRIMARY_OFFENCE`: 0
- `OCC_DATE`: 0
- `OCC_YEAR`: 0
- `OCC_MONTH`: 0
- `OCC_DOW`: 0
- `OCC_DAY`: 0
- `OCC_DOY`: 0
- `OCC_HOUR`: 0
- `REPORT_DATE`: 0
- `REPORT_YEAR`: 0
- `REPORT_MONTH`: 0
- `REPORT_DOW`: 0
- `REPORT_DAY`: 0
- `REPORT_DOY`: 0
- `REPORT_HOUR`: 0
- `DIVISION`: 0
- `LOCATION_TYPE`: 0
- `PREMISES_TYPE`: 0
- `BIKE_MAKE`: 191
- `BIKE_MODEL`: 15,374
- `BIKE_TYPE`: 0
- `BIKE_SPEED`: 1,562
- `BIKE_COLOUR`: 3,544
- `BIKE_COST`: 2,631
- `STATUS`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `LONG_WGS84`: 0
- `LAT_WGS84`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: yes
- EVENT_UNIQUE_ID unique: no (35,865 distinct / 39,969 non-blank)
- Date/time columns: `OCC_DATE`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DOW`, `OCC_DOY`, `OCC_HOUR`, `REPORT_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DOW`, `REPORT_DOY`, `REPORT_HOUR`
- Offence/category columns: `PRIMARY_OFFENCE`, `LOCATION_TYPE`, `PREMISES_TYPE`, `BIKE_TYPE`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DIVISION`
- Coordinate columns: `LONG_WGS84`, `LAT_WGS84`, `x`, `y`
- WGS84 lat/lng present: yes (`LAT_WGS84`, `LONG_WGS84`)
- Rows with 0,0 coordinates: 347
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LAT_WGS84` and `LONG_WGS84`.
- Has `EVENT_UNIQUE_ID`; uniqueness within file: no (35,865 distinct / 39,969 non-blank).
- Has `OBJECTID`; uniqueness within file: yes.

### `Break_and_Enter_Open_Data_9198768316349412680.csv`

- **Detected dataset name:** Break and Enter Open Data
- **File type:** CSV
- **File size:** 27.92 MB (29,272,161 bytes)
- **Row count:** 84,689 (excluding header)
- **Column count:** 31

**Columns:** `OBJECTID`, `EVENT_UNIQUE_ID`, `REPORT_DATE`, `OCC_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DAY`, `REPORT_DOY`, `REPORT_DOW`, `REPORT_HOUR`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DAY`, `OCC_DOY`, `OCC_DOW`, `OCC_HOUR`, `DIVISION`, `LOCATION_TYPE`, `PREMISES_TYPE`, `UCR_CODE`, `UCR_EXT`, `OFFENCE`, `CSI_CATEGORY`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `LONG_WGS84`, `LAT_WGS84`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "EVENT_UNIQUE_ID": "GO-20141260521", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "2", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOY": "1"}`
2. `{"OBJECTID": "2", "EVENT_UNIQUE_ID": "GO-20141261478", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "8", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOY": "1"}`
3. `{"OBJECTID": "3", "EVENT_UNIQUE_ID": "GO-20141261592", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "9", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOY": "1"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `EVENT_UNIQUE_ID`: 0
- `REPORT_DATE`: 0
- `OCC_DATE`: 0
- `REPORT_YEAR`: 0
- `REPORT_MONTH`: 0
- `REPORT_DAY`: 0
- `REPORT_DOY`: 0
- `REPORT_DOW`: 0
- `REPORT_HOUR`: 0
- `OCC_YEAR`: 2
- `OCC_MONTH`: 2
- `OCC_DAY`: 2
- `OCC_DOY`: 2
- `OCC_DOW`: 2
- `OCC_HOUR`: 0
- `DIVISION`: 0
- `LOCATION_TYPE`: 0
- `PREMISES_TYPE`: 0
- `UCR_CODE`: 0
- `UCR_EXT`: 0
- `OFFENCE`: 0
- `CSI_CATEGORY`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `LONG_WGS84`: 0
- `LAT_WGS84`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: yes
- EVENT_UNIQUE_ID unique: no (84,261 distinct / 84,689 non-blank)
- Date/time columns: `REPORT_DATE`, `OCC_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DOY`, `REPORT_DOW`, `REPORT_HOUR`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DOY`, `OCC_DOW`, `OCC_HOUR`
- Offence/category columns: `LOCATION_TYPE`, `PREMISES_TYPE`, `OFFENCE`, `CSI_CATEGORY`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DIVISION`
- Coordinate columns: `LONG_WGS84`, `LAT_WGS84`, `x`, `y`
- WGS84 lat/lng present: yes (`LAT_WGS84`, `LONG_WGS84`)
- Rows with 0,0 coordinates: 569
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LAT_WGS84` and `LONG_WGS84`.
- Has `EVENT_UNIQUE_ID`; uniqueness within file: no (84,261 distinct / 84,689 non-blank).
- Has `OBJECTID`; uniqueness within file: yes.

### `Budget_2020_8087021416505284746.csv`

- **Detected dataset name:** Budget 2020
- **File type:** CSV
- **File size:** 1.44 MB (1,514,446 bytes)
- **Row count:** 7,682 (excluding header)
- **Column count:** 12

**Columns:** `Fiscal Year`, `Budget Type`, `Organization Entity`, `Command Name`, `Pillar Name`, `District Name`, `Unit Name`, `Feature_Category`, `Cost Element`, `Cost Element Long Name`, `Amount`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Fiscal Year": "2020", "Budget Type": "Approved Budget", "Command Name": "Centralized Service Charges", "Pillar Name": "Centralized Service Charges", "District Name": "Centralized Service Charges", "Unit Name": "CCC - Central Paid Duty", "Feature_Category": "Revenues", "Cost Element Long Name": "PAID DUTY", "ObjectId": "1"}`
2. `{"Fiscal Year": "2020", "Budget Type": "Approved Budget", "Command Name": "Centralized Service Charges", "Pillar Name": "Centralized Service Charges", "District Name": "Centralized Service Charges", "Unit Name": "CCC - Central Paid Duty", "Feature_Category": "Revenues", "Cost Element Long Name": "PAID DUTY- OFFICERS FEE", "ObjectId": "2"}`
3. `{"Fiscal Year": "2020", "Budget Type": "Approved Budget", "Command Name": "Centralized Service Charges", "Pillar Name": "Centralized Service Charges", "District Name": "Centralized Service Charges", "Unit Name": "CCC - Central Paid Duty", "Feature_Category": "Revenues", "Cost Element Long Name": "PAY DUTY EQUIPMENT RENTAL", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Fiscal Year`: 0
- `Budget Type`: 0
- `Organization Entity`: 0
- `Command Name`: 0
- `Pillar Name`: 6
- `District Name`: 6
- `Unit Name`: 84
- `Feature_Category`: 0
- `Cost Element`: 0
- `Cost Element Long Name`: 0
- `Amount`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `Fiscal Year`
- Offence/category columns: `Budget Type`, `Feature_Category`
- Neighbourhood columns: none
- Division columns: `Command Name`, `District Name`
- Coordinate columns: `Cost Element Long Name`
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: `Command Name`, `Pillar Name`, `District Name`, `Unit Name`, `Cost Element Long Name`
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Budget_2021_2456030383083920061.csv`

- **Detected dataset name:** Budget 2021
- **File type:** CSV
- **File size:** 1.22 MB (1,281,540 bytes)
- **Row count:** 6,032 (excluding header)
- **Column count:** 12

**Columns:** `Fiscal Year`, `Budget Type`, `Organization Entity`, `Command Name`, `Pillar Name`, `District Name`, `Unit Name`, `Feature_Category`, `Cost Element`, `Cost Element Long Name`, `Amount`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Fiscal Year": "2021", "Budget Type": "Approved Budget", "Command Name": "Centralized Service Charges (Command)", "Pillar Name": "Centralized Service Chrgs & UNS (Pillar)", "District Name": "Centralized Service Charges", "Unit Name": "Centralized Service Charges", "Feature_Category": "Services", "Cost Element Long Name": "Telephone", "ObjectId": "1"}`
2. `{"Fiscal Year": "2021", "Budget Type": "Approved Budget", "Command Name": "Centralized Service Charges (Command)", "Pillar Name": "Centralized Service Chrgs & UNS (Pillar)", "District Name": "Centralized Service Charges", "Unit Name": "Centralized Service Charges", "Feature_Category": "Services", "Cost Element Long Name": "Long-distance calls", "ObjectId": "2"}`
3. `{"Fiscal Year": "2021", "Budget Type": "Approved Budget", "Command Name": "Centralized Service Charges (Command)", "Pillar Name": "Centralized Service Chrgs & UNS (Pillar)", "District Name": "Centralized Service Charges", "Unit Name": "Centralized Service Charges", "Feature_Category": "Services", "Cost Element Long Name": "Courier services", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Fiscal Year`: 0
- `Budget Type`: 0
- `Organization Entity`: 0
- `Command Name`: 0
- `Pillar Name`: 0
- `District Name`: 0
- `Unit Name`: 0
- `Feature_Category`: 0
- `Cost Element`: 0
- `Cost Element Long Name`: 0
- `Amount`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `Fiscal Year`
- Offence/category columns: `Budget Type`, `Feature_Category`
- Neighbourhood columns: none
- Division columns: `Command Name`, `District Name`
- Coordinate columns: `Cost Element Long Name`
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: `Command Name`, `Pillar Name`, `District Name`, `Unit Name`, `Cost Element Long Name`
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Budget_2022_-2655320733178210418.csv`

- **Detected dataset name:** Budget 2022
- **File type:** CSV
- **File size:** 1.85 MB (1,937,685 bytes)
- **Row count:** 9,594 (excluding header)
- **Column count:** 12

**Columns:** `Fiscal Year`, `Budget Type`, `Organization Entity`, `Command Name`, `Pillar Name`, `District Name`, `Unit Name`, `Feature_Category`, `Cost Element`, `Cost Element Long Name`, `Amount`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Fiscal Year": "2022", "Budget Type": "Approved Budget", "Command Name": "Centralized Service Charges (Command)", "Pillar Name": "Centralized Service Chrgs & UNS (Pillar)", "District Name": "Centralized Service Charges", "Unit Name": "Centralized Service Charges", "Feature_Category": "Benefits", "Cost Element Long Name": "Comprehensive Medical", "ObjectId": "1"}`
2. `{"Fiscal Year": "2022", "Budget Type": "Approved Budget", "Command Name": "Centralized Service Charges (Command)", "Pillar Name": "Reserves Group (Pillar)", "District Name": "Reserves Group", "Unit Name": "Reserves Group", "Feature_Category": "Benefits", "Cost Element Long Name": "Health care benefits - retiree", "ObjectId": "2"}`
3. `{"Fiscal Year": "2022", "Budget Type": "Approved Budget", "Command Name": "Chief of Police (Command)", "Pillar Name": "Centralized Command Charges,CHF (Pillar)", "District Name": "Centralized Command Charges,CHF", "Unit Name": "Centralized Command Charges, CHF", "Feature_Category": "Services", "Cost Element Long Name": "Business travel - other expenses", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Fiscal Year`: 0
- `Budget Type`: 0
- `Organization Entity`: 0
- `Command Name`: 0
- `Pillar Name`: 0
- `District Name`: 0
- `Unit Name`: 0
- `Feature_Category`: 0
- `Cost Element`: 0
- `Cost Element Long Name`: 0
- `Amount`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `Fiscal Year`
- Offence/category columns: `Budget Type`, `Feature_Category`
- Neighbourhood columns: none
- Division columns: `Command Name`, `District Name`
- Coordinate columns: `Cost Element Long Name`
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: `Command Name`, `Pillar Name`, `District Name`, `Unit Name`, `Cost Element Long Name`
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Budget_2023_1284559222086023539.csv`

- **Detected dataset name:** Budget 2023
- **File type:** CSV
- **File size:** 3.10 MB (3,255,120 bytes)
- **Row count:** 15,378 (excluding header)
- **Column count:** 12

**Columns:** `Fiscal Year`, `Budget Type`, `Organization Entity`, `Command Name`, `Pillar Name`, `District Name`, `Unit Name`, `Feature Category`, `Cost Element`, `Cost Element Long Name`, `Amount`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Fiscal Year": "2023", "Budget Type": "Actual Expenditures", "Command Name": "Centralized Service Charges (Command)", "Pillar Name": "Centralized Service Chrgs & UNS (Pillar)", "District Name": "Centralized Service Charges", "Unit Name": "Centralized Service Charges", "Feature Category": "1501", "Cost Element Long Name": " Regular salaries - Chief/Command", "ObjectId": "1"}`
2. `{"Fiscal Year": "2023", "Budget Type": "Actual Expenditures", "Command Name": "Centralized Service Charges (Command)", "Pillar Name": "Centralized Service Chrgs & UNS (Pillar)", "District Name": "Centralized Service Charges", "Unit Name": "Centralized Service Charges", "Feature Category": "1502", "Cost Element Long Name": " Regular salaries - Civilian Sr. Officer", "ObjectId": "2"}`
3. `{"Fiscal Year": "2023", "Budget Type": "Actual Expenditures", "Command Name": "Centralized Service Charges (Command)", "Pillar Name": "Centralized Service Chrgs & UNS (Pillar)", "District Name": "Centralized Service Charges", "Unit Name": "Centralized Service Charges", "Feature Category": "1503", "Cost Element Long Name": " Regular salaries - Uniform Sr. Officer", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Fiscal Year`: 0
- `Budget Type`: 0
- `Organization Entity`: 0
- `Command Name`: 0
- `Pillar Name`: 0
- `District Name`: 0
- `Unit Name`: 0
- `Feature Category`: 0
- `Cost Element`: 0
- `Cost Element Long Name`: 0
- `Amount`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `Fiscal Year`
- Offence/category columns: `Budget Type`, `Feature Category`
- Neighbourhood columns: none
- Division columns: `Command Name`, `District Name`
- Coordinate columns: `Cost Element Long Name`
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: `Command Name`, `Pillar Name`, `District Name`, `Unit Name`, `Cost Element Long Name`
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Budget_2024 (1).csv`

- **Detected dataset name:** Budget
- **File type:** CSV
- **File size:** 3.03 MB (3,177,041 bytes)
- **Row count:** 16,266 (excluding header)
- **Column count:** 12

**Columns:** `Fiscal_Year`, `Budget_Type`, `Organization_Entity`, `Command_Name`, `Pillar_Name`, `District_Name`, `Unit_Name`, `Feature_Category`, `Cost_Element`, `Cost_Element_Long_Name`, `Amount`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Fiscal_Year": "2024", "Budget_Type": "Approved Budget", "Command_Name": "Centralized Service Charges (Command)", "District_Name": "Centralized Service Chrgs & UNS (Pillar)", "Feature_Category": "1-Salaries", "Cost_Element_Long_Name": " Regular salaries - Civilian B", "ObjectId": "1"}`
2. `{"Fiscal_Year": "2024", "Budget_Type": "Approved Budget", "Command_Name": "Centralized Service Charges (Command)", "District_Name": "Centralized Service Chrgs & UNS (Pillar)", "Feature_Category": "1-Salaries", "Cost_Element_Long_Name": " Regular salaries - Civilian C", "ObjectId": "2"}`
3. `{"Fiscal_Year": "2024", "Budget_Type": "Approved Budget", "Command_Name": "Centralized Service Charges (Command)", "District_Name": "Centralized Service Chrgs & UNS (Pillar)", "Feature_Category": "1-Salaries", "Cost_Element_Long_Name": " Regular salaries - Excluded", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Fiscal_Year`: 0
- `Budget_Type`: 0
- `Organization_Entity`: 16,266
- `Command_Name`: 0
- `Pillar_Name`: 0
- `District_Name`: 0
- `Unit_Name`: 0
- `Feature_Category`: 0
- `Cost_Element`: 0
- `Cost_Element_Long_Name`: 0
- `Amount`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `Fiscal_Year`
- Offence/category columns: `Budget_Type`, `Feature_Category`
- Neighbourhood columns: none
- Division columns: `Command_Name`, `District_Name`
- Coordinate columns: `Cost_Element_Long_Name`
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Budget_2024.csv`

- **Detected dataset name:** Budget
- **File type:** CSV
- **File size:** 1.33 MB (1,395,060 bytes)
- **Row count:** 7,689 (excluding header)
- **Column count:** 12

**Columns:** `Fiscal_Year`, `Budget_Type`, `Organization_Entity`, `Command_Name`, `Pillar_Name`, `District_Name`, `Unit_Name`, `Feature_Category`, `Cost_Element`, `Cost_Element_Long_Name`, `Amount`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Fiscal_Year": "2024", "Budget_Type": "Approved Budget", "Command_Name": "Centralized Service Charges (Command)", "District_Name": "Unit Not Assigned", "Feature_Category": "Not_Used", "Cost_Element_Long_Name": " Not_used", "ObjectId": "1"}`
2. `{"Fiscal_Year": "2024", "Budget_Type": "Approved Budget", "Command_Name": "Centralized Service Charges (Command)", "District_Name": "Unit Not Assigned", "Feature_Category": "1-Salaries", "Cost_Element_Long_Name": " Salaries & wages - general", "ObjectId": "2"}`
3. `{"Fiscal_Year": "2024", "Budget_Type": "Approved Budget", "Command_Name": "Centralized Service Charges (Command)", "District_Name": "Unit Not Assigned", "Feature_Category": "1-Salaries", "Cost_Element_Long_Name": " Recruits - Civilian", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Fiscal_Year`: 0
- `Budget_Type`: 0
- `Organization_Entity`: 7,689
- `Command_Name`: 0
- `Pillar_Name`: 0
- `District_Name`: 0
- `Unit_Name`: 0
- `Feature_Category`: 0
- `Cost_Element`: 0
- `Cost_Element_Long_Name`: 0
- `Amount`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `Fiscal_Year`
- Offence/category columns: `Budget_Type`, `Feature_Category`
- Neighbourhood columns: none
- Division columns: `Command_Name`, `District_Name`
- Coordinate columns: `Cost_Element_Long_Name`
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Budget_2025.csv`

- **Detected dataset name:** Budget
- **File type:** CSV
- **File size:** 1.69 MB (1,773,711 bytes)
- **Row count:** 8,133 (excluding header)
- **Column count:** 12

**Columns:** `Fiscal_Year`, `Budget_Type`, `Organizational_Entity`, `Command_Name`, `Pillar_Name`, `District_Name`, `Unit_Name`, `Cost_Element`, `Feature_Category`, `Cost_Element_Long_Name`, `Amount`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Fiscal_Year": "2025", "Budget_Type": "Approved Budget", "Command_Name": "Centralized Service Charges (Command)", "District_Name": "Centralized Service Chrgs & UNS (Pillar)", "Feature_Category": "6-Services", "Cost_Element_Long_Name": " Repairs - vehicles", "ObjectId": "1"}`
2. `{"Fiscal_Year": "2025", "Budget_Type": "Approved Budget", "Command_Name": "Centralized Service Charges (Command)", "District_Name": "Centralized Service Chrgs & UNS (Pillar)", "Feature_Category": "6-Services", "Cost_Element_Long_Name": " Consulting - IT", "ObjectId": "2"}`
3. `{"Fiscal_Year": "2025", "Budget_Type": "Approved Budget", "Command_Name": "Centralized Service Charges (Command)", "District_Name": "Centralized Service Chrgs & UNS (Pillar)", "Feature_Category": "6-Services", "Cost_Element_Long_Name": " Shredding services", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Fiscal_Year`: 0
- `Budget_Type`: 0
- `Organizational_Entity`: 0
- `Command_Name`: 0
- `Pillar_Name`: 0
- `District_Name`: 0
- `Unit_Name`: 0
- `Cost_Element`: 0
- `Feature_Category`: 0
- `Cost_Element_Long_Name`: 0
- `Amount`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `Fiscal_Year`
- Offence/category columns: `Budget_Type`, `Feature_Category`
- Neighbourhood columns: none
- Division columns: `Command_Name`, `District_Name`
- Coordinate columns: `Cost_Element_Long_Name`
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Budget_2026.csv`

- **Detected dataset name:** Budget
- **File type:** CSV
- **File size:** 1.69 MB (1,773,891 bytes)
- **Row count:** 8,133 (excluding header)
- **Column count:** 12

**Columns:** `Fiscal_Year`, `Budget_Type`, `Organizational_Entity`, `Command_Name`, `Pillar_Name`, `District_Name`, `Unit_Name`, `Cost_Element`, `Feature_Category`, `Cost_Element_Long_Name`, `Amount`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Fiscal_Year": "2026", "Budget_Type": "Proposed Budget", "Command_Name": "Centralized Service Charges (Command)", "District_Name": "Centralized Service Chrgs & UNS (Pillar)", "Feature_Category": "1-Salaries", "Cost_Element_Long_Name": " Regular salaries - Chief/Command", "ObjectId": "1"}`
2. `{"Fiscal_Year": "2026", "Budget_Type": "Proposed Budget", "Command_Name": "Centralized Service Charges (Command)", "District_Name": "Centralized Service Chrgs & UNS (Pillar)", "Feature_Category": "1-Salaries", "Cost_Element_Long_Name": " Regular salaries - Civilian Sr. Officer", "ObjectId": "2"}`
3. `{"Fiscal_Year": "2026", "Budget_Type": "Proposed Budget", "Command_Name": "Centralized Service Charges (Command)", "District_Name": "Centralized Service Chrgs & UNS (Pillar)", "Feature_Category": "1-Salaries", "Cost_Element_Long_Name": " Regular salaries - Uniform Sr. Officer", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Fiscal_Year`: 0
- `Budget_Type`: 0
- `Organizational_Entity`: 0
- `Command_Name`: 0
- `Pillar_Name`: 0
- `District_Name`: 0
- `Unit_Name`: 0
- `Cost_Element`: 0
- `Feature_Category`: 0
- `Cost_Element_Long_Name`: 0
- `Amount`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `Fiscal_Year`
- Offence/category columns: `Budget_Type`, `Feature_Category`
- Neighbourhood columns: none
- Division columns: `Command_Name`, `District_Name`
- Coordinate columns: `Cost_Element_Long_Name`
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Budget_by_Command.csv`

- **Detected dataset name:** Budget by Command
- **File type:** CSV
- **File size:** 121.1 KB (124,003 bytes)
- **Row count:** 1,273 (excluding header)
- **Column count:** 7

**Columns:** `Year`, `Type_of_Metric`, `Organizational_Entity`, `Command_Name`, `Category`, `Amount`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Year": "2016", "Type_of_Metric": "Approved Budget", "Command_Name": "Human Resources Command", "Category": "Salaries", "ObjectId": "1"}`
2. `{"Year": "2016", "Type_of_Metric": "Actual Expenditures", "Command_Name": "Specialized Operations Command", "Category": "Premium Pay", "ObjectId": "2"}`
3. `{"Year": "2016", "Type_of_Metric": "Approved Budget", "Command_Name": "Human Resources Command", "Category": "Services", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Year`: 0
- `Type_of_Metric`: 0
- `Organizational_Entity`: 0
- `Command_Name`: 0
- `Category`: 0
- `Amount`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `Year`
- Offence/category columns: `Type_of_Metric`, `Category`
- Neighbourhood columns: none
- Division columns: `Command_Name`
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Calls_for_Service_Attended_(ASR_CS_TBL_003)_8360330772672605309.csv`

- **Detected dataset name:** Calls for Service Attended (ASR CS TBL 003)
- **File type:** CSV
- **File size:** 256.2 KB (262,361 bytes)
- **Row count:** 5,399 (excluding header)
- **Column count:** 8

**Columns:** `INDEX`, `EVENT_YEAR`, `DIVISION_ORIGINAL`, `DIVISION_FINAL`, `HOOD_158`, `NEIGHBOURHOOD_158`, `EVENT_COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"EVENT_YEAR": "2015", "DIVISION_ORIGINAL": "D11", "DIVISION_FINAL": "D11", "HOOD_158": "114", "NEIGHBOURHOOD_158": "Lambton Baby Point", "ObjectId": "1"}`
2. `{"EVENT_YEAR": "2015", "DIVISION_ORIGINAL": "D11", "DIVISION_FINAL": "D11", "HOOD_158": "091", "NEIGHBOURHOOD_158": "Weston-Pelham Park", "ObjectId": "2"}`
3. `{"EVENT_YEAR": "2015", "DIVISION_ORIGINAL": "D11", "DIVISION_FINAL": "D22", "HOOD_158": "016", "NEIGHBOURHOOD_158": "Stonegate-Queensway", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `EVENT_YEAR`: 0
- `DIVISION_ORIGINAL`: 0
- `DIVISION_FINAL`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `EVENT_COUNT`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `EVENT_YEAR`
- Offence/category columns: none
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`
- Division columns: `DIVISION_ORIGINAL`, `DIVISION_FINAL`
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Complaint_Dispositions_(ASR_PCF_TBL_003)_-5877412472568242550.csv`

- **Detected dataset name:** Complaint Dispositions (ASR PCF TBL 003)
- **File type:** CSV
- **File size:** 9.4 KB (9,665 bytes)
- **Row count:** 133 (excluding header)
- **Column count:** 6

**Columns:** `INDEX`, `YEAR`, `TYPE`, `SUBTYPE`, `COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"YEAR": "2014", "TYPE": "DISPOSITION - Investigated Complaints", "SUBTYPE": "Informal Resolution", "ObjectId": "1"}`
2. `{"YEAR": "2014", "TYPE": "DISPOSITION - Investigated Complaints", "SUBTYPE": "Misconduct Identified", "ObjectId": "2"}`
3. `{"YEAR": "2014", "TYPE": "DISPOSITION - Investigated Complaints", "SUBTYPE": "No Jurisdiction", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `YEAR`: 0
- `TYPE`: 0
- `SUBTYPE`: 0
- `COUNT`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `YEAR`
- Offence/category columns: `TYPE`, `SUBTYPE`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `CYCLIST_KSI_6778972150312286022.csv`

- **Detected dataset name:** CYCLIST KSI
- **File type:** CSV
- **File size:** 822.2 KB (841,974 bytes)
- **Row count:** 1,986 (excluding header)
- **Column count:** 54

**Columns:** `OBJECTID`, `INDEX`, `ACCNUM`, `DATE`, `TIME`, `STREET1`, `STREET2`, `OFFSET`, `ROAD_CLASS`, `DISTRICT`, `LATITUDE`, `LONGITUDE`, `ACCLOC`, `TRAFFCTL`, `VISIBILITY`, `LIGHT`, `RDSFCOND`, `ACCLASS`, `IMPACTYPE`, `INVTYPE`, `INVAGE`, `INJURY`, `FATAL_NO`, `INITDIR`, `VEHTYPE`, `MANOEUVER`, `DRIVACT`, `DRIVCOND`, `PEDTYPE`, `PEDACT`, `PEDCOND`, `CYCLISTYPE`, `CYCACT`, `CYCCOND`, `PEDESTRIAN`, `CYCLIST`, `AUTOMOBILE`, `MOTORCYCLE`, `TRUCK`, `TRSN_CITY_VEH`, `EMERG_VEH`, `PASSENGER`, `SPEEDING`, `AG_DRIV`, `REDLIGHT`, `ALCOHOL`, `DISABILITY`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `DIVISION`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "ACCNUM": "891027", "DATE": "2/11/2006 5:00:00 AM", "TIME": "1804", "DISTRICT": "North York", "LATITUDE": "43.752745", "LONGITUDE": "-79.32639", "IMPACTYPE": "Cyclist Collisions", "INVTYPE": "Driver", "VEHTYPE": "Automobile, Station Wagon", "PEDTYPE": "", "CYCLISTYPE": ""}`
2. `{"OBJECTID": "2", "ACCNUM": "891027", "DATE": "2/11/2006 5:00:00 AM", "TIME": "1804", "DISTRICT": "North York", "LATITUDE": "43.752745", "LONGITUDE": "-79.32639", "IMPACTYPE": "Cyclist Collisions", "INVTYPE": "Cyclist", "VEHTYPE": "Bicycle", "PEDTYPE": "", "CYCLISTYPE": "Motorist turned left across cyclists path."}`
3. `{"OBJECTID": "3", "ACCNUM": "893580", "DATE": "2/27/2006 5:00:00 AM", "TIME": "1955", "DISTRICT": "Scarborough", "LATITUDE": "43.770645", "LONGITUDE": "-79.18689", "IMPACTYPE": "Cyclist Collisions", "INVTYPE": "Vehicle Owner", "VEHTYPE": "Other", "PEDTYPE": "", "CYCLISTYPE": ""}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `INDEX`: 0
- `ACCNUM`: 532
- `DATE`: 0
- `TIME`: 0
- `STREET1`: 0
- `STREET2`: 196
- `OFFSET`: 1,609
- `ROAD_CLASS`: 8
- `DISTRICT`: 20
- `LATITUDE`: 0
- `LONGITUDE`: 0
- `ACCLOC`: 494
- `TRAFFCTL`: 6
- `VISIBILITY`: 0
- `LIGHT`: 0
- `RDSFCOND`: 0
- `ACCLASS`: 0
- `IMPACTYPE`: 2
- `INVTYPE`: 1
- `INVAGE`: 0
- `INJURY`: 1,070
- `FATAL_NO`: 1,946
- `INITDIR`: 276
- `VEHTYPE`: 122
- `MANOEUVER`: 288
- `DRIVACT`: 1,128
- `DRIVCOND`: 1,130
- `PEDTYPE`: 1,967
- `PEDACT`: 1,967
- `PEDCOND`: 1,967
- `CYCLISTYPE`: 1,181
- `CYCACT`: 1,184
- `CYCCOND`: 1,186
- `PEDESTRIAN`: 1,947
- `CYCLIST`: 0
- `AUTOMOBILE`: 304
- `MOTORCYCLE`: 1,971
- `TRUCK`: 1,840
- `TRSN_CITY_VEH`: 1,893
- `EMERG_VEH`: 1,981
- `PASSENGER`: 1,690
- `SPEEDING`: 1,925
- `AG_DRIV`: 1,256
- `REDLIGHT`: 1,922
- `ALCOHOL`: 1,965
- `DISABILITY`: 1,986
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `DIVISION`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `DATE`, `TIME`
- Offence/category columns: `IMPACTYPE`, `INVTYPE`, `VEHTYPE`, `PEDTYPE`, `CYCLISTYPE`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DISTRICT`, `DIVISION`
- Coordinate columns: `LATITUDE`, `LONGITUDE`, `x`, `y`
- WGS84 lat/lng present: yes (`LATITUDE`, `LONGITUDE`)
- Rows with 0,0 coordinates: 0
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LATITUDE` and `LONGITUDE`.
- Has `OBJECTID`; uniqueness within file: yes.
- Participant- or collision-level rows; may share `ACCNUM` or `EVENT_UNIQUE_ID` across multiple rows.

### `Dispatched_Calls_by_Division_(ASR_CS_TBL_001)_-2648219355645136891.csv`

- **Detected dataset name:** Dispatched Calls by Division (ASR CS TBL 001)
- **File type:** CSV
- **File size:** 7.8 KB (7,987 bytes)
- **Row count:** 152 (excluding header)
- **Column count:** 7

**Columns:** `INDEX`, `YEAR`, `CATEGORY`, `UNIT`, `COMMAND`, `COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"YEAR": "2016", "CATEGORY": "Dispatched Calls", "COMMAND": "Area", "ObjectId": "1"}`
2. `{"YEAR": "2016", "CATEGORY": "Dispatched Calls", "COMMAND": "Area", "ObjectId": "2"}`
3. `{"YEAR": "2016", "CATEGORY": "Dispatched Calls", "COMMAND": "Area", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `YEAR`: 0
- `CATEGORY`: 0
- `UNIT`: 0
- `COMMAND`: 24
- `COUNT`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `YEAR`
- Offence/category columns: `CATEGORY`
- Neighbourhood columns: none
- Division columns: `COMMAND`
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `FATALS_KSI_1591277964987434465.csv`

- **Detected dataset name:** FATALS KSI
- **File type:** CSV
- **File size:** 391.2 KB (400,573 bytes)
- **Row count:** 976 (excluding header)
- **Column count:** 54

**Columns:** `OBJECTID`, `INDEX`, `ACCNUM`, `DATE`, `TIME`, `STREET1`, `STREET2`, `OFFSET`, `ROAD_CLASS`, `DISTRICT`, `LATITUDE`, `LONGITUDE`, `ACCLOC`, `TRAFFCTL`, `VISIBILITY`, `LIGHT`, `RDSFCOND`, `ACCLASS`, `IMPACTYPE`, `INVTYPE`, `INVAGE`, `INJURY`, `FATAL_NO`, `INITDIR`, `VEHTYPE`, `MANOEUVER`, `DRIVACT`, `DRIVCOND`, `PEDTYPE`, `PEDACT`, `PEDCOND`, `CYCLISTYPE`, `CYCACT`, `CYCCOND`, `PEDESTRIAN`, `CYCLIST`, `AUTOMOBILE`, `MOTORCYCLE`, `TRUCK`, `TRSN_CITY_VEH`, `EMERG_VEH`, `PASSENGER`, `SPEEDING`, `AG_DRIV`, `REDLIGHT`, `ALCOHOL`, `DISABILITY`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `DIVISION`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "ACCNUM": "882024", "DATE": "1/7/2006 5:00:00 AM", "TIME": "2325", "DISTRICT": "Scarborough", "LATITUDE": "43.842745", "LONGITUDE": "-79.22479", "IMPACTYPE": "Approaching", "INVTYPE": "Driver", "VEHTYPE": "Automobile, Station Wagon", "PEDTYPE": "", "CYCLISTYPE": ""}`
2. `{"OBJECTID": "2", "ACCNUM": "882497", "DATE": "1/8/2006 5:00:00 AM", "TIME": "1828", "DISTRICT": "Etobicoke York", "LATITUDE": "43.721445", "LONGITUDE": "-79.55809", "IMPACTYPE": "Pedestrian Collisions", "INVTYPE": "Pedestrian", "VEHTYPE": "Other", "PEDTYPE": "Pedestrian hit a PXO/ped. Mid-block signal", "CYCLISTYPE": ""}`
3. `{"OBJECTID": "3", "ACCNUM": "882174", "DATE": "1/9/2006 5:00:00 AM", "TIME": "1435", "DISTRICT": "Scarborough", "LATITUDE": "43.769445", "LONGITUDE": "-79.28229", "IMPACTYPE": "Pedestrian Collisions", "INVTYPE": "Pedestrian", "VEHTYPE": "Other", "PEDTYPE": "Vehicle is going straight thru inter.while ped cross without ROW", "CYCLISTYPE": ""}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `INDEX`: 0
- `ACCNUM`: 336
- `DATE`: 0
- `TIME`: 0
- `STREET1`: 0
- `STREET2`: 99
- `OFFSET`: 871
- `ROAD_CLASS`: 25
- `DISTRICT`: 5
- `LATITUDE`: 0
- `LONGITUDE`: 0
- `ACCLOC`: 262
- `TRAFFCTL`: 2
- `VISIBILITY`: 12
- `LIGHT`: 2
- `RDSFCOND`: 13
- `ACCLASS`: 1
- `IMPACTYPE`: 1
- `INVTYPE`: 0
- `INVAGE`: 0
- `INJURY`: 0
- `FATAL_NO`: 111
- `INITDIR`: 117
- `VEHTYPE`: 417
- `MANOEUVER`: 642
- `DRIVACT`: 697
- `DRIVCOND`: 699
- `PEDTYPE`: 437
- `PEDACT`: 434
- `PEDCOND`: 439
- `CYCLISTYPE`: 931
- `CYCACT`: 932
- `CYCCOND`: 932
- `PEDESTRIAN`: 430
- `CYCLIST`: 930
- `AUTOMOBILE`: 162
- `MOTORCYCLE`: 874
- `TRUCK`: 868
- `TRSN_CITY_VEH`: 904
- `EMERG_VEH`: 975
- `PASSENGER`: 736
- `SPEEDING`: 782
- `AG_DRIV`: 534
- `REDLIGHT`: 915
- `ALCOHOL`: 930
- `DISABILITY`: 956
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `DIVISION`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `DATE`, `TIME`
- Offence/category columns: `IMPACTYPE`, `INVTYPE`, `VEHTYPE`, `PEDTYPE`, `CYCLISTYPE`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DISTRICT`, `DIVISION`
- Coordinate columns: `LATITUDE`, `LONGITUDE`, `x`, `y`
- WGS84 lat/lng present: yes (`LATITUDE`, `LONGITUDE`)
- Rows with 0,0 coordinates: 0
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LATITUDE` and `LONGITUDE`.
- Has `OBJECTID`; uniqueness within file: yes.
- Participant- or collision-level rows; may share `ACCNUM` or `EVENT_UNIQUE_ID` across multiple rows.

### `Firearms_Top_Calibres_(ASR_F_TBL_001)_-5421012277072395013.csv`

- **Detected dataset name:** Firearms Top Calibres (ASR F TBL 001)
- **File type:** CSV
- **File size:** 6.4 KB (6,562 bytes)
- **Row count:** 203 (excluding header)
- **Column count:** 5

**Columns:** `INDEX`, `YEAR`, `FIREARM TYPE`, `CALIBRE`, `ObjectId`

**First 3 rows (important fields):**

1. `{"YEAR": "2014", "FIREARM TYPE": "Pistol", "ObjectId": "1"}`
2. `{"YEAR": "2014", "FIREARM TYPE": "Pistol", "ObjectId": "2"}`
3. `{"YEAR": "2014", "FIREARM TYPE": "Pistol", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `YEAR`: 0
- `FIREARM TYPE`: 0
- `CALIBRE`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `YEAR`
- Offence/category columns: `FIREARM TYPE`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Gross_Expenditures_by_Division_(ASR_PB_TBL_001)_3825889777885479982.csv`

- **Detected dataset name:** Gross Expenditures by Division (ASR PB TBL 001)
- **File type:** CSV
- **File size:** 10.6 KB (10,820 bytes)
- **Row count:** 176 (excluding header)
- **Column count:** 7

**Columns:** `INDEX`, `YEAR`, `CATEGORY`, `DIVISION`, `COMMAND`, `GROSS EXPENDITURE (FINAL)`, `ObjectId`

**First 3 rows (important fields):**

1. `{"YEAR": "2014", "CATEGORY": "Expenditures", "DIVISION": "Division 11", "COMMAND": "Central", "ObjectId": "1"}`
2. `{"YEAR": "2014", "CATEGORY": "Expenditures", "DIVISION": "Division 12", "COMMAND": "Central", "ObjectId": "2"}`
3. `{"YEAR": "2014", "CATEGORY": "Expenditures", "DIVISION": "Division 13", "COMMAND": "Central", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `YEAR`: 0
- `CATEGORY`: 0
- `DIVISION`: 0
- `COMMAND`: 0
- `GROSS EXPENDITURE (FINAL)`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `YEAR`
- Offence/category columns: `CATEGORY`
- Neighbourhood columns: none
- Division columns: `DIVISION`, `COMMAND`
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Gross_Operating_Budget_(ASR_PB_TBL_005)_-1923772532052292360.csv`

- **Detected dataset name:** Gross Operating Budget (ASR PB TBL 005)
- **File type:** CSV
- **File size:** 10.0 KB (10,280 bytes)
- **Row count:** 140 (excluding header)
- **Column count:** 7

**Columns:** `INDEX`, `YEAR`, `SECTION`, `CATEGORY`, `SUBTYPE`, `COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"YEAR": "2019", "CATEGORY": "Appropriation (%)", "SUBTYPE": "Specialized Operations", "ObjectId": "1"}`
2. `{"YEAR": "2019", "CATEGORY": "Appropriation (%)", "SUBTYPE": "Chief", "ObjectId": "2"}`
3. `{"YEAR": "2019", "CATEGORY": "Feature (%)", "SUBTYPE": "Salaries & Benefits", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `YEAR`: 0
- `SECTION`: 0
- `CATEGORY`: 0
- `SUBTYPE`: 0
- `COUNT`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `YEAR`
- Offence/category columns: `CATEGORY`, `SUBTYPE`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `HATE_CRIME_OPEN_DATA_-1768225117781365955.csv`

- **Detected dataset name:** HATE CRIME OPEN DATA
- **File type:** CSV
- **File size:** 452.0 KB (462,853 bytes)
- **Row count:** 2,041 (excluding header)
- **Column count:** 25

**Columns:** `OBJECTID`, `EVENT_UNIQUE_ID`, `OCCURRENCE_YEAR`, `OCCURRENCE_DATE`, `OCCURRENCE_TIME`, `REPORTED_YEAR`, `REPORTED_DATE`, `REPORTED_TIME`, `DIVISION`, `LOCATION_TYPE`, `AGE_BIAS`, `MENTAL_OR_PHYSICAL_DISABILITY`, `RACE_BIAS`, `ETHNICITY_BIAS`, `LANGUAGE_BIAS`, `RELIGION_BIAS`, `SEXUAL_ORIENTATION_BIAS`, `GENDER_BIAS`, `MULTIPLE_BIAS`, `PRIMARY_OFFENCE`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `ARREST_MADE`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "EVENT_UNIQUE_ID": "GO-2020813480", "OCCURRENCE_YEAR": "2014", "OCCURRENCE_DATE": "8/1/2014 4:00:00 AM", "OCCURRENCE_TIME": "1200", "REPORTED_YEAR": "2020", "REPORTED_DATE": "4/30/2020 4:00:00 AM", "REPORTED_TIME": "1904", "DIVISION": "D33", "LOCATION_TYPE": "Religious Place of Worship/Cultural Centre", "PRIMARY_OFFENCE": "Wilful Promotion of Hatred", "HOOD_158": "053"}`
2. `{"OBJECTID": "2", "EVENT_UNIQUE_ID": "GO-2019601581", "OCCURRENCE_YEAR": "2016", "OCCURRENCE_DATE": "1/1/2016 5:00:00 AM", "OCCURRENCE_TIME": "900", "REPORTED_YEAR": "2019", "REPORTED_DATE": "4/3/2019 4:00:00 AM", "REPORTED_TIME": "1956", "DIVISION": "D42", "LOCATION_TYPE": "House (Townhouse, Retirement Home, Garage, Vehicle, Cottage)", "PRIMARY_OFFENCE": "Uttering Threats - Bodily Harm", "HOOD_158": "144"}`
3. `{"OBJECTID": "3", "EVENT_UNIQUE_ID": "GO-2019728283", "OCCURRENCE_YEAR": "2016", "OCCURRENCE_DATE": "9/1/2016 4:00:00 AM", "OCCURRENCE_TIME": "0", "REPORTED_YEAR": "2019", "REPORTED_DATE": "4/23/2019 4:00:00 AM", "REPORTED_TIME": "754", "DIVISION": "D53", "LOCATION_TYPE": "Educational Institution (Universities, Colleges, Schools, etc.)", "PRIMARY_OFFENCE": "Assault With a Weapon", "HOOD_158": "173"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `EVENT_UNIQUE_ID`: 0
- `OCCURRENCE_YEAR`: 0
- `OCCURRENCE_DATE`: 0
- `OCCURRENCE_TIME`: 0
- `REPORTED_YEAR`: 0
- `REPORTED_DATE`: 0
- `REPORTED_TIME`: 0
- `DIVISION`: 0
- `LOCATION_TYPE`: 68
- `AGE_BIAS`: 0
- `MENTAL_OR_PHYSICAL_DISABILITY`: 0
- `RACE_BIAS`: 1,432
- `ETHNICITY_BIAS`: 1,794
- `LANGUAGE_BIAS`: 2,037
- `RELIGION_BIAS`: 1,073
- `SEXUAL_ORIENTATION_BIAS`: 1,748
- `GENDER_BIAS`: 1,929
- `MULTIPLE_BIAS`: 0
- `PRIMARY_OFFENCE`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `ARREST_MADE`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`, `EVENT_UNIQUE_ID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: yes
- EVENT_UNIQUE_ID unique: yes
- Date/time columns: `OCCURRENCE_YEAR`, `OCCURRENCE_DATE`, `OCCURRENCE_TIME`, `REPORTED_YEAR`, `REPORTED_DATE`, `REPORTED_TIME`
- Offence/category columns: `LOCATION_TYPE`, `PRIMARY_OFFENCE`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DIVISION`
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Has `EVENT_UNIQUE_ID`; uniqueness within file: yes.
- Has `OBJECTID`; uniqueness within file: yes.

### `Homicides_Open_Data_ASR_RC_TBL_002_8369086210015881422 (1).csv`

- **Detected dataset name:** Homicides Open Data ASR RC TBL 002
- **File type:** CSV
- **File size:** 304.3 KB (311,554 bytes)
- **Row count:** 1,531 (excluding header)
- **Column count:** 18

**Columns:** `OBJECTID`, `EVENT_UNIQUE_ID`, `OCC_DATE`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DAY`, `OCC_DOW`, `OCC_DOY`, `DIVISION`, `HOMICIDE_TYPE`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `LONG_WGS84`, `LAT_WGS84`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "EVENT_UNIQUE_ID": "GO-2004111878", "OCC_DATE": "1/3/2004 5:00:00 AM", "OCC_YEAR": "2004", "OCC_MONTH": "January", "OCC_DOW": "Saturday", "OCC_DOY": "3", "DIVISION": "D53", "HOMICIDE_TYPE": "Other", "HOOD_158": "098", "NEIGHBOURHOOD_158": "Rosedale-Moore Park (98)", "HOOD_140": "098"}`
2. `{"OBJECTID": "2", "EVENT_UNIQUE_ID": "GO-2004125755", "OCC_DATE": "1/8/2004 5:00:00 AM", "OCC_YEAR": "2004", "OCC_MONTH": "January", "OCC_DOW": "Thursday", "OCC_DOY": "8", "DIVISION": "D42", "HOMICIDE_TYPE": "Shooting", "HOOD_158": "142", "NEIGHBOURHOOD_158": "Woburn North (142)", "HOOD_140": "137"}`
3. `{"OBJECTID": "3", "EVENT_UNIQUE_ID": "GO-2004136086", "OCC_DATE": "1/8/2004 5:00:00 AM", "OCC_YEAR": "2004", "OCC_MONTH": "January", "OCC_DOW": "Thursday", "OCC_DOY": "8", "DIVISION": "D42", "HOMICIDE_TYPE": "Shooting", "HOOD_158": "146", "NEIGHBOURHOOD_158": "Malvern East (146)", "HOOD_140": "132"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `EVENT_UNIQUE_ID`: 0
- `OCC_DATE`: 0
- `OCC_YEAR`: 0
- `OCC_MONTH`: 0
- `OCC_DAY`: 0
- `OCC_DOW`: 0
- `OCC_DOY`: 0
- `DIVISION`: 0
- `HOMICIDE_TYPE`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `LONG_WGS84`: 0
- `LAT_WGS84`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: yes
- EVENT_UNIQUE_ID unique: no (1,433 distinct / 1,531 non-blank)
- Date/time columns: `OCC_DATE`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DOW`, `OCC_DOY`
- Offence/category columns: `HOMICIDE_TYPE`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DIVISION`
- Coordinate columns: `LONG_WGS84`, `LAT_WGS84`, `x`, `y`
- WGS84 lat/lng present: yes (`LAT_WGS84`, `LONG_WGS84`)
- Rows with 0,0 coordinates: 0
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LAT_WGS84` and `LONG_WGS84`.
- Has `EVENT_UNIQUE_ID`; uniqueness within file: no (1,433 distinct / 1,531 non-blank).
- Has `OBJECTID`; uniqueness within file: yes.

### `Homicides_Open_Data_ASR_RC_TBL_002_8369086210015881422.csv`

- **Detected dataset name:** Homicides Open Data ASR RC TBL 002
- **File type:** CSV
- **File size:** 304.3 KB (311,554 bytes)
- **Row count:** 1,531 (excluding header)
- **Column count:** 18

**Columns:** `OBJECTID`, `EVENT_UNIQUE_ID`, `OCC_DATE`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DAY`, `OCC_DOW`, `OCC_DOY`, `DIVISION`, `HOMICIDE_TYPE`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `LONG_WGS84`, `LAT_WGS84`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "EVENT_UNIQUE_ID": "GO-2004111878", "OCC_DATE": "1/3/2004 5:00:00 AM", "OCC_YEAR": "2004", "OCC_MONTH": "January", "OCC_DOW": "Saturday", "OCC_DOY": "3", "DIVISION": "D53", "HOMICIDE_TYPE": "Other", "HOOD_158": "098", "NEIGHBOURHOOD_158": "Rosedale-Moore Park (98)", "HOOD_140": "098"}`
2. `{"OBJECTID": "2", "EVENT_UNIQUE_ID": "GO-2004125755", "OCC_DATE": "1/8/2004 5:00:00 AM", "OCC_YEAR": "2004", "OCC_MONTH": "January", "OCC_DOW": "Thursday", "OCC_DOY": "8", "DIVISION": "D42", "HOMICIDE_TYPE": "Shooting", "HOOD_158": "142", "NEIGHBOURHOOD_158": "Woburn North (142)", "HOOD_140": "137"}`
3. `{"OBJECTID": "3", "EVENT_UNIQUE_ID": "GO-2004136086", "OCC_DATE": "1/8/2004 5:00:00 AM", "OCC_YEAR": "2004", "OCC_MONTH": "January", "OCC_DOW": "Thursday", "OCC_DOY": "8", "DIVISION": "D42", "HOMICIDE_TYPE": "Shooting", "HOOD_158": "146", "NEIGHBOURHOOD_158": "Malvern East (146)", "HOOD_140": "132"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `EVENT_UNIQUE_ID`: 0
- `OCC_DATE`: 0
- `OCC_YEAR`: 0
- `OCC_MONTH`: 0
- `OCC_DAY`: 0
- `OCC_DOW`: 0
- `OCC_DOY`: 0
- `DIVISION`: 0
- `HOMICIDE_TYPE`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `LONG_WGS84`: 0
- `LAT_WGS84`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: yes
- EVENT_UNIQUE_ID unique: no (1,433 distinct / 1,531 non-blank)
- Date/time columns: `OCC_DATE`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DOW`, `OCC_DOY`
- Offence/category columns: `HOMICIDE_TYPE`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DIVISION`
- Coordinate columns: `LONG_WGS84`, `LAT_WGS84`, `x`, `y`
- WGS84 lat/lng present: yes (`LAT_WGS84`, `LONG_WGS84`)
- Rows with 0,0 coordinates: 0
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LAT_WGS84` and `LONG_WGS84`.
- Has `EVENT_UNIQUE_ID`; uniqueness within file: no (1,433 distinct / 1,531 non-blank).
- Has `OBJECTID`; uniqueness within file: yes.

### `Intimate_Partner_and_Family_Violence_open_data_-3830886989670353627.csv`

- **Detected dataset name:** Intimate Partner and Family Violence open data
- **File type:** CSV
- **File size:** 27.67 MB (29,017,177 bytes)
- **Row count:** 190,723 (excluding header)
- **Column count:** 15

**Columns:** `OBJECTID`, `INDEX`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DOW`, `HISTORICAL`, `FAMILY_VIOLENCE_FLAG`, `FAMILY_VIOLENCE_RELATION`, `DIVISION`, `PREMISES_TYPE`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `COUNT`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "REPORT_YEAR": "2024", "REPORT_MONTH": "July", "REPORT_DOW": "Monday", "FAMILY_VIOLENCE_RELATION": "Former Intimate Relationship", "DIVISION": "D33", "PREMISES_TYPE": "Outside", "HOOD_158": "053", "NEIGHBOURHOOD_158": "Henry Farm (53)", "HOOD_140": "053", "NEIGHBOURHOOD_140": "Henry Farm (53)"}`
2. `{"OBJECTID": "2", "REPORT_YEAR": "2024", "REPORT_MONTH": "February", "REPORT_DOW": "Tuesday", "FAMILY_VIOLENCE_RELATION": "Former Intimate Relationship", "DIVISION": "D14", "PREMISES_TYPE": "Other", "HOOD_158": "084", "NEIGHBOURHOOD_158": "Little Portugal (84)", "HOOD_140": "084", "NEIGHBOURHOOD_140": "Little Portugal (84)"}`
3. `{"OBJECTID": "3", "REPORT_YEAR": "2024", "REPORT_MONTH": "February", "REPORT_DOW": "Tuesday", "FAMILY_VIOLENCE_RELATION": "Intimate Relationship", "DIVISION": "D32", "PREMISES_TYPE": "House", "HOOD_158": "031", "NEIGHBOURHOOD_158": "Yorkdale-Glen Park (31)", "HOOD_140": "031", "NEIGHBOURHOOD_140": "Yorkdale-Glen Park (31)"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `INDEX`: 0
- `REPORT_YEAR`: 0
- `REPORT_MONTH`: 0
- `REPORT_DOW`: 0
- `HISTORICAL`: 0
- `FAMILY_VIOLENCE_FLAG`: 0
- `FAMILY_VIOLENCE_RELATION`: 0
- `DIVISION`: 0
- `PREMISES_TYPE`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `COUNT`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DOW`
- Offence/category columns: `PREMISES_TYPE`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DIVISION`
- Coordinate columns: `FAMILY_VIOLENCE_RELATION`
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `OBJECTID`; uniqueness within file: yes.

### `Investigated_Alleged_Misconduct_(ASR_PCF_TBL_002)_-2085696945410791167.csv`

- **Detected dataset name:** Investigated Alleged Misconduct (ASR PCF TBL 002)
- **File type:** CSV
- **File size:** 13.6 KB (13,909 bytes)
- **Row count:** 170 (excluding header)
- **Column count:** 6

**Columns:** `INDEX`, `YEAR`, `TYPE`, `SUBTYPE`, `COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"YEAR": "2022", "TYPE": "ALLEGED MISCONDUCT - Investigated Complaints", "SUBTYPE": "Consuming Drugs or Alcohol", "ObjectId": "1"}`
2. `{"YEAR": "2022", "TYPE": "ALLEGED MISCONDUCT - Investigated Complaints", "SUBTYPE": "Corrupt Practice", "ObjectId": "2"}`
3. `{"YEAR": "2022", "TYPE": "ALLEGED MISCONDUCT - Investigated Complaints", "SUBTYPE": "Deceit", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `YEAR`: 0
- `TYPE`: 0
- `SUBTYPE`: 0
- `COUNT`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `YEAR`
- Offence/category columns: `TYPE`, `SUBTYPE`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Mental_Health_Act_Apprehensions_Open_Data_6462585705434383286.csv`

- **Detected dataset name:** Mental Health Act Apprehensions Open Data
- **File type:** CSV
- **File size:** 29.27 MB (30,690,310 bytes)
- **Row count:** 134,457 (excluding header)
- **Column count:** 25

**Columns:** `OBJECTID`, `EVENT_UNIQUE_ID`, `REPORT_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DOW`, `REPORT_DOY`, `REPORT_DAY`, `REPORT_HOUR`, `OCC_DATE`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DOY`, `OCC_DAY`, `OCC_DOW`, `OCC_HOUR`, `DIVISION`, `PREMISES_TYPE`, `APPREHENSION_TYPE`, `SEX`, `AGE_COHORT`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "EVENT_UNIQUE_ID": "GO-20141261310", "REPORT_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOW": "Wednesday", "REPORT_DOY": "1", "REPORT_HOUR": "8", "OCC_DATE": "1/1/2014 5:00:00 AM", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOY": "1"}`
2. `{"OBJECTID": "2", "EVENT_UNIQUE_ID": "GO-20141263132", "REPORT_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOW": "Wednesday", "REPORT_DOY": "1", "REPORT_HOUR": "16", "OCC_DATE": "1/1/2014 5:00:00 AM", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOY": "1"}`
3. `{"OBJECTID": "3", "EVENT_UNIQUE_ID": "GO-20141263946", "REPORT_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOW": "Wednesday", "REPORT_DOY": "1", "REPORT_HOUR": "19", "OCC_DATE": "1/1/2014 5:00:00 AM", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOY": "1"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `EVENT_UNIQUE_ID`: 0
- `REPORT_DATE`: 0
- `REPORT_YEAR`: 0
- `REPORT_MONTH`: 0
- `REPORT_DOW`: 0
- `REPORT_DOY`: 0
- `REPORT_DAY`: 0
- `REPORT_HOUR`: 0
- `OCC_DATE`: 0
- `OCC_YEAR`: 0
- `OCC_MONTH`: 0
- `OCC_DOY`: 0
- `OCC_DAY`: 0
- `OCC_DOW`: 0
- `OCC_HOUR`: 0
- `DIVISION`: 0
- `PREMISES_TYPE`: 0
- `APPREHENSION_TYPE`: 0
- `SEX`: 0
- `AGE_COHORT`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: yes
- EVENT_UNIQUE_ID unique: no (134,162 distinct / 134,457 non-blank)
- Date/time columns: `REPORT_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DOW`, `REPORT_DOY`, `REPORT_HOUR`, `OCC_DATE`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DOY`, `OCC_DOW`, `OCC_HOUR`
- Offence/category columns: `PREMISES_TYPE`, `APPREHENSION_TYPE`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DIVISION`
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Has `EVENT_UNIQUE_ID`; uniqueness within file: no (134,162 distinct / 134,457 non-blank).
- Has `OBJECTID`; uniqueness within file: yes.

### `Miscellaneous_Calls_for_Service_(ASR_CS_TBL_002)_-4714122475863368795.csv`

- **Detected dataset name:** Miscellaneous Calls for Service (ASR CS TBL 002)
- **File type:** CSV
- **File size:** 10.6 KB (10,828 bytes)
- **Row count:** 296 (excluding header)
- **Column count:** 6

**Columns:** `INDEX`, `YEAR`, `CATEGORY`, `TYPE`, `COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"YEAR": "2020", "CATEGORY": "Languages", "TYPE": "Somali", "ObjectId": "1"}`
2. `{"YEAR": "2020", "CATEGORY": "Languages", "TYPE": "Spanish ", "ObjectId": "2"}`
3. `{"YEAR": "2020", "CATEGORY": "Languages", "TYPE": "Tamil", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `YEAR`: 0
- `CATEGORY`: 0
- `TYPE`: 0
- `COUNT`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `YEAR`
- Offence/category columns: `CATEGORY`, `TYPE`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Miscellaneous_Data_(ASR_MISC_TBL_001)_2360693627772460444.csv`

- **Detected dataset name:** Miscellaneous Data (ASR MISC TBL 001)
- **File type:** CSV
- **File size:** 14.9 KB (15,225 bytes)
- **Row count:** 270 (excluding header)
- **Column count:** 7

**Columns:** `INDEX`, `YEAR`, `SECTION`, `CATEGORY`, `SUBTYPE`, `COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"YEAR": "2014", "CATEGORY": "Hate Crimes", "SUBTYPE": "Total Events", "ObjectId": "1"}`
2. `{"YEAR": "2015", "CATEGORY": "Hate Crimes", "SUBTYPE": "Total Events", "ObjectId": "2"}`
3. `{"YEAR": "2016", "CATEGORY": "Hate Crimes", "SUBTYPE": "Total Events", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `YEAR`: 0
- `SECTION`: 0
- `CATEGORY`: 0
- `SUBTYPE`: 0
- `COUNT`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `YEAR`
- Offence/category columns: `CATEGORY`, `SUBTYPE`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Miscellaneous_Firearms_(ASR_F_TBL_003)_5714712306071097312.csv`

- **Detected dataset name:** Miscellaneous Firearms (ASR F TBL 003)
- **File type:** CSV
- **File size:** 27.3 KB (27,984 bytes)
- **Row count:** 594 (excluding header)
- **Column count:** 6

**Columns:** `INDEX`, `YEAR`, `CATEGORY`, `TYPE`, `COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"YEAR": "2014", "CATEGORY": "Firearm Types Stolen & Recovered", "TYPE": "Submachine Gun", "ObjectId": "1"}`
2. `{"YEAR": "2019", "CATEGORY": "Firearm Types Stolen & Recovered", "TYPE": "Pistol", "ObjectId": "2"}`
3. `{"YEAR": "2014", "CATEGORY": "Firearm Types Stolen & Recovered", "TYPE": "Shotgun", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `YEAR`: 0
- `CATEGORY`: 0
- `TYPE`: 0
- `COUNT`: 48
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `YEAR`
- Offence/category columns: `CATEGORY`, `TYPE`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `MOTORCYCLIST_KSI_5609304537475892552.csv`

- **Detected dataset name:** MOTORCYCLIST KSI
- **File type:** CSV
- **File size:** 658.5 KB (674,294 bytes)
- **Row count:** 1,684 (excluding header)
- **Column count:** 54

**Columns:** `OBJECTID`, `INDEX`, `ACCNUM`, `DATE`, `TIME`, `STREET1`, `STREET2`, `OFFSET`, `ROAD_CLASS`, `DISTRICT`, `LATITUDE`, `LONGITUDE`, `ACCLOC`, `TRAFFCTL`, `VISIBILITY`, `LIGHT`, `RDSFCOND`, `ACCLASS`, `IMPACTYPE`, `INVTYPE`, `INVAGE`, `INJURY`, `FATAL_NO`, `INITDIR`, `VEHTYPE`, `MANOEUVER`, `DRIVACT`, `DRIVCOND`, `PEDTYPE`, `PEDACT`, `PEDCOND`, `CYCLISTYPE`, `CYCACT`, `CYCCOND`, `PEDESTRIAN`, `CYCLIST`, `AUTOMOBILE`, `MOTORCYCLE`, `TRUCK`, `TRSN_CITY_VEH`, `EMERG_VEH`, `PASSENGER`, `SPEEDING`, `AG_DRIV`, `REDLIGHT`, `ALCOHOL`, `DISABILITY`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `DIVISION`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "ACCNUM": "892810", "DATE": "3/11/2006 5:00:00 AM", "TIME": "915", "DISTRICT": "Scarborough", "LATITUDE": "43.801943", "LONGITUDE": "-79.199786", "IMPACTYPE": "Turning Movement", "INVTYPE": "Motorcycle Driver", "VEHTYPE": "Motorcycle", "PEDTYPE": "", "CYCLISTYPE": ""}`
2. `{"OBJECTID": "2", "ACCNUM": "892810", "DATE": "3/11/2006 5:00:00 AM", "TIME": "915", "DISTRICT": "Scarborough", "LATITUDE": "43.801943", "LONGITUDE": "-79.199786", "IMPACTYPE": "Turning Movement", "INVTYPE": "Driver", "VEHTYPE": "Automobile, Station Wagon", "PEDTYPE": "", "CYCLISTYPE": ""}`
3. `{"OBJECTID": "3", "ACCNUM": "900010", "DATE": "4/8/2006 4:00:00 AM", "TIME": "1150", "DISTRICT": "Scarborough", "LATITUDE": "43.788745", "LONGITUDE": "-79.26289", "IMPACTYPE": "SMV Other", "INVTYPE": "Vehicle Owner", "VEHTYPE": "Other", "PEDTYPE": "", "CYCLISTYPE": ""}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `INDEX`: 0
- `ACCNUM`: 539
- `DATE`: 0
- `TIME`: 0
- `STREET1`: 0
- `STREET2`: 141
- `OFFSET`: 1,210
- `ROAD_CLASS`: 71
- `DISTRICT`: 45
- `LATITUDE`: 0
- `LONGITUDE`: 0
- `ACCLOC`: 352
- `TRAFFCTL`: 7
- `VISIBILITY`: 4
- `LIGHT`: 0
- `RDSFCOND`: 4
- `ACCLASS`: 0
- `IMPACTYPE`: 7
- `INVTYPE`: 2
- `INVAGE`: 0
- `INJURY`: 786
- `FATAL_NO`: 1,592
- `INITDIR`: 306
- `VEHTYPE`: 182
- `MANOEUVER`: 330
- `DRIVACT`: 358
- `DRIVCOND`: 356
- `PEDTYPE`: 1,653
- `PEDACT`: 1,653
- `PEDCOND`: 1,652
- `CYCLISTYPE`: 1,678
- `CYCACT`: 1,678
- `CYCCOND`: 1,678
- `PEDESTRIAN`: 1,609
- `CYCLIST`: 1,669
- `AUTOMOBILE`: 333
- `MOTORCYCLE`: 0
- `TRUCK`: 1,641
- `TRSN_CITY_VEH`: 1,661
- `EMERG_VEH`: 1,682
- `PASSENGER`: 1,220
- `SPEEDING`: 1,284
- `AG_DRIV`: 607
- `REDLIGHT`: 1,590
- `ALCOHOL`: 1,657
- `DISABILITY`: 1,676
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `DIVISION`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `DATE`, `TIME`
- Offence/category columns: `IMPACTYPE`, `INVTYPE`, `VEHTYPE`, `PEDTYPE`, `CYCLISTYPE`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DISTRICT`, `DIVISION`
- Coordinate columns: `LATITUDE`, `LONGITUDE`, `x`, `y`
- WGS84 lat/lng present: yes (`LATITUDE`, `LONGITUDE`)
- Rows with 0,0 coordinates: 0
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LATITUDE` and `LONGITUDE`.
- Has `OBJECTID`; uniqueness within file: yes.
- Participant- or collision-level rows; may share `ACCNUM` or `EVENT_UNIQUE_ID` across multiple rows.

### `Neighbourhood_Crime_Rates_Open_Data_5187007239983414201.csv`

- **Detected dataset name:** Neighbourhood Crime Rates Open Data
- **File type:** CSV
- **File size:** 310.0 KB (317,424 bytes)
- **Row count:** 158 (excluding header)
- **Column count:** 222

**Columns:** `OBJECTID_1`, `NEIGHBOURHOOD_NAME`, `HOOD_158`, `ASSAULT_2014`, `ASSAULT_2015`, `ASSAULT_2016`, `ASSAULT_2017`, `ASSAULT_2018`, `ASSAULT_2019`, `ASSAULT_2020`, `ASSAULT_2021`, `ASSAULT_2022`, `ASSAULT_2023`, `ASSAULT_2024`, `ASSAULT_2025`, `ASSAULT_RATE_2014`, `ASSAULT_RATE_2015`, `ASSAULT_RATE_2016`, `ASSAULT_RATE_2017`, `ASSAULT_RATE_2018`, `ASSAULT_RATE_2019`, `ASSAULT_RATE_2020`, `ASSAULT_RATE_2021`, `ASSAULT_RATE_2022`, `ASSAULT_RATE_2023`, `ASSAULT_RATE_2024`, `ASSAULT_RATE_2025`, `AUTOTHEFT_2014`, `AUTOTHEFT_2015`, `AUTOTHEFT_2016`, `AUTOTHEFT_2017`, `AUTOTHEFT_2018`, `AUTOTHEFT_2019`, `AUTOTHEFT_2020`, `AUTOTHEFT_2021`, `AUTOTHEFT_2022`, `AUTOTHEFT_2023`, `AUTOTHEFT_2024`, `AUTOTHEFT_2025`, `AUTOTHEFT_RATE_2014`, `AUTOTHEFT_RATE_2015`, `AUTOTHEFT_RATE_2016`, `AUTOTHEFT_RATE_2017`, `AUTOTHEFT_RATE_2018`, `AUTOTHEFT_RATE_2019`, `AUTOTHEFT_RATE_2020`, `AUTOTHEFT_RATE_2021`, `AUTOTHEFT_RATE_2022`, `AUTOTHEFT_RATE_2023`, `AUTOTHEFT_RATE_2024`, `AUTOTHEFT_RATE_2025`, `BIKETHEFT_2014`, `BIKETHEFT_2015`, `BIKETHEFT_2016`, `BIKETHEFT_2017`, `BIKETHEFT_2018`, `BIKETHEFT_2019`, `BIKETHEFT_2020`, `BIKETHEFT_2021`, `BIKETHEFT_2022`, `BIKETHEFT_2023`, `BIKETHEFT_2024`, `BIKETHEFT_2025`, `BIKETHEFT_RATE_2014`, `BIKETHEFT_RATE_2015`, `BIKETHEFT_RATE_2016`, `BIKETHEFT_RATE_2017`, `BIKETHEFT_RATE_2018`, `BIKETHEFT_RATE_2019`, `BIKETHEFT_RATE_2020`, `BIKETHEFT_RATE_2021`, `BIKETHEFT_RATE_2022`, `BIKETHEFT_RATE_2023`, `BIKETHEFT_RATE_2024`, `BIKETHEFT_RATE_2025`, `BREAKENTER_2014`, `BREAKENTER_2015`, `BREAKENTER_2016`, `BREAKENTER_2017`, `BREAKENTER_2018`, `BREAKENTER_2019`, `BREAKENTER_2020`, `BREAKENTER_2021`, `BREAKENTER_2022`, `BREAKENTER_2023`, `BREAKENTER_2024`, `BREAKENTER_2025`, `BREAKENTER_RATE_2014`, `BREAKENTER_RATE_2015`, `BREAKENTER_RATE_2016`, `BREAKENTER_RATE_2017`, `BREAKENTER_RATE_2018`, `BREAKENTER_RATE_2019`, `BREAKENTER_RATE_2020`, `BREAKENTER_RATE_2021`, `BREAKENTER_RATE_2022`, `BREAKENTER_RATE_2023`, `BREAKENTER_RATE_2024`, `BREAKENTER_RATE_2025`, `HOMICIDE_2014`, `HOMICIDE_2015`, `HOMICIDE_2016`, `HOMICIDE_2017`, `HOMICIDE_2018`, `HOMICIDE_2019`, `HOMICIDE_2020`, `HOMICIDE_2021`, `HOMICIDE_2022`, `HOMICIDE_2023`, `HOMICIDE_2024`, `HOMICIDE_2025`, `HOMICIDE_RATE_2014`, `HOMICIDE_RATE_2015`, `HOMICIDE_RATE_2016`, `HOMICIDE_RATE_2017`, `HOMICIDE_RATE_2018`, `HOMICIDE_RATE_2019`, `HOMICIDE_RATE_2020`, `HOMICIDE_RATE_2021`, `HOMICIDE_RATE_2022`, `HOMICIDE_RATE_2023`, `HOMICIDE_RATE_2024`, `HOMICIDE_RATE_2025`, `ROBBERY_2014`, `ROBBERY_2015`, `ROBBERY_2016`, `ROBBERY_2017`, `ROBBERY_2018`, `ROBBERY_2019`, `ROBBERY_2020`, `ROBBERY_2021`, `ROBBERY_2022`, `ROBBERY_2023`, `ROBBERY_2024`, `ROBBERY_2025`, `ROBBERY_RATE_2014`, `ROBBERY_RATE_2015`, `ROBBERY_RATE_2016`, `ROBBERY_RATE_2017`, `ROBBERY_RATE_2018`, `ROBBERY_RATE_2019`, `ROBBERY_RATE_2020`, `ROBBERY_RATE_2021`, `ROBBERY_RATE_2022`, `ROBBERY_RATE_2023`, `ROBBERY_RATE_2024`, `ROBBERY_RATE_2025`, `SHOOTING_2014`, `SHOOTING_2015`, `SHOOTING_2016`, `SHOOTING_2017`, `SHOOTING_2018`, `SHOOTING_2019`, `SHOOTING_2020`, `SHOOTING_2021`, `SHOOTING_2022`, `SHOOTING_2023`, `SHOOTING_2024`, `SHOOTING_2025`, `SHOOTING_RATE_2014`, `SHOOTING_RATE_2015`, `SHOOTING_RATE_2016`, `SHOOTING_RATE_2017`, `SHOOTING_RATE_2018`, `SHOOTING_RATE_2019`, `SHOOTING_RATE_2020`, `SHOOTING_RATE_2021`, `SHOOTING_RATE_2022`, `SHOOTING_RATE_2023`, `SHOOTING_RATE_2024`, `SHOOTING_RATE_2025`, `THEFTFROMMV_2014`, `THEFTFROMMV_2015`, `THEFTFROMMV_2016`, `THEFTFROMMV_2017`, `THEFTFROMMV_2018`, `THEFTFROMMV_2019`, `THEFTFROMMV_2020`, `THEFTFROMMV_2021`, `THEFTFROMMV_2022`, `THEFTFROMMV_2023`, `THEFTFROMMV_2024`, `THEFTFROMMV_2025`, `THEFTFROMMV_RATE_2014`, `THEFTFROMMV_RATE_2015`, `THEFTFROMMV_RATE_2016`, `THEFTFROMMV_RATE_2017`, `THEFTFROMMV_RATE_2018`, `THEFTFROMMV_RATE_2019`, `THEFTFROMMV_RATE_2020`, `THEFTFROMMV_RATE_2021`, `THEFTFROMMV_RATE_2022`, `THEFTFROMMV_RATE_2023`, `THEFTFROMMV_RATE_2024`, `THEFTFROMMV_RATE_2025`, `THEFTOVER_2014`, `THEFTOVER_2015`, `THEFTOVER_2016`, `THEFTOVER_2017`, `THEFTOVER_2018`, `THEFTOVER_2019`, `THEFTOVER_2020`, `THEFTOVER_2021`, `THEFTOVER_2022`, `THEFTOVER_2023`, `THEFTOVER_2024`, `THEFTOVER_2025`, `THEFTOVER_RATE_2014`, `THEFTOVER_RATE_2015`, `THEFTOVER_RATE_2016`, `THEFTOVER_RATE_2017`, `THEFTOVER_RATE_2018`, `THEFTOVER_RATE_2019`, `THEFTOVER_RATE_2020`, `THEFTOVER_RATE_2021`, `THEFTOVER_RATE_2022`, `THEFTOVER_RATE_2023`, `THEFTOVER_RATE_2024`, `THEFTOVER_RATE_2025`, `POPULATION_2025`, `Shape__Area`, `Shape__Length`

**First 3 rows (important fields):**

1. `{"OBJECTID_1": "1", "NEIGHBOURHOOD_NAME": "South Eglinton-Davisville", "HOOD_158": "174", "HOMICIDE_2014": "0", "HOMICIDE_2015": "0", "HOMICIDE_2016": "1", "HOMICIDE_2017": "0", "HOMICIDE_2018": "0", "HOMICIDE_2019": "1", "HOMICIDE_2020": "1", "HOMICIDE_2021": "1", "HOMICIDE_2022": "0"}`
2. `{"OBJECTID_1": "2", "NEIGHBOURHOOD_NAME": "North Toronto", "HOOD_158": "173", "HOMICIDE_2014": "0", "HOMICIDE_2015": "0", "HOMICIDE_2016": "0", "HOMICIDE_2017": "0", "HOMICIDE_2018": "0", "HOMICIDE_2019": "1", "HOMICIDE_2020": "1", "HOMICIDE_2021": "0", "HOMICIDE_2022": "0"}`
3. `{"OBJECTID_1": "3", "NEIGHBOURHOOD_NAME": "Dovercourt Village", "HOOD_158": "172", "HOMICIDE_2014": "1", "HOMICIDE_2015": "0", "HOMICIDE_2016": "0", "HOMICIDE_2017": "1", "HOMICIDE_2018": "0", "HOMICIDE_2019": "2", "HOMICIDE_2020": "1", "HOMICIDE_2021": "0", "HOMICIDE_2022": "0"}`

**Blank/null counts per column:**

- `OBJECTID_1`: 0
- `NEIGHBOURHOOD_NAME`: 0
- `HOOD_158`: 0
- `ASSAULT_2014`: 0
- `ASSAULT_2015`: 0
- `ASSAULT_2016`: 0
- `ASSAULT_2017`: 0
- `ASSAULT_2018`: 0
- `ASSAULT_2019`: 0
- `ASSAULT_2020`: 0
- `ASSAULT_2021`: 0
- `ASSAULT_2022`: 0
- `ASSAULT_2023`: 0
- `ASSAULT_2024`: 0
- `ASSAULT_2025`: 0
- `ASSAULT_RATE_2014`: 0
- `ASSAULT_RATE_2015`: 0
- `ASSAULT_RATE_2016`: 0
- `ASSAULT_RATE_2017`: 0
- `ASSAULT_RATE_2018`: 0
- `ASSAULT_RATE_2019`: 0
- `ASSAULT_RATE_2020`: 0
- `ASSAULT_RATE_2021`: 0
- `ASSAULT_RATE_2022`: 0
- `ASSAULT_RATE_2023`: 0
- `ASSAULT_RATE_2024`: 0
- `ASSAULT_RATE_2025`: 0
- `AUTOTHEFT_2014`: 0
- `AUTOTHEFT_2015`: 0
- `AUTOTHEFT_2016`: 0
- `AUTOTHEFT_2017`: 0
- `AUTOTHEFT_2018`: 0
- `AUTOTHEFT_2019`: 0
- `AUTOTHEFT_2020`: 0
- `AUTOTHEFT_2021`: 0
- `AUTOTHEFT_2022`: 0
- `AUTOTHEFT_2023`: 0
- `AUTOTHEFT_2024`: 0
- `AUTOTHEFT_2025`: 0
- `AUTOTHEFT_RATE_2014`: 0
- `AUTOTHEFT_RATE_2015`: 0
- `AUTOTHEFT_RATE_2016`: 0
- `AUTOTHEFT_RATE_2017`: 0
- `AUTOTHEFT_RATE_2018`: 0
- `AUTOTHEFT_RATE_2019`: 0
- `AUTOTHEFT_RATE_2020`: 0
- `AUTOTHEFT_RATE_2021`: 0
- `AUTOTHEFT_RATE_2022`: 0
- `AUTOTHEFT_RATE_2023`: 0
- `AUTOTHEFT_RATE_2024`: 0
- `AUTOTHEFT_RATE_2025`: 0
- `BIKETHEFT_2014`: 0
- `BIKETHEFT_2015`: 0
- `BIKETHEFT_2016`: 0
- `BIKETHEFT_2017`: 0
- `BIKETHEFT_2018`: 0
- `BIKETHEFT_2019`: 0
- `BIKETHEFT_2020`: 0
- `BIKETHEFT_2021`: 0
- `BIKETHEFT_2022`: 0
- `BIKETHEFT_2023`: 0
- `BIKETHEFT_2024`: 0
- `BIKETHEFT_2025`: 0
- `BIKETHEFT_RATE_2014`: 0
- `BIKETHEFT_RATE_2015`: 0
- `BIKETHEFT_RATE_2016`: 0
- `BIKETHEFT_RATE_2017`: 0
- `BIKETHEFT_RATE_2018`: 0
- `BIKETHEFT_RATE_2019`: 0
- `BIKETHEFT_RATE_2020`: 0
- `BIKETHEFT_RATE_2021`: 0
- `BIKETHEFT_RATE_2022`: 0
- `BIKETHEFT_RATE_2023`: 0
- `BIKETHEFT_RATE_2024`: 0
- `BIKETHEFT_RATE_2025`: 0
- `BREAKENTER_2014`: 0
- `BREAKENTER_2015`: 0
- `BREAKENTER_2016`: 0
- `BREAKENTER_2017`: 0
- `BREAKENTER_2018`: 0
- `BREAKENTER_2019`: 0
- `BREAKENTER_2020`: 0
- `BREAKENTER_2021`: 0
- `BREAKENTER_2022`: 0
- `BREAKENTER_2023`: 0
- `BREAKENTER_2024`: 0
- `BREAKENTER_2025`: 0
- `BREAKENTER_RATE_2014`: 0
- `BREAKENTER_RATE_2015`: 0
- `BREAKENTER_RATE_2016`: 0
- `BREAKENTER_RATE_2017`: 0
- `BREAKENTER_RATE_2018`: 0
- `BREAKENTER_RATE_2019`: 0
- `BREAKENTER_RATE_2020`: 0
- `BREAKENTER_RATE_2021`: 0
- `BREAKENTER_RATE_2022`: 0
- `BREAKENTER_RATE_2023`: 0
- `BREAKENTER_RATE_2024`: 0
- `BREAKENTER_RATE_2025`: 0
- `HOMICIDE_2014`: 0
- `HOMICIDE_2015`: 0
- `HOMICIDE_2016`: 0
- `HOMICIDE_2017`: 0
- `HOMICIDE_2018`: 0
- `HOMICIDE_2019`: 0
- `HOMICIDE_2020`: 0
- `HOMICIDE_2021`: 0
- `HOMICIDE_2022`: 0
- `HOMICIDE_2023`: 0
- `HOMICIDE_2024`: 0
- `HOMICIDE_2025`: 0
- `HOMICIDE_RATE_2014`: 0
- `HOMICIDE_RATE_2015`: 0
- `HOMICIDE_RATE_2016`: 0
- `HOMICIDE_RATE_2017`: 0
- `HOMICIDE_RATE_2018`: 0
- `HOMICIDE_RATE_2019`: 0
- `HOMICIDE_RATE_2020`: 0
- `HOMICIDE_RATE_2021`: 0
- `HOMICIDE_RATE_2022`: 0
- `HOMICIDE_RATE_2023`: 0
- `HOMICIDE_RATE_2024`: 0
- `HOMICIDE_RATE_2025`: 0
- `ROBBERY_2014`: 0
- `ROBBERY_2015`: 0
- `ROBBERY_2016`: 0
- `ROBBERY_2017`: 0
- `ROBBERY_2018`: 0
- `ROBBERY_2019`: 0
- `ROBBERY_2020`: 0
- `ROBBERY_2021`: 0
- `ROBBERY_2022`: 0
- `ROBBERY_2023`: 0
- `ROBBERY_2024`: 0
- `ROBBERY_2025`: 0
- `ROBBERY_RATE_2014`: 0
- `ROBBERY_RATE_2015`: 0
- `ROBBERY_RATE_2016`: 0
- `ROBBERY_RATE_2017`: 0
- `ROBBERY_RATE_2018`: 0
- `ROBBERY_RATE_2019`: 0
- `ROBBERY_RATE_2020`: 0
- `ROBBERY_RATE_2021`: 0
- `ROBBERY_RATE_2022`: 0
- `ROBBERY_RATE_2023`: 0
- `ROBBERY_RATE_2024`: 0
- `ROBBERY_RATE_2025`: 0
- `SHOOTING_2014`: 0
- `SHOOTING_2015`: 0
- `SHOOTING_2016`: 0
- `SHOOTING_2017`: 0
- `SHOOTING_2018`: 0
- `SHOOTING_2019`: 0
- `SHOOTING_2020`: 0
- `SHOOTING_2021`: 0
- `SHOOTING_2022`: 0
- `SHOOTING_2023`: 0
- `SHOOTING_2024`: 0
- `SHOOTING_2025`: 0
- `SHOOTING_RATE_2014`: 0
- `SHOOTING_RATE_2015`: 0
- `SHOOTING_RATE_2016`: 0
- `SHOOTING_RATE_2017`: 0
- `SHOOTING_RATE_2018`: 0
- `SHOOTING_RATE_2019`: 0
- `SHOOTING_RATE_2020`: 0
- `SHOOTING_RATE_2021`: 0
- `SHOOTING_RATE_2022`: 0
- `SHOOTING_RATE_2023`: 0
- `SHOOTING_RATE_2024`: 0
- `SHOOTING_RATE_2025`: 0
- `THEFTFROMMV_2014`: 0
- `THEFTFROMMV_2015`: 0
- `THEFTFROMMV_2016`: 0
- `THEFTFROMMV_2017`: 0
- `THEFTFROMMV_2018`: 0
- `THEFTFROMMV_2019`: 0
- `THEFTFROMMV_2020`: 0
- `THEFTFROMMV_2021`: 0
- `THEFTFROMMV_2022`: 0
- `THEFTFROMMV_2023`: 0
- `THEFTFROMMV_2024`: 0
- `THEFTFROMMV_2025`: 0
- `THEFTFROMMV_RATE_2014`: 0
- `THEFTFROMMV_RATE_2015`: 0
- `THEFTFROMMV_RATE_2016`: 0
- `THEFTFROMMV_RATE_2017`: 0
- `THEFTFROMMV_RATE_2018`: 0
- `THEFTFROMMV_RATE_2019`: 0
- `THEFTFROMMV_RATE_2020`: 0
- `THEFTFROMMV_RATE_2021`: 0
- `THEFTFROMMV_RATE_2022`: 0
- `THEFTFROMMV_RATE_2023`: 0
- `THEFTFROMMV_RATE_2024`: 0
- `THEFTFROMMV_RATE_2025`: 0
- `THEFTOVER_2014`: 0
- `THEFTOVER_2015`: 0
- `THEFTOVER_2016`: 0
- `THEFTOVER_2017`: 0
- `THEFTOVER_2018`: 0
- `THEFTOVER_2019`: 0
- `THEFTOVER_2020`: 0
- `THEFTOVER_2021`: 0
- `THEFTOVER_2022`: 0
- `THEFTOVER_2023`: 0
- `THEFTOVER_2024`: 0
- `THEFTOVER_2025`: 0
- `THEFTOVER_RATE_2014`: 0
- `THEFTOVER_RATE_2015`: 0
- `THEFTOVER_RATE_2016`: 0
- `THEFTOVER_RATE_2017`: 0
- `THEFTOVER_RATE_2018`: 0
- `THEFTOVER_RATE_2019`: 0
- `THEFTOVER_RATE_2020`: 0
- `THEFTOVER_RATE_2021`: 0
- `THEFTOVER_RATE_2022`: 0
- `THEFTOVER_RATE_2023`: 0
- `THEFTOVER_RATE_2024`: 0
- `THEFTOVER_RATE_2025`: 0
- `POPULATION_2025`: 0
- `Shape__Area`: 0
- `Shape__Length`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID_1`
- OBJECTID exists: yes (`OBJECTID_1`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: none
- Offence/category columns: `HOMICIDE_2014`, `HOMICIDE_2015`, `HOMICIDE_2016`, `HOMICIDE_2017`, `HOMICIDE_2018`, `HOMICIDE_2019`, `HOMICIDE_2020`, `HOMICIDE_2021`, `HOMICIDE_2022`, `HOMICIDE_2023`, `HOMICIDE_2024`, `HOMICIDE_2025`, `HOMICIDE_RATE_2014`, `HOMICIDE_RATE_2015`, `HOMICIDE_RATE_2016`, `HOMICIDE_RATE_2017`, `HOMICIDE_RATE_2018`, `HOMICIDE_RATE_2019`, `HOMICIDE_RATE_2020`, `HOMICIDE_RATE_2021`, `HOMICIDE_RATE_2022`, `HOMICIDE_RATE_2023`, `HOMICIDE_RATE_2024`, `HOMICIDE_RATE_2025`
- Neighbourhood columns: `NEIGHBOURHOOD_NAME`, `HOOD_158`
- Division columns: none
- Coordinate columns: `POPULATION_2025`
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `OBJECTID_1`; uniqueness within file: yes.
- Wide rate/count matrix by neighbourhood and year (222 columns); one row per neighbourhood.

### `PASSENGER_KSI_3578422465060491855.csv`

- **Detected dataset name:** PASSENGER KSI
- **File type:** CSV
- **File size:** 2.62 MB (2,746,496 bytes)
- **Row count:** 7,183 (excluding header)
- **Column count:** 54

**Columns:** `OBJECTID`, `INDEX`, `ACCNUM`, `DATE`, `TIME`, `STREET1`, `STREET2`, `OFFSET`, `ROAD_CLASS`, `DISTRICT`, `LATITUDE`, `LONGITUDE`, `ACCLOC`, `TRAFFCTL`, `VISIBILITY`, `LIGHT`, `RDSFCOND`, `ACCLASS`, `IMPACTYPE`, `INVTYPE`, `INVAGE`, `INJURY`, `FATAL_NO`, `INITDIR`, `VEHTYPE`, `MANOEUVER`, `DRIVACT`, `DRIVCOND`, `PEDTYPE`, `PEDACT`, `PEDCOND`, `CYCLISTYPE`, `CYCACT`, `CYCCOND`, `PEDESTRIAN`, `CYCLIST`, `AUTOMOBILE`, `MOTORCYCLE`, `TRUCK`, `TRSN_CITY_VEH`, `EMERG_VEH`, `PASSENGER`, `SPEEDING`, `AG_DRIV`, `REDLIGHT`, `ALCOHOL`, `DISABILITY`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `DIVISION`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "ACCNUM": "893184", "DATE": "1/1/2006 5:00:00 AM", "TIME": "236", "DISTRICT": "Toronto and East York", "LATITUDE": "43.699595", "LONGITUDE": "-79.318797", "IMPACTYPE": "Approaching", "INVTYPE": "Passenger", "VEHTYPE": "", "PEDTYPE": "", "CYCLISTYPE": ""}`
2. `{"OBJECTID": "2", "ACCNUM": "893184", "DATE": "1/1/2006 5:00:00 AM", "TIME": "236", "DISTRICT": "Toronto and East York", "LATITUDE": "43.699595", "LONGITUDE": "-79.318797", "IMPACTYPE": "Approaching", "INVTYPE": "Passenger", "VEHTYPE": "", "PEDTYPE": "", "CYCLISTYPE": ""}`
3. `{"OBJECTID": "3", "ACCNUM": "893184", "DATE": "1/1/2006 5:00:00 AM", "TIME": "236", "DISTRICT": "Toronto and East York", "LATITUDE": "43.699595", "LONGITUDE": "-79.318797", "IMPACTYPE": "Approaching", "INVTYPE": "Driver", "VEHTYPE": "Automobile, Station Wagon", "PEDTYPE": "", "CYCLISTYPE": ""}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `INDEX`: 0
- `ACCNUM`: 2,184
- `DATE`: 0
- `TIME`: 0
- `STREET1`: 0
- `STREET2`: 571
- `OFFSET`: 5,501
- `ROAD_CLASS`: 279
- `DISTRICT`: 94
- `LATITUDE`: 0
- `LONGITUDE`: 0
- `ACCLOC`: 1,867
- `TRAFFCTL`: 24
- `VISIBILITY`: 3
- `LIGHT`: 0
- `RDSFCOND`: 8
- `ACCLASS`: 0
- `IMPACTYPE`: 16
- `INVTYPE`: 0
- `INVAGE`: 0
- `INJURY`: 3,095
- `FATAL_NO`: 6,977
- `INITDIR`: 3,583
- `VEHTYPE`: 1,935
- `MANOEUVER`: 3,810
- `DRIVACT`: 4,076
- `DRIVCOND`: 4,071
- `PEDTYPE`: 6,833
- `PEDACT`: 6,833
- `PEDCOND`: 6,830
- `CYCLISTYPE`: 7,107
- `CYCACT`: 7,106
- `CYCCOND`: 7,106
- `PEDESTRIAN`: 5,869
- `CYCLIST`: 6,887
- `AUTOMOBILE`: 312
- `MOTORCYCLE`: 6,719
- `TRUCK`: 6,805
- `TRSN_CITY_VEH`: 6,697
- `EMERG_VEH`: 7,145
- `PASSENGER`: 0
- `SPEEDING`: 5,584
- `AG_DRIV`: 2,829
- `REDLIGHT`: 6,250
- `ALCOHOL`: 6,712
- `DISABILITY`: 6,980
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `DIVISION`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `DATE`, `TIME`
- Offence/category columns: `IMPACTYPE`, `INVTYPE`, `VEHTYPE`, `PEDTYPE`, `CYCLISTYPE`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DISTRICT`, `DIVISION`
- Coordinate columns: `LATITUDE`, `LONGITUDE`, `x`, `y`
- WGS84 lat/lng present: yes (`LATITUDE`, `LONGITUDE`)
- Rows with 0,0 coordinates: 0
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LATITUDE` and `LONGITUDE`.
- Has `OBJECTID`; uniqueness within file: yes.
- Participant- or collision-level rows; may share `ACCNUM` or `EVENT_UNIQUE_ID` across multiple rows.

### `Patrol_Zone_-3288783031102167883.csv`

- **Detected dataset name:** Patrol Zone
- **File type:** CSV
- **File size:** 3.1 KB (3,153 bytes)
- **Row count:** 76 (excluding header)
- **Column count:** 4

**Columns:** `OBJECTID`, `Zone`, `Shape__Area`, `Shape__Length`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1"}`
2. `{"OBJECTID": "2"}`
3. `{"OBJECTID": "3"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `Zone`: 0
- `Shape__Area`: 0
- `Shape__Length`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: none
- Offence/category columns: none
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `OBJECTID`; uniqueness within file: yes.

### `PEDESTRIAN_KSI_3654470648591023106.csv`

- **Detected dataset name:** PEDESTRIAN KSI
- **File type:** CSV
- **File size:** 3.06 MB (3,204,545 bytes)
- **Row count:** 7,688 (excluding header)
- **Column count:** 54

**Columns:** `OBJECTID`, `INDEX`, `ACCNUM`, `DATE`, `TIME`, `STREET1`, `STREET2`, `OFFSET`, `ROAD_CLASS`, `DISTRICT`, `LATITUDE`, `LONGITUDE`, `ACCLOC`, `TRAFFCTL`, `VISIBILITY`, `LIGHT`, `RDSFCOND`, `ACCLASS`, `IMPACTYPE`, `INVTYPE`, `INVAGE`, `INJURY`, `FATAL_NO`, `INITDIR`, `VEHTYPE`, `MANOEUVER`, `DRIVACT`, `DRIVCOND`, `PEDTYPE`, `PEDACT`, `PEDCOND`, `CYCLISTYPE`, `CYCACT`, `CYCCOND`, `PEDESTRIAN`, `CYCLIST`, `AUTOMOBILE`, `MOTORCYCLE`, `TRUCK`, `TRSN_CITY_VEH`, `EMERG_VEH`, `PASSENGER`, `SPEEDING`, `AG_DRIV`, `REDLIGHT`, `ALCOHOL`, `DISABILITY`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `DIVISION`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "ACCNUM": "884090", "DATE": "1/2/2006 5:00:00 AM", "TIME": "705", "DISTRICT": "Toronto and East York", "LATITUDE": "43.652892", "LONGITUDE": "-79.406253", "IMPACTYPE": "Pedestrian Collisions", "INVTYPE": "Driver", "VEHTYPE": "Automobile, Station Wagon", "PEDTYPE": "", "CYCLISTYPE": ""}`
2. `{"OBJECTID": "2", "ACCNUM": "884090", "DATE": "1/2/2006 5:00:00 AM", "TIME": "705", "DISTRICT": "Toronto and East York", "LATITUDE": "43.652892", "LONGITUDE": "-79.406253", "IMPACTYPE": "Pedestrian Collisions", "INVTYPE": "Pedestrian", "VEHTYPE": "", "PEDTYPE": "Pedestrian hit at mid-block", "CYCLISTYPE": ""}`
3. `{"OBJECTID": "3", "ACCNUM": "885782", "DATE": "1/4/2006 5:00:00 AM", "TIME": "1940", "DISTRICT": "Toronto and East York", "LATITUDE": "43.655145", "LONGITUDE": "-79.43359", "IMPACTYPE": "Pedestrian Collisions", "INVTYPE": "Driver", "VEHTYPE": "Automobile, Station Wagon", "PEDTYPE": "", "CYCLISTYPE": ""}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `INDEX`: 0
- `ACCNUM`: 2,065
- `DATE`: 0
- `TIME`: 0
- `STREET1`: 0
- `STREET2`: 728
- `OFFSET`: 6,222
- `ROAD_CLASS`: 72
- `DISTRICT`: 71
- `LATITUDE`: 0
- `LONGITUDE`: 0
- `ACCLOC`: 2,097
- `TRAFFCTL`: 30
- `VISIBILITY`: 14
- `LIGHT`: 4
- `RDSFCOND`: 12
- `ACCLASS`: 0
- `IMPACTYPE`: 0
- `INVTYPE`: 10
- `INVAGE`: 0
- `INJURY`: 4,118
- `FATAL_NO`: 7,191
- `INITDIR`: 1,458
- `VEHTYPE`: 2,070
- `MANOEUVER`: 4,262
- `DRIVACT`: 4,504
- `DRIVCOND`: 4,508
- `PEDTYPE`: 4,459
- `PEDACT`: 4,461
- `PEDCOND`: 4,442
- `CYCLISTYPE`: 7,671
- `CYCACT`: 7,671
- `CYCCOND`: 7,672
- `PEDESTRIAN`: 0
- `CYCLIST`: 7,649
- `AUTOMOBILE`: 979
- `MOTORCYCLE`: 7,613
- `TRUCK`: 7,264
- `TRSN_CITY_VEH`: 7,194
- `EMERG_VEH`: 7,678
- `PASSENGER`: 6,374
- `SPEEDING`: 7,296
- `AG_DRIV`: 4,505
- `REDLIGHT`: 7,415
- `ALCOHOL`: 7,516
- `DISABILITY`: 7,638
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `DIVISION`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `DATE`, `TIME`
- Offence/category columns: `IMPACTYPE`, `INVTYPE`, `VEHTYPE`, `PEDTYPE`, `CYCLISTYPE`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DISTRICT`, `DIVISION`
- Coordinate columns: `LATITUDE`, `LONGITUDE`, `x`, `y`
- WGS84 lat/lng present: yes (`LATITUDE`, `LONGITUDE`)
- Rows with 0,0 coordinates: 0
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LATITUDE` and `LONGITUDE`.
- Has `OBJECTID`; uniqueness within file: yes.
- Participant- or collision-level rows; may share `ACCNUM` or `EVENT_UNIQUE_ID` across multiple rows.

### `Personnel_by_Command_(ASR_PB_TBL_004)_8734482224623258744.csv`

- **Detected dataset name:** Personnel by Command (ASR PB TBL 004)
- **File type:** CSV
- **File size:** 2.7 KB (2,724 bytes)
- **Row count:** 70 (excluding header)
- **Column count:** 5

**Columns:** `INDEX`, `YEAR`, `COMMAND`, `COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"YEAR": "2014", "COMMAND": "BOARD", "ObjectId": "1"}`
2. `{"YEAR": "2014", "COMMAND": "CHIEF'S COMMAND", "ObjectId": "2"}`
3. `{"YEAR": "2014", "COMMAND": "COMMUNITY SAFETY COMMAND", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `YEAR`: 0
- `COMMAND`: 0
- `COUNT`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `YEAR`
- Offence/category columns: none
- Neighbourhood columns: none
- Division columns: `COMMAND`
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Personnel_by_Rank_(ASR_PB_TBL_002)_4327912300163850055.csv`

- **Detected dataset name:** Personnel by Rank (ASR PB TBL 002)
- **File type:** CSV
- **File size:** 11.3 KB (11,538 bytes)
- **Row count:** 250 (excluding header)
- **Column count:** 6

**Columns:** `INDEX`, `YEAR`, `RANK`, `CLASSIFICATION`, `COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"YEAR": "2018", "ObjectId": "1"}`
2. `{"YEAR": "2014", "ObjectId": "2"}`
3. `{"YEAR": "2018", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `YEAR`: 0
- `RANK`: 0
- `CLASSIFICATION`: 0
- `COUNT`: 7
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `YEAR`
- Offence/category columns: none
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Personnel_by_Rank_by_Division_(ASR_PB_TBL_003)_5370263291996234710.csv`

- **Detected dataset name:** Personnel by Rank by Division (ASR PB TBL 003)
- **File type:** CSV
- **File size:** 148.5 KB (152,105 bytes)
- **Row count:** 1,582 (excluding header)
- **Column count:** 8

**Columns:** `INDEX`, `YEAR`, `COMMAND GROUP`, `COMMAND SUBUNIT`, `UNIT`, `CLASSIFICATION`, `COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"YEAR": "2014", "COMMAND GROUP": "Area Field Command", "COMMAND SUBUNIT": "Area Field Command", "ObjectId": "1"}`
2. `{"YEAR": "2014", "COMMAND GROUP": "Area Field Command", "COMMAND SUBUNIT": "Area Field Command", "ObjectId": "2"}`
3. `{"YEAR": "2014", "COMMAND GROUP": "Area Field Command", "COMMAND SUBUNIT": "Area Field Command", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `YEAR`: 0
- `COMMAND GROUP`: 0
- `COMMAND SUBUNIT`: 0
- `UNIT`: 0
- `CLASSIFICATION`: 0
- `COUNT`: 7
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `YEAR`
- Offence/category columns: none
- Neighbourhood columns: none
- Division columns: `COMMAND GROUP`, `COMMAND SUBUNIT`
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Persons_in_Crisis_Calls_for_Service_Attended_Open_Data_-3877229567131500534.csv`

- **Detected dataset name:** Persons in Crisis Calls for Service Attended Open Data
- **File type:** CSV
- **File size:** 49.14 MB (51,526,929 bytes)
- **Row count:** 357,697 (excluding header)
- **Column count:** 16

**Columns:** `OBJECTID`, `EVENT_ID`, `EVENT_DATE`, `EVENT_YEAR`, `EVENT_MONTH`, `EVENT_DOW`, `EVENT_HOUR`, `EVENT_TYPE`, `DIVISION`, `OCCURRENCE_CREATED`, `APPREHENSION_MADE`, `MCIT_ATTEND`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "EVENT_ID": "1254168", "EVENT_DATE": "1/1/2014 5:00:00 AM", "EVENT_YEAR": "2014", "EVENT_MONTH": "January", "EVENT_DOW": "Wednesday", "EVENT_HOUR": "4", "EVENT_TYPE": "Suicide-related", "DIVISION": "D51", "OCCURRENCE_CREATED": "No", "MCIT_ATTEND": "No", "HOOD_158": "071"}`
2. `{"OBJECTID": "2", "EVENT_ID": "1254978", "EVENT_DATE": "1/1/2014 5:00:00 AM", "EVENT_YEAR": "2014", "EVENT_MONTH": "January", "EVENT_DOW": "Wednesday", "EVENT_HOUR": "10", "EVENT_TYPE": "Person in Crisis", "DIVISION": "D51", "OCCURRENCE_CREATED": "No", "MCIT_ATTEND": "No", "HOOD_158": "073"}`
3. `{"OBJECTID": "3", "EVENT_ID": "1257986", "EVENT_DATE": "1/1/2014 5:00:00 AM", "EVENT_YEAR": "2014", "EVENT_MONTH": "January", "EVENT_DOW": "Wednesday", "EVENT_HOUR": "23", "EVENT_TYPE": "Suicide-related", "DIVISION": "D52", "OCCURRENCE_CREATED": "Yes", "MCIT_ATTEND": "No", "HOOD_158": "078"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `EVENT_ID`: 0
- `EVENT_DATE`: 0
- `EVENT_YEAR`: 0
- `EVENT_MONTH`: 0
- `EVENT_DOW`: 0
- `EVENT_HOUR`: 0
- `EVENT_TYPE`: 0
- `DIVISION`: 0
- `OCCURRENCE_CREATED`: 0
- `APPREHENSION_MADE`: 0
- `MCIT_ATTEND`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`, `EVENT_ID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `EVENT_DATE`, `EVENT_YEAR`, `EVENT_MONTH`, `EVENT_DOW`, `EVENT_HOUR`, `OCCURRENCE_CREATED`
- Offence/category columns: `EVENT_TYPE`, `MCIT_ATTEND`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DIVISION`
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Has `OBJECTID`; uniqueness within file: yes.

### `Police_Facilities_6911054687584621728.csv`

- **Detected dataset name:** Police Facilities
- **File type:** CSV
- **File size:** 3.5 KB (3,549 bytes)
- **Row count:** 26 (excluding header)
- **Column count:** 9

**Columns:** `OBJECTID_1`, `FACILITY`, `ORGANIZATION`, `ADDRESS`, `POSTAL_CODE`, `LATITUDE`, `LONGITUDE`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID_1": "1", "LATITUDE": "43.67107112", "LONGITUDE": "-79.46082507", "x": "-8845538.94791127", "y": "5414681.30525301"}`
2. `{"OBJECTID_1": "2", "LATITUDE": "43.69457914", "LONGITUDE": "-79.48687581", "x": "-8848438.53971393", "y": "5418298.61581296"}`
3. `{"OBJECTID_1": "3", "LATITUDE": "43.69832725", "LONGITUDE": "-79.43668302", "x": "-8842851.10380466", "y": "5418875.69936718"}`

**Blank/null counts per column:**

- `OBJECTID_1`: 0
- `FACILITY`: 0
- `ORGANIZATION`: 0
- `ADDRESS`: 0
- `POSTAL_CODE`: 0
- `LATITUDE`: 0
- `LONGITUDE`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID_1`
- OBJECTID exists: yes (`OBJECTID_1`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: none
- Offence/category columns: none
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: `LATITUDE`, `LONGITUDE`, `x`, `y`
- WGS84 lat/lng present: yes (`LATITUDE`, `LONGITUDE`)
- Rows with 0,0 coordinates: 0
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Contains WGS84 coordinates via `LATITUDE` and `LONGITUDE`.
- Has `OBJECTID_1`; uniqueness within file: yes.

### `RBDC_ARR_TBL_001_4032986751229720343.csv`

- **Detected dataset name:** RBDC ARR TBL 001
- **File type:** CSV
- **File size:** 8.33 MB (8,738,364 bytes)
- **Row count:** 65,276 (excluding header)
- **Column count:** 25

**Columns:** `Arrest Year`, `Arrest Month`, `EventID`, `ArrestID`, `PersonID`, `Perceived Race`, `Sex`, `Age group (at arrest)`, `Youth at arrest (under 18 years)`, `ArrestLocDiv`, `StripSearch`, `Booked`, `Occurrence Category`, `Actions at arrest - Concealed items`, `Actions at arrest - Combative, violent or spitter/biter`, `Actions at arrest - Resisted, defensive or escape risk`, `Actions at arrest - Mental instability or possibly suicidal`, `Actions at arrest - Assaulted officer`, `Actions at arrest - Cooperative`, `SearchReason-CauseInjury`, `SearchReason-AssistEscape`, `SearchReason-PossessWeapons`, `SearchReason-PossessEvidence`, `ItemsFound`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Arrest Year": "2020", "Arrest Month": "July-Sept", "ArrestID": "6017884", "PersonID": "326622", "Youth at arrest (under 18 years)": "Not a youth", "ArrestLocDiv": "54", "Occurrence Category": "Assault & Other crimes against persons", "ObjectId": "1"}`
2. `{"Arrest Year": "2020", "Arrest Month": "July-Sept", "ArrestID": "6056669", "PersonID": "326622", "Youth at arrest (under 18 years)": "Not a youth", "ArrestLocDiv": "54", "Occurrence Category": "Assault & Other crimes against persons", "ObjectId": "2"}`
3. `{"Arrest Year": "2020", "Arrest Month": "Oct-Dec", "ArrestID": "6057065", "PersonID": "326622", "Youth at arrest (under 18 years)": "Not a youth", "ArrestLocDiv": "54", "Occurrence Category": "Assault & Other crimes against persons", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Arrest Year`: 0
- `Arrest Month`: 0
- `EventID`: 0
- `ArrestID`: 469
- `PersonID`: 0
- `Perceived Race`: 4
- `Sex`: 0
- `Age group (at arrest)`: 24
- `Youth at arrest (under 18 years)`: 0
- `ArrestLocDiv`: 0
- `StripSearch`: 0
- `Booked`: 0
- `Occurrence Category`: 165
- `Actions at arrest - Concealed items`: 0
- `Actions at arrest - Combative, violent or spitter/biter`: 0
- `Actions at arrest - Resisted, defensive or escape risk`: 0
- `Actions at arrest - Mental instability or possibly suicidal`: 0
- `Actions at arrest - Assaulted officer`: 0
- `Actions at arrest - Cooperative`: 0
- `SearchReason-CauseInjury`: 57,475
- `SearchReason-AssistEscape`: 57,475
- `SearchReason-PossessWeapons`: 57,475
- `SearchReason-PossessEvidence`: 57,475
- `ItemsFound`: 57,475
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `Arrest Year`, `Arrest Month`, `Youth at arrest (under 18 years)`, `Occurrence Category`
- Offence/category columns: `Occurrence Category`
- Neighbourhood columns: none
- Division columns: `ArrestLocDiv`
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `RBDC_UOF_TBL_001_8718036773732049598.csv`

- **Detected dataset name:** RBDC UOF TBL 001
- **File type:** CSV
- **File size:** 2.8 KB (2,856 bytes)
- **Row count:** 48 (excluding header)
- **Column count:** 6

**Columns:** `Data Type`, `Description`, `OccurredYear`, `OccurredMonth`, `Incident Count`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Data Type": "Call Source", "OccurredYear": "2020", "OccurredMonth": "Jan", "ObjectId": "1"}`
2. `{"Data Type": "Call Source", "OccurredYear": "2020", "OccurredMonth": "Jan", "ObjectId": "2"}`
3. `{"Data Type": "Call Source", "OccurredYear": "2020", "OccurredMonth": "Jan", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Data Type`: 0
- `Description`: 0
- `OccurredYear`: 0
- `OccurredMonth`: 0
- `Incident Count`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `OccurredYear`, `OccurredMonth`
- Offence/category columns: `Data Type`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `RBDC_UOF_TBL_002_2114656744363348377.csv`

- **Detected dataset name:** RBDC UOF TBL 002
- **File type:** CSV
- **File size:** 6.0 KB (6,142 bytes)
- **Row count:** 80 (excluding header)
- **Column count:** 5

**Columns:** `Type of Incident`, `Perceived Race of People Involved`, `OccurredTime`, `Incident Count`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Type of Incident": "Reported Use of force incident", "OccurredTime": "Early morning (0:01 - 5:00)", "ObjectId": "1"}`
2. `{"Type of Incident": "Reported Use of force incident", "OccurredTime": "Early morning (0:01 - 5:00)", "ObjectId": "2"}`
3. `{"Type of Incident": "Reported Use of force incident", "OccurredTime": "Early morning (0:01 - 5:00)", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Type of Incident`: 0
- `Perceived Race of People Involved`: 0
- `OccurredTime`: 0
- `Incident Count`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `OccurredTime`
- Offence/category columns: `Type of Incident`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `RBDC_UOF_TBL_003_7983536065313291159.csv`

- **Detected dataset name:** RBDC UOF TBL 003
- **File type:** CSV
- **File size:** 14.3 KB (14,687 bytes)
- **Row count:** 272 (excluding header)
- **Column count:** 5

**Columns:** `Type of Incident`, `Location (Division)`, `Perceived Race of People Involved`, `Incident Count`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Type of Incident": "Reported Use of Force Incidents", "Location (Division)": "33", "ObjectId": "1"}`
2. `{"Type of Incident": "Enforcement Action Incidents", "Location (Division)": "22", "ObjectId": "2"}`
3. `{"Type of Incident": "Reported Use of Force Incidents", "Location (Division)": "41", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Type of Incident`: 0
- `Location (Division)`: 0
- `Perceived Race of People Involved`: 0
- `Incident Count`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: none
- Offence/category columns: `Type of Incident`
- Neighbourhood columns: none
- Division columns: `Location (Division)`
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `RBDC_UOF_TBL_004_-3558409208154542082.csv`

- **Detected dataset name:** RBDC UOF TBL 004
- **File type:** CSV
- **File size:** 11.7 KB (11,977 bytes)
- **Row count:** 176 (excluding header)
- **Column count:** 5

**Columns:** `Type of Incident`, `Call for Service Type`, `Perceived Race of People Involved`, `Incident Count`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Type of Incident": " Enforcement Action Incidents", "Call for Service Type": "IN PROGRESS/JUST OCC'D", "ObjectId": "1"}`
2. `{"Type of Incident": " Enforcement Action Incidents", "Call for Service Type": "IN PROGRESS/JUST OCC'D", "ObjectId": "2"}`
3. `{"Type of Incident": " Enforcement Action Incidents", "Call for Service Type": "IN PROGRESS/JUST OCC'D", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Type of Incident`: 0
- `Call for Service Type`: 0
- `Perceived Race of People Involved`: 0
- `Incident Count`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: none
- Offence/category columns: `Type of Incident`, `Call for Service Type`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `RBDC_UOF_TBL_005_1242716001725294161.csv`

- **Detected dataset name:** RBDC UOF TBL 005
- **File type:** CSV
- **File size:** 13.5 KB (13,824 bytes)
- **Row count:** 208 (excluding header)
- **Column count:** 5

**Columns:** `Type of Incident`, `Occurrence Category`, `Perceived Race of People Involved`, `Incident Count`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Type of Incident": "Reported Use of Force Incidents", "Occurrence Category": "AssaultCrimPers", "ObjectId": "1"}`
2. `{"Type of Incident": "Reported Use of Force Incidents", "Occurrence Category": "AssaultCrimPers", "ObjectId": "2"}`
3. `{"Type of Incident": "Reported Use of Force Incidents", "Occurrence Category": "AssaultCrimPers", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Type of Incident`: 0
- `Occurrence Category`: 0
- `Perceived Race of People Involved`: 0
- `Incident Count`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `Occurrence Category`
- Offence/category columns: `Type of Incident`, `Occurrence Category`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `RBDC_UOF_TBL_006_4119402934590759753.csv`

- **Detected dataset name:** RBDC UOF TBL 006
- **File type:** CSV
- **File size:** 3.0 KB (3,021 bytes)
- **Row count:** 48 (excluding header)
- **Column count:** 5

**Columns:** `Type of Incident`, `Perceived Race of People Involved`, `Gender of People Involved`, `Incident Count`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Type of Incident": "Reported Use of Force Incidents", "ObjectId": "1"}`
2. `{"Type of Incident": "Reported Use of Force Incidents", "ObjectId": "2"}`
3. `{"Type of Incident": "Reported Use of Force Incidents", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Type of Incident`: 0
- `Perceived Race of People Involved`: 0
- `Gender of People Involved`: 0
- `Incident Count`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: none
- Offence/category columns: `Type of Incident`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `RBDC_UOF_TBL_007_8618837934118874435.csv`

- **Detected dataset name:** RBDC UOF TBL 007
- **File type:** CSV
- **File size:** 4.2 KB (4,325 bytes)
- **Row count:** 64 (excluding header)
- **Column count:** 5

**Columns:** `Weapons Carried`, `Highest Type of Force Used`, `Perceived Race of People Involved`, `Incident Count`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Highest Type of Force Used": "Physical force or Other type of force", "ObjectId": "1"}`
2. `{"Highest Type of Force Used": "Physical force or Other type of force", "ObjectId": "2"}`
3. `{"Highest Type of Force Used": "Physical force or Other type of force", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Weapons Carried`: 0
- `Highest Type of Force Used`: 0
- `Perceived Race of People Involved`: 0
- `Incident Count`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: none
- Offence/category columns: `Highest Type of Force Used`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Regulated_Interactions_(ASR_RI_TBL_001)_3915709414202984778.csv`

- **Detected dataset name:** Regulated Interactions (ASR RI TBL 001)
- **File type:** CSV
- **File size:** 17.6 KB (18,068 bytes)
- **Row count:** 110 (excluding header)
- **Column count:** 5

**Columns:** `INDEX`, `YEAR`, `CATEGORY`, `COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"YEAR": "2022", "CATEGORY": "The number of times the individual was not offered/given a document, because to do so:might delay the officer from responding to another matter that should be responded to immediately", "ObjectId": "1"}`
2. `{"YEAR": "2022", "CATEGORY": "A statement as to whether the collections were attempted disproportionately from individuals within a group, based on the sex, age, racialized group, or a combination of groups and if so, any additional information the Chief considers relevant to explain the disproportionate attempted collections", "ObjectId": "2"}`
3. `{"YEAR": "2022", "CATEGORY": "The number of determinations made by the Chief entries of identifying information entered into the database:did not comply with section 5", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `YEAR`: 0
- `CATEGORY`: 0
- `COUNT`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `YEAR`
- Offence/category columns: `CATEGORY`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Reported_Crimes_(ASR_RC_TBL_001)_-3089647980937589388.csv`

- **Detected dataset name:** Reported Crimes (ASR RC TBL 001)
- **File type:** CSV
- **File size:** 3.42 MB (3,591,301 bytes)
- **Row count:** 40,390 (excluding header)
- **Column count:** 9

**Columns:** `INDEX`, `REPORT_YEAR`, `DIVISION`, `NEIGHBOURHOOD`, `CATEGORY`, `SUBTYPE`, `COUNT`, `COUNT_CLEARED`, `ObjectId`

**First 3 rows (important fields):**

1. `{"REPORT_YEAR": "2014", "DIVISION": "D11", "NEIGHBOURHOOD": "Junction-Wallace Emerson (171)", "CATEGORY": "Other Federal Statute Violations", "SUBTYPE": "Other", "ObjectId": "1"}`
2. `{"REPORT_YEAR": "2014", "DIVISION": "D11", "NEIGHBOURHOOD": "Kensington-Chinatown (78)", "CATEGORY": "Crimes Against the Person", "SUBTYPE": "Assault", "ObjectId": "2"}`
3. `{"REPORT_YEAR": "2014", "DIVISION": "D11", "NEIGHBOURHOOD": "Lambton Baby Point (114)", "CATEGORY": "Controlled Drugs and Substances Act", "SUBTYPE": "Other", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `REPORT_YEAR`: 0
- `DIVISION`: 0
- `NEIGHBOURHOOD`: 0
- `CATEGORY`: 0
- `SUBTYPE`: 0
- `COUNT`: 0
- `COUNT_CLEARED`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `REPORT_YEAR`
- Offence/category columns: `CATEGORY`, `SUBTYPE`
- Neighbourhood columns: `NEIGHBOURHOOD`
- Division columns: `DIVISION`
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Robbery_Open_Data_2226832258065309099.csv`

- **Detected dataset name:** Robbery Open Data
- **File type:** CSV
- **File size:** 13.37 MB (14,019,100 bytes)
- **Row count:** 40,248 (excluding header)
- **Column count:** 31

**Columns:** `OBJECTID`, `EVENT_UNIQUE_ID`, `REPORT_DATE`, `OCC_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DAY`, `REPORT_DOY`, `REPORT_DOW`, `REPORT_HOUR`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DAY`, `OCC_DOY`, `OCC_DOW`, `OCC_HOUR`, `DIVISION`, `LOCATION_TYPE`, `PREMISES_TYPE`, `UCR_CODE`, `UCR_EXT`, `OFFENCE`, `CSI_CATEGORY`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `LONG_WGS84`, `LAT_WGS84`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "EVENT_UNIQUE_ID": "GO-20141260912", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "6", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOY": "1"}`
2. `{"OBJECTID": "2", "EVENT_UNIQUE_ID": "GO-20141262644", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "14", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOY": "1"}`
3. `{"OBJECTID": "3", "EVENT_UNIQUE_ID": "GO-20141262818", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "14", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOY": "1"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `EVENT_UNIQUE_ID`: 0
- `REPORT_DATE`: 0
- `OCC_DATE`: 0
- `REPORT_YEAR`: 0
- `REPORT_MONTH`: 0
- `REPORT_DAY`: 0
- `REPORT_DOY`: 0
- `REPORT_DOW`: 0
- `REPORT_HOUR`: 0
- `OCC_YEAR`: 2
- `OCC_MONTH`: 2
- `OCC_DAY`: 2
- `OCC_DOY`: 2
- `OCC_DOW`: 2
- `OCC_HOUR`: 0
- `DIVISION`: 0
- `LOCATION_TYPE`: 1
- `PREMISES_TYPE`: 1
- `UCR_CODE`: 0
- `UCR_EXT`: 0
- `OFFENCE`: 0
- `CSI_CATEGORY`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `LONG_WGS84`: 0
- `LAT_WGS84`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: yes
- EVENT_UNIQUE_ID unique: no (31,805 distinct / 40,248 non-blank)
- Date/time columns: `REPORT_DATE`, `OCC_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DOY`, `REPORT_DOW`, `REPORT_HOUR`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DOY`, `OCC_DOW`, `OCC_HOUR`
- Offence/category columns: `LOCATION_TYPE`, `PREMISES_TYPE`, `OFFENCE`, `CSI_CATEGORY`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DIVISION`
- Coordinate columns: `LONG_WGS84`, `LAT_WGS84`, `x`, `y`
- WGS84 lat/lng present: yes (`LAT_WGS84`, `LONG_WGS84`)
- Rows with 0,0 coordinates: 1,105
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LAT_WGS84` and `LONG_WGS84`.
- Has `EVENT_UNIQUE_ID`; uniqueness within file: no (31,805 distinct / 40,248 non-blank).
- Has `OBJECTID`; uniqueness within file: yes.

### `Search_of_Persons_(ASR_SP_TBL_001)_4815884241870621834.csv`

- **Detected dataset name:** Search of Persons (ASR SP TBL 001)
- **File type:** CSV
- **File size:** 8.9 KB (9,104 bytes)
- **Row count:** 201 (excluding header)
- **Column count:** 11

**Columns:** `INDEX`, `SEARCH_YEAR`, `SEARCH_LEVEL`, `SELF_IDENTIFY_TRANS`, `EVIDENCE`, `ESCAPE`, `INJURY`, `OTHER`, `ITEMS_FOUND`, `COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"SEARCH_YEAR": "2014", "ObjectId": "1"}`
2. `{"SEARCH_YEAR": "2014", "ObjectId": "2"}`
3. `{"SEARCH_YEAR": "2014", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `SEARCH_YEAR`: 0
- `SEARCH_LEVEL`: 0
- `SELF_IDENTIFY_TRANS`: 0
- `EVIDENCE`: 0
- `ESCAPE`: 0
- `INJURY`: 0
- `OTHER`: 0
- `ITEMS_FOUND`: 0
- `COUNT`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `SEARCH_YEAR`
- Offence/category columns: none
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Shooting_and_Firearm_Discharges_Open_Data_-3025367010736391071.csv`

- **Detected dataset name:** Shooting and Firearm Discharges Open Data
- **File type:** CSV
- **File size:** 1.46 MB (1,527,662 bytes)
- **Row count:** 6,829 (excluding header)
- **Column count:** 22

**Columns:** `OBJECTID`, `EVENT_UNIQUE_ID`, `OCC_DATE`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DOW`, `OCC_DOY`, `OCC_DAY`, `OCC_HOUR`, `OCC_TIME_RANGE`, `DIVISION`, `DEATH`, `INJURIES`, `EVENT_TYPE`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `LONG_WGS84`, `LAT_WGS84`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "EVENT_UNIQUE_ID": "GO-2004133803", "OCC_DATE": "1/1/2004 5:00:00 AM", "OCC_YEAR": "2004", "OCC_MONTH": "January", "OCC_DOW": "Thursday", "OCC_DOY": "1", "OCC_HOUR": "0", "OCC_TIME_RANGE": "Night", "DIVISION": "D31", "EVENT_TYPE": "Shooting", "HOOD_158": "023"}`
2. `{"OBJECTID": "2", "EVENT_UNIQUE_ID": "GO-2004120070", "OCC_DATE": "1/3/2004 5:00:00 AM", "OCC_YEAR": "2004", "OCC_MONTH": "January", "OCC_DOW": "Saturday", "OCC_DOY": "3", "OCC_HOUR": "1", "OCC_TIME_RANGE": "Night", "DIVISION": "D54", "EVENT_TYPE": "Firearm Discharge", "HOOD_158": "NSA"}`
3. `{"OBJECTID": "3", "EVENT_UNIQUE_ID": "GO-2004135509", "OCC_DATE": "1/4/2004 5:00:00 AM", "OCC_YEAR": "2004", "OCC_MONTH": "January", "OCC_DOW": "Sunday", "OCC_DOY": "4", "OCC_HOUR": "4", "OCC_TIME_RANGE": "Night", "DIVISION": "D14", "EVENT_TYPE": "Shooting", "HOOD_158": "078"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `EVENT_UNIQUE_ID`: 0
- `OCC_DATE`: 0
- `OCC_YEAR`: 0
- `OCC_MONTH`: 0
- `OCC_DOW`: 0
- `OCC_DOY`: 0
- `OCC_DAY`: 0
- `OCC_HOUR`: 0
- `OCC_TIME_RANGE`: 0
- `DIVISION`: 0
- `DEATH`: 0
- `INJURIES`: 0
- `EVENT_TYPE`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `LONG_WGS84`: 0
- `LAT_WGS84`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`, `EVENT_UNIQUE_ID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: yes
- EVENT_UNIQUE_ID unique: yes
- Date/time columns: `OCC_DATE`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DOW`, `OCC_DOY`, `OCC_HOUR`, `OCC_TIME_RANGE`
- Offence/category columns: `EVENT_TYPE`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DIVISION`
- Coordinate columns: `LONG_WGS84`, `LAT_WGS84`, `x`, `y`
- WGS84 lat/lng present: yes (`LAT_WGS84`, `LONG_WGS84`)
- Rows with 0,0 coordinates: 63
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LAT_WGS84` and `LONG_WGS84`.
- Has `EVENT_UNIQUE_ID`; uniqueness within file: yes.
- Has `OBJECTID`; uniqueness within file: yes.

### `Staffing_by_Command.csv`

- **Detected dataset name:** Staffing by Command
- **File type:** CSV
- **File size:** 26.9 KB (27,525 bytes)
- **Row count:** 307 (excluding header)
- **Column count:** 7

**Columns:** `Year`, `Type_of_Metric`, `Organizational_Entity`, `Command_Name`, `Category`, `Count_`, `ObjectId`

**First 3 rows (important fields):**

1. `{"Year": "2016", "Type_of_Metric": "Actual Staffing", "Command_Name": "Centralized and Grants", "Category": "Civilian", "ObjectId": "1"}`
2. `{"Year": "2016", "Type_of_Metric": "Actual Staffing", "Command_Name": "Centralized and Grants", "Category": "Uniform", "ObjectId": "2"}`
3. `{"Year": "2016", "Type_of_Metric": "Actual Staffing", "Command_Name": "Chief of Police", "Category": "Civilian", "ObjectId": "3"}`

**Blank/null counts per column:**

- `Year`: 0
- `Type_of_Metric`: 0
- `Organizational_Entity`: 0
- `Command_Name`: 0
- `Category`: 0
- `Count_`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `Year`
- Offence/category columns: `Type_of_Metric`, `Category`
- Neighbourhood columns: none
- Division columns: `Command_Name`
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Theft_From_Motor_Vehicle_Open_Data_4636805822324249695.csv`

- **Detected dataset name:** Theft From Motor Vehicle Open Data
- **File type:** CSV
- **File size:** 36.92 MB (38,708,604 bytes)
- **Row count:** 106,574 (excluding header)
- **Column count:** 31

**Columns:** `OBJECTID`, `EVENT_UNIQUE_ID`, `REPORT_DATE`, `OCC_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DAY`, `REPORT_DOY`, `REPORT_DOW`, `REPORT_HOUR`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DAY`, `OCC_DOY`, `OCC_DOW`, `OCC_HOUR`, `DIVISION`, `LOCATION_TYPE`, `PREMISES_TYPE`, `UCR_CODE`, `UCR_EXT`, `OFFENCE`, `CSI_CATEGORY`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `LONG_WGS84`, `LAT_WGS84`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "EVENT_UNIQUE_ID": "GO-20141263375", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "12/31/2013 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "17", "OCC_YEAR": "2013", "OCC_MONTH": "December", "OCC_DOY": "365"}`
2. `{"OBJECTID": "2", "EVENT_UNIQUE_ID": "GO-20141261650", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "12/31/2013 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "9", "OCC_YEAR": "2013", "OCC_MONTH": "December", "OCC_DOY": "365"}`
3. `{"OBJECTID": "3", "EVENT_UNIQUE_ID": "GO-20141261694", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "10", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOY": "1"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `EVENT_UNIQUE_ID`: 0
- `REPORT_DATE`: 0
- `OCC_DATE`: 0
- `REPORT_YEAR`: 0
- `REPORT_MONTH`: 0
- `REPORT_DAY`: 0
- `REPORT_DOY`: 0
- `REPORT_DOW`: 0
- `REPORT_HOUR`: 0
- `OCC_YEAR`: 19
- `OCC_MONTH`: 19
- `OCC_DAY`: 19
- `OCC_DOY`: 19
- `OCC_DOW`: 19
- `OCC_HOUR`: 0
- `DIVISION`: 0
- `LOCATION_TYPE`: 9
- `PREMISES_TYPE`: 9
- `UCR_CODE`: 0
- `UCR_EXT`: 0
- `OFFENCE`: 0
- `CSI_CATEGORY`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `LONG_WGS84`: 0
- `LAT_WGS84`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: yes
- EVENT_UNIQUE_ID unique: no (106,515 distinct / 106,574 non-blank)
- Date/time columns: `REPORT_DATE`, `OCC_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DOY`, `REPORT_DOW`, `REPORT_HOUR`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DOY`, `OCC_DOW`, `OCC_HOUR`
- Offence/category columns: `LOCATION_TYPE`, `PREMISES_TYPE`, `OFFENCE`, `CSI_CATEGORY`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DIVISION`
- Coordinate columns: `LONG_WGS84`, `LAT_WGS84`, `x`, `y`
- WGS84 lat/lng present: yes (`LAT_WGS84`, `LONG_WGS84`)
- Rows with 0,0 coordinates: 1,250
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LAT_WGS84` and `LONG_WGS84`.
- Has `EVENT_UNIQUE_ID`; uniqueness within file: no (106,515 distinct / 106,574 non-blank).
- Has `OBJECTID`; uniqueness within file: yes.

### `Theft_Over_Open_Data_-309556416197554984.csv`

- **Detected dataset name:** Theft Over Open Data
- **File type:** CSV
- **File size:** 5.70 MB (5,981,231 bytes)
- **Row count:** 16,790 (excluding header)
- **Column count:** 31

**Columns:** `OBJECTID`, `EVENT_UNIQUE_ID`, `REPORT_DATE`, `OCC_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DAY`, `REPORT_DOY`, `REPORT_DOW`, `REPORT_HOUR`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DAY`, `OCC_DOY`, `OCC_DOW`, `OCC_HOUR`, `DIVISION`, `LOCATION_TYPE`, `PREMISES_TYPE`, `UCR_CODE`, `UCR_EXT`, `OFFENCE`, `CSI_CATEGORY`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `LONG_WGS84`, `LAT_WGS84`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "EVENT_UNIQUE_ID": "GO-20141264862", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "23", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOY": "1"}`
2. `{"OBJECTID": "2", "EVENT_UNIQUE_ID": "GO-20141260973", "REPORT_DATE": "1/1/2014 5:00:00 AM", "OCC_DATE": "1/1/2014 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "1", "REPORT_DOW": "Wednesday ", "REPORT_HOUR": "4", "OCC_YEAR": "2014", "OCC_MONTH": "January", "OCC_DOY": "1"}`
3. `{"OBJECTID": "3", "EVENT_UNIQUE_ID": "GO-20141267602", "REPORT_DATE": "1/2/2014 5:00:00 AM", "OCC_DATE": "12/24/2013 5:00:00 AM", "REPORT_YEAR": "2014", "REPORT_MONTH": "January", "REPORT_DOY": "2", "REPORT_DOW": "Thursday  ", "REPORT_HOUR": "23", "OCC_YEAR": "2013", "OCC_MONTH": "December", "OCC_DOY": "358"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `EVENT_UNIQUE_ID`: 0
- `REPORT_DATE`: 0
- `OCC_DATE`: 0
- `REPORT_YEAR`: 0
- `REPORT_MONTH`: 0
- `REPORT_DAY`: 0
- `REPORT_DOY`: 0
- `REPORT_DOW`: 0
- `REPORT_HOUR`: 0
- `OCC_YEAR`: 4
- `OCC_MONTH`: 4
- `OCC_DAY`: 4
- `OCC_DOY`: 4
- `OCC_DOW`: 4
- `OCC_HOUR`: 0
- `DIVISION`: 0
- `LOCATION_TYPE`: 5
- `PREMISES_TYPE`: 5
- `UCR_CODE`: 0
- `UCR_EXT`: 0
- `OFFENCE`: 0
- `CSI_CATEGORY`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `LONG_WGS84`: 0
- `LAT_WGS84`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: yes
- EVENT_UNIQUE_ID unique: no (16,740 distinct / 16,790 non-blank)
- Date/time columns: `REPORT_DATE`, `OCC_DATE`, `REPORT_YEAR`, `REPORT_MONTH`, `REPORT_DOY`, `REPORT_DOW`, `REPORT_HOUR`, `OCC_YEAR`, `OCC_MONTH`, `OCC_DOY`, `OCC_DOW`, `OCC_HOUR`
- Offence/category columns: `LOCATION_TYPE`, `PREMISES_TYPE`, `OFFENCE`, `CSI_CATEGORY`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DIVISION`
- Coordinate columns: `LONG_WGS84`, `LAT_WGS84`, `x`, `y`
- WGS84 lat/lng present: yes (`LAT_WGS84`, `LONG_WGS84`)
- Rows with 0,0 coordinates: 295
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LAT_WGS84` and `LONG_WGS84`.
- Has `EVENT_UNIQUE_ID`; uniqueness within file: no (16,740 distinct / 16,790 non-blank).
- Has `OBJECTID`; uniqueness within file: yes.

### `Tickets_Issued_(ASR_ENF_TBL_002)_6312647708442498473.csv`

- **Detected dataset name:** Tickets Issued (ASR ENF TBL 002)
- **File type:** CSV
- **File size:** 4.33 MB (4,543,304 bytes)
- **Row count:** 31,643 (excluding header)
- **Column count:** 10

**Columns:** `INDEX`, `OFFENCE_YEAR`, `DIVISION`, `TICKET_TYPE`, `OFFENCE_CATEGORY`, `AGE_GROUP`, `HOOD_158`, `NEIGHBOURHOOD_158`, `TICKET_COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"OFFENCE_YEAR": "2014", "DIVISION": "D11", "TICKET_TYPE": "Prov Offence Notice - Part I (Pot)                                             ", "OFFENCE_CATEGORY": "Aggressive Driving", "HOOD_158": "089", "NEIGHBOURHOOD_158": "Runnymede-Bloor West Village", "ObjectId": "1"}`
2. `{"OFFENCE_YEAR": "2014", "DIVISION": "D11", "TICKET_TYPE": "Prov Offence Notice - Part I (Pot)                                             ", "OFFENCE_CATEGORY": "Distracted Driving", "HOOD_158": "NSA", "NEIGHBOURHOOD_158": "NSA", "ObjectId": "2"}`
3. `{"OFFENCE_YEAR": "2014", "DIVISION": "D11", "TICKET_TYPE": "Prov Offence Notice - Part I (Pot)                                             ", "OFFENCE_CATEGORY": "Aggressive Driving", "HOOD_158": "111", "NEIGHBOURHOOD_158": "Rockcliffe-Smythe", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `OFFENCE_YEAR`: 0
- `DIVISION`: 0
- `TICKET_TYPE`: 0
- `OFFENCE_CATEGORY`: 0
- `AGE_GROUP`: 0
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `TICKET_COUNT`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `OFFENCE_YEAR`
- Offence/category columns: `OFFENCE_YEAR`, `TICKET_TYPE`, `OFFENCE_CATEGORY`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`
- Division columns: `DIVISION`
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Top_20_Offences_of_Firearm_Seizures_(ASR_F_TBL_002)_3169920589327387274.csv`

- **Detected dataset name:** Top 20 Offences of Firearm Seizures (ASR F TBL 002)
- **File type:** CSV
- **File size:** 9.1 KB (9,277 bytes)
- **Row count:** 243 (excluding header)
- **Column count:** 5

**Columns:** `INDEX`, `SEIZED_YEAR`, `RANK`, `OFFENCE`, `ObjectId`

**First 3 rows (important fields):**

1. `{"SEIZED_YEAR": "2018", "OFFENCE": "Possession Property Obc Under", "ObjectId": "1"}`
2. `{"SEIZED_YEAR": "2019", "OFFENCE": "Firearm - Unauthorized Possess", "ObjectId": "2"}`
3. `{"SEIZED_YEAR": "2019", "OFFENCE": "Weapon - Poss Dangerous Purp", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `SEIZED_YEAR`: 0
- `RANK`: 0
- `OFFENCE`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `SEIZED_YEAR`
- Offence/category columns: `OFFENCE`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `TOTAL_KSI_4115794401574937330.csv`

- **Detected dataset name:** TOTAL KSI
- **File type:** CSV
- **File size:** 7.11 MB (7,450,470 bytes)
- **Row count:** 18,957 (excluding header)
- **Column count:** 54

**Columns:** `OBJECTID`, `INDEX`, `ACCNUM`, `DATE`, `TIME`, `STREET1`, `STREET2`, `OFFSET`, `ROAD_CLASS`, `DISTRICT`, `LATITUDE`, `LONGITUDE`, `ACCLOC`, `TRAFFCTL`, `VISIBILITY`, `LIGHT`, `RDSFCOND`, `ACCLASS`, `IMPACTYPE`, `INVTYPE`, `INVAGE`, `INJURY`, `FATAL_NO`, `INITDIR`, `VEHTYPE`, `MANOEUVER`, `DRIVACT`, `DRIVCOND`, `PEDTYPE`, `PEDACT`, `PEDCOND`, `CYCLISTYPE`, `CYCACT`, `CYCCOND`, `PEDESTRIAN`, `CYCLIST`, `AUTOMOBILE`, `MOTORCYCLE`, `TRUCK`, `TRSN_CITY_VEH`, `EMERG_VEH`, `PASSENGER`, `SPEEDING`, `AG_DRIV`, `REDLIGHT`, `ALCOHOL`, `DISABILITY`, `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`, `DIVISION`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "ACCNUM": "893184", "DATE": "1/1/2006 10:00:00 AM", "TIME": "236", "DISTRICT": "Toronto and East York", "LATITUDE": "43.699595", "LONGITUDE": "-79.318797", "IMPACTYPE": "Approaching", "INVTYPE": "Passenger", "VEHTYPE": "", "PEDTYPE": "", "CYCLISTYPE": ""}`
2. `{"OBJECTID": "2", "ACCNUM": "893184", "DATE": "1/1/2006 10:00:00 AM", "TIME": "236", "DISTRICT": "Toronto and East York", "LATITUDE": "43.699595", "LONGITUDE": "-79.318797", "IMPACTYPE": "Approaching", "INVTYPE": "Passenger", "VEHTYPE": "", "PEDTYPE": "", "CYCLISTYPE": ""}`
3. `{"OBJECTID": "3", "ACCNUM": "893184", "DATE": "1/1/2006 10:00:00 AM", "TIME": "236", "DISTRICT": "Toronto and East York", "LATITUDE": "43.699595", "LONGITUDE": "-79.318797", "IMPACTYPE": "Approaching", "INVTYPE": "Driver", "VEHTYPE": "Automobile, Station Wagon", "PEDTYPE": "", "CYCLISTYPE": ""}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `INDEX`: 0
- `ACCNUM`: 4,930
- `DATE`: 0
- `TIME`: 0
- `STREET1`: 0
- `STREET2`: 1,706
- `OFFSET`: 15,137
- `ROAD_CLASS`: 486
- `DISTRICT`: 229
- `LATITUDE`: 0
- `LONGITUDE`: 0
- `ACCLOC`: 5,456
- `TRAFFCTL`: 75
- `VISIBILITY`: 24
- `LIGHT`: 4
- `RDSFCOND`: 29
- `ACCLASS`: 1
- `IMPACTYPE`: 27
- `INVTYPE`: 16
- `INVAGE`: 0
- `INJURY`: 8,897
- `FATAL_NO`: 18,087
- `INITDIR`: 5,277
- `VEHTYPE`: 3,487
- `MANOEUVER`: 7,953
- `DRIVACT`: 9,289
- `DRIVCOND`: 9,291
- `PEDTYPE`: 15,728
- `PEDACT`: 15,730
- `PEDCOND`: 15,711
- `CYCLISTYPE`: 18,152
- `CYCACT`: 18,155
- `CYCCOND`: 18,157
- `PEDESTRIAN`: 11,269
- `CYCLIST`: 16,971
- `AUTOMOBILE`: 1,727
- `MOTORCYCLE`: 17,273
- `TRUCK`: 17,788
- `TRSN_CITY_VEH`: 17,809
- `EMERG_VEH`: 18,908
- `PASSENGER`: 11,774
- `SPEEDING`: 16,263
- `AG_DRIV`: 9,121
- `REDLIGHT`: 17,380
- `ALCOHOL`: 18,149
- `DISABILITY`: 18,464
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `HOOD_140`: 0
- `NEIGHBOURHOOD_140`: 0
- `DIVISION`: 0
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `DATE`, `TIME`
- Offence/category columns: `IMPACTYPE`, `INVTYPE`, `VEHTYPE`, `PEDTYPE`, `CYCLISTYPE`
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`, `HOOD_140`, `NEIGHBOURHOOD_140`
- Division columns: `DISTRICT`, `DIVISION`
- Coordinate columns: `LATITUDE`, `LONGITUDE`, `x`, `y`
- WGS84 lat/lng present: yes (`LATITUDE`, `LONGITUDE`)
- Rows with 0,0 coordinates: 0
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LATITUDE` and `LONGITUDE`.
- Has `OBJECTID`; uniqueness within file: yes.
- Participant- or collision-level rows; may share `ACCNUM` or `EVENT_UNIQUE_ID` across multiple rows.

### `Total_Public_Complaints(ASR_PCF_TBL_001)_-5426935284038049601.csv`

- **Detected dataset name:** Total Public Complaints(ASR PCF TBL 001)
- **File type:** CSV
- **File size:** 10.6 KB (10,868 bytes)
- **Row count:** 180 (excluding header)
- **Column count:** 6

**Columns:** `INDEX`, `YEAR`, `TYPE`, `SUBTYPE`, `COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"YEAR": "2014", "TYPE": "Investigated Complaints", "SUBTYPE": "Conduct - Less  Serious", "ObjectId": "1"}`
2. `{"YEAR": "2014", "TYPE": "Investigated Complaints", "SUBTYPE": "Conduct - Serious", "ObjectId": "2"}`
3. `{"YEAR": "2014", "TYPE": "Investigated Complaints", "SUBTYPE": "Policy", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `YEAR`: 0
- `TYPE`: 0
- `SUBTYPE`: 0
- `COUNT`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `YEAR`
- Offence/category columns: `TYPE`, `SUBTYPE`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `TPS_POLICE_DIVISIONS_-3160015003731132608.csv`

- **Detected dataset name:** TPS POLICE DIVISIONS
- **File type:** CSV
- **File size:** 1.9 KB (1,969 bytes)
- **Row count:** 16 (excluding header)
- **Column count:** 9

**Columns:** `OBJECTID`, `AGENCY`, `DIV`, `UNIT_NAME`, `ADDRESS`, `CITY`, `AREA_SQKM`, `Shape__Area`, `Shape__Length`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "DIV": "D11"}`
2. `{"OBJECTID": "2", "DIV": "D12"}`
3. `{"OBJECTID": "3", "DIV": "D13"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `AGENCY`: 0
- `DIV`: 0
- `UNIT_NAME`: 0
- `ADDRESS`: 0
- `CITY`: 0
- `AREA_SQKM`: 0
- `Shape__Area`: 0
- `Shape__Length`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: none
- Offence/category columns: none
- Neighbourhood columns: none
- Division columns: `DIV`
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `OBJECTID`; uniqueness within file: yes.

### `Traffic_Collisions_Open_Data_8128730402587031536 (1).csv`

- **Detected dataset name:** Traffic Collisions Open Data
- **File type:** CSV
- **File size:** 145.86 MB (152,944,463 bytes)
- **Row count:** 809,034 (excluding header)
- **Column count:** 23

**Columns:** `OBJECTID`, `EVENT_UNIQUE_ID`, `OCC_DATE`, `OCC_MONTH`, `OCC_DOW`, `OCC_YEAR`, `OCC_HOUR`, `DIVISION`, `FATALITIES`, `INJURY_COLLISIONS`, `FTR_COLLISIONS`, `PD_COLLISIONS`, `HOOD_158`, `NEIGHBOURHOOD_158`, `LONG_WGS84`, `LAT_WGS84`, `AUTOMOBILE`, `MOTORCYCLE`, `PASSENGER`, `BICYCLE`, `PEDESTRIAN`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "EVENT_UNIQUE_ID": "GO-20148000002", "OCC_DATE": "1/1/2014 5:00:00 AM", "OCC_MONTH": "January", "OCC_DOW": "Wednesday", "OCC_YEAR": "2014", "OCC_HOUR": "1", "DIVISION": "D52", "HOOD_158": "168", "NEIGHBOURHOOD_158": "Downtown Yonge East (168)", "LONG_WGS84": "-79.3784277450713", "LAT_WGS84": "43.6504100895137"}`
2. `{"OBJECTID": "2", "EVENT_UNIQUE_ID": "GO-20141264617", "OCC_DATE": "1/1/2014 5:00:00 AM", "OCC_MONTH": "January", "OCC_DOW": "Wednesday", "OCC_YEAR": "2014", "OCC_HOUR": "22", "DIVISION": "D32", "HOOD_158": "NSA", "NEIGHBOURHOOD_158": "NSA", "LONG_WGS84": "0", "LAT_WGS84": "0"}`
3. `{"OBJECTID": "3", "EVENT_UNIQUE_ID": "GO-20141260499", "OCC_DATE": "1/1/2014 5:00:00 AM", "OCC_MONTH": "January", "OCC_DOW": "Wednesday", "OCC_YEAR": "2014", "OCC_HOUR": "2", "DIVISION": "NSA", "HOOD_158": "NSA", "NEIGHBOURHOOD_158": "NSA", "LONG_WGS84": "0", "LAT_WGS84": "0"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `EVENT_UNIQUE_ID`: 0
- `OCC_DATE`: 0
- `OCC_MONTH`: 0
- `OCC_DOW`: 0
- `OCC_YEAR`: 0
- `OCC_HOUR`: 0
- `DIVISION`: 0
- `FATALITIES`: 0
- `INJURY_COLLISIONS`: 4
- `FTR_COLLISIONS`: 4
- `PD_COLLISIONS`: 4
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `LONG_WGS84`: 0
- `LAT_WGS84`: 0
- `AUTOMOBILE`: 4
- `MOTORCYCLE`: 4
- `PASSENGER`: 4
- `BICYCLE`: 4
- `PEDESTRIAN`: 4
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`, `EVENT_UNIQUE_ID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: yes
- EVENT_UNIQUE_ID unique: yes
- Date/time columns: `OCC_DATE`, `OCC_MONTH`, `OCC_DOW`, `OCC_YEAR`, `OCC_HOUR`
- Offence/category columns: none
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`
- Division columns: `DIVISION`
- Coordinate columns: `LONG_WGS84`, `LAT_WGS84`, `x`, `y`
- WGS84 lat/lng present: yes (`LAT_WGS84`, `LONG_WGS84`)
- Rows with 0,0 coordinates: 131,978
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LAT_WGS84` and `LONG_WGS84`.
- Has `EVENT_UNIQUE_ID`; uniqueness within file: yes.
- Has `OBJECTID`; uniqueness within file: yes.
- Participant- or collision-level rows; may share `ACCNUM` or `EVENT_UNIQUE_ID` across multiple rows.

### `Traffic_Collisions_Open_Data_8128730402587031536.csv`

- **Detected dataset name:** Traffic Collisions Open Data
- **File type:** CSV
- **File size:** 145.86 MB (152,944,463 bytes)
- **Row count:** 809,034 (excluding header)
- **Column count:** 23

**Columns:** `OBJECTID`, `EVENT_UNIQUE_ID`, `OCC_DATE`, `OCC_MONTH`, `OCC_DOW`, `OCC_YEAR`, `OCC_HOUR`, `DIVISION`, `FATALITIES`, `INJURY_COLLISIONS`, `FTR_COLLISIONS`, `PD_COLLISIONS`, `HOOD_158`, `NEIGHBOURHOOD_158`, `LONG_WGS84`, `LAT_WGS84`, `AUTOMOBILE`, `MOTORCYCLE`, `PASSENGER`, `BICYCLE`, `PEDESTRIAN`, `x`, `y`

**First 3 rows (important fields):**

1. `{"OBJECTID": "1", "EVENT_UNIQUE_ID": "GO-20148000002", "OCC_DATE": "1/1/2014 5:00:00 AM", "OCC_MONTH": "January", "OCC_DOW": "Wednesday", "OCC_YEAR": "2014", "OCC_HOUR": "1", "DIVISION": "D52", "HOOD_158": "168", "NEIGHBOURHOOD_158": "Downtown Yonge East (168)", "LONG_WGS84": "-79.3784277450713", "LAT_WGS84": "43.6504100895137"}`
2. `{"OBJECTID": "2", "EVENT_UNIQUE_ID": "GO-20141264617", "OCC_DATE": "1/1/2014 5:00:00 AM", "OCC_MONTH": "January", "OCC_DOW": "Wednesday", "OCC_YEAR": "2014", "OCC_HOUR": "22", "DIVISION": "D32", "HOOD_158": "NSA", "NEIGHBOURHOOD_158": "NSA", "LONG_WGS84": "0", "LAT_WGS84": "0"}`
3. `{"OBJECTID": "3", "EVENT_UNIQUE_ID": "GO-20141260499", "OCC_DATE": "1/1/2014 5:00:00 AM", "OCC_MONTH": "January", "OCC_DOW": "Wednesday", "OCC_YEAR": "2014", "OCC_HOUR": "2", "DIVISION": "NSA", "HOOD_158": "NSA", "NEIGHBOURHOOD_158": "NSA", "LONG_WGS84": "0", "LAT_WGS84": "0"}`

**Blank/null counts per column:**

- `OBJECTID`: 0
- `EVENT_UNIQUE_ID`: 0
- `OCC_DATE`: 0
- `OCC_MONTH`: 0
- `OCC_DOW`: 0
- `OCC_YEAR`: 0
- `OCC_HOUR`: 0
- `DIVISION`: 0
- `FATALITIES`: 0
- `INJURY_COLLISIONS`: 4
- `FTR_COLLISIONS`: 4
- `PD_COLLISIONS`: 4
- `HOOD_158`: 0
- `NEIGHBOURHOOD_158`: 0
- `LONG_WGS84`: 0
- `LAT_WGS84`: 0
- `AUTOMOBILE`: 4
- `MOTORCYCLE`: 4
- `PASSENGER`: 4
- `BICYCLE`: 4
- `PEDESTRIAN`: 4
- `x`: 0
- `y`: 0

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`, `EVENT_UNIQUE_ID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: yes
- EVENT_UNIQUE_ID unique: yes
- Date/time columns: `OCC_DATE`, `OCC_MONTH`, `OCC_DOW`, `OCC_YEAR`, `OCC_HOUR`
- Offence/category columns: none
- Neighbourhood columns: `HOOD_158`, `NEIGHBOURHOOD_158`
- Division columns: `DIVISION`
- Coordinate columns: `LONG_WGS84`, `LAT_WGS84`, `x`, `y`
- WGS84 lat/lng present: yes (`LAT_WGS84`, `LONG_WGS84`)
- Rows with 0,0 coordinates: 131,978
- Personal-name-like columns: none
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Contains WGS84 coordinates via `LAT_WGS84` and `LONG_WGS84`.
- Has `EVENT_UNIQUE_ID`; uniqueness within file: yes.
- Has `OBJECTID`; uniqueness within file: yes.
- Participant- or collision-level rows; may share `ACCNUM` or `EVENT_UNIQUE_ID` across multiple rows.

### `Victims_of_Crime_(ASR_VC_TBL_001)_3114193774591085696.csv`

- **Detected dataset name:** Victims of Crime (ASR VC TBL 001)
- **File type:** CSV
- **File size:** 108.7 KB (111,284 bytes)
- **Row count:** 1,384 (excluding header)
- **Column count:** 10

**Columns:** `INDEX`, `REPORT_YEAR`, `CATEGORY`, `SUBTYPE`, `ASSAULT_SUBTYPE`, `SEX`, `AGE_GROUP`, `AGE_COHORT`, `COUNT`, `ObjectId`

**First 3 rows (important fields):**

1. `{"REPORT_YEAR": "2015", "CATEGORY": "Crimes Against the Person", "SUBTYPE": "Robbery", "ASSAULT_SUBTYPE": "N/A", "ObjectId": "1"}`
2. `{"REPORT_YEAR": "2015", "CATEGORY": "Crimes Against the Person", "SUBTYPE": "Robbery", "ASSAULT_SUBTYPE": "N/A", "ObjectId": "2"}`
3. `{"REPORT_YEAR": "2015", "CATEGORY": "Crimes Against the Person", "SUBTYPE": "Robbery", "ASSAULT_SUBTYPE": "N/A", "ObjectId": "3"}`

**Blank/null counts per column:**

- `INDEX`: 0
- `REPORT_YEAR`: 0
- `CATEGORY`: 0
- `SUBTYPE`: 0
- `ASSAULT_SUBTYPE`: 698
- `SEX`: 0
- `AGE_GROUP`: 0
- `AGE_COHORT`: 0
- `COUNT`: 0
- `ObjectId`: 0

**Identifiers and geography:**

- Likely row ID column(s): `ObjectId`
- OBJECTID exists: yes (`ObjectId`)
- OBJECTID unique: yes
- EVENT_UNIQUE_ID exists: no
- EVENT_UNIQUE_ID unique: N/A
- Date/time columns: `REPORT_YEAR`
- Offence/category columns: `CATEGORY`, `SUBTYPE`, `ASSAULT_SUBTYPE`
- Neighbourhood columns: none
- Division columns: none
- Coordinate columns: none
- WGS84 lat/lng present: no
- Rows with 0,0 coordinates: N/A
- Personal-name-like columns: none
- Non-incident aggregate dataset: yes

**V1 ingestion relevance (structure only):**

- Aggregate or reference table; rows represent counts, summaries, budgets, staffing, complaints, facilities, or boundary geometry rather than individual geocoded incidents.
- Has `ObjectId`; uniqueness within file: yes.

### `Major_Crime_Indicators_Open_Data.csv`

- **Detected dataset name:** Major Crime Indicators Open Data
- **File type:** CSV
- **File size:** 156.4 MB (163,903,604 bytes)
- **Row count:** 474,819 (excluding header)
- **Column count:** 31
- **Prior location:** `data/raw/tps/major-crime-indicators/2026-06-30/original-file.csv` (relocated 2026-06-30)

**Columns:** Same 31-column Major Crime Open Data schema family as the six per-offence files (`OBJECTID`, `EVENT_UNIQUE_ID`, `REPORT_DATE`, `OCC_DATE`, …, `LAT_WGS84`, `LONG_WGS84`, `x`, `y`).

**Identifiers and geography:**

- Likely row ID column(s): `OBJECTID`
- OBJECTID exists: yes (`OBJECTID`)
- OBJECTID unique: yes (within file)
- EVENT_UNIQUE_ID exists: yes
- EVENT_UNIQUE_ID unique: no (multiple rows per event possible)
- WGS84 lat/lng present: yes (`LAT_WGS84`, `LONG_WGS84`)
- Non-incident aggregate dataset: no

**V1 ingestion relevance (structure only):**

- Combined multi-offence Major Crime export; **V1 public UI still uses six per-offence files only** (see [DATA_SOURCE_PLAN.md](./DATA_SOURCE_PLAN.md)).
- Contains WGS84 coordinates via `LAT_WGS84` and `LONG_WGS84`.
- Has `OBJECTID`; uniqueness within file: yes.
