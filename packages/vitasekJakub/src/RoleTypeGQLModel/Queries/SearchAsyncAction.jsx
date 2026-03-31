import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2"
import { LargeFragment, MediumFragment } from "./Fragments"
import { reduceToFirstEntity } from "../../../../dynamic/src/Store"

const SearchQueryStr = `
query roleTypePage(
	$skip: Int # how many entities will be ignored, 
	$limit: Int # how many entities will be taken, 
	$orderby: String # name of field which will determite the order, 
    $pattern: String
) {
  result: roleTypePage(
	skip: $skip, 
	limit: $limit, 
	orderby: $orderby, 
	where: {name: {_ilike: $pattern}}
  ) {
  ...Medium
}
}
`


export const SearchAsyncActionQuery = createQueryStrLazy(`${SearchQueryStr}`, 
    // LargeFragment,
    MediumFragment
)
export const SearchAsyncAction = createAsyncGraphQLAction2(SearchAsyncActionQuery, reduceToFirstEntity)