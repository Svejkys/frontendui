import { useState } from "react"
import { Lock } from "react-bootstrap-icons"

import { PermissionGate, usePermissionGateContext } from "../../../../dynamic/src/Hooks/useRoles"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks/useAsyncThunkAction"
import { useGQLEntityContext } from "../../../../_template/src/Base/Helpers/GQLEntityProvider"
import { AsyncStateIndicator } from "../../../../_template/src/Base/Helpers/AsyncStateIndicator"
import { Dialog } from "../../../../_template/src/Base/FormControls/Dialog"
import UserInputSearch from "../Components/UserSearch"
import { InsertAsyncAction as InsertInvitationAsyncAction } from "../../EventInvitationGQLModel/Queries/InsertAsyncAction"

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

const AddStudentButtonBody = ({ item, children, ...props }) => {
    const { allowed } = usePermissionGateContext()
    const { reRead } = useGQLEntityContext()

    const [visible, setVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [progress, setProgress] = useState(null)

    const insert = useAsyncThunkAction(InsertInvitationAsyncAction, undefined, { deferred: true })

    const events = collectSemesterEvents(item)

    const handleHide = () => {
        setVisible(false)
        setSelectedUser(null)
        setProgress(null)
    }

    const handleOk = async () => {
        if (submitting) return
        if (!selectedUser?.id || events.length === 0) return

        setSubmitting(true)
        setProgress({ done: 0, total: events.length })
        try {
            // Pro každou událost semestru vytvoříme pozvánku pro vybraného studenta.
            for (const event of events) {
                await insert.run({ eventId: event.id, userId: selectedUser.id })
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

    const okLabel = progress ? `Přidávám… (${progress.done}/${progress.total})` : "Přidat"

    return (
        <>
            <AsyncStateIndicator error={insert.error} loading={submitting} text="Vytvářím pozvánky" />
            <button {...props} onClick={() => setVisible(true)}>{children}</button>
            {visible && (
                <Dialog
                    title="Přidat studenta na všechny události semestru"
                    oklabel={okLabel}
                    cancellabel="Zrušit"
                    onOk={handleOk}
                    onCancel={handleHide}
                >
                    <p>
                        Vyberte studenta. Pozvánka bude vytvořena pro všech <strong>{events.length}</strong>{" "}
                        událostí navázaných na lekce tohoto studijního plánu.
                    </p>
                    <UserInputSearch onSelect={setSelectedUser} />
                    {selectedUser && (
                        <div className="mt-2">
                            Vybraný student: <strong>{selectedUser.fullname}</strong>
                        </div>
                    )}
                    {events.length === 0 && (
                        <div className="text-danger mt-2">
                            Studijní plán nemá žádné lekce s událostí, ke kterým by šlo studenta přidat.
                        </div>
                    )}
                </Dialog>
            )}
        </>
    )
}

/**
 * Tlačítko, které otevře dialog pro výběr studenta a následně vytvoří
 * `eventInvitationInsert` pro vybraného studenta ke všem událostem semestru
 * (tj. ke všem `item.lessons[].event`).
 *
 * @param {Object} params
 * @param {Object} params.item Studijní plán s polem `lessons`.
 * @param {Object} [params.rbacitem] RBAC item pro PermissionGate.
 * @param {React.ReactNode} [params.children="Přidat studenta"] Popisek tlačítka.
 * @returns {JSX.Element}
 */
export const AddStudentButton = ({ item, rbacitem, children = "Přidat studenta", ...props }) => (
    <PermissionGate {...permissions} item={rbacitem}>
        <AddStudentButtonBody item={item} {...props}>
            {children}
        </AddStudentButtonBody>
    </PermissionGate>
)
