import { useState } from "react"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks/useAsyncThunkAction"
import { UpdateAsyncAction } from "../Queries/UpdateAsyncAction"
import { stateCellColor, stateSymbol } from "./stateHelpers"

/**
 * Jedna buňka docházkové matice (průsečík student × výuka).
 *
 * Pokud pro daný průsečík existuje pozvánka, zobrazí barevnou buňku se symbolem
 * stavu a rozbalovací nabídku pro změnu stavu. Jinak je buňka prázdná (student
 * na danou výuku není pozván).
 */
export const MatrixCell = ({ invitation, availableStates = [], onChanged }) => {
    const { run, loading } = useAsyncThunkAction(UpdateAsyncAction, undefined, { deferred: true })
    const [error, setError] = useState(false)

    if (!invitation) {
        return <td style={{ textAlign: "center", color: "#ccc" }}>–</td>
    }

    const currentStateId = invitation?.stateId || invitation?.state?.id

    const handleChange = async (e) => {
        const stateId = e.target.value
        if (!stateId || stateId === currentStateId) return
        setError(false)
        try {
            await run({ id: invitation.id, lastchange: invitation.lastchange, stateId })
            if (onChanged) onChanged()
        } catch {
            setError(true)
        }
    }

    return (
        <td
            style={{
                backgroundColor: error ? "#ffe0e0" : stateCellColor(invitation?.state),
                textAlign: "center",
                padding: "2px 4px",
                minWidth: 30,
            }}
            title={invitation?.state?.name || ""}
        >
            <div style={{ fontWeight: "bold", lineHeight: 1 }}>
                {stateSymbol(invitation?.state)}
            </div>
            <select
                className="form-select form-select-sm w-100"
                style={{ fontSize: "0.72rem", padding: "1px 4px", minWidth: 0, maxWidth: "100%" }}
                value={currentStateId || ""}
                disabled={loading}
                onChange={handleChange}
            >
                {!availableStates.some((s) => s.id === currentStateId) && (
                    <option value={currentStateId || ""}>{stateSymbol(invitation?.state)}</option>
                )}
                {availableStates.map((st) => (
                    <option key={st.id} value={st.id} title={st.name}>{stateSymbol(st)}</option>
                ))}
            </select>
        </td>
    )
}
