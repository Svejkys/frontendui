import { createAsyncGraphQLAction, updateItemsFromGraphQLResult } from "@hrbolek/uoisfrontend-gql-shared"

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
      ... on EventInvitationGQLModelInsertError {
      __typename
      msg
      code
      location
    }
  }
}
`

export const InsertAsyncAction = createAsyncGraphQLAction(
    InsertMutationStr,
    updateItemsFromGraphQLResult
)