import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks/useAsyncThunkAction"
import { AsyncStateIndicator } from "../../../../_template/src/Base/Helpers/AsyncStateIndicator"
import { StudyPlanAttendanceReadAsyncAction } from "../Queries/StudyPlanAttendanceReadAsyncAction"
import { AttendanceMatrix } from "./AttendanceMatrix"

/**
 * Docházková matice pro studijní plán.
 *
 * Načte studijní plán podle `studyPlanId`, z něj získá master událost a její
 * podřízené výuky (`children`) i s pozvánkami, a vykreslí docházkovou matici.
 *
 * @param {object} props
 * @param {string} props.studyPlanId - UUID studijního plánu
 */
export const StudyPlanAttendance = ({ studyPlanId }) => {
    const { data, loading, error, run } = useAsyncThunkAction(
        StudyPlanAttendanceReadAsyncAction,
        { id: studyPlanId }
    )

    const masterEvent = data?.studyPlanById?.event
    const events = (masterEvent?.subevents || []).map((ev) => ({
        ...ev,
        invitations: ev?.userInvitations || [],
    }))

    return (
        <>
            <AsyncStateIndicator loading={loading} error={error} text="Načítám docházku studijního plánu…" />
            {masterEvent && (
                <AttendanceMatrix
                    events={events}
                    onChanged={() => run()}
                    title={`Docházka: ${masterEvent?.name ?? "Studijní plán"}`}
                />
            )}
            {!loading && !error && !masterEvent && studyPlanId && (
                <div className="p-2 text-muted">Studijní plán nemá přiřazenou výuku.</div>
            )}
        </>
    )
}
