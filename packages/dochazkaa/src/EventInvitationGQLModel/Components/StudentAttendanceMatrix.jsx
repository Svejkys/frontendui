import { useMemo } from "react"
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { CardCapsule } from "../../EventGQLModel/Components/CardCapsule"
import { MatrixCell } from "./MatrixCell"
import { collectAvailableStates, classifyState } from "./stateHelpers"
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks/useAsyncThunkAction"
import { formatLectureShort } from "./datetime"
import { UserLink } from "../../../../ug/src/Components/User/UserLink"
import { Link as StudyPlanLink } from "../../StudyPlanGQLModel/Components/Link"
 
/**
 * Dotaz na VŠECHNY stavy – ať máme jejich názvy vždy k dispozici a `classifyState`
 * je pozná (i když přijdeme na stránku z jiné stránky, kde stav neměl načtené jméno).
 */
const AllStatesQueryStr = `
query allStatesForMatrix($skip: Int, $limit: Int) {
  statePage(skip: $skip, limit: $limit) {
    __typename
    id
    name
    nameEn
    order
    statemachineId
    statemachine { __typename id name }
  }
}
`
const AllStatesReadAsyncAction = createAsyncGraphQLAction2(createQueryStrLazy(`${AllStatesQueryStr}`))
 
/** Ze všech stavů vybere ty patřící docházkovému automatu (podle názvu / pokrytí ✓✕•). */
const selectAttendanceStates = (allStates = []) => {
    const byMachine = new Map()
    for (const s of allStates) {
        const mid = s?.statemachineId
        if (!mid) continue
        if (!byMachine.has(mid)) byMachine.set(mid, { name: s?.statemachine?.name || "", states: [] })
        byMachine.get(mid).states.push(s)
    }
    let best = null
    let bestScore = -1
    for (const { name, states } of byMachine.values()) {
        const kinds = new Set(states.map((st) => classifyState(st)))
        const coverage = ["confirmed", "declined", "pending"].filter((k) => kinds.has(k)).length
        const nameMatch = /docház|dochaz|attend|účast|ucast/i.test(name) ? 3 : 0
        const score = nameMatch + coverage
        if (score > bestScore || (score === bestScore && best && states.length > best.length)) {
            bestScore = score
            best = states
        }
    }
    return best || []
}
 
/**
DOCHÁZKOVÁ MATICE — rámeček "DOCHÁZKA" na stránce studijního plánu.
Řádky = studenti, sloupce = výuky (témata), buňka = stav účasti.
@param {object} props
@param {Array<object>} props.events 
@param {() => void} [props.onChanged] 
@param {string} [props.title="Docházková matice"]
@param {object} [props.studyPlan] 
@param {Array<object>} [props.availableStates] 
@param {Map<string, string>} [props.pendingChanges]
@param {(invitationId: string, stateId: string) => void} [props.onStage] 
 */
export const StudentAttendanceMatrix = ({
    events = [],
    onChanged,
    title = "Docházková matice",
    editable = false,
    studyPlan,
    availableStates: availableStatesProp,
    pendingChanges,
    onStage,
}) => {
    // Stavy načteme i přes statePage – tím mají vždy názvy a buňky se rozpoznají
    // spolehlivě, i po přechodu z jiné stránky (kde stav neměl načtené jméno).
    const { data: statesData } = useAsyncThunkAction(AllStatesReadAsyncAction, { skip: 0, limit: 500 })
    const loadedStates = useMemo(
        () => selectAttendanceStates(statesData?.data?.statePage || []),
        [statesData]
    )
 
    const availableStates = useMemo(() => {
        if (availableStatesProp?.length) return availableStatesProp
        if (loadedStates.length) return loadedStates
        const all = events.flatMap((ev) => ev?.invitations || [])
        return collectAvailableStates(all)
    }, [availableStatesProp, loadedStates, events])
 
    // Řádky matice: unikátní studenti
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
 
    // Index pozvánek pro O(1) přístup k buňce: klíč "eventId__userId" -> pozvánka.
    // Bez něj by každá buňka procházela všechny pozvánky (O(n) na buňku).
    const lookup = useMemo(() => {
        const m = new Map()
        for (const ev of events) {
            for (const inv of ev?.invitations || []) {
                m.set(`${ev.id}__${inv?.user?.id}`, inv)
            }
        }
        return m
    }, [events])
 
    // Sloupce matice: výuky chronologicky podle začátku.
    const sortedEvents = useMemo(
        () => [...events].sort((a, b) => new Date(a?.startdate || 0) - new Date(b?.startdate || 0)),
        [events]
    )
 
    // Prázdné stavy: bez výuk / bez pozvaných studentů → vysvětlující hláška
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
 
    // Sloupec "Celkem": kolik výuk má student POTVRZENÝCH 
    const confirmedCountForStudent = (studentId) =>
        sortedEvents.filter((ev) =>
            classifyState(lookup.get(`${ev.id}__${studentId}`)?.state) === "confirmed"
        ).length
 
    return (
        <CardCapsule item={{}} title={title}>
            <div className="d-flex flex-wrap gap-2 mb-2 small">
                <span>✅ potvrzeno</span>
                <span>❌ odmítnuto</span>
            </div>
            <div style={{ overflowX: "auto" }}>
                <table className="table table-sm table-bordered align-middle" style={{ tableLayout: "fixed", width: "auto" }}>
                    <thead>
                        <tr>
                            {/* první sloupec drží jména studentů viditelná */}
                            <th style={{ position: "sticky", left: 0, background: "#fff", width: 140 }}>
                                Student \ Výuka
                            </th>
                            {/* Hlavička sloupce: název výuky */}
                            {sortedEvents.map((ev) => (
                                <th key={ev.id} style={{ fontSize: "0.78rem", verticalAlign: "bottom", width: 90, tableLayout: "fixed" }}>
                                    <div className="fw-bold">
                                        {studyPlan?.id
                                            ? <StudyPlanLink item={studyPlan} LinkURI="studyplan/StudyPlanGQLModel/view/">{ev?.name || "Výuka"}</StudyPlanLink>
                                            : (ev?.name || "Výuka")}
                                    </div>
                                    <div className="text-muted">{formatLectureShort(ev?.startdate, ev?.enddate)}</div>
                                </th>
                            ))}
                            <th style={{ fontSize: "0.78rem", verticalAlign: "bottom", width: 60 }}>
                                Celkem
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Jeden řádek = jeden student */}
                        {students.map((student) => (
                            <tr key={student.id}>
                                <th style={{ position: "sticky", left: 0, background: "#fff", fontWeight: "normal", width: 140 }}>
                                    <div className="fw-bold">
                                        <UserLink user={student}>{student.fullname || student.id}</UserLink>
                                    </div>
                                </th>
                                {sortedEvents.map((ev) => {
                                    const invitation = lookup.get(`${ev.id}__${student.id}`)
                                    return (
                                        <MatrixCell
                                            key={`${ev.id}__${student.id}`}
                                            invitation={invitation}
                                            availableStates={availableStates}
                                            editable={editable}
                                            pendingStateId={invitation?.id ? pendingChanges?.get(invitation.id) : undefined}
                                            onStage={onStage}
                                        />
                                    )
                                })}
                                {/* Souhrn řádku: potvrzené / všechny výuky */}
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