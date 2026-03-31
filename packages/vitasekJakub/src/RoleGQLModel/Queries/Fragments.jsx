import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"

const LinkFragmentStr = `
fragment Link on RoleGQLModel {
  __typename
  id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    valid
    deputy
    startdate
    enddate
    roletypeId
    userId
    groupId
    roletype { __typename id name }
}
`

const MediumFragmentStr = `
fragment Medium on RoleGQLModel {
  ...Link

    createdby { id __typename }
    changedby { id __typename }
    rbacobject { id __typename }

    user { __typename id fullname }
    group { __typename id name }

  rbacobject {
    ...RBRoles
  }
}
`

const LargeFragmentStr = `
fragment Large on RoleGQLModel {
  ...Medium
  group {
    __typename id name
    roles {
        __typename
        id
        created
        lastchange
        roletypeId
        roletype { __typename id name }
        userId
        user { __typename id fullname }
        groupId
        group { __typename id name }
        changedby { __typename id fullname }
        createdby { __typename id fullname }
    }
  }
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
    createdby { id __typename fullname}
    changedby { id __typename fullname}
    rbacobject { id __typename }
    valid
    deputy
    startdate
    enddate
    roletypeId
    userId
    groupId
    roletype { __typename id name }
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
export const LargeFragment = createQueryStrLazy(`${LargeFragmentStr}`, MediumFragment )
  