import { useState } from "react"
import { useDispatch } from "react-redux"
import { UserInputSearch } from "./UserSearch"
import { InsertAsyncAction as InsertInvitationAsyncAction } from "../../EventInvitationGQLModel/Queries/InsertAsyncAction"
import { StudentAttendanceMatrix } from "../../EventInvitationGQLModel/Components/StudentAttendanceMatrix"
import { useGQLEntityContext } from "../../../../_template/src/Base/Helpers/GQLEntityProvider"

/**
 * Posbírá id všech událostí v načteném studijním plánu:
 * hlavní událost plánu (`eventId`/`event`) i událost každé lekce (`lessons[].eventId`/`event`).
 * Výsledek je deduplikovaný.
 */
const collectEventIds = (item) => {
    const ids = [
        item?.eventId,
        item?.event?.id,
        ...(item?.lessons || []).flatMap((lesson) => [lesson?.eventId, lesson?.event?.id]),
    ].filter(Boolean)
    return [...new Set(ids)]
}

const sortLessons = (lessons = []) => {
    return [...lessons].sort((a, b) => {
        const orderA = a?.order ?? 9999
        const orderB = b?.order ?? 9999
        if (orderA !== orderB) return orderA - orderB
        const dateA = a?.event?.startdate ? new Date(a.event.startdate).getTime() : 0
        const dateB = b?.event?.startdate ? new Date(b.event.startdate).getTime() : 0
        return dateA - dateB
    })
}

export const MediumEditableContent = ({ item, program, onSelect, onChange, children }) => {
    const dispatch = useDispatch()
    const { reRead } = useGQLEntityContext()
    const [selectedUser, setSelectedUser] = useState(null)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)

    const lessons = sortLessons(item?.lessons || [])

    const handleSelect = (user) => {
        setSelectedUser(user)
        setMessage(null)
        setError(null)
        if (onChange) {
            onChange({ target: { id: "selectedUserId", value: user.id } })
        }
        if (onSelect) onSelect(user)
    }

    const handleOk = async () => {
        if (!selectedUser?.id) return
        const eventIds = collectEventIds(item)
        if (eventIds.length === 0) {
            setError("Načtená položka nemá žádné události.")
            return
        }
        setSaving(true)
        setMessage(null)
        setError(null)
        try {
            await Promise.all(
                eventIds.map((eventId) =>
                    dispatch(InsertInvitationAsyncAction({ eventId, userId: selectedUser.id }))
                )
            )
            setMessage(`Vytvořeno ${eventIds.length} pozvánek pro ${selectedUser.fullname || selectedUser.id}.`)
            if (reRead) reRead()
        } catch (e) {
            setError("Pozvánky se nepodařilo vytvořit.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <h4>Přidat studenta</h4>
            <UserInputSearch onSelect={handleSelect} />
            {selectedUser && (
                <div className="mt-2">
                    <span className="me-2">Vybraný: <strong>{selectedUser.fullname || selectedUser.email}</strong></span>
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={handleOk}
                        disabled={saving}
                    >
                        {saving ? "Ukládám..." : "Přidat do všech lekcí"}
                    </button>
                </div>
            )}
            {message && <div className="alert alert-success mt-2">{message}</div>}
            {error && <div className="alert alert-danger mt-2">{error}</div>}

            <hr className="my-4" />

            <StudentAttendanceMatrix
                events={lessons
                    .filter((lesson) => lesson?.event?.id)
                    .map((lesson) => ({
                        ...lesson.event,
                        name: lesson?.name || lesson.event?.name,
                        invitations: lesson.event?.userInvitations || [],
                    }))}
                onChanged={() => reRead?.()}
                title="Docházka - Editace"
                editable={true}
            />

            {children}
        </>
    )
}