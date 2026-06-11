import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { LargeFragment } from "./Fragments"
import { updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store"

const InsertMutationStr = `
mutation eventInvitationInsert($id: UUID, $eventId: UUID!, $userId: UUID!, $stateId: UUID) {
  eventInvitationInsert(invitation: {id: $id, eventId: $eventId, userId: $userId, stateId: $stateId}) {
    ... on EventInvitationGQLModel {
      __typename
      id
      lastchange
      eventId
      userId
      stateId
    }
  }
}
`

const InsertMutation = createQueryStrLazy(InsertMutationStr, LargeFragment)

export const InsertAsyncAction = createAsyncGraphQLAction(InsertMutation, updateItemsFromGraphQLResult)
