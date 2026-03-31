import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";


const InsertMutationStr = `
mutation groupTypeInsert(
	$id: UUID # null, 
	$name: String # null, 
	$nameEn: String # null, 
	$subtypes: [GroupTypeInsertGQLModel!] # null
    $mastertypeId: UUID
) {
  groupTypeInsert(
	groupType: {
	id: $id, 
	name: $name, 
	nameEn: $nameEn, 
    mastertypeId: $mastertypeId,
	subtypes: $subtypes}
  ) {
    __typename
    ... on GroupTypeGQLModel { ...Large }
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
export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation,
    updateItemsFromGraphQLResult, reduceToFirstEntity)