import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

/**
 * Mutace měnící stav pozvánky (`stateId`).
 *
 * Toto je jádro docházkového systému: student (nebo administrátor) tímto
 * potvrzuje nebo odmítá účast na události. Změna stavu = přechod ve stavovém
 * automatu pozvánky.
 */
const UpdateMutationStr = `
mutation eventInvitationUpdate($id: UUID!, $lastchange: DateTime!, $stateId: UUID!) {
  eventInvitationUpdate(invitation: {id: $id, lastchange: $lastchange, stateId: $stateId}) {
    ... on EventInvitationGQLModel { ...InvitationLarge }
    ... on EventInvitationGQLModelUpdateError { ...InvitationError }
  }
}

fragment InvitationError on EventInvitationGQLModelUpdateError {
  __typename
  Entity {
    ...InvitationLarge
  }
  msg
  failed
  code
  location
}
`

const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`, LargeFragment)

export const UpdateAsyncAction = createAsyncGraphQLAction2(
    UpdateMutation,
    updateItemsFromGraphQLResult,
    reduceToFirstEntity
)
