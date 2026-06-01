import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

/**
 * Mutace mažící pozvánku.
 */
const DeleteMutationStr = `
mutation eventInvitationDelete($id: UUID!, $lastchange: DateTime!) {
  eventInvitationDelete(invitation: {id: $id, lastchange: $lastchange}) {
    __typename
    ... on EventInvitationGQLModelDeleteError {
      msg
      failed
      code
    }
  }
}
`

const DeleteMutation = createQueryStrLazy(`${DeleteMutationStr}`)

export const DeleteAsyncAction = createAsyncGraphQLAction2(DeleteMutation)
