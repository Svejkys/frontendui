import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

const UpdateMutationStr = `
mutation statemachineUpdate(
	$lastchange: DateTime! # null, 
	$id: UUID! # null, 
	$name: String # null, 
	$nameEn: String # null
) {
  statemachineUpdate(
	statemachine: {
	lastchange: $lastchange, 
	id: $id, 
	name: $name, 
	nameEn: $nameEn}
  ) {
    ... on StateMachineGQLModel { ...Large }
    ... on StateMachineGQLModelUpdateError { ...Error }
  }
}

fragment Error on StateMachineGQLModelUpdateError {
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

const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`, LargeFragment)
export const UpdateAsyncAction = createAsyncGraphQLAction2(UpdateMutation, 
    updateItemsFromGraphQLResult, reduceToFirstEntity)