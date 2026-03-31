import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const ReadPageQueryStr = `
query statePage(
	$skip: Int # how many entities will be ignored, 
	$limit: Int # how many entities will be taken, 
	$orderby: String # name of field which will determite the order, 
	$where: StateWhereFilter # filter
) {
  statePage(
	skip: $skip, 
	limit: $limit, 
	orderby: $orderby, 
	where: $where
  ) {
  ...Large
}
}
`
const ReadPageQuery = createQueryStrLazy(`${ReadPageQueryStr}`, LargeFragment)
export const ReadPageAsyncAction = createAsyncGraphQLAction2(ReadPageQuery)