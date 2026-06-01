/**
 * Formátování času výuky (přednášky/cvičení) v češtině.
 */

const DAYS_CS = ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"]

const pad = (n) => String(n).padStart(2, "0")

const toDate = (value) => {
    if (!value) return null
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d
}

/** "14:30" */
export const formatTime = (value) => {
    const d = toDate(value)
    if (!d) return ""
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** "pondělí 8. 9. 2024" */
export const formatDay = (value) => {
    const d = toDate(value)
    if (!d) return ""
    return `${DAYS_CS[d.getDay()]} ${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`
}

/** "pondělí 8. 9. 2024, 14:30 – 16:00" */
export const formatLectureWhen = (startdate, enddate) => {
    const start = toDate(startdate)
    if (!start) return "Termín neurčen"
    const dayPart = formatDay(startdate)
    const from = formatTime(startdate)
    const to = enddate ? formatTime(enddate) : null
    return to ? `${dayPart}, ${from} – ${to}` : `${dayPart}, ${from}`
}

/** Krátký variant pro hlavičku sloupce v matici: "8.9. 14:30" */
export const formatLectureShort = (startdate, enddate) => {
    const start = toDate(startdate)
    if (!start) return "?"
    const date = `${start.getDate()}.${start.getMonth() + 1}.`
    const from = formatTime(startdate)
    const to = enddate ? formatTime(enddate) : null
    return to ? `${date} ${from}–${to}` : `${date} ${from}`
}
