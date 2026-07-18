import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { EventFragment } from "../../EventGQLModel/Queries/Fragments"
import { StudyPlanLessonFragment } from "../../StudyPlanLessonGQLModel/Queries/Fragments"

/*
ReadAsyncAction načítá plán v rozsahu fragmentu `Large`
`event` → hlavní událost plánu (název předmětu v titulku karty),
`lessons` → stavební bloky předmětu; každá lekce nese (přes
StudyPlanLessonFragment) svou událost a její `userInvitations`
— tedy studenty a stavy, ze kterých se staví docházková matice,
`rbacobject.currentUserRoles` → sekce "Moje role" v detailu.
 */

/*
Základní (Link) fragment — identifikace plánu + navázané entity.
`id` + `lastchange` jsou nutné pro update/delete mutace (concurrent
update), `eventId`/`semesterId`/`examId` jsou vazby na okolní modely.
`...Event` a `...StudyPlanLesson` se přibalují z cizích fragmentů
 */
const LinkFragmentStr = `
fragment Link on StudyPlanGQLModel {
__typename
id
lastchange
created
createdbyId
changedbyId
rbacobjectId
semesterId
examId
eventId
event {
  ...Event
}
lessons {
  ...StudyPlanLesson
}
}
`

/*
 * Střední úroveň — základ + RBAC objekt s rolemi přihlášeného uživatele.
 * Z `currentUserRoles` se na stránce vypisuje "Moje role" a dá se podle
 * nich řídit viditelnost editačních tlačítek (zabezpečení aplikace).
 */
const MediumFragmentStr = `
fragment Medium on StudyPlanGQLModel {
  ...Link
  rbacobject {
    ...RBRoles
  }
}
`

const LargeFragmentStr = `
fragment Large on StudyPlanGQLModel {
  ...Medium
}
`

/*
 Plný popis role (kdo, v jaké skupině, od–do).
*/
const RoleFragmentStr = `
fragment Role on RoleGQLModel {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    createdby { id __typename }
    changedby { id __typename }
    rbacobject { id __typename }
    valid
    deputy
    startdate
    enddate
    roletypeId
    userId
    groupId
    roletype { __typename id }
    user { __typename id fullname }
    group { __typename id name }
  }
`

/*
Role PŘIHLÁŠENÉHO uživatele vůči tomuto plánu (`currentUserRoles`):
typ role (administrátor…), skupina
*/
const RBACFragmentStr = `
fragment RBRoles on RBACObjectGQLModel {
  __typename
  id
  currentUserRoles {
    __typename
    id
    lastchange
    valid
    startdate
    enddate
    roletype {
      __typename
      id
      name
    }
    group {
      __typename
      id
      name
      grouptype {
        __typename
        id
        name
      }
    }
  }
}`

export const RoleFragment = createQueryStrLazy(`${RoleFragmentStr}`)
export const RBACFragment = createQueryStrLazy(`${RBACFragmentStr}`)
export const LinkFragment = createQueryStrLazy(`${LinkFragmentStr}`)
export const MediumFragment = createQueryStrLazy(`${MediumFragmentStr}`, LinkFragment, RBACFragment)
export const LargeFragment = createQueryStrLazy(`${LargeFragmentStr}`, MediumFragment, EventFragment, StudyPlanLessonFragment)
  