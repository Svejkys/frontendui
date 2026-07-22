import { createContext, useContext, useMemo } from "react"
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { Table as BaseTable } from "../../../../_template/src/Base/Components/Table"
import { Link } from "./Link"
import { classifyState } from "../../EventInvitationGQLModel/Components/stateHelpers"
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks/useAsyncThunkAction"
 
// Práh pro splnění docházky.
const PASS_THRESHOLD = 0.6
 
/** Dotaz na všechny stavy – ať víme, který stateId znamená "přítomen". */
const AllStatesQueryStr = `
query allStatesForTable($skip: Int, $limit: Int) {
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
 
/** Vybere stavy docházkového automatu (podle názvu / pokrytí). */
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
 * Mapa stateId -> význam ("confirmed"/"declined"/"pending").
 * Stejná logika jako v matici: co jde, rozpozná podle jména; zbytek doplní
 * podle pořadí (čeká → potvrzeno → odmítnuto), aby to sedělo i u nestandardních názvů.
 */
const buildSemanticByStateId = (attendanceStates = []) => {
    const slot = { confirmed: null, declined: null, pending: null }
    const neutrals = []
    for (const s of attendanceStates) {
        const c = classifyState(s)
        if (c === "confirmed" && !slot.confirmed) slot.confirmed = s
        else if (c === "declined" && !slot.declined) slot.declined = s
        else if (c === "pending" && !slot.pending) slot.pending = s
        else neutrals.push(s)
    }
    const sortedNeutral = [...neutrals].sort((a, b) => (a?.order ?? 999) - (b?.order ?? 999))
    let ni = 0
    for (const key of ["pending", "confirmed", "declined"]) {
        if (!slot[key] && ni < sortedNeutral.length) slot[key] = sortedNeutral[ni++]
    }
    const map = new Map()
    if (slot.confirmed) map.set(slot.confirmed.id, "confirmed")
    if (slot.pending) map.set(slot.pending.id, "pending")
    if (slot.declined) map.set(slot.declined.id, "declined")
    return map
}
 
// Sdílíme mapu významů stavů do buněk (BaseTable renderuje buňky jako komponenty).
const SemanticContext = createContext(new Map())
 
const getSubjectName = (row) =>
    row?.event?.name
    || row?.lessons?.find((lesson) => lesson?.event?.name)?.event?.name
    || ""
 
const collectInvitations = (row) =>
    (row?.lessons || []).flatMap((lesson) => lesson?.event?.userInvitations || [])
 
const lessonCount = (row) => {
    const ids = new Set((row?.lessons || []).map((l) => l?.event?.id).filter(Boolean))
    return ids.size || (row?.lessons?.length || 0)
}
 
const studentCount = (row) => {
    const ids = new Set(collectInvitations(row).map((i) => i?.userId).filter(Boolean))
    return ids.size
}
 
/**
 * Spočítá, kolik studentů plán splnilo docházku (≥ prahu) a kolik ne.
 * Docházka studenta = počet jeho "přítomen" / počet výuk v plánu.
 */
const attendanceByStudent = (row, semanticById) => {
    const totalLessons = lessonCount(row)
    const byStudent = new Map()
    for (const inv of collectInvitations(row)) {
        const uid = inv?.userId
        if (!uid) continue
        if (!byStudent.has(uid)) byStudent.set(uid, [])
        byStudent.get(uid).push(inv)
    }
    let pass = 0
    let fail = 0
    for (const invs of byStudent.values()) {
        const present = invs.filter((inv) => semanticById.get(inv?.stateId) === "confirmed").length
        const pct = totalLessons > 0 ? present / totalLessons : 0
        if (pct > PASS_THRESHOLD) pass += 1
        else fail += 1
    }
    return { pass, fail, students: byStudent.size }
}
 
const CellPlan = ({ row }) => (
    <td><Link item={row}>{getSubjectName(row) || row?.id}</Link></td>
)
 
const CellSubject = ({ row }) => <td>{getSubjectName(row)}</td>
 
const CellDate = ({ row, name }) => (
    <td>{row?.[name] ? new Date(row[name]).toLocaleDateString("cs-CZ") : ""}</td>
)
 
const CellLessons = ({ row }) => <td>{lessonCount(row)}</td>
const CellStudents = ({ row }) => <td>{studentCount(row)}</td>
 
/** Docházka: ✅ kolik studentů splnilo (≥ 60 %) a ❌ kolik ne. */
const CellAttendance = ({ row }) => {
    const semanticById = useContext(SemanticContext)
    const { pass, fail, students } = attendanceByStudent(row, semanticById)
    if (students === 0) return <td className="text-muted">—</td>
    return (
        <td style={{ whiteSpace: "nowrap" }}>
            <span style={{ color: "#198754", fontWeight: 600, marginRight: 10 }}>✅ {pass}</span>
            <span style={{ color: "#dc3545", fontWeight: 600 }}>❌ {fail}</span>
        </td>
    )
}
 
const table_def = {
    name:         { label: "Studijní plán", component: CellPlan },
    event:        { label: "Předmět",       component: CellSubject },
    lessonsCount: { label: "Výuk",          component: CellLessons },
    studentsCount:{ label: "Studentů",      component: CellStudents },
    attendance:   { label: "Splnili / nesplnili docházku", component: CellAttendance },
    created:      { label: "Vytvořeno",     component: CellDate },
    lastchange:   { label: "Změněno",       component: CellDate },
}
 
export const Table = ({ data }) => {
    // Stavy načteme jednou pro celou tabulku a mapu významů předáme buňkám.
    const { data: statesData } = useAsyncThunkAction(AllStatesReadAsyncAction, { skip: 0, limit: 500 })
    const semanticById = useMemo(() => {
        const attendanceStates = selectAttendanceStates(statesData?.data?.statePage || [])
        return buildSemanticByStateId(attendanceStates)
    }, [statesData])
 
    return (
        <SemanticContext.Provider value={semanticById}>
            <BaseTable data={data} table_def={table_def} />
        </SemanticContext.Provider>
    )
}