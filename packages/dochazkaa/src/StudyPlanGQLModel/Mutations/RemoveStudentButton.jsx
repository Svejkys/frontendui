import { useState } from "react"
import { Lock } from "react-bootstrap-icons"
 
import { PermissionGate, usePermissionGateContext } from "../../../../dynamic/src/Hooks/useRoles"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks/useAsyncThunkAction"
import { useGQLEntityContext } from "../../../../_template/src/Base/Helpers/GQLEntityProvider"
import { AsyncStateIndicator } from "../../../../_template/src/Base/Helpers/AsyncStateIndicator"
import { Dialog } from "../../../../_template/src/Base/FormControls/Dialog"
import { DeleteAsyncAction as DeleteInvitationAsyncAction } from "../../EventInvitationGQLModel/Queries/DeleteAsyncAction"
 
const permissions = {
    oneOfRoles: ["studijní administrátor"],
    mode: "absolute",
}
 
/**
 * Z položky studijního plánu vybere unikátní události navázané na jeho lekce
 * (`item.lessons[].event`). Duplicity (stejné `event.id`) jsou odfiltrovány.
 *
 * @param {Object} item Studijní plán s polem `lessons`.
 * @returns {Array<Object>} Pole unikátních událostí semestru.
 */
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
 
/**
 * Ze všech událostí semestru poskládá seznam unikátních studentů (podle userId)
 * a u každého shromáždí jeho pozvánky (id + lastchange potřebné pro smazání).
 *
 * @param {Array<Object>} events Události semestru s polem `userInvitations`.
 * @returns {Array<{userId:string, fullname:string, email?:string, invitations:Array<{id:string,lastchange:any}>}>}
 */
const collectStudents = (events) => {
    const byUser = new Map()
    for (const event of events) {
        for (const inv of event?.userInvitations || []) {
            const uid = inv?.userId || inv?.user?.id
            if (!uid || !inv?.id) continue
            if (!byUser.has(uid)) {
                byUser.set(uid, {
                    userId: uid,
                    fullname: inv?.user?.fullname || uid,
                    email: inv?.user?.email || "",
                    invitations: [],
                })
            }
            byUser.get(uid).invitations.push({ id: inv.id, lastchange: inv.lastchange })
        }
    }
    return [...byUser.values()].sort((a, b) =>
        String(a.fullname).localeCompare(String(b.fullname), "cs"))
}
 
const RemoveStudentButtonBody = ({ item, children, ...props }) => {
    const { allowed } = usePermissionGateContext()
    const { reRead } = useGQLEntityContext()
 
    const [visible, setVisible] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [progress, setProgress] = useState(null)
 
    const del = useAsyncThunkAction(DeleteInvitationAsyncAction, undefined, { deferred: true })
 
    const events = collectSemesterEvents(item)
    const students = collectStudents(events)
    const selectedStudent = students.find((s) => s.userId === selectedUserId) || null
 
    const handleHide = () => {
        setVisible(false)
        setSelectedUserId(null)
        setProgress(null)
    }
 
    const handleOk = async () => {
        if (submitting) return
        if (!selectedStudent || selectedStudent.invitations.length === 0) return
 
        setSubmitting(true)
        setProgress({ done: 0, total: selectedStudent.invitations.length })
        try {
            // Smažeme všechny pozvánky vybraného studenta napříč událostmi semestru.
            for (const inv of selectedStudent.invitations) {
                await del.run({ id: inv.id, lastchange: inv.lastchange })
                setProgress((prev) => ({ ...prev, done: prev.done + 1 }))
            }
            reRead?.()
            handleHide()
        } finally {
            setSubmitting(false)
        }
    }
 
    if (!allowed) {
        const { onClick, ...rest } = props
        return (
            <button {...rest} disabled style={{ opacity: 0.5 }}>
                <Lock /> {children}
            </button>
        )
    }
 
    const okLabel = progress ? `Odebírám… (${progress.done}/${progress.total})` : "Odebrat"
 
    return (
        <>
            <AsyncStateIndicator error={del.error} loading={submitting} text="Mažu pozvánky" />
            <button {...props} onClick={() => setVisible(true)}>{children}</button>
            {visible && (
                <Dialog
                    title="Odebrat studenta ze všech událostí semestru"
                    oklabel={okLabel}
                    cancellabel="Zrušit"
                    onOk={handleOk}
                    onCancel={handleHide}
                >
                    {students.length === 0 ? (
                        <div className="text-muted">
                            K tomuto studijnímu plánu nejsou přidáni žádní studenti.
                        </div>
                    ) : (
                        <>
                            <p>Vyberte studenta, kterého chcete odebrat:</p>
                            <div className="list-group">
                                {students.map((s) => (
                                    <label
                                        key={s.userId}
                                        className="list-group-item d-flex align-items-center gap-2"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <input
                                            type="radio"
                                            name="removeStudent"
                                            className="form-check-input m-0"
                                            checked={selectedUserId === s.userId}
                                            onChange={() => setSelectedUserId(s.userId)}
                                        />
                                        <span>
                                            <strong>{s.fullname}</strong>
                                            {s.email && <span className="text-muted small"> ({s.email})</span>}
                                            <span className="text-muted small"> — {s.invitations.length} pozvánek</span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                            {selectedStudent && (
                                <div className="text-danger mt-2 small">
                                    Smaže se {selectedStudent.invitations.length} pozvánek studenta{" "}
                                    <strong>{selectedStudent.fullname}</strong>. Akce je nevratná.
                                </div>
                            )}
                        </>
                    )}
                </Dialog>
            )}
        </>
    )
}
 
/**
 * Tlačítko, které otevře dialog se seznamem studentů přidaných ke studijnímu
 * plánu a po výběru jednoho z nich smaže všechny jeho pozvánky
 * (`eventInvitationDelete`) napříč událostmi semestru.
 *
 * @param {Object} params
 * @param {Object} params.item Studijní plán s polem `lessons`.
 * @param {Object} [params.rbacitem] RBAC item pro PermissionGate.
 * @param {React.ReactNode} [params.children="Odebrat studenta"] Popisek tlačítka.
 * @returns {JSX.Element}
 */
export const RemoveStudentButton = ({ item, rbacitem, children = "Odebrat studenta", ...props }) => (
    <PermissionGate {...permissions} item={rbacitem}>
        <RemoveStudentButtonBody item={item} {...props}>
            {children}
        </RemoveStudentButtonBody>
    </PermissionGate>
)