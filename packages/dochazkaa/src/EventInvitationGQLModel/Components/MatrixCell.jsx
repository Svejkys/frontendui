import { useState, useMemo } from "react"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks/useAsyncThunkAction"
import { UpdateAsyncAction } from "../Queries/UpdateAsyncAction"
import { stateCellColor, stateEmoji, classifyState } from "./stateHelpers"

/**
 * Jedna buňka docházkové matice (průsečík student × výuka).
 *
 * Pokud pro daný průsečík existuje pozvánka, zobrazí barevnou buňku s emoji.
 * V editačním režimu (editable=true) zobrazí dropdown pro změnu stavu.
 */
export const MatrixCell = ({ invitation, availableStates = [], onChanged, editable = false }) => {
    const { run, loading } = useAsyncThunkAction(UpdateAsyncAction, undefined, { deferred: true })
    const [error, setError] = useState(false)
    const [localState, setLocalState] = useState(null)

    const states = useMemo(() => {
        if (availableStates.length > 0) return availableStates
        const machineStates = invitation?.state?.statemachine?.states || []
        if (machineStates.length > 0) return machineStates
        return []
    }, [availableStates, invitation])

    if (!invitation) {
        return <td style={{ textAlign: "center", color: "#ccc" }}>–</td>
    }

    const currentStateId = invitation?.stateId || invitation?.state?.id
    const displayState = localState || invitation?.state

    const handleChange = async (e) => {
        const stateId = e.target.value
        if (!stateId || stateId === currentStateId) return

        const newState = states.find(s => s.id === stateId)
        setLocalState(newState)
        setError(false)

        try {
            await run({ id: invitation.id, lastchange: invitation.lastchange, stateId })
            if (onChanged) onChanged()
        } catch {
            setError(true)
            setLocalState(null)
        }
    }

    const handleLocalChange = (value) => {
        setLocalState({ name: value, nameEn: value })
    }

    return (
        <td
            style={{
                backgroundColor: error ? "#ffe0e0" : stateCellColor(displayState),
                textAlign: "center",
                padding: "4px",
                minWidth: 60,
            }}
            title={displayState?.name || ""}
        >
            {editable ? (
                states.length > 0 ? (
                    <select
                        className="form-select form-select-sm"
                        style={{ fontSize: "1rem", padding: "2px 4px", minWidth: 50, textAlign: "center" }}
                        value={currentStateId || ""}
                        disabled={loading}
                        onChange={handleChange}
                    >
                        {states.map((st) => (
                            <option key={st.id} value={st.id}>{stateEmoji(st)}</option>
                        ))}
                    </select>
                ) : (
                    <select
                        className="form-select form-select-sm"
                        style={{ fontSize: "1rem", padding: "2px 4px", minWidth: 50, textAlign: "center" }}
                        value={classifyState(displayState)}
                        disabled={loading}
                        onChange={(e) => handleLocalChange(e.target.value)}
                    >
                        <option value="confirmed">✅</option>
                        <option value="declined">❌</option>
                        <option value="pending">❓</option>
                    </select>
                )
            ) : (
                <div style={{ fontSize: "1.2rem" }}>{stateEmoji(displayState)}</div>
            )}
        </td>
    )
}