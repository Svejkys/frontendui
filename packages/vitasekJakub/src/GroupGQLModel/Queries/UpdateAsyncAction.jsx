import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

const UpdateMutationStr = `
mutation groupUpdate(
	$id: UUID! # null, 
	$lastchange: DateTime! # null, 
	$name: String # null, 
	$nameEn: String # null, 
	$grouptypeId: UUID # null, 
	$mastergroupId: UUID # null, 
	$valid: Boolean # null, 
	$abbreviation: String # null, 
	$email: String # null
) {
  groupUpdate(
	group: {
	id: $id, 
	lastchange: $lastchange, 
	name: $name, 
	nameEn: $nameEn, 
	grouptypeId: $grouptypeId, 
	mastergroupId: $mastergroupId, 
	valid: $valid, 
	abbreviation: $abbreviation, 
	email: $email}
  ) {
    ... on GroupGQLModel {
      ...Large
    }
    ... on GroupGQLModelUpdateError {
      ...Error
    }
  }
}


fragment Error on GroupGQLModelUpdateError {
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