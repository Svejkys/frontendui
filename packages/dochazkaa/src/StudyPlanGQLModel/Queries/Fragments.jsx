import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { EventFragment } from "../../EventGQLModel/Queries/Fragments"
import { StudyPlanLessonFragment } from "../../StudyPlanLessonGQLModel/Queries/Fragments"

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

export const RoleFragment = createQueryStrLazy(`${RoleFragmentStr}`)
export const RBACFragment = createQueryStrLazy(`${RBACFragmentStr}`)
export const LinkFragment = createQueryStrLazy(`${LinkFragmentStr}`)
export const MediumFragment = createQueryStrLazy(`${MediumFragmentStr}`, LinkFragment, RBACFragment)
export const LargeFragment = createQueryStrLazy(`${LargeFragmentStr}`, MediumFragment, EventFragment, StudyPlanLessonFragment)
  