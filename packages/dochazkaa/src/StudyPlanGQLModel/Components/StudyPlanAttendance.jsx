import { useMemo } from "react"
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks/useAsyncThunkAction"
import { AsyncStateIndicator } from "../../../../_template/src/Base/Helpers/AsyncStateIndicator"

/*
 * DOCHÁZKA NA STUDIJNÍ PLÁN – vše v jednom souboru (jednoduchá struktura).
 *
 * Plán -> hodiny (lessons) -> událost (event) -> pozvánky (userInvitations).
 * Každá pozvánka má uživatele (student) a stav (zúčastnil / odmítl / pozván).
 * Matice: řádky = hodiny, sloupce = studenti, buňka = stav (lze měnit).
 *
 * Pozn.: pole se na backendu jmenuje `userInvitations`, ale aliasujeme ho na
 * `invitations`, takže v kódu níže pracujeme s `event.invitations`.
 */

// 1) Dotaz: načti plán s docházkou
const AttendanceQuery = createQueryStrLazy(`
query studyPlanAttendance($id: UUID!) {
  studyPlanById(id: $id) {
    id
    lessons {
      id
      name
      event {
        id
        name
        startdate
        enddate
        invitations: userInvitations {
          id
          lastchange
          user { id fullname }
          state {
            id
            name
            statemachine { states { id name } }
          }
        }
      }
    }
  }
}
`)
const ReadAttendance = createAsyncGraphQLAction2(AttendanceQuery)

// 2) Mutace: změna stavu účasti (potvrdit / odmítnout / ...)
const UpdateMutation = createQueryStrLazy(`
mutation setInvitationState($id: UUID!, $lastchange: DateTime!, $stateId: UUID!) {
  eventInvitationUpdate(invitation: {id: $id, lastchange: $lastchange, stateId: $stateId}) {
    ... on EventInvitationGQLModel { id lastchange state { id name } }
  }
}
`)
const UpdateState = createAsyncGraphQLAction2(UpdateMutation)

// barva buňky podle názvu stavu
const colorFor = (name = "") => {
  const s = name.toLowerCase()
  if (/(potvr|zúčast|zucast|účast|ucast|present|confirm)/.test(s)) return "#d1e7dd"
  if (/(odmít|odmit|nezúčast|nezucast|absen|decline)/.test(s)) return "#f8d7da"
  return "#e9ecef"
}

// formát času výuky: "8.9.2024 14:30–16:00"
const fmtWhen = (start, end) => {
  if (!start) return ""
  const d = new Date(start)
  const e = end ? new Date(end) : null
  const t = (x) => `${String(x.getHours()).padStart(2, "0")}:${String(x.getMinutes()).padStart(2, "0")}`
  const day = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
  return e ? `${day} ${t(d)}–${t(e)}` : `${day} ${t(d)}`
}

export const StudyPlanAttendance = ({ studyPlanId }) => {
  const { data, loading, error, run } = useAsyncThunkAction(ReadAttendance, { id: studyPlanId })
  const { run: setState } = useAsyncThunkAction(UpdateState, undefined, { deferred: true })

  const lessons = useMemo(
    () => (data?.studyPlanById?.lessons || []).filter((l) => l?.event),
    [data]
  )

  // sloupce = unikátní studenti
  const students = useMemo(() => {
    const m = new Map()
    for (const l of lessons)
      for (const inv of l.event.invitations || [])
        if (inv?.user?.id && !m.has(inv.user.id)) m.set(inv.user.id, inv.user)
    return [...m.values()].sort((a, b) => (a.fullname || "").localeCompare(b.fullname || "", "cs"))
  }, [lessons])

  // všechny možné stavy (z automatu) -> nabídka pro přepínání
  const states = useMemo(() => {
    const m = new Map()
    for (const l of lessons)
      for (const inv of l.event.invitations || []) {
        for (const st of inv?.state?.statemachine?.states || [])
          if (st?.id && !m.has(st.id)) m.set(st.id, st)
        if (inv?.state?.id && !m.has(inv.state.id)) m.set(inv.state.id, inv.state)
      }
    return [...m.values()]
  }, [lessons])

  const invOf = (lesson, userId) =>
    (lesson.event.invitations || []).find((i) => i?.user?.id === userId)

  const change = async (inv, stateId) => {
    if (!inv?.id || stateId === inv?.state?.id) return
    await setState({ id: inv.id, lastchange: inv.lastchange, stateId })
    run() // znovu načti
  }

  if (loading) return <AsyncStateIndicator loading={loading} error={error} text="Načítám docházku…" />
  if (error) return <div className="alert alert-danger mt-3">Docházku se nepodařilo načíst.</div>
  if (lessons.length === 0)
    return (
      <div className="alert alert-info mt-3">
        Tento studijní plán nemá hodiny s naplánovanou událostí a pozvánkami,
        takže není co v docházce zobrazit.
      </div>
    )

  return (
    <div className="mt-4">
      <h4>Účast na hodinách</h4>
      <div style={{ overflowX: "auto" }}>
        <table className="table table-bordered table-sm align-middle">
          <thead>
            <tr>
              <th style={{ minWidth: 180 }}>Hodina</th>
              {students.map((s) => (
                <th key={s.id} style={{ fontSize: "0.8rem" }}>{s.fullname}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lessons.map((l) => (
              <tr key={l.id}>
                <th style={{ fontWeight: "normal" }}>
                  <strong>{l.event.name || l.name || "Výuka"}</strong>
                  <div className="small text-muted">{fmtWhen(l.event.startdate, l.event.enddate)}</div>
                </th>
                {students.map((s) => {
                  const inv = invOf(l, s.id)
                  if (!inv) return <td key={s.id} className="text-center text-muted">–</td>
                  return (
                    <td key={s.id} style={{ background: colorFor(inv.state?.name) }}>
                      <select
                        className="form-select form-select-sm"
                        style={{ fontSize: "0.75rem" }}
                        value={inv.state?.id || ""}
                        onChange={(e) => change(inv, e.target.value)}
                      >
                        {states.map((st) => (
                          <option key={st.id} value={st.id}>{st.name}</option>
                        ))}
                      </select>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudyPlanAttendance
