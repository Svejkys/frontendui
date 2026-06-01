import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

/**
 * Mutace vytvářející novou pozvánku (pozvání studenta na událost).
 */
const InsertMutationStr = `
mutation eventInvitationInsert($id: UUID, $eventId: UUID!, $userId: UUID!, $stateId: UUID) {
  eventInvitationInsert(invitation: {id: $id, eventId: $eventId, userId: $userId, stateId: $stateId}) {
    ... on EventInvitationGQLModel { ...InvitationLarge }
    ... on EventInvitationGQLModelInsertError { ...InvitationInsertError }
  }
}

fragment InvitationInsertError on EventInvitationGQLModelInsertError {
  __typename
  msg
  failed
  code
}
`

const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`, LargeFragment)

export const InsertAsyncAction = createAsyncGraphQLAction2(
    InsertMutation,
    updateItemsFromGraphQLResult,
    reduceToFirstEntity
)
