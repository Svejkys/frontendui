import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const DeleteMutationStr = `
mutation stateDelete(
	$lastchange: DateTime! # null, 
	$id: UUID! # null
) {
  stateDelete(
	state: {
	lastchange: $lastchange, 
	id: $id}
  ) {
  ...StateGQLModelDeleteError
}
}

fragment StateGQLModelDeleteError on StateGQLModelDeleteError {
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