import { stateCellColor, stateEmoji } from "./stateHelpers"

/**
 * Jedna buňka docházkové matice (průsečík student × výuka).
 *
 * V editačním režimu nabídne stavy docházkového automatu. Výběr se neukládá
 * hned – ohlásí se rodiči přes `onStage` a odešle se až tlačítkem "Uložit
 * změny". Dokud změna není uložená, je buňka orámovaná.
 *
 * @param {object} props
 * @param {object} [props.invitation] - pozvánka na průsečíku (nemusí existovat)
 * @param {Array<object>} [props.availableStates] - stavy nabízené v dropdownu
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

    // Bez znalosti stavů není co nabídnout – jakýkoliv výběr by nešlo uložit,
    // protože mutace vyžaduje UUID skutečného stavu. Buňka zůstane jen ke čtení
    // a důvod vysvětlí rodič.
    const canEdit = editable && availableStates.length > 0

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
                    {!savedStateId && <option value="">–</option>}
                    {availableStates.map((st) => (
                        <option key={st.id} value={st.id}>{stateEmoji(st)}</option>
                    ))}
                </select>
            ) : (
                <div style={{ fontSize: "1.2rem" }}>{stateEmoji(displayState)}</div>
            )}
        </td>
    )
}
