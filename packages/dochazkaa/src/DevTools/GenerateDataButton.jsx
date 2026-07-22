import { useMemo, useState } from "react"
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
 
// Kompaktní tlačítko do řady s ostatními (Upravit / Přidat / Odstranit studenta).
// PŘIDÁ nové studenty do plánu a rovnou jim nastaví stav docházky – jedním
// insertem pozvánky (stejný insert jako "Přidat studenta", jen s vyplněným stateId).
// Studenty, kteří v plánu už jsou, přeskočí => nic nepřepisuje.
// Umístění: packages/dochazkaa/src/DevTools/GenerateDataButton.jsx
import { useAsyncThunkAction } from "../../../dynamic/src/Hooks/useAsyncThunkAction"
import { createAsyncGraphQLAction2 } from "../../../dynamic/src/Core/createAsyncGraphQLAction2"
import { Dialog } from "../../../_template/src/Base/FormControls/Dialog"
import { useGQLEntityContext } from "../../../_template/src/Base/Helpers/GQLEntityProvider"
import { SearchUsersAsyncAction } from "../EventInvitationGQLModel/Queries/SearchUsersAsyncAction"
import { InsertAsyncAction as InvitationInsertAsyncAction } from "../EventInvitationGQLModel/Queries/InsertAsyncAction"
import { classifyState } from "../EventInvitationGQLModel/Components/stateHelpers"
 
/** Dotaz na VŠECHNY stavy – docházkový automat si najdeme sami (bez pevného ID). */
const AllStatesQueryStr = `
query allStatesForGenerator($skip: Int, $limit: Int) {
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
 
/** Ze všech stavů vybere jen: Vedoucí katedry, Žadatel a Proděkan. */
const selectAttendanceStates = (allStates) => {
    const allowedNames = ["Vedoucí katedry", "Žadatel", "Proděkan"]
    return allStates.filter((s) => allowedNames.includes(s?.name))
}
 
/** Unikátní události plánu (stejně jako AddStudentButton: item.lessons[].event). */
const collectSemesterEvents = (item) => {
    const seen = new Set()
    const events = []
    for (const lesson of item?.lessons || []) {
        const event = lesson?.event
        if (event?.id && !seen.has(event.id)) {
            seen.add(event.id)
            events.push(event)
        }
    }
    return events
}
 
/** userId studentů, kteří v plánu už mají aspoň jednu pozvánku (ty přeskočíme). */
const collectExistingUserIds = (item) => {
    const ids = new Set()
    for (const lesson of item?.lessons || []) {
        for (const inv of lesson?.event?.userInvitations || []) {
            if (inv?.userId) ids.add(inv.userId)
        }
    }
    return ids
}
 
const bucketStates = (states) => {
    const buckets = { confirmed: [], declined: [], pending: [], all: states }
    for (const s of states) {
        const c = classifyState(s)
        if (c === "confirmed") buckets.confirmed.push(s)
        else if (c === "declined") buckets.declined.push(s)
        else if (c === "pending") buckets.pending.push(s)
    }
    return buckets
}
 
/** Náhodný stav ze seznamu filtrů (Vedoucí katedry, Žadatel, Proděkan). */
const pickWeightedStateId = (b) => {
    const pool = b.all
    if (!pool || pool.length === 0) return null
    return pool[Math.floor(Math.random() * pool.length)]?.id
}
 
/** Rozpozná "řízenou chybu" nebo pole errors z GraphQL response. */
const findResult = (res) =>
    res?.data?.eventInvitationInsert ?? res?.eventInvitationInsert ?? res

const resultFailed = (res) => {
    // Pokud GraphQL vrátil pole errors
    if (res?.errors && res.errors.length > 0) return true
    const r = findResult(res)
    return String(r?.__typename || "").endsWith("Error") || r?.failed === true
}

const resultMsg = (res) => {
    if (res?.errors && res.errors.length > 0) {
        return res.errors.map((e) => e.message).join("; ")
    }
    return findResult(res)?.msg || "Neznámá GraphQL chyba"
}
 
/**
 * Tlačítko "Vygenerovat data".
 * Přidá do plánu nové studenty a každému rovnou nastaví stav docházky
 * (eventInvitationInsert se stateId). Existující studenty nechá být.
 *
 * @param {Object} props
 * @param {Object} props.item studijní plán (s polem `lessons`)
 * @param {React.ReactNode} [props.children="Vygenerovat data"]
 */
export const GenerateDataButton = ({ item, children = "Vygenerovat data", ...props }) => {
    const [visible, setVisible] = useState(false)
    const [studentCount, setStudentCount] = useState(5)
    const [busy, setBusy] = useState(false)
    const [progress, setProgress] = useState(null)
    const [error, setError] = useState(null)
    const [log, setLog] = useState([])
 
    const { reRead } = useGQLEntityContext()
    const statesAction = useAsyncThunkAction(AllStatesReadAsyncAction, undefined, { deferred: true })
    const usersAction = useAsyncThunkAction(SearchUsersAsyncAction, undefined, { deferred: true })
    const insertAction = useAsyncThunkAction(InvitationInsertAsyncAction, undefined, { deferred: true })
 
    const events = useMemo(() => collectSemesterEvents(item), [item])
    const existingUserIds = useMemo(() => collectExistingUserIds(item), [item])
 
    const addLog = (line) => setLog((prev) => [...prev, line])
 
    const handleHide = () => {
        if (busy) return
        setVisible(false)
        setError(null)
        setLog([])
        setProgress(null)
    }
 
   const handleGenerate = async () => {
    if (busy) return
    setBusy(true)
    setError(null)
    setLog([])
    setProgress(null)

    try {
        if (events.length === 0) {
            throw new Error("Plán nemá žádné výuky (lekce s událostí), ke kterým by šlo studenty přidat.")
        }

        // 1) Stavy docházky – vyfiltrované
        const statesRes = await statesAction.run({ skip: 0, limit: 500 })
        const allStates = statesRes?.data?.statePage ?? []
        const states = selectAttendanceStates(allStates)
        if (states.length === 0) {
            throw new Error("Nenašel jsem vybrané stavy (Vedoucí katedry, Žadatel, Proděkan).")
        }

        // 2) Uživatelé
        const usersRes = await usersAction.run({ pattern: "%", skip: 0, limit: 200 })
        const allUsers = usersRes?.data?.result ?? []
        
        // Vezmeme libovolných X studentů z databáze
        const targetUsers = allUsers.slice(0, studentCount)
        if (targetUsers.length === 0) {
            throw new Error("Nenašli se žádní studenti k přidání.")
        }

        // Vytvoříme si přehled, KDO už MÁ pozvánku na KTEROU událost (eventId_userId)
        const existingMap = new Set()
        for (const lesson of item?.lessons || []) {
            const evId = lesson?.event?.id
            for (const inv of lesson?.event?.userInvitations || []) {
                if (evId && inv?.userId) existingMap.add(`${evId}_${inv.userId}`)
            }
        }

        // 3) Projdeme matici Student × Výuka a doplníme CHYBĚJÍCÍ pozvánky
        const total = targetUsers.length * events.length
        let done = 0, ok = 0, failed = 0
        let firstFailMsg = null
        setProgress({ done, total })

        for (const user of targetUsers) {
            for (const ev of events) {
                const pairKey = `${ev.id}_${user.id}`
                
                // Pokud student u této konkrétní lekce pozvánku ještě nemá, vytvoříme ji!
                if (!existingMap.has(pairKey)) {
                    // Náhodný výběr jednoho ze 3 stavů
                    const randomState = states[Math.floor(Math.random() * states.length)]
                    
                    try {
                        const res = await insertAction.run({ 
                            eventId: ev.id, 
                            userId: user.id, 
                            stateId: randomState.id 
                        })
                        if (resultFailed(res)) {
                            failed += 1
                            if (!firstFailMsg) firstFailMsg = resultMsg(res) || "neznámá chyba"
                        } else {
                            ok += 1
                        }
                    } catch (e) {
                        failed += 1
                        if (!firstFailMsg) firstFailMsg = e?.message || String(e)
                    }
                }
                done += 1
                setProgress({ done, total })
            }
        }

        if (failed > 0) {
            addLog(`Nepovedlo se: ${failed} (${firstFailMsg})`)
        }
        addLog(ok > 0 ? "Hotovo" : "Všichni vybraní studenti již byli kompletně obsazeni.")
        if (ok > 0) reRead?.() // Obnovit matici
    } catch (e) {
        setError(e?.message || String(e))
        addLog("Chyba – viz hláška výše.")
    } finally {
        setBusy(false)
    }
}
 
    const okLabel = busy
        ? progress
            ? `Přidávám… (${progress.done}/${progress.total})`
            : "Přidávám…"
        : "Přidat studenty se stavy"
 
    return (
        <>
            <button {...props} onClick={() => setVisible(true)}>{children}</button>
            {visible && (
                <Dialog
                    title="Vygenerovat studenty"
                    oklabel={okLabel}
                    cancellabel="Zavřít"
                    onOk={handleGenerate}
                    onCancel={handleHide}
                >

                    <div className="mb-2" style={{ maxWidth: 200 }}>
                        <label className="form-label">Kolik studentů přidat?</label>
                        <input
                            type="number" min={1} max={20}
                            className="form-control"
                            value={studentCount}
                            onChange={(e) => setStudentCount(Number(e.target.value))}
                            disabled={busy}
                        />
                    </div>
 
                    {error && (
                        <div className="alert alert-danger mt-2" role="alert" style={{ fontSize: 14 }}>
                            {error}
                        </div>
                    )}
                    {log.length > 0 && (
                        <ul className="mt-2" style={{ fontSize: 14 }}>
                            {log.map((line, idx) => <li key={idx}>{line}</li>)}
                        </ul>
                    )}
                </Dialog>
            )}
        </>
    )
}
 
export default GenerateDataButton