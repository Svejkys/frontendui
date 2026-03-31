import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

const UpdateMutationStr = `
mutation userUpdate($id: UUID!, $lastchange: DateTime!, $name: String, $surname: String, $email: String, $valid: Boolean) {
  userUpdate(
    user: {id: $id, lastchange: $lastchange, name: $name, surname: $surname, email: $email, valid: $valid}
  ) {
    ... on UserGQLModel {
      ...User
    }
    ... on UserGQLModelUpdateError {
      ...Error
    }
  }
}

# fragment Role on RoleGQLModel {
#   __typename
#   id
#   lastchange
#   created
#   createdbyId
#   changedbyId
#   rbacobjectId
#   createdby {
#     id
#   }
#   changedby {
#     id
#   }
#   rbacobject {
#     id
#   }
#   valid
#   deputy
#   startdate
#   enddate
#   roletypeId
#   userId
#   groupId
#   roletype {
#     id
#   }
#   user {
#     id
#   }
#   group {
#     id
#   }
# }

fragment User on UserGQLModel {
  __typename
  id
  ...Large
}

fragment Error on UserGQLModelUpdateError {
  __typename
  Entity {
    ...User
  }
  msg
  failed
  code
  location
  input
}
`

const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`, LargeFragment)
export const UpdateAsyncAction = createAsyncGraphQLAction2(UpdateMutation, 
    updateItemsFromGraphQLResult, reduceToFirstEntity)