import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation statemachineInsert(
	$name: String! # null, 
	$rbacobjectId: UUID! # null, 
	$nameEn: String # null, 
	$id: UUID # null, 
	$states: [StateInsertGQLModel!] # null, 
	$transitions: [StatetransitionInsertGQLModel!] # null
) {
  statemachineInsert(
	statemachine: {
	name: $name, 
	rbacobjectId: $rbacobjectId, 
	nameEn: $nameEn, 
	id: $id, 
	states: $states, 
	transitions: $transitions}
  ) {
    ... on StateMachineGQLModel { ...Large }
    ... on StateMachineGQLModelInsertError { ...StateMachineGQLModelInsertError }
  }
}


fragment StateMachineGQLModelInsertError on StateMachineGQLModelInsertError {
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