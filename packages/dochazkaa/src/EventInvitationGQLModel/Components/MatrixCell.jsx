import { stateCellColor, stateEmoji, classifyState } from "./stateHelpers"
 
/**
 * Sestaví z dostupných stavů PŘESNĚ tři volby pro dropdown: ✓ / ? / ✕.
 *
 * Nejdřív zkusí stavy rozpoznat podle významu (classifyState). Co se rozpozná,
 * padne rovnou do své přihrádky (potvrzeno → ✓, čeká → ?, odmítnuto → ✕).
 * Nerozpoznané stavy (neutral) se doplní do prázdných přihrádek podle `order`
 * v obvyklém pořadí čeká → potvrzeno → odmítnuto, ať to funguje i když se
 * stavy jmenují nestandardně.
 *
 * @param {Array<{id:string,name?:string,order?:number}>} states
 * @returns {Array<{icon:string, id:string, name?:string}>} max 3 volby
 */
const buildThreeChoices = (states = []) => {
    const slot = { confirmed: null, pending: null, declined: null }
    const neutrals = []
    for (const s of states) {
        const c = classifyState(s)
        if (c === "confirmed" && !slot.confirmed) slot.confirmed = s
        else if (c === "declined" && !slot.declined) slot.declined = s
        else if (c === "pending" && !slot.pending) slot.pending = s
        else neutrals.push(s)
    }
    // Doplnění prázdných přihrádek z nerozpoznaných stavů podle pořadí.
    const sortedNeutral = [...neutrals].sort((a, b) => (a?.order ?? 999) - (b?.order ?? 999))
    let ni = 0
    for (const key of ["pending", "confirmed", "declined"]) {
        if (!slot[key] && ni < sortedNeutral.length) slot[key] = sortedNeutral[ni++]
    }
    // Výsledek v pořadí ✅ ❓ ❌ (barevné emoji, stejné jako v přehledu)
    const out = []
    if (slot.confirmed) out.push({ icon: "✅", id: slot.confirmed.id, name: slot.confirmed.name })
    if (slot.pending)   out.push({ icon: "❓", id: slot.pending.id, name: slot.pending.name })
    if (slot.declined)  out.push({ icon: "❌", id: slot.declined.id, name: slot.declined.name })
    return out
}
 
/**
 * Jedna buňka docházkové matice (průsečík student × výuka).
 *
 * V editačním režimu nabídne PŘESNĚ tři volby (✓ / ? / ✕). Výběr se neukládá
 * hned – ohlásí se rodiči přes `onStage` a odešle se až tlačítkem "Uložit
 * změny". Dokud změna není uložená, je buňka orámovaná.
 *
 * @param {object} props
 * @param {object} [props.invitation] - pozvánka na průsečíku (nemusí existovat)
 * @param {Array<object>} [props.availableStates] - stavy docházkového automatu
 * @param {boolean} [props.editable] - vykreslit dropdown místo statického emoji
 * @param {string} [props.pendingStateId] - dosud neuložený výběr z rodiče
 * @param {(invitationId: string, stateId: string) => void} [props.onStage]
 */
export const MatrixCell = ({
    invitation,
    availableStates = [],
    editable = false,
    pendingStateId,
    onStage,
}) => {
    if (!invitation) {
        return <td style={{ textAlign: "center", color: "#ccc" }}>–</td>
    }
 
    const savedStateId = invitation?.stateId || invitation?.state?.id || ""
    const selectedStateId = pendingStateId ?? savedStateId
    const dirty = pendingStateId !== undefined && pendingStateId !== savedStateId
 
    const displayState =
        availableStates.find((st) => st.id === selectedStateId) || invitation?.state
 
    // Tři volby pro dropdown (✅ / ❓ / ❌).
    const choices = buildThreeChoices(availableStates)
    const canEdit = editable && choices.length > 0
 
    // Ikona podle STEJNÉHO mapování jako dropdown – aby read-only přehled ukazoval
    // totéž co editace, i když se stav nedá rozpoznat podle jména (classifyState).
    const iconById = new Map(choices.map((c) => [c.id, c.icon]))
    const displayIcon = iconById.get(selectedStateId) || stateEmoji(displayState)
 
    return (
        <td
            style={{
                backgroundColor: stateCellColor(displayState),
                textAlign: "center",
                padding: "4px",
                minWidth: 60,
                outline: dirty ? "2px solid #0d6efd" : undefined,
                outlineOffset: dirty ? "-2px" : undefined,
            }}
            title={displayState?.name || "Bez stavu"}
        >
            {canEdit ? (
                <select
                    className="form-select form-select-sm"
                    style={{ fontSize: "1rem", padding: "2px 4px", minWidth: 50, textAlign: "center" }}
                    value={selectedStateId}
                    onChange={(e) => onStage?.(invitation.id, e.target.value)}
                >
                    {/* prázdná volba jen dokud není nic vybráno – ať nejsou 4 položky */}
                    {!selectedStateId && <option value="">–</option>}
                    {choices.map((c) => (
                        <option key={c.id} value={c.id} title={c.name}>{c.icon}</option>
                    ))}
                </select>
            ) : (
                <div style={{ fontSize: "1.2rem" }}>{displayIcon}</div>
            )}
        </td>
    )
}