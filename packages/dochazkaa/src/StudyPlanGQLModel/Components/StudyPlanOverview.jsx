import UserSearch from "./UserSearch"
import { useState } from "react"
import { useGQLEntityContext } from "../../../../_template/src/Base/Helpers/GQLEntityProvider"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks/useAsyncThunkAction"
import { AttendanceButtons } from "../../EventInvitationGQLModel/Components/AttendanceButtons"
import { classifyState, collectAvailableStates } from "../../EventInvitationGQLModel/Components/stateHelpers"
import { InsertAsyncAction, SearchUsersAsyncAction } from "../../EventInvitationGQLModel/Queries"
import { StudentAttendanceMatrix } from "../../EventInvitationGQLModel/Components/StudentAttendanceMatrix"

const toDate = (value) => {
    if (!value) return null
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

const formatDate = (value) => {
    const date = toDate(value)
    if (!date) return "Datum neni urceno"
    return new Intl.DateTimeFormat("cs-CZ", {
        weekday: "long",
        day: "numeric",
        month: "numeric",
        year: "numeric",
    }).format(date)
}

const formatTime = (value) => {
    const date = toDate(value)
    if (!date) return null
    return new Intl.DateTimeFormat("cs-CZ", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date)
}

const formatTimeRange = (startdate, enddate) => {
    const start = formatTime(startdate)
    const end = formatTime(enddate)
    if (!start) return "Cas neni urcen"
    return end ? `${start} - ${end}` : start
}

const formatWhen = (startdate, enddate) => {
    if (!startdate) return "Termin neni urcen"
    return `${formatDate(startdate)}, ${formatTimeRange(startdate, enddate)}`
}

const sortLessons = (lessons = []) => {
    return [...lessons].sort((a, b) => {
        const orderA = a?.order ?? 9999
        const orderB = b?.order ?? 9999
        if (orderA !== orderB) return orderA - orderB
        return (toDate(a?.event?.startdate)?.getTime() ?? 0) - (toDate(b?.event?.startdate)?.getTime() ?? 0)
    })
}

const getPrimaryEvent = (item, lessons) => {
    return item?.event || lessons.find((lesson) => lesson?.event)?.event || null
}

const getLessonInvitations = (lesson) => lesson?.event?.userInvitations || []

const getInvitationsCount = (lesson) => getLessonInvitations(lesson).length

const labelForAttendanceState = (state) => {
    switch (classifyState(state)) {
        case "confirmed": return "Zúčastním se"
        case "declined": return "Nezúčastním se"
        case "pending": return "Nereaguji"
        default: return state?.name || "Změnit stav"
    }
}

const sortInvitations = (invitations = []) => {
    return [...invitations].sort((a, b) =>
        String(a?.user?.fullname ?? "").localeCompare(String(b?.user?.fullname ?? ""), "cs")
    )
}

const InvitationControls = ({ invitation, availableStates, onChanged, showUser = false }) => (
    <div className="study-plan-invitation-control">
        {showUser && (
            <div className="study-plan-invitation-user">
                {invitation?.user?.fullname || invitation?.user?.email || invitation?.userId || "Neznama osoba"}
            </div>
        )}
        <div className="study-plan-current-state">
            Aktualni stav: <strong>{invitation?.state?.name || "neznamy"}</strong>
        </div>
        <AttendanceButtons
            invitation={invitation}
            availableStates={availableStates}
            onChanged={onChanged}
            labelForState={labelForAttendanceState}
        />
    </div>
)

const InviteUserControl = ({ eventId, onChanged }) => {
    const [pattern, setPattern] = useState("")
    const [users, setUsers] = useState([])
    const [message, setMessage] = useState(null)
    const search = useAsyncThunkAction(SearchUsersAsyncAction, undefined, { deferred: true })
    const insert = useAsyncThunkAction(InsertAsyncAction, undefined, { deferred: true })

    const handleSearch = async () => {
        const value = pattern.trim()
        if (!value) return
        setMessage(null)
        const result = await search.run({ skip: 0, limit: 8, pattern: `%${value}%` })
        setUsers(result?.result || result?.data?.result || [])
    }

    const handleInvite = async (user) => {
        if (!eventId || !user?.id) return
        setMessage(null)
        await insert.run({ eventId, userId: user.id })
        setPattern("")
        setUsers([])
        setMessage(`Pozvanka pro ${user.fullname || user.email || user.id} byla vytvorena.`)
        if (onChanged) onChanged()
    }

    if (!eventId) {
        return <span className="study-plan-no-invitation">Tema nema prirazenou udalost.</span>
    }

    return (
        <details className="study-plan-add-invitation">
            <summary>Pridat pozvanou osobu</summary>
            <div className="study-plan-add-invitation-form">
                <input
                    className="form-control form-control-sm"
                    type="search"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            handleSearch()
                        }
                    }}
                    placeholder="E-mail osoby"
                />
                <UserSearch />  
                <button
                    className="btn btn-sm btn-outline-primary"
                    type="button"
                    disabled={search.loading || !pattern.trim()}
                    onClick={handleSearch}
                >
                    {search.loading ? "Hledam..." : "Vyhledat"}
                </button>
            </div>
            {search.error && <div className="text-danger small mt-1">Vyhledavani se nezdarilo.</div>}
            {insert.error && <div className="text-danger small mt-1">Pozvanku se nepodarilo vytvorit.</div>}
            {message && <div className="text-success small mt-1">{message}</div>}
            {users.length > 0 && (
                <div className="study-plan-user-results">
                    {users.map((user) => (
                        <button
                            key={user.id}
                            className="study-plan-user-result"
                            type="button"
                            disabled={insert.loading}
                            onClick={() => handleInvite(user)}
                        >
                            <span>{user.fullname || user.email || user.id}</span>
                            {user.email && <small>{user.email}</small>}
                        </button>
                    ))}
                </div>
            )}
        </details>
    )
}

const LessonInvitationActions = ({ event, invitations, onChanged }) => {
    const availableStates = collectAvailableStates(invitations)

    if (!invitations.length) {
        return (
            <div className="study-plan-no-invitation-wrap">
                <span className="study-plan-no-invitation">K tomuto tematu nejsou pozvanky.</span>
                <InviteUserControl eventId={event?.id} onChanged={onChanged} />
            </div>
        )
    }

    if (invitations.length === 1) {
        return (
            <InvitationControls
                invitation={invitations[0]}
                availableStates={availableStates}
                onChanged={onChanged}
            />
        )
    }

    return (
        <details className="study-plan-invitations-panel">
            <summary>Upravit ucast pozvanych osob ({invitations.length})</summary>
            <div className="study-plan-invitations-list">
                {sortInvitations(invitations).map((invitation) => (
                    <InvitationControls
                        key={invitation?.id}
                        invitation={invitation}
                        availableStates={availableStates}
                        onChanged={onChanged}
                        showUser
                    />
                ))}
                <InviteUserControl eventId={event?.id} onChanged={onChanged} />
            </div>
        </details>
    )
}

const SummaryItem = ({ label, value }) => (
    <div className="study-plan-summary-item">
        <div className="study-plan-summary-label">{label}</div>
        <div className="study-plan-summary-value">{value}</div>
    </div>
)

const EmptyLessons = () => (
    <div className="study-plan-empty">
        Tento studijni plan zatim nema zadne stavebni bloky.
    </div>
)

const LessonRow = ({ lesson, index, onChanged }) => {
    const event = lesson?.event
    const invitations = getLessonInvitations(lesson)
    const invitationsCount = getInvitationsCount(lesson)
    const title = lesson?.name || event?.name || `Blok ${index + 1}`

    return (
        <article className="study-plan-lesson">
            <div className="study-plan-lesson-index">{lesson?.order ?? index + 1}</div>
            <div className="study-plan-lesson-body">
                <div className="study-plan-lesson-title">{title}</div>
                {event?.name && event.name !== title && (
                    <div className="study-plan-lesson-subtitle">{event.name}</div>
                )}
                <div className="study-plan-lesson-meta">
                    <span>{formatWhen(event?.startdate, event?.enddate)}</span>
                    {event?.place && <span>{event.place}</span>}
                    {lesson?.length && <span>{lesson.length} vyuc. hod.</span>}
                </div>
                <div className="study-plan-lesson-actions">
                    <LessonInvitationActions event={event} invitations={invitations} onChanged={onChanged} />
                </div>
            </div>
            <div className="study-plan-lesson-invitations">
                <strong>{invitationsCount}</strong>
                <span>pozvanych</span>
            </div>
        </article>
    )
}

export const StudyPlanOverview = ({ item }) => {
    const { reRead } = useGQLEntityContext()
    const lessons = sortLessons(item?.lessons || [])
    const primaryEvent = getPrimaryEvent(item, lessons)
    const firstLessonEvent = lessons.find((lesson) => lesson?.event?.startdate)?.event || primaryEvent
    const subjectName = primaryEvent?.name || "Studijni plan"
    const invitationsTotal = lessons.reduce((sum, lesson) => sum + getInvitationsCount(lesson), 0)

    return (
        <section className="study-plan-overview">
            <div className="study-plan-section-head">
                <h3>Stavebni bloky predmetu</h3>
            </div>

            <div className="study-plan-lessons">
                <StudentAttendanceMatrix
                    events={lessons.map((lesson) => ({
                        ...lesson?.event,
                        name: lesson?.name || lesson?.event?.name,
                        invitations: lesson?.event?.userInvitations || [],
                    }))}
                    onChanged={() => reRead?.()} /*Tady změnit na mutaci, aby se updatoval stav*/
                    title="Docházka"
                />
            </div>
        </section>
    )
}
