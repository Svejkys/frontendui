import { useParams } from "react-router"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks/useAsyncThunkAction"
import { AsyncStateIndicator } from "../../../../_template/src/Base/Helpers/AsyncStateIndicator"
import { MasterEventChildrenReadAsyncAction, EventsAttendanceReadAsyncAction } from "../Queries"
import { AttendanceMatrix } from "../Components/AttendanceMatrix"

/**
 * Stránka docházkové matice pro JEDEN předmět/master událost.
 *
 * Z URL přečte `:id` master události, načte její `children` (jednotlivé výuky)
 * i s pozvánkami a vykreslí matici (řádky = výuky, sloupce = studenti).
 *
 * Route: /dochazka/eventinvitation/matrix/:id
 */
export const PageAttendanceMatrix = () => {
    const { id } = useParams()
    const { data, loading, error, run } = useAsyncThunkAction(
        MasterEventChildrenReadAsyncAction,
        { id }
    )

    const master = data?.eventById
    const events = master?.children || []

    return (
        <div className="container-fluid p-3">
            <AsyncStateIndicator loading={loading} error={error} text="Načítám docházkovou matici…" />
            {master && (
                <AttendanceMatrix
                    events={events}
                    onChanged={() => run()}
                    title={`Docházková matice: ${master?.name ?? "Předmět"}`}
                />
            )}
            {!loading && !error && !master && (
                <div className="text-muted">Předmět nenalezen.</div>
            )}
        </div>
    )
}

/**
 * Stránka docházkové matice pro stránku posledních událostí (bez parametru).
 *
 * Route: /dochazka/eventinvitation/matrix
 */
export const PageAttendanceMatrixAll = () => {
    const { data, loading, error, run } = useAsyncThunkAction(
        EventsAttendanceReadAsyncAction,
        { limit: 50, orderby: "startdate" }
    )

    const events = data?.eventPage || []

    return (
        <div className="container-fluid p-3">
            <AsyncStateIndicator loading={loading} error={error} text="Načítám docházkovou matici…" />
            {!loading && (
                <AttendanceMatrix
                    events={events}
                    onChanged={() => run()}
                    title="Docházková matice (poslední výuky)"
                />
            )}
        </div>
    )
}
