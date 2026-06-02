import { useState } from "react"
import { useMemo } from "react"
import { Row } from "../../../../_template/src/Base/Components/Row"
import { Col } from "../../../../_template/src/Base/Components/Col"
import { CardCapsule } from "../../EventGQLModel/Components/CardCapsule"
import { AttendanceButtons } from "./AttendanceButtons"
import { collectAvailableStates, classifyState, stateVariant } from "./stateHelpers"
import { formatLectureWhen } from "./datetime"

/**
 * Souhrnná čísla (kolik potvrzeno / odmítnuto / čeká) pro jednu událost.
 */
const AttendanceSummary = ({ invitations }) => {
    const counts = useMemo(() => {
        const c = { confirmed: 0, declined: 0, pending: 0, neutral: 0 }
        for (const inv of invitations) c[classifyState(inv?.state)]++
        return c
    }, [invitations])

    return (
        <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="badge bg-secondary">Pozváno: {invitations.length}</span>
            <span className="badge bg-success">Potvrzeno: {counts.confirmed}</span>
            <span className="badge bg-danger">Odmítnuto: {counts.declined}</span>
            <span className="badge bg-secondary">Čeká: {counts.pending + counts.neutral}</span>
        </div>
    )
}

/**
 * Docházková tabulka jedné výuky (přednášky/cvičení).
 *
 * Zobrazí název výuky, kdy probíhá (den + od–do) a místo, a pod tím seznam
 * pozvaných studentů. U každého studenta jsou tlačítka pro potvrzení/odmítnutí
 * účasti (resp. nastavení libovolného stavu ze stavového automatu).
 *
 * @param {object} props
 * @param {object} props.event - událost s polem `invitations`
 * @param {() => void} [props.onChanged] - znovunačtení po změně stavu
 */
export const EventAttendance = ({ event, onChanged }) => {
    const invitations = event?.invitations || []
    const availableStates = useMemo(() => collectAvailableStates(invitations), [invitations])

    const sorted = useMemo(
        () => [...invitations].sort((a, b) =>
            String(a?.user?.fullname ?? "").localeCompare(String(b?.user?.fullname ?? ""), "cs")),
        [invitations]
    )

    return (
        <CardCapsule item={event} title={`Docházka: ${event?.name ?? "Výuka"}`}>
            <div className="mb-2">
                <div className="fs-5 fw-bold">{event?.name || "Bez názvu"}</div>
                <div className="text-muted">{formatLectureWhen(event?.startdate, event?.enddate)}</div>
                {event?.place && <div className="text-muted">Místo: {event.place}</div>}
            </div>

            <AttendanceSummary invitations={invitations} />

            {sorted.length === 0 ? (
                <div className="p-2 text-muted">Na tuto výuku zatím nejsou pozváni žádní studenti.</div>
            ) : (
                <table className="table table-sm align-middle">
                    <thead>
                        <tr>
                            <th style={{ width: "30%" }}>Student</th>
                            <th style={{ width: "20%" }}>Aktuální stav</th>
                            <th>Změnit účast</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((inv) => (
                            <tr key={inv.id}>
                                <td>
                                    <div>{inv?.user?.fullname || inv?.user?.id || "Neznámý student"}</div>
                                    {inv?.user?.email && <div className="small text-muted">{inv.user.email}</div>}
                                </td>
                                <td>
                                    <span className={`badge bg-${stateVariant(inv?.state)}`}>
                                        {inv?.state?.name || "—"}
                                    </span>
                                </td>
                                <td>
                                    <AttendanceButtons
                                        invitation={inv}
                                        availableStates={availableStates}
                                        onChanged={onChanged}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </CardCapsule>
    )
}
