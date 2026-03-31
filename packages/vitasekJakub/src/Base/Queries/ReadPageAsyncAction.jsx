import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment, MediumFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const ReadPageQueryStr = `
query roleTypePage($skip: Int, $limit: Int, $orderby: String, $where: RoleTypeInputWhereFilter) {
  roleTypePage(skip: $skip, limit: $limit, orderby: $orderby, where: $where) {
    ...Medium
  }
}
`
const ReadPageQuery = createQueryStrLazy(`${ReadPageQueryStr}`, 
    MediumFragment,
    // LargeFragment,
)
export const ReadPageAsyncAction = createAsyncGraphQLAction2(ReadPageQuery)