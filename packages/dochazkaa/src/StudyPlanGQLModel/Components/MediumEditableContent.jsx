import { useState } from "react"
import { useDispatch } from "react-redux"
import { UserInputSearch } from "./UserSearch"
import { InsertAsyncAction as InsertInvitationAsyncAction } from "../../EventInvitationGQLModel/Queries/InsertAsyncAction"

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

export const MediumEditableContent = ({ item, program, onSelect, onChange, children }) => {
    const dispatch = useDispatch()
    const [selectedUser, setSelectedUser] = useState(null)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)

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
        if (!selectedUser?.id) return //kdyz vyberu toho usera, tak se posle mutace
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
        } catch (e) {
            setError("Pozvánky se nepodařilo vytvořit.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <h4>Jméno</h4>
            <UserInputSearch onSelect={handleSelect} />
            {children}
        </>
    )
}
