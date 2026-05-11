import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

const UpdateMutationStr = `
mutation eventUpdate($id: UUID!, $lastchange: DateTime!, $name: String, $nameEn: String, $description: String, $startdate: DateTime, $enddate: DateTime) {
  eventUpdate(event: {id: $id, lastchange: $lastchange, name: $name, nameEn: $nameEn, description: $description, startdate: $startdate, enddate: $enddate}) {
    ... on EventGQLModel { ...Large}
    ... on EventGQLModelUpdateError { ...Error }
  }
}

fragment Error on EventGQLModelUpdateError {
  __typename
  Entity {
    ...Large
  }
  msg
  failed
  code
  location
}
`

const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`, LargeFragment)
export const UpdateAsyncAction = createAsyncGraphQLAction2(UpdateMutation, 
    updateItemsFromGraphQLResult, reduceToFirstEntity)