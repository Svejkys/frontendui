import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { addItemsFromGraphQLResult, reduceToFirstEntity } from "../../../../dynamic/src/Store";

const SearchReadPageQueryStr = `
query ReadPageQuery($skip: Int, $limit: Int, $pattern: String) {
  result: groupPage(skip: $skip, limit: $limit, where: { name: {_ilike: $pattern}}) {
    ...Large
  }
}
`
const SearchPageQuery = createQueryStrLazy(`${SearchReadPageQueryStr}`, LargeFragment)
export const SearchAsyncAction = createAsyncGraphQLAction2(
    SearchPageQuery, reduceToFirstEntity)