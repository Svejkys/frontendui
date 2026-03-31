import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment, MediumFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { Medium } from "react-bootstrap-icons";

const ReadPageQueryStr = `
query ReadPageQuery($skip: Int, $limit: Int, $where: GroupInputWhereFilter) {
  result: groupPage(skip: $skip, limit: $limit, where: $where) {
    ...Medium
  }
}
`
const ReadPageQuery = createQueryStrLazy(`${ReadPageQueryStr}`, 
    // LargeFragment,
    MediumFragment

)
export const ReadPageAsyncAction = createAsyncGraphQLAction2(ReadPageQuery)