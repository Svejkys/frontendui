import { useGQLEntityContext } from "../../../../_template/src/Base/Helpers/GQLEntityProvider"
import { StudentAttendanceMatrix } from "../../EventInvitationGQLModel/Components/StudentAttendanceMatrix"

/* Bezpečný převod hodnoty na Date. */
const toDate = (value) => {
    if (!value) return null
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

/*
seřadí lekce (stavební bloky) primárně podle `order`,
sekundárně podle začátku události. Určuje pořadí sloupců matice.
*/
const sortLessons = (lessons = []) => {
    return [...lessons].sort((a, b) => {
        const orderA = a?.order ?? 9999
        const orderB = b?.order ?? 9999
        if (orderA !== orderB) return orderA - orderB
        return (toDate(a?.event?.startdate)?.getTime() ?? 0) - (toDate(b?.event?.startdate)?.getTime() ?? 0)
    })
}

/**
 * HLAVNÍ KOMPONENTA — tohle se vykresluje na view/:id.
 *
 * Tok dat: `item` = studijní plán z fragmentu Large → `sortLessons`
 * seřadí stavební bloky → každá lekce se přemapuje na "událost" pro matici
 * (název lekce má přednost před názvem události, `userInvitations` se
 * přejmenují na `invitations`, jak to matice očekává) → matice vykreslí
 * studenty × výuky. `reRead` z GQL kontextu po každé změně znovu načte plán.
 */
export const StudyPlanOverview = ({ item }) => {
    const { reRead } = useGQLEntityContext()
    const lessons = sortLessons(item?.lessons || [])

    return (
        <section className="study-plan-overview">
            <div className="study-plan-section-head">
                <h3>Předmět a jeho hodiny v semestru</h3>
            </div>

            <div className="study-plan-lessons">
                <StudentAttendanceMatrix
                    events={lessons.map((lesson) => ({
                        ...lesson?.event,
                        name: lesson?.name || lesson?.event?.name,
                        invitations: lesson?.event?.userInvitations || [],
                    }))}
                    onChanged={() => reRead?.()}
                    title="Docházka"
                    studyPlan={item}
                />
            </div>
        </section>
    )
}
