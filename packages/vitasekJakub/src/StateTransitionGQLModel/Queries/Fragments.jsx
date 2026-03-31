import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"

const LinkFragmentStr = `
fragment Link on StateTransitionGQLModel  {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId

    name
    nameEn
    sourceId  
  targetId
  statemachineId
}
`

const MediumFragmentStr = `
fragment Medium on StateTransitionGQLModel  {
  ...Link

  createdby { __typename id fullname }
  changedby { __typename id fullname  }
  
  rbacobject {
    ...RBRoles
  }
    source {
    ...State
    }
  target {
    ...State
    }
}

fragment State on StateGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  createdby { __typename id fullname }
  changedby { __typename id fullname  }
  rbacobject { ...RBRoles }
  name
  nameEn
  statemachineId
  writerslistId
  readerslistId
  statemachine { __typename id name }
  order
  sources { __typename id name }
  targets { __typename id name }
  # userCan
  }
`

const LargeFragmentStr = `
fragment Large on StateTransitionGQLModel  {
  ...Medium
  statemachine {
    ...StateMachine
    }
}

fragment StateMachine on StateMachineGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  createdby { __typename id fullname }
  changedby { __typename id fullname }
  rbacobject { ...RBRoles }
  name
  nameEn
  states { __typename id name }
  transitions { __typename id name }
  typeId
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
export const LargeFragment = createQueryStrLazy(`${LargeFragmentStr}`, MediumFragment)
  