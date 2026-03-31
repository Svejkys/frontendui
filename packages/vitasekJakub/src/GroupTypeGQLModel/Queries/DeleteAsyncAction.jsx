import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const DeleteMutationStr = `
mutation groupTypeDelete($id: UUID!, $lastchange: DateTime!) {
  groupTypeDelete(
    groupType: {id: $id, lastchange: $lastchange}
  ) {
    ...GroupTypeGQLModelDeleteError
    
  }
}

fragment GroupTypeGQLModelDeleteError on GroupTypeGQLModelDeleteError {
  __typename
  Entity {
    ...Large
  }
  msg
  code
  location
}

`
const DeleteMutation = createQueryStrLazy(`${DeleteMutationStr}`, LargeFragment)
export const DeleteAsyncAction = createAsyncGraphQLAction2(DeleteMutation)