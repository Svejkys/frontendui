import { useMemo } from "react"
import { CardCapsule } from "../../EventGQLModel/Components/CardCapsule"
import { MatrixCell } from "./MatrixCell"
import { collectAvailableStates, classifyState } from "./stateHelpers"
import { formatLectureShort } from "./datetime"

/**
 * Docházková matice: řádky = výuky (přednášky/cvičení), sloupce = studenti.
 *
 * Každá buňka je průsečík (výuka × student) a obsahuje aktuální stav účasti
 * s možností jej změnit. Spodní řádek shrnuje počet potvrzení na každou výuku.
 *
 * @param {object} props
 * @param {Array<object>} props.events - pole událostí, každá s polem `invitations`
 * @param {() => void} [props.onChanged] - znovunačtení po změně stavu
 * @param {string} [props.title="Docházková matice"]
 */
export const AttendanceMatrix = ({ events = [], onChanged, title = "Docházková matice" }) => {
    // Všechny dostupné stavy napříč všemi pozvánkami
    const availableStates = useMemo(() => {
        const all = events.flatMap((ev) => ev?.invitations || [])
        return collectAvailableStates(all)
    }, [events])

    // Unikátní studenti (sloupce)
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

    // Rychlé vyhledání pozvánky podle (eventId, userId)
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

    const confirmedCount = (ev) =>
        (ev?.invitations || []).filter((inv) => classifyState(inv?.state) === "confirmed").length

    return (
        <CardCapsule item={{}} title={title}>
            <div className="d-flex flex-wrap gap-2 mb-2 small">
                <span><span style={{ color: "#198754", fontWeight: "bold" }}>✓</span> potvrzeno</span>
                <span><span style={{ color: "#dc3545", fontWeight: "bold" }}>✕</span> odmítnuto</span>
                <span><span style={{ color: "#6c757d", fontWeight: "bold" }}>•</span> čeká</span>
            </div>
            <div style={{ overflowX: "auto" }}>
                <table className="table table-sm table-bordered align-middle" style={{ minWidth: 600 }}>
                    <thead>
                        <tr>
                            <th style={{ position: "sticky", left: 0, background: "#fff", minWidth: 200 }}>
                                Výuka \ Student
                            </th>
                            {students.map((s) => (
                                <th key={s.id} style={{ fontSize: "0.78rem", verticalAlign: "bottom" }}>
                                    {s.fullname || s.id}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedEvents.map((ev) => (
                            <tr key={ev.id}>
                                <th style={{ position: "sticky", left: 0, background: "#fff", fontWeight: "normal" }}>
                                    <div className="fw-bold">{ev?.name || "Výuka"}</div>
                                    <div className="small text-muted">{formatLectureShort(ev?.startdate, ev?.enddate)}</div>
                                    <div className="small text-success">Potvrzeno: {confirmedCount(ev)} / {(ev?.invitations || []).length}</div>
                                </th>
                                {students.map((s) => (
                                    <MatrixCell
                                        key={`${ev.id}__${s.id}`}
                                        invitation={lookup.get(`${ev.id}__${s.id}`)}
                                        availableStates={availableStates}
                                        onChanged={onChanged}
                                    />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CardCapsule>
    )
}
