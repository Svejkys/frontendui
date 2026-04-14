import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"

const LinkFragmentStr = `
fragment Link on EventGQLModel {
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
  }
}
`

const MediumFragmentStr = `
fragment Medium on EventGQLModel {
  ...Link
  rbacobject {
    ...RBRoles
  }
}
`

const LargeFragmentStr = `
fragment Large on EventGQLModel {
  ...Medium
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

export const RBACFragment = createQueryStrLazy(`${RBACFragmentStr}`)
export const LinkFragment = createQueryStrLazy(`${LinkFragmentStr}`)
export const MediumFragment = createQueryStrLazy(`${MediumFragmentStr}`, LinkFragment, RBACFragment)
export const LargeFragment = createQueryStrLazy(`${LargeFragmentStr}`, MediumFragment)