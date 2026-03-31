import { Strava } from "react-bootstrap-icons";


const GREY = "#777777";

/* =========================
    TOOLS
========================= */

const tools = [
    { id: "ac3238a2-a3ca-4f4b-a56b-8ac7c3953aff", name: "výuka - zimní semestr", abbreviation: "ZS", color: "#ffffff" },
    { id: "78a6f015-b8f4-49c8-b218-7861454cb8e9", name: "výuka - letní semestr", abbreviation: "LS", color: "#f2f2f2" },

    { id: "6fef77f1-a580-4e13-a088-30368a95af2f", name: "řádná dovolená", abbreviation: "ŘD", color: "#d9a441" },
    { id: "7e4187e5-b219-4332-b50e-54411541bba6", name: "zkouškové období", abbreviation: "Z", color: "#f28c28" },
    { id: "79c71457-b926-449a-b227-a3461bf1df4c", name: "příprava v poli - teorie", abbreviation: "PT", color: "#8bc34a" },
    { id: "539c45b2-629c-43ca-87cb-db753e7bbab9", name: "příprava v poli - praxe", abbreviation: "PP", color: "#7cb342" },
    { id: "83d0a942-6456-4f35-bce8-37c9a08cb966", name: "rezerva", abbreviation: "R", color: "#ff1f1f" },

    { id: "5f147c3c-b307-4334-a339-6f4c83f1dad7", name: "intenzivní kurz AJ", abbreviation: "AJ", color: "#ffff33" },
    { id: "48ff1e53-83c8-48d6-84e6-b63e4f5fa60d", name: "kurz TV", abbreviation: "TV", color: "#7a6000" },
    { id: "1af8ea7e-b280-4202-8efe-1df22763081e", name: "odborná praxe", abbreviation: "OP", color: "#bdbdbd" },
    { id: "0b624b6c-ed72-4316-b070-8e09f73e531c", name: "stáž na systematizovaném místě", abbreviation: "SSM", color: "#d9d9d9" },
    { id: "cd309340-cae0-4ec2-8adc-f4c61dc5f023", name: "letecká AJ", abbreviation: "LA", color: "#ffff66" },
    { id: "0f5713ca-7134-4c6a-99a0-7166c689dbfb", name: "vyřazení", abbreviation: "V", color: "#ff1f1f" },
    { id: "7edccbad-3c70-49ec-b5ca-b744bec8d234", name: "aplikované vojenské technologie", abbreviation: "AVT", color: "#00b0f0" },

    { id: "d9494b47-b46c-4ba4-a900-1443751cabce", name: "příprava na SZZ", abbreviation: "PSZZ", color: "#a64ac9" },
    { id: "eb86a21b-04e2-419c-a3a3-5f21603d349b", name: "SZZ", abbreviation: "SZZ", color: "#8e24aa" },
    { id: "4d0d3e3f-4d45-4fc4-95f5-612905cf5823", name: "kurz SERE, případně LV, CANI, PARA", abbreviation: "SERE", color: "#9fd3f2" },
    { id: "4560fca2-533b-45c1-945c-16dcf0935126", name: "zkouškové období / letecký výcvik", abbreviation: "ŘD/LV", color: "#d4af37" },
    { id: "3d5c8255-9abc-4d3e-aa25-b3984e5ce1a1", name: "diplomový projekt", abbreviation: "DP", color: "#d9d9d9" }
];

/**
 * Vytvoří mapu nástrojů podle jejich zkratky (abbreviation).
 *
 * Výstupem je objekt, kde klíčem je `tool.abbreviation`
 * a hodnotou je celý objekt nástroje.
 *
 * @param {Array<{ id: string, name: string, abbreviation: string, color: string }>} tools
 * Seznam nástrojů.
 *
 * @returns {{ [abbreviation: string]: { id: string, name: string, abbreviation: string, color: string } }}
 * Objektová mapa nástrojů indexovaná podle zkratky.
 *
 * @example
 * const tools = [
 *   { id: "1", name: "výuka - zimní semestr", abbreviation: "ZS", color: "#ffffff" },
 *   { id: "2", name: "zkouškové období", abbreviation: "Z", color: "#f28c28" }
 * ];
 *
 * const toolMap = createToolMap(tools);
 *
 * console.log(toolMap["ZS"].name); // "výuka - zimní semestr"
 */
export function createToolMap(tools) {
    return Object.fromEntries(tools.map(tool => [tool.abbreviation, tool]));
}

/**
 * Vrátí kontrastní barvu textu (#000 nebo #fff) pro danou barvu pozadí.
 *
 * Používá YIQ algoritmus pro odhad světlosti barvy.
 * Pokud je pozadí světlé → vrací černý text (#000),
 * pokud je tmavé → vrací bílý text (#fff).
 *
 * Podporuje hex formáty:
 * - #RGB (např. #fff)
 * - #RRGGBB (např. #ffffff)
 *
 * Pokud vstup není validní hex barva, vrací výchozí #000.
 *
 * @param {string} bgColor Barva pozadí ve formátu hex (#RGB nebo #RRGGBB).
 * @returns {"#000" | "#fff"} Doporučená barva textu pro dostatečný kontrast.
 *
 * @example
 * getContrastTextColor("#ffffff") // "#000"
 * getContrastTextColor("#000000") // "#fff"
 * getContrastTextColor("#ff0000") // "#fff"
 * getContrastTextColor("#eee")    // "#000"
 */
export function getContrastTextColor(bgColor) {
    if (!bgColor || bgColor[0] !== "#") return "#000";
    let hex = bgColor.replace("#", "");
    if (hex.length === 3) {
        hex = hex.split("").map(ch => ch + ch).join("");
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 160 ? "#000" : "#fff";
}

/* =========================
    DATE / ISO HELPERS
========================= */

/**
 * Převede vstup (Date | YYYY-MM-DD | ISO datetime string)
 * na lokální Date bez časové složky (00:00:00 local time).
 *
 * @param {Date|string} dateLike
 * @returns {Date}
 */
export function toLocalDate(dateLike) {
    if (dateLike instanceof Date) {
        return new Date(
            dateLike.getFullYear(),
            dateLike.getMonth(),
            dateLike.getDate()
        );
    }

    const str = String(dateLike);

    // vezmi jen datumovou část (před "T")
    const datePart = str.includes("T") ? str.split("T")[0] : str;

    const [y, m, d] = datePart.split("-").map(Number);

    return new Date(y, m - 1, d);
}

/**
 * Převede Date objekt na string ve formátu ISO `YYYY-MM-DD`.
 *
 * Výstup je vhodný pro:
 * - ukládání dat (např. do JSON)
 * - porovnávání dat jako stringů
 * - další zpracování funkcí jako `toLocalDate`
 *
 * Používá lokální datum (ne UTC), takže nedochází k posunům
 * způsobeným časovým pásmem.
 *
 * @param {Date} date Datum jako JavaScript Date objekt.
 * @returns {string} Datum ve formátu "YYYY-MM-DD".
 *
 * @example
 * toIsoDate(new Date(2025, 7, 25))
 * // → "2025-08-25"
 *
 * @example
 * const d = new Date("2025-08-25T15:30:00");
 * toIsoDate(d)
 * // → "2025-08-25"
 */
export function toIsoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

/**
 * Naformátuje Date objekt do čitelného stringu ve formátu `DD.MM.YYYY`.
 *
 * Používá lokální datum (ne UTC), takže nedochází k posunům
 * způsobeným časovým pásmem.
 *
 * Vhodné pro:
 * - zobrazení v UI (tooltipy, popisky)
 * - export pro uživatele
 *
 * @param {Date} date Datum jako JavaScript Date objekt.
 * @returns {string} Datum ve formátu "DD.MM.YYYY".
 *
 * @example
 * formatDate(new Date(2025, 7, 25))
 * // → "25.08.2025"
 *
 * @example
 * const d = new Date("2025-08-25T15:30:00");
 * formatDate(d)
 * // → "25.08.2025"
 */
export function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${d}.${m}.${y}`;
}

/**
 * Naformátuje týden do víceřádkového textu ve formátu:
 *
 * DD.MM.
 * DD.MM.
 * YYYY
 *
 * Kde:
 * - první řádek = začátek týdne (pondělí / firstHalfStart)
 * - druhý řádek = konec týdne (neděle / secondHalfEnd)
 * - třetí řádek = rok (podle konce týdne)
 *
 * Používá lokální datum (ne UTC).
 *
 * Vhodné pro:
 * - zobrazení v hlavičce planneru
 * - kompaktní popis týdne (např. v tooltipu nebo labelu)
 *
 * @param {{
 *   firstHalfStart: Date,
 *   secondHalfEnd: Date
 * }} week Objekt týdne obsahující minimálně začátek a konec týdne.
 *
 * @returns {string} Víceřádkový string s formátovaným týdnem.
 *
 * @example
 * formatWeek({
 *   firstHalfStart: new Date(2025, 7, 25),
 *   secondHalfEnd: new Date(2025, 7, 31)
 * })
 * // →
 * // "25.08.
 * // 31.08.
 * // 2025"
 */
export function formatWeek(week) {
    const date = week.firstHalfStart
    const date2 = week.secondHalfEnd
    const y = date2.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const m2 = String(date2.getMonth() + 1).padStart(2, "0");
    const d2 = String(date2.getDate()).padStart(2, "0");
    return `${d}.${m}.\n${d2}.${m2}.\n${y}`;
}
// {formatDate(week.firstHalfStart)}<br />
// {formatDate(week.secondHalfEnd)}

/**
 * Vrátí nový Date objekt posunutý o zadaný počet dní.
 *
 * Zachovává pouze datum (rok, měsíc, den) a ignoruje časovou složku.
 * Výsledný Date je vytvořen v lokálním časovém pásmu, takže nedochází
 * k problémům s UTC posuny (např. při práci s ISO týdny).
 *
 * @param {Date} date Výchozí datum.
 * @param {number} days Počet dní k přičtení (může být i záporný).
 * @returns {Date} Nový Date objekt posunutý o daný počet dní.
 *
 * @example
 * addDays(new Date(2025, 7, 25), 3)
 * // → 28.08.2025
 *
 * @example
 * addDays(new Date(2025, 7, 25), -1)
 * // → 24.08.2025
 */
export function addDays(date, days) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setDate(d.getDate() + days);
    return d;
}

/**
 * Vrátí den v týdnu podle ISO standardu (1 = pondělí, 7 = neděle).
 *
 * Oproti JavaScript `Date.getDay()`:
 * - JS: 0 = neděle, 6 = sobota
 * - ISO: 1 = pondělí, 7 = neděle
 *
 * @param {Date} date Datum.
 * @returns {number} ISO den v týdnu (1–7).
 *
 * @example
 * getISOWeekday(new Date(2025, 7, 25)) // pondělí → 1
 */
export function getISOWeekday(date) {
    const day = date.getDay();
    return day === 0 ? 7 : day; // Po=1 ... Ne=7
}

/**
 * Vrátí číslo ISO týdne pro dané datum.
 *
 * ISO týdny:
 * - začínají pondělím
 * - týden 1 je ten, který obsahuje 4. leden
 *
 * Používá UTC výpočty, aby se předešlo problémům s časovým pásmem.
 *
 * @param {Date} date Datum.
 * @returns {number} ISO číslo týdne (1–53).
 *
 * @example
 * getISOWeek(new Date(2025, 7, 25)) // → např. 35
 */
export function getISOWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Vrátí ISO rok (week-based year) pro dané datum.
 *
 * Pozor:
 * ISO rok se může lišit od kalendářního roku.
 * Např.:
 * - 1.1. může patřit ještě do posledního ISO týdne předchozího roku
 * - 31.12. může patřit do týdne 1 následujícího roku
 *
 * @param {Date} date Datum.
 * @returns {number} ISO rok.
 *
 * @example
 * getISOWeekYear(new Date(2025, 0, 1)) // může vrátit 2024
 */
export function getISOWeekYear(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    return d.getUTCFullYear();
}

/**
 * Vrátí počet ISO týdnů v daném roce (52 nebo 53).
 *
 * ISO rok má 53 týdnů pokud:
 * - rok začíná ve čtvrtek
 * - nebo je přestupný a začíná ve středu
 *
 * Implementace využívá fakt, že 28. prosinec
 * vždy spadá do posledního ISO týdne roku.
 *
 * @param {number} year Kalendářní rok.
 * @returns {number} Počet ISO týdnů (52 nebo 53).
 *
 * @example
 * getISOWeeksInYear(2025) // → 52 nebo 53
 */
export function getISOWeeksInYear(year) {
    const dec28 = new Date(year, 11, 28);
    return getISOWeek(dec28);
}

/**
 * Vrátí konkrétní datum podle ISO roku, týdne a dne v týdnu.
 *
 * @param {number} year ISO rok.
 * @param {number} week ISO týden (1–53).
 * @param {number} [isoDay=1] ISO den v týdnu (1 = pondělí, 7 = neděle).
 * @returns {Date} Datum odpovídající danému ISO týdnu a dni.
 *
 * @example
 * getDateFromISOWeek(2025, 35, 1) // pondělí 35. týdne
 *
 * @example
 * getDateFromISOWeek(2025, 35, 7) // neděle 35. týdne
 */
export function getDateFromISOWeek(year, week, isoDay = 1) {
    const jan4 = new Date(year, 0, 4);
    const jan4IsoDay = getISOWeekday(jan4);
    const mondayOfWeek1 = addDays(jan4, 1 - jan4IsoDay);
    return addDays(mondayOfWeek1, (week - 1) * 7 + (isoDay - 1));
}


/* =========================
    ACADEMIC WEEKS
========================= */
/**
 * Vygeneruje seznam týdnů pro akademický rok ve formátu ISO týdnů.
 *
 * Akademický rok:
 * - začíná zadaným ISO týdnem (např. 35) v `startYear`
 * - pokračuje do konce ISO týdnů daného roku
 * - a končí zadaným týdnem (např. 42) v následujícím roce
 *
 * Každý týden obsahuje:
 * - základní ISO identifikaci (rok, číslo týdne)
 * - datumový rozsah (pondělí–neděle)
 * - rozdělení na dvě poloviny týdne:
 *   - první polovina: pondělí–středa
 *   - druhá polovina: čtvrtek–neděle
 *
 * @param {number} startYear Počáteční rok akademického období.
 * @param {number} [startWeek=35] ISO týden, kterým akademický rok začíná.
 * @param {number} [endWeekNextYear=42] ISO týden v následujícím roce, kterým akademický rok končí.
 *
 * @returns {Array<{
 *   id: string,
 *   isoYear: number,
 *   isoWeek: number,
 *   label: string,
 *   labelFull: string,
 *   weekStart: Date,
 *   weekEnd: Date,
 *   firstHalfStart: Date,
 *   firstHalfEnd: Date,
 *   secondHalfStart: Date,
 *   secondHalfEnd: Date
 * }>} Seznam týdnů v akademickém roce.
 *
 * @example
 * buildAcademicWeeks(2025, 35, 42)
 * // → týdny od W35/2025 až do W42/2026
 *
 * @example
 * const weeks = buildAcademicWeeks(2025);
 * console.log(weeks[0].labelFull) // "2025/W35"
 * console.log(weeks.at(-1).labelFull) // "2026/W42"
 */
export function buildAcademicWeeks(startYear, startWeek = 35, endWeekNextYear = 42) {
    const result = [];

    const weeksInStartYear = getISOWeeksInYear(startYear);
    for (let w = startWeek; w <= weeksInStartYear; w++) {
        const monday = getDateFromISOWeek(startYear, w, 1);
        const sunday = getDateFromISOWeek(startYear, w, 7);
        result.push({
            id: `${startYear}-W${String(w).padStart(2, "0")}`,
            isoYear: startYear,
            isoWeek: w,
            label: `${w}`,
            labelFull: `${startYear}/W${w}`,
            weekStart: monday,
            weekEnd: sunday,
            firstHalfStart: monday,
            firstHalfEnd: addDays(monday, 2),     // Po-St
            secondHalfStart: addDays(monday, 3),  // Čt
            secondHalfEnd: sunday                 // Čt-Ne
        });
    }

    for (let w = 1; w <= endWeekNextYear; w++) {
        const monday = getDateFromISOWeek(startYear + 1, w, 1);
        const sunday = getDateFromISOWeek(startYear + 1, w, 7);
        result.push({
            id: `${startYear + 1}-W${String(w).padStart(2, "0")}`,
            isoYear: startYear + 1,
            isoWeek: w,
            label: `${w}`,
            labelFull: `${startYear + 1}/W${w}`,
            weekStart: monday,
            weekEnd: sunday,
            firstHalfStart: monday,
            firstHalfEnd: addDays(monday, 2),
            secondHalfStart: addDays(monday, 3),
            secondHalfEnd: sunday
        });
    }

    return result;
}


export function assignEventsToWeeks(weeks, events) {
    const result = weeks.map(week => {
        return {
            ...week,
            firstHalfEvents: events.filter(
                event => rangesIntersect(
                    week.firstHalfStart,
                    week.firstHalfEnd,
                    event.startDateObj,
                    event.endDateObj
                )
            ),
            secondHalfEvents: events.filter(
                event => rangesIntersect(
                    week.secondHalfStart,
                    week.secondHalfEnd,
                    event.startDateObj,
                    event.endDateObj
                )
            )
        }
    })
    return result
}
/* =========================
    EVENTS <-> SEGMENTS
========================= */

/**
 * Ověří, zda se dva časové intervaly překrývají (včetně hranic).
 *
 * Intervaly jsou považovány za uzavřené:
 * - [aStart, aEnd]
 * - [bStart, bEnd]
 *
 * To znamená, že pokud se dotýkají na hraně, považují se za průnik:
 * např. [1.1, 3.1] a [3.1, 5.1] → TRUE
 *
 * @param {Date} aStart Začátek prvního intervalu.
 * @param {Date} aEnd Konec prvního intervalu.
 * @param {Date} bStart Začátek druhého intervalu.
 * @param {Date} bEnd Konec druhého intervalu.
 * @returns {boolean} True pokud se intervaly překrývají.
 *
 * @example
 * rangesIntersect(
 *   new Date(2025, 7, 25),
 *   new Date(2025, 7, 27),
 *   new Date(2025, 7, 27),
 *   new Date(2025, 7, 30)
 * ) // → true
 */
export function rangesIntersect(aStart, aEnd, bStart, bEnd) {
    return aStart <= bEnd && bStart <= aEnd;
}

/**
 * Normalizuje event tak, aby měl:
 * - převedené datumy na Date objekty bez časové složky
 * - zajištěné pořadí (start <= end)
 *
 * Přidává do objektu:
 * - `startDateObj` (Date)
 * - `endDateObj` (Date)
 *
 * Pokud `endDate` není definováno, použije se `startDate`.
 * Pokud jsou data obráceně (end < start), automaticky se prohodí.
 *
 * @param {{
 *   startDate: string | Date,
 *   endDate?: string | Date,
 *   [key: string]: any
 * }} event Event s daty ve formátu "YYYY-MM-DD" nebo Date.
 *
 * @returns {{
 *   startDate: string | Date,
 *   endDate?: string | Date,
 *   startDateObj: Date,
 *   endDateObj: Date
 * } & Record<string, any>} Normalizovaný event.
 *
 * @example
 * normalizeEvent({
 *   startDate: "2025-08-25",
 *   endDate: "2025-08-20"
 * })
 * // → startDateObj = 20.08.2025
 * // → endDateObj   = 25.08.2025
 *
 * @example
 * normalizeEvent({
 *   startDate: "2025-08-25"
 * })
 * // → startDateObj = endDateObj = 25.08.2025
 */
export function normalizeEvent(event) {
    const start = toLocalDate(event?.startDate || event?.startdate);
    const end = toLocalDate(event?.endDate || event?.enddate || event?.startDate);
    return start <= end
        ? { ...event, startDateObj: start, endDateObj: end, startDate: toIsoDate(start), endDate: toIsoDate(end) }
        : { ...event, startDateObj: end, endDateObj: start, startDate: toIsoDate(end), endDate: toIsoDate(start) };
}

/**
 * Rozbalí seznam událostí (events) na jemnější strukturu segmentů,
 * kde každý segment reprezentuje polovinu týdne:
 *
 * - "L" (left)  = pondělí–středa
 * - "R" (right) = čtvrtek–neděle
 *
 * Nejprve vytvoří segmenty pro všechny týdny, poté do nich promítne události.
 * Pokud událost zasahuje do segmentu (má průnik s jeho intervalem),
 * nastaví se `toolAbbr` daného segmentu.
 *
 * Pokud více událostí zasahuje do stejného segmentu,
 * poslední z nich v poli `events` má přednost (přepisuje předchozí).
 *
 * @param {Array<{
 *   id: string,
 *   firstHalfStart: Date,
 *   firstHalfEnd: Date,
 *   secondHalfStart: Date,
 *   secondHalfEnd: Date
 * }>} weeks Seznam týdnů (výstup z buildAcademicWeeks).
 *
 * @param {Array<{
 *   startDate: string | Date,
 *   endDate?: string | Date,
 *   toolAbbr: string
 * }>} events Seznam událostí (intervaly).
 *
 * @returns {Array<{
 *   key: string,
 *   weekId: string,
 *   side: "L" | "R",
 *   startDate: Date,
 *   endDate: Date,
 *   toolAbbr: string | null
 * }>} Seznam segmentů (polovin týdnů) s přiřazenými nástroji.
 *
 * @example
 * expandEventsToSegments(weeks, [
 *   { startDate: "2025-08-25", endDate: "2025-08-27", toolAbbr: "ZS" }
 * ])
 * // → segment L v daném týdnu bude mít toolAbbr "ZS"
 *
 * @example
 * expandEventsToSegments(weeks, [
 *   { startDate: "2025-08-28", endDate: "2025-08-30", toolAbbr: "AJ" }
 * ])
 * // → segment R bude mít toolAbbr "AJ"
 */
export function expandEventsToSegments(weeks, events) {
    const segments = [];

    for (const week of weeks) {
        segments.push({
            key: `${week.id}-L`,
            weekId: week.id,
            side: "L",
            startDate: week.firstHalfStart,
            endDate: week.firstHalfEnd,
            toolAbbr: null
        });
        segments.push({
            key: `${week.id}-R`,
            weekId: week.id,
            side: "R",
            startDate: week.secondHalfStart,
            endDate: week.secondHalfEnd,
            toolAbbr: null
        });
    }

    for (const rawEvent of events || []) {
        const event = normalizeEvent(rawEvent);

        for (const segment of segments) {
            if (
                rangesIntersect(
                    event.startDateObj,
                    event.endDateObj,
                    segment.startDate,
                    segment.endDate
                )
            ) {
                segment.toolAbbr = event.toolAbbr;
                segment.event = event
            }
        }
    }

    return segments;
}

/**
 * Složí segmenty (poloviny týdnů) zpět do kompaktního seznamu událostí (events).
 *
 * Funguje jako inverzní operace k `expandEventsToSegments()`:
 * - vezme jednotlivé segmenty (L/R půlky týdnů)
 * - odstraní prázdné segmenty (`toolAbbr === null`)
 * - spojí sousedící segmenty se stejným `toolAbbr` do jednoho časového intervalu
 *
 * Dva segmenty se sloučí pokud:
 * - mají stejný `toolAbbr`
 * - jejich intervaly na sebe přímo navazují (end + 1 den = start dalšího)
 *
 * Interně používá:
 * - `_start` a `_end` (Date) pro výpočty
 * - `startDate` a `endDate` (string ve formátu YYYY-MM-DD) pro výstup
 *
 * @param {Array<{
 *   key: string,
 *   weekId: string,
 *   side: "L" | "R",
 *   startDate: Date,
 *   endDate: Date,
 *   toolAbbr: string | null
 * }>} segments Seznam segmentů (výstup z expandEventsToSegments).
 *
 * @returns {Array<{
 *   toolAbbr: string,
 *   startDate: string,
 *   endDate: string
 * }>} Sloučený seznam událostí (intervaly).
 *
 * @example
 * // vstup (segmenty)
 * [
 *   { toolAbbr: "ZS", startDate: 1.1, endDate: 3.1 },
 *   { toolAbbr: "ZS", startDate: 4.1, endDate: 7.1 }
 * ]
 *
 * // výstup (events)
 * [
 *   { toolAbbr: "ZS", startDate: "2025-01-01", endDate: "2025-01-07" }
 * ]
 *
 * @example
 * // různé toolAbbr → nesloučí se
 * [
 *   { toolAbbr: "ZS", ... },
 *   { toolAbbr: "AJ", ... }
 * ]
 */
export function compressSegmentsToEvents(segments) {
    const filtered = segments.filter(s => s.toolAbbr);

    if (filtered.length === 0) return [];

    const result = [];
    let current = null;

    for (const segment of filtered) {
        if (!current) {
            current = {
                toolAbbr: segment.toolAbbr,
                startDate: toIsoDate(segment.startDate),
                endDate: toIsoDate(segment.endDate),
                _start: segment.startDate,
                _end: segment.endDate
            };
            continue;
        }

        const isSameTool = current.toolAbbr === segment.toolAbbr;
        const isContiguous = toIsoDate(addDays(current._end, 1)) === toIsoDate(segment.startDate);

        if (isSameTool && isContiguous) {
            current.endDate = toIsoDate(segment.endDate);
            current._end = segment.endDate;
        } else {
            result.push({
                toolAbbr: current.toolAbbr,
                startDate: current.startDate,
                endDate: current.endDate
            });
            current = {
                toolAbbr: segment.toolAbbr,
                startDate: toIsoDate(segment.startDate),
                endDate: toIsoDate(segment.endDate),
                _start: segment.startDate,
                _end: segment.endDate
            };
        }
    }

    if (current) {
        result.push({
            toolAbbr: current.toolAbbr,
            startDate: current.startDate,
            endDate: current.endDate
        });
    }

    return result;
}

/**
 * Aplikuje (nebo přepne) nástroj na konkrétní polovinu týdne
 * a vrátí aktualizovaný seznam událostí (events).
 *
 * Postup:
 * 1. Rozbalí existující events na segmenty (poloviny týdnů)
 * 2. Najde cílový segment podle `weekId` a `side`
 * 3. Přepne hodnotu:
 *    - pokud je již stejný nástroj → odstraní ho (toggle off)
 *    - jinak nastaví nový nástroj
 * 4. Zkomprimuje segmenty zpět na intervaly (events)
 *
 * @param {Array<{
 *   id: string,
 *   firstHalfStart: Date,
 *   firstHalfEnd: Date,
 *   secondHalfStart: Date,
 *   secondHalfEnd: Date
 * }>} weeks Seznam týdnů (výstup z buildAcademicWeeks).
 *
 * @param {Array<{
 *   startDate: string | Date,
 *   endDate?: string | Date,
 *   toolAbbr: string
 * }>} events Aktuální seznam událostí.
 *
 * @param {string} weekId ID týdne (např. "2025-W35").
 *
 * @param {"L" | "R"} side Polovina týdne:
 * - "L" = pondělí–středa
 * - "R" = čtvrtek–neděle
 *
 * @param {string} selectedToolAbbr Zkratka vybraného nástroje (např. "ZS").
 *
 * @returns {Array<{
 *   toolAbbr: string,
 *   startDate: string,
 *   endDate: string
 * }>} Nový seznam událostí po aplikaci změny.
 *
 * @example
 * // nastaví ZS na levou polovinu týdne
 * applyToolToHalf(weeks, events, "2025-W35", "L", "ZS")
 *
 * @example
 * // kliknutí znovu stejným nástrojem → odstraní hodnotu
 * applyToolToHalf(weeks, events, "2025-W35", "L", "ZS")
 */
export function applyToolToHalf(weeks, events, weekId, side, selectedToolAbbr) {
    const segments = expandEventsToSegments(weeks, events);
    const key = `${weekId}-${side}`;
    const target = segments.find(s => s.key === key);

    if (!target) return events;

    target.toolAbbr = target.toolAbbr === selectedToolAbbr ? null : selectedToolAbbr;

    return compressSegmentsToEvents(segments);
}

/**
 * Aktualizuje události (events) jedné entity na základě změny
 * v konkrétní polovině týdne.
 *
 * Interně:
 * - použije `applyToolToHalf()` pro výpočet nového seznamu events
 * - vrátí novou entitu s aktualizovanými events (immutabilní update)
 *
 * @param {{
 *   entity: {
 *     id: string,
 *     events?: Array<{
 *       startDate: string | Date,
 *       endDate?: string | Date,
 *       toolAbbr: string
 *     }>
 *   },
 *   weeks: Array<any>,
 *   weekId: string,
 *   side: "L" | "R",
 *   selectedToolAbbr: string
 * }} params Parametry aktualizace.
 *
 * @returns {{
 *   id: string,
 *   events: Array<{
 *     toolAbbr: string,
 *     startDate: string,
 *     endDate: string
 *   }>
 * } & Record<string, any>} Nová entita s upravenými events.
 *
 * @example
 * updateEntityEventsForHalf({
 *   entity,
 *   weeks,
 *   weekId: "2025-W35",
 *   side: "L",
 *   selectedToolAbbr: "ZS"
 * })
 */
export function updateEntityEventsForHalf({
    entity,
    weeks,
    weekId,
    side,
    selectedToolAbbr
}) {
    const updatedEvents = applyToolToHalf(
        weeks,
        entity.events || [],
        weekId,
        side,
        selectedToolAbbr
    );

    return {
        ...entity,
        events: updatedEvents
    };
}

/**
 * Namapuje události (events) na jednotlivé týdny
 * a přiřadí nástroje pro levou a pravou polovinu týdne.
 *
 * Výsledkem je seznam týdnů obohacený o:
 * - `leftTool`  (pondělí–středa)
 * - `rightTool` (čtvrtek–neděle)
 *
 * Interně:
 * - rozbalí events na segmenty (`expandEventsToSegments`)
 * - vytvoří mapu segmentů podle `key`
 * - pro každý týden dohledá odpovídající segmenty
 *
 * @param {Array<{
 *   id: string
 * }>} weeks Seznam týdnů (z buildAcademicWeeks).
 *
 * @param {Array<{
 *   startDate: string | Date,
 *   endDate?: string | Date,
 *   toolAbbr: string
 * }>} events Seznam událostí.
 *
 * @param {{ [abbreviation: string]: {
 *   id: string,
 *   name: string,
 *   abbreviation: string,
 *   color: string
 * } }} toolMap Mapa nástrojů podle zkratky.
 *
 * @returns {Array<{
 *   id: string,
 *   leftTool: object | null,
 *   rightTool: object | null
 * }>} Seznam týdnů s přiřazenými nástroji.
 *
 * @example
 * mapEventsToWeeks(weeks, events, toolMap)
 * // → week.leftTool / week.rightTool obsahují tool objekty
 */
export function mapEventsToWeeks(weeks, events, toolMap) {
    const segments = expandEventsToSegments(weeks, events);
    const segmentMap = Object.fromEntries(segments.map(s => [s.key, s]));

    return weeks.map(week => {
        const leftAbbr = segmentMap[`${week.id}-L`]?.toolAbbr || null;
        const rightAbbr = segmentMap[`${week.id}-R`]?.toolAbbr || null;

        return {
            ...week,
            leftTool: leftAbbr ? toolMap[leftAbbr] : null,
            rightTool: rightAbbr ? toolMap[rightAbbr] : null
        };
    });
}


/**
 * Vypočítá agregaci nástrojů (toolAbbr) pro entitu
 * na základě rozdělení na poloviny týdnů.
 *
 * Každý segment (polovina týdne) přispívá:
 * - 0.5 týdne
 *
 * Výsledkem je objekt:
 * - klíč = toolAbbr
 * - hodnota = počet týdnů (včetně půlek, např. 12.5)
 *
 * @param {Array<any>} weeks Seznam týdnů.
 *
 * @param {Array<{
 *   startDate: string | Date,
 *   endDate?: string | Date,
 *   toolAbbr: string
 * }>} events Seznam událostí.
 *
 * @returns {{ [toolAbbr: string]: number }} Agregace nástrojů v týdnech.
 *
 * @example
 * aggregateEntityTools(weeks, events)
 * // → { ZS: 12.5, LS: 8, Z: 3 }
 */
export function aggregateEntityTools(weeks, events) {
    const segments = expandEventsToSegments(weeks, events);

    const counts = {};

    for (const segment of segments) {
        if (!segment.toolAbbr) continue;

        if (!counts[segment.toolAbbr]) {
            counts[segment.toolAbbr] = 0;
        }

        counts[segment.toolAbbr] += 0.5;
    }

    return counts;
}