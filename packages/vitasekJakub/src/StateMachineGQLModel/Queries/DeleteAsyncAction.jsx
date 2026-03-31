import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const DeleteMutationStr = `
mutation statemachineDelete(
	$lastchange: DateTime! # null, 
	$id: UUID! # null
) {
  statemachineDelete(
	statemachine: {
	lastchange: $lastchange, 
	id: $id}
  ) {
  ...StateMachineGQLModelDeleteError
}
}

fragment StateMachineGQLModelDeleteError on StateMachineGQLModelDeleteError  {
  __typename
  Entity {
    ...Large
  }
  msg
  code
  failed
  location
  input
}
`
const DeleteMutation = createQueryStrLazy(`${DeleteMutationStr}`, LargeFragment)
export const DeleteAsyncAction = createAsyncGraphQLAction2(DeleteMutation)