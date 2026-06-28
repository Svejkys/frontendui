import { useMemo } from "react"
import { CardCapsule } from "../../EventGQLModel/Components/CardCapsule"
import { MatrixCell } from "./MatrixCell"
import { collectAvailableStates, classifyState } from "./stateHelpers"
import { formatLectureShort } from "./datetime"
import { UserLink } from "../../../../ug/src/Components/User/UserLink"
 
/**
 * Docházková matice: řádky = studenti, sloupce = výuky (témata).
 *
 * @param {object} props
 * @param {Array<object>} props.events - pole událostí, každá s polem `invitations`
 * @param {() => void} [props.onChanged] - znovunačtení po změně stavu
 * @param {string} [props.title="Docházková matice"]
 */
export const StudentAttendanceMatrix = ({ events = [], onChanged, title = "Docházková matice" }) => {
    const availableStates = useMemo(() => {
        const all = events.flatMap((ev) => ev?.invitations || [])
        return collectAvailableStates(all)
    }, [events])
 
    const students = useMemo(() => {
        const byId = new Map()
        for (const ev of events) {
            for (const inv of ev?.invitations || []) {
                const u = inv?.user
                if (u?.id && !byId.has(u.id)) byId.set(u.id, u)
            }
        }
        return [...byId.values()].sort((a, b) =>
            String(a?.fullname ?? "").localeCompare(String(b?.fullname ?? ""), "cs"))
    }, [events])
 
    const lookup = useMemo(() => {
        const m = new Map()
        for (const ev of events) {
            for (const inv of ev?.invitations || []) {
                m.set(`${ev.id}__${inv?.user?.id}`, inv)
            }
        }
        return m
    }, [events])
 
    const sortedEvents = useMemo(
        () => [...events].sort((a, b) => new Date(a?.startdate || 0) - new Date(b?.startdate || 0)),
        [events]
    )
 
    if (events.length === 0) {
        return (
            <CardCapsule item={{}} title={title}>
                <div className="p-2 text-muted">Žádné výuky k zobrazení.</div>
            </CardCapsule>
        )
    }
 
    if (students.length === 0) {
        return (
            <CardCapsule item={{}} title={title}>
                <div className="p-2 text-muted">K výukám nejsou pozváni žádní studenti.</div>
            </CardCapsule>
        )
    }
 
    const confirmedCountForStudent = (studentId) =>
        sortedEvents.filter((ev) =>
            classifyState(lookup.get(`${ev.id}__${studentId}`)?.state) === "confirmed"
        ).length
 
    return (
        <CardCapsule item={{}} title={title}>
            <div className="d-flex flex-wrap gap-2 mb-2 small">
                <span><span style={{ color: "#198754", fontWeight: "bold" }}>✓</span> potvrzeno</span>
                <span><span style={{ color: "#dc3545", fontWeight: "bold" }}>✕</span> odmítnuto</span>
                <span><span style={{ color: "#6c757d", fontWeight: "bold" }}>•</span> čeká</span>
            </div>
            <div style={{ overflowX: "auto" }}>
                <table className="table table-sm table-bordered align-middle" style={{ tableLayout: "fixed", width: "auto" }}>
                    <thead>
                        <tr>
                            <th style={{ position: "sticky", left: 0, background: "#fff", width: 140 }}>
                                Student \ Výuka
                            </th>
                            {sortedEvents.map((ev) => (
                                <th key={ev.id} style={{ fontSize: "0.78rem", verticalAlign: "bottom", width: 90, tableLayout: "fixed" }}>
                                    <div className="fw-bold">{ev?.name || "Výuka"}</div>
                                    <div className="text-muted">{formatLectureShort(ev?.startdate, ev?.enddate)}</div>
                                </th>
                            ))}
                            <th style={{ fontSize: "0.78rem", verticalAlign: "bottom", width: 60 }}>
                                Celkem
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <th style={{ position: "sticky", left: 0, background: "#fff", fontWeight: "normal", width: 140 }}>
                                    <div className="fw-bold">
                                        <UserLink user={student}>{student.fullname || student.id}</UserLink>
                                    </div>
                                </th>
                                {sortedEvents.map((ev) => (
                                    <MatrixCell
                                        key={`${ev.id}__${student.id}`}
                                        invitation={lookup.get(`${ev.id}__${student.id}`)}
                                        availableStates={availableStates}
                                        onChanged={onChanged}
                                    />
                                ))}
                                <td className="text-center small text-success">
                                    {confirmedCountForStudent(student.id)} / {sortedEvents.length}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CardCapsule>
    )
}