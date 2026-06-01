import { useParams } from "react-router"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks/useAsyncThunkAction"
import { AsyncStateIndicator } from "../../../../_template/src/Base/Helpers/AsyncStateIndicator"
import { EventAttendanceReadAsyncAction } from "../Queries"
import { EventAttendance } from "../Components/EventAttendance"

/**
 * Stránka docházky jedné výuky.
 *
 * Z URL přečte `:id` události, načte ji i s pozvánkami a vykreslí docházkovou
 * tabulku (`EventAttendance`). Po každé změně stavu se data znovu načtou.
 *
 * Route: /dochazka/eventinvitation/event/:id
 */
export const PageEventAttendance = () => {
    const { id } = useParams()
    const { data, loading, error, run } = useAsyncThunkAction(
        EventAttendanceReadAsyncAction,
        { id }
    )

    const event = data?.eventById

    return (
        <div className="container-fluid p-3">
            <AsyncStateIndicator loading={loading} error={error} text="Načítám docházku…" />
            {event && <EventAttendance event={event} onChanged={() => run()} />}
            {!loading && !error && !event && (
                <div className="text-muted">Výuka nenalezena.</div>
            )}
        </div>
    )
}
