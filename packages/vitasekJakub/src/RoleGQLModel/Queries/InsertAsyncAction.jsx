import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation roleInsert(
	$userId: UUID! # null, 
	$groupId: UUID! # null, 
	$roletypeId: UUID! # null, 
	$id: UUID # null, 
	$deputy: Boolean # null, 
	$startdate: DateTime # null, 
	$enddate: DateTime # null
) {
  roleInsert(
	role: {
	userId: $userId, 
	groupId: $groupId, 
	roletypeId: $roletypeId, 
	id: $id, 
	deputy: $deputy, 
	startdate: $startdate, 
	enddate: $enddate}
  ) {
    ... on RoleGQLModel { ...Large }
    ... on RoleGQLModelInsertError { ...RoleGQLModelInsertError }
  }
}

fragment RoleGQLModelInsertError on RoleGQLModelInsertError {
  __typename
  Entity {
  ...Large
}
  msg
  failed
  code
  location
  input
  }
`

const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`, LargeFragment)
export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation)