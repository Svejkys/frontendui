import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation membershipInsert(
	$userId: UUID! # null, 
	$groupId: UUID! # null, 
	$id: UUID # null, 
	$startdate: DateTime # null, 
	$enddate: DateTime # null
) {
  membershipInsert(
	membership: {
	userId: $userId, 
	groupId: $groupId, 
	id: $id, 
	startdate: $startdate, 
	enddate: $enddate}
  ) {
    ... on MembershipGQLModel { ...Large }
    ... on InsertError { ...InsertError }
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
`

const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`, LargeFragment)
export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation)