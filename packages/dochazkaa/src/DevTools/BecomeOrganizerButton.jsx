import { useMemo, useState } from "react"
 
// Vloží přihlášenému uživateli organizátorskou pozvánku ke všem výukám plánu,
// kde ji ještě nemá. Tím se stane organizátorem => projde update i delete stavů.
// Umístění: packages/dochazkaa/src/DevTools/BecomeOrganizerButton.jsx
import { useAsyncThunkAction } from "../../../dynamic/src/Hooks/useAsyncThunkAction"
import { Dialog } from "../../../_template/src/Base/FormControls/Dialog"
import { useGQLEntityContext } from "../../../_template/src/Base/Helpers/GQLEntityProvider"
import { useMe } from "../../../shared/src/Components/Me"
import { InsertAsyncAction as InvitationInsertAsyncAction } from "../EventInvitationGQLModel/Queries/InsertAsyncAction"
 
// Natvrdo stanovené id STAVU "organizátor" z backendu (EventInvitationGQLModel.py).
// Když se DB přeseeduje a id se změní, uprav ho tady.
const ORGANIZER_STATE_ID = "3265a488-bbfa-4c59-946c-7a7b059ee4f0"
 
/** Unikátní události plánu (item.lessons[].event). */
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
 
/** Rozpozná "řízenou chybu" z výsledku insert mutace. */
const findResult = (res) =>
    res?.data?.eventInvitationInsert ?? res?.eventInvitationInsert ?? res
const resultFailed = (res) => {
    const r = findResult(res)
    return String(r?.__typename || "").endsWith("Error") || r?.failed === true
}
const resultMsg = (res) => findResult(res)?.msg
 
/**
 * Tlačítko "Stát se organizátorem".
 * Pro každou výuku plánu, kde přihlášený uživatel nemá organizátorskou pozvánku,
 * vloží pozvánku se stavem organizátora. Po dokončení jde měnit i mazat stavy.
 *
 * @param {Object} props
 * @param {Object} props.item studijní plán (s polem `lessons`)
 * @param {React.ReactNode} [props.children="Stát se organizátorem"]
 */
export const BecomeOrganizerButton = ({ item, children = "Stát se organizátorem", ...props }) => {
    const [visible, setVisible] = useState(false)
    const [busy, setBusy] = useState(false)
    const [progress, setProgress] = useState(null)
    const [error, setError] = useState(null)
    const [log, setLog] = useState([])
 
    const { reRead } = useGQLEntityContext()
    const { me } = useMe()
    const insertAction = useAsyncThunkAction(InvitationInsertAsyncAction, undefined, { deferred: true })
 
    const events = useMemo(() => collectSemesterEvents(item), [item])
 
    // Výuky, kde přihlášený uživatel ještě NENÍ organizátor.
    const missing = useMemo(() => {
        if (!me?.id) return events
        return events.filter((ev) => {
            const invs = ev?.userInvitations || []
            return !invs.some((inv) => inv?.userId === me.id && inv?.stateId === ORGANIZER_STATE_ID)
        })
    }, [events, me])
 
    const addLog = (line) => setLog((prev) => [...prev, line])
 
    const handleHide = () => {
        if (busy) return
        setVisible(false)
        setError(null)
        setLog([])
        setProgress(null)
    }
 
    const handleRun = async () => {
        if (busy) return
        setBusy(true)
        setError(null)
        setLog([])
        setProgress(null)
 
        try {
            if (!me?.id) throw new Error("Nepodařilo se zjistit přihlášeného uživatele (me).")
            if (missing.length === 0) throw new Error("U všech výuk už organizátorem jsi.")
 
            const total = missing.length
            let done = 0, ok = 0, failed = 0
            let firstFailMsg = null
            setProgress({ done, total })
 
            for (const ev of missing) {
                try {
                    const res = await insertAction.run({
                        eventId: ev.id,
                        userId: me.id,
                        stateId: ORGANIZER_STATE_ID,
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
                done += 1
                setProgress({ done, total })
            }
 
            addLog(`Staly se organizátorem u výuk: ${ok}`)
            if (failed > 0) addLog(`Nepovedlo se: ${failed} (např. „${firstFailMsg}“)`)
            addLog(ok > 0 ? "Hotovo ✅ – teď půjde měnit i mazat stavy." : "Nic se nezměnilo ❌")
            if (ok > 0) reRead?.()
        } catch (e) {
            setError(e?.message || String(e))
            addLog("Chyba ❌ – viz hláška výše.")
        } finally {
            setBusy(false)
        }
    }
 
    const okLabel = busy
        ? progress
            ? `Zakládám… (${progress.done}/${progress.total})`
            : "Zakládám…"
        : "Stát se organizátorem"
 
    return (
        <>
            <button {...props} onClick={() => setVisible(true)}>{children}</button>
            {visible && (
                <Dialog
                    title="Stát se organizátorem výuk"
                    oklabel={okLabel}
                    cancellabel="Zavřít"
                    onOk={handleRun}
                    onCancel={handleHide}
                >
                    <p style={{ fontSize: 14 }}>
                        Přidá tě jako organizátora k výukám tohoto plánu, kde jím ještě nejsi
                        (<strong>{missing.length}</strong> z {events.length}). Potom projde
                        změna i mazání stavů docházky u všech sloupců.
                    </p>
                    {!me?.id && (
                        <div className="alert alert-warning" style={{ fontSize: 14 }}>
                            Načítám přihlášeného uživatele…
                        </div>
                    )}
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
 
export default BecomeOrganizerButton