import { useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { UserInputSearch } from "./UserSearch"
import { InsertAsyncAction as InsertInvitationAsyncAction } from "../../EventInvitationGQLModel/Queries/InsertAsyncAction"
import { UpdateAsyncAction as UpdateInvitationAsyncAction } from "../../EventInvitationGQLModel/Queries/UpdateAsyncAction"
import {
    ATTENDANCE_STATEMACHINE_ID,
    AttendanceStatesReadAsyncAction,
} from "../../EventInvitationGQLModel/Queries/AttendanceStatesReadAsyncAction"
import { StudentAttendanceMatrix } from "../../EventInvitationGQLModel/Components/StudentAttendanceMatrix"
import { useGQLEntityContext } from "../../../../_template/src/Base/Helpers/GQLEntityProvider"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks/useAsyncThunkAction"
import { useGQLClient } from "../../../../dynamic/src/Store"

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
    // AsyncAction má signaturu (vars, gqlClient) a bez klienta hodí výjimku;
    // useAsyncThunkAction si ho dodává sám, při ručním dispatchi je to na nás.
    const gqlClient = useGQLClient()
    const { reRead } = useGQLEntityContext()
    const [selectedUser, setSelectedUser] = useState(null)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)

    // Neuložené výběry v matici: invitationId → stateId
    const [pendingChanges, setPendingChanges] = useState(() => new Map())
    const [savingAttendance, setSavingAttendance] = useState(false)
    const [attendanceMessage, setAttendanceMessage] = useState(null)
    const [attendanceError, setAttendanceError] = useState(null)

    const lessons = sortLessons(item?.lessons || [])

    const {
        entity: statemachineFromStore,
        data: statesData,
        loading: statesLoading,
        error: statesError,
    } = useAsyncThunkAction(AttendanceStatesReadAsyncAction, { id: ATTENDANCE_STATEMACHINE_ID })

    // `entity` je normalizovaná entita z ItemSlice (tudy si ji bere i AsyncActionProvider).
    // `data` je celá GraphQL odpověď včetně obalu `data` – gqlFetch vrací raw JSON
    // a middleware ho posílá dál nezměněný, proto ta dvojitá `.data`.
    const statemachine = statemachineFromStore || statesData?.data?.statemachineById

    const availableStates = useMemo(() => {
        const states = statemachine?.states || []
        return [...states].sort((a, b) => (a?.order ?? 999) - (b?.order ?? 999))
    }, [statemachine])

    // Pozvánky podle id – potřeba pro uložení (kvůli `lastchange`) i pro
    // rozpoznání, zda se výběr liší od uloženého stavu.
    const invitationsById = useMemo(() => {
        const byId = new Map()
        for (const lesson of lessons) {
            for (const invitation of lesson?.event?.userInvitations || []) {
                if (invitation?.id) byId.set(invitation.id, invitation)
            }
        }
        return byId
    }, [lessons])

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
                    dispatch(InsertInvitationAsyncAction({ eventId, userId: selectedUser.id }, gqlClient))
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

    const handleStage = (invitationId, stateId) => {
        setAttendanceMessage(null)
        setAttendanceError(null)
        setPendingChanges((previous) => {
            const next = new Map(previous)
            const savedStateId = invitationsById.get(invitationId)?.stateId || ""
            // Návrat na uložený stav není změna – ať tlačítko nehlásí víc, než se opravdu pošle.
            if (stateId === savedStateId) next.delete(invitationId)
            else next.set(invitationId, stateId)
            return next
        })
    }

    const handleCancelAttendance = () => {
        setPendingChanges(new Map())
        setAttendanceMessage(null)
        setAttendanceError(null)
    }

    const handleSaveAttendance = async () => {
        if (pendingChanges.size === 0) return
        const changes = [...pendingChanges]
        setSavingAttendance(true)
        setAttendanceMessage(null)
        setAttendanceError(null)
        try {
            await Promise.all(
                changes.map(([invitationId, stateId]) =>
                    dispatch(UpdateInvitationAsyncAction({
                        id: invitationId,
                        lastchange: invitationsById.get(invitationId)?.lastchange,
                        stateId,
                    }, gqlClient))
                )
            )
            setPendingChanges(new Map())
            setAttendanceMessage(`Uloženo ${changes.length} změn.`)
            // Načte data znovu, aby buňky ukazovaly stav potvrzený serverem
            // (včetně nových `lastchange` pro další editaci).
            if (reRead) reRead()
        } catch (e) {
            setAttendanceError(e?.message || "Změny se nepodařilo uložit.")
        } finally {
            setSavingAttendance(false)
        }
    }

    const statesUnavailable = !statesLoading && !statesError && availableStates.length === 0

    return (
        <>
           
            <hr className="my-4" />

            {statesLoading && <div className="text-muted mb-2">Načítám stavy docházky…</div>}
            {statesError && (
                <div className="alert alert-danger">
                    <div>Stavy docházky se nepodařilo načíst, editovat proto nelze.</div>
                    <pre className="mb-0 mt-2 small">{statesError?.message || String(statesError)}</pre>
                </div>
            )}
            <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                <button
                    className="btn btn-primary"
                    onClick={handleSaveAttendance}
                    disabled={pendingChanges.size === 0 || savingAttendance}
                >
                    {savingAttendance
                        ? "Ukládám…"
                        : `Uložit změny${pendingChanges.size > 0 ? ` (${pendingChanges.size})` : ""}`}
                </button>
                <button
                    className="btn btn-outline-secondary"
                    onClick={handleCancelAttendance}
                    disabled={pendingChanges.size === 0 || savingAttendance}
                >
                    Zrušit změny
                </button>
                {pendingChanges.size > 0 && !savingAttendance && (
                    <span className="text-primary small">Máš neuložené změny.</span>
                )}
            </div>
            {attendanceMessage && <div className="alert alert-success">{attendanceMessage}</div>}
            {attendanceError && <div className="alert alert-danger">{attendanceError}</div>}

            <StudentAttendanceMatrix
                events={lessons
                    .filter((lesson) => lesson?.event?.id)
                    .map((lesson) => ({
                        ...lesson.event,
                        name: lesson?.name || lesson.event?.name,
                        invitations: lesson.event?.userInvitations || [],
                    }))}
                title="Docházka - Editace"
                editable={true}
                availableStates={availableStates}
                pendingChanges={pendingChanges}
                onStage={handleStage}
            />

            {children}
        </>
    )
}
