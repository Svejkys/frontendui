import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { EventFragment } from "../../EventGQLModel/Queries/Fragments"

const StudyPlanLessonFragmentStr = `
fragment StudyPlanLesson on StudyPlanLessonGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  order
  name
  nameEn
  length
  eventId
  event {
  ...Event
}
 
  linkedWithId
  planId

  linkedWith { id }
}
`

const MediumFragmentStr = `
fragment Medium on StudyPlanLessonGQLModel {
  ...StudyPlanLesson
}
`

const LargeFragmentStr = `
fragment Large on StudyPlanLessonGQLModel {
  ...Medium
}
`
/*
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
*/
/* export const RoleFragment = createQueryStrLazy(`${RoleFragmentStr}`)
export const RBACFragment = createQueryStrLazy(`${RBACFragmentStr}`) */

export const StudyPlanLessonFragment = createQueryStrLazy(`${StudyPlanLessonFragmentStr}`)
export const MediumFragment = createQueryStrLazy(`${MediumFragmentStr}`, StudyPlanLessonFragment, EventFragment)
export const LargeFragment = createQueryStrLazy(`${LargeFragmentStr}`, MediumFragment)
  