import { useState } from "react"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks/useAsyncThunkAction"
import { UpdateAsyncAction } from "../Queries/UpdateAsyncAction"
import { stateVariant } from "./stateHelpers"

export const AttendanceButtons = ({
    invitation,
    availableStates = [],
    onChanged,
    size = "sm",
    labelForState = (state) => state?.name || "Stav",
}) => {
    const { run, loading } = useAsyncThunkAction(UpdateAsyncAction, undefined, { deferred: true })
    const [busyStateId, setBusyStateId] = useState(null)
    const [error, setError] = useState(null)

    const currentStateId = invitation?.stateId || invitation?.state?.id

    const handleClick = async (stateId) => {
        if (!invitation?.id || stateId === currentStateId) return
        setError(null)
        setBusyStateId(stateId)
        try {
            await run({
                id: invitation.id,
                lastchange: invitation.lastchange,
                stateId,
            })
            if (onChanged) onChanged()
        } catch (e) {
            setError(e?.message || "Zmena stavu se nezdarila")
        } finally {
            setBusyStateId(null)
        }
    }

    if (!availableStates.length) {
        return <span className="text-muted">Zadne dostupne stavy</span>
    }

    return (
        <div className="d-flex flex-wrap gap-1 align-items-center">
            {availableStates.map((st) => {
                const isCurrent = st.id === currentStateId
                const variant = stateVariant(st)
                const className = `btn btn-${size} ${isCurrent ? `btn-${variant}` : `btn-outline-${variant}`}`
                const isBusy = busyStateId === st.id && loading
                const label = labelForState(st)

                return (
                    <button
                        key={st.id}
                        type="button"
                        className={className}
                        disabled={loading || isCurrent}
                        onClick={() => handleClick(st.id)}
                        title={isCurrent ? "Aktualni stav" : `Nastavit stav: ${label}`}
                    >
                        {isBusy ? "..." : label}
                    </button>
                )
            })}
            {error && <span className="text-danger small ms-2">{error}</span>}
        </div>
    )
}
