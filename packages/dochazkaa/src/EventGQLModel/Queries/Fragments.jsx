import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"

const EventFragmentStr = `
fragment Event on EventGQLModel {
  __typename
  id
  lastchange
  created
  name
  nameEn
  startdate
  enddate
  valid
  place
  path
  description

  subevents {
    __typename
    id
    name
    nameEn
    startdate
    enddate
  }

  userInvitations {
    __typename
    id
    lastchange
    userId
    stateId
    user {
      __typename
      id
      fullname
      email
    }
    state {
      __typename
      id
      name
      nameEn
      order
      statemachine {
        __typename
        id
        states {
          __typename
          id
          name
          nameEn
          order
        }
      }
    }
  }
}
`

const MediumFragmentStr = `
fragment Medium on EventGQLModel {
  ...Event
}
`

const LargeFragmentStr = `
fragment Large on EventGQLModel {
  ...Medium
}
`
/*
const RoleFragmentStr = `
fragment Role on EventGQLModel {
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
}
`
*/
/*export const RoleFragment = createQueryStrLazy(`${RoleFragmentStr}`)
export const RBACFragment = createQueryStrLazy(`${RBACFragmentStr}`)
*/
export const EventFragment = createQueryStrLazy(`${EventFragmentStr}`)
export const MediumFragment = createQueryStrLazy(`${MediumFragmentStr}`, EventFragment)
export const LargeFragment = createQueryStrLazy(`${LargeFragmentStr}`, MediumFragment)
