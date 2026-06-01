/**
 * Pomocné funkce pro sémantiku stavů docházky.
 *
 * Stavový automat může mít libovolné názvy stavů. Tato heuristika rozpozná
 * podle názvu, zda jde o "potvrzeno", "odmítnuto" či "čeká" (pozváno),
 * aby UI mohlo přiřadit barvy a ikony. Pokud rozpoznání selže, stav se
 * zobrazí neutrálně, ale stále půjde použít jako tlačítko.
 */

const norm = (s) => String(s ?? "").toLowerCase().trim()

const CONFIRMED_KEYS = [
    "potvrz", "zúčast", "zucast", "účast", "ucast", "přít", "prit",
    "ano", "accept", "confirm", "present", "attend", "yes", "going",
]
const DECLINED_KEYS = [
    "odmít", "odmit", "nezúčast", "nezucast", "neúčast", "neucast",
    "omluv", "absen", "nepřít", "neprit", "ne ", "decline", "reject",
    "absent", "no ", "not going", "cancel",
]
const PENDING_KEYS = [
    "pozv", "čeká", "ceka", "nevyjádř", "nevyjadr", "invite",
    "pending", "waiting", "new", "nový", "novy",
]

/**
 * @param {{name?: string, nameEn?: string}|null|undefined} state
 * @returns {"confirmed"|"declined"|"pending"|"neutral"}
 */
export const classifyState = (state) => {
    const hay = `${norm(state?.name)} ${norm(state?.nameEn)}`
    if (CONFIRMED_KEYS.some((k) => hay.includes(k))) return "confirmed"
    if (DECLINED_KEYS.some((k) => hay.includes(k))) return "declined"
    if (PENDING_KEYS.some((k) => hay.includes(k))) return "pending"
    return "neutral"
}

/** Bootstrap kontextová barva pro daný sémantický typ stavu. */
export const stateVariant = (state) => {
    switch (classifyState(state)) {
        case "confirmed": return "success"
        case "declined": return "danger"
        case "pending": return "secondary"
        default: return "info"
    }
}

/** Krátký symbol pro buňku matice. */
export const stateSymbol = (state) => {
    switch (classifyState(state)) {
        case "confirmed": return "✓"
        case "declined": return "✕"
        case "pending": return "•"
        default: return "?"
    }
}

/** Background barva buňky (jemná) pro matici. */
export const stateCellColor = (state) => {
    switch (classifyState(state)) {
        case "confirmed": return "#d1e7dd"
        case "declined": return "#f8d7da"
        case "pending": return "#e2e3e5"
        default: return "#cff4fc"
    }
}

/**
 * Z pole pozvánek odvodí seznam dostupných stavů (z prvního stavového automatu,
 * který najde). Stavy seřadí podle `order` a poté podle názvu.
 *
 * @param {Array<object>} invitations
 * @returns {Array<{id:string,name:string,nameEn?:string,order?:number}>}
 */
export const collectAvailableStates = (invitations = []) => {
    const byId = new Map()
    for (const inv of invitations) {
        const machineStates = inv?.state?.statemachine?.states || []
        for (const st of machineStates) {
            if (st?.id && !byId.has(st.id)) byId.set(st.id, st)
        }
        // fallback: i samotný aktuální stav (kdyby statemachine.states chybělo)
        const cur = inv?.state
        if (cur?.id && !byId.has(cur.id)) byId.set(cur.id, cur)
    }
    return [...byId.values()].sort((a, b) => {
        const oa = a?.order ?? 999, ob = b?.order ?? 999
        if (oa !== ob) return oa - ob
        return String(a?.name ?? "").localeCompare(String(b?.name ?? ""))
    })
}
