import { useState } from "react"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks/useAsyncThunkAction"
import { UpdateAsyncAction } from "../Queries/UpdateAsyncAction"
import { stateVariant } from "./stateHelpers"

/**
 * Sada tlačítek pro nastavení stavu jedné pozvánky.
 *
 * Pro každý dostupný stav vykreslí tlačítko. Aktuální stav je zvýrazněn
 * (plné tlačítko), ostatní jsou jako "outline". Kliknutí odešle mutaci
 * `eventInvitationUpdate` a po úspěchu zavolá `onChanged()`, aby si rodič
 * mohl znovu načíst data.
 *
 * @param {object} props
 * @param {object} props.invitation - pozvánka { id, lastchange, stateId, state }
 * @param {Array<{id,name,nameEn,order}>} props.availableStates - možné stavy
 * @param {() => void} [props.onChanged] - callback po úspěšné změně
 * @param {string} [props.size="sm"] - velikost tlačítek (bootstrap)
 */
export const AttendanceButtons = ({ invitation, availableStates = [], onChanged, size = "sm" }) => {
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
            setError(e?.message || "Změna stavu se nezdařila")
        } finally {
            setBusyStateId(null)
        }
    }

    if (!availableStates.length) {
        return <span className="text-muted">Žádné dostupné stavy</span>
    }

    return (
        <div className="d-flex flex-wrap gap-1 align-items-center">
            {availableStates.map((st) => {
                const isCurrent = st.id === currentStateId
                const variant = stateVariant(st)
                const className = `btn btn-${size} ${isCurrent ? `btn-${variant}` : `btn-outline-${variant}`}`
                const isBusy = busyStateId === st.id && loading
                return (
                    <button
                        key={st.id}
                        type="button"
                        className={className}
                        disabled={loading || isCurrent}
                        onClick={() => handleClick(st.id)}
                        title={isCurrent ? "Aktuální stav" : `Nastavit stav: ${st.name}`}
                    >
                        {isBusy ? "…" : st.name}
                    </button>
                )
            })}
            {error && <span className="text-danger small ms-2">{error}</span>}
        </div>
    )
}
