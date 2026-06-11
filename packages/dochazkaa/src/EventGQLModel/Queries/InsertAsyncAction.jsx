import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { EventFragment } from "./Fragments"
import { updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store"

const InsertMutationStr = `
mutation eventInsert($id: UUID, $name: String, $nameEn: String, $description: String, $startdate: DateTime, $enddate: DateTime) {
  eventInsert(event: {id: $id, name: $name, nameEn: $nameEn, description: $description, startdate: $startdate, enddate: $enddate}) {
    ... on EventGQLModel { ...Event }
  }
}
`

const InsertMutation = createQueryStrLazy(InsertMutationStr, EventFragment)

export const InsertAsyncAction = createAsyncGraphQLAction(InsertMutation, updateItemsFromGraphQLResult)
