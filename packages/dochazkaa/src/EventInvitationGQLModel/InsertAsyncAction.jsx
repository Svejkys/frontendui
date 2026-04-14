import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const InsertMutationStr = `
mutation eventInvitationInsert(
  $id: UUID
  $eventId: UUID!
  $userId: UUID!
  $valid: Boolean
) {
  eventInvitationInsert(
    eventInvitation: {
      id: $id
      eventId: $eventId
      userId: $userId
      valid: $valid
    }
  ) {
    ... on InsertError { ...InsertError }
    ... on EventInvitationGQLModel { ...Large }
  }
}

fragment InsertError on InsertError {
  __typename
  msg
  failed
  code
  location
  input
}
`;

const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`, LargeFragment);
export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation);