import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const DeleteMutationStr = `
mutation studyPlanDelete(
  $id: UUID!
  $lastchange: DateTime!
) {
  studyPlanDelete(
    studyPlan: {
      id: $id
      lastchange: $lastchange
    }
  ) {
    __typename
    Entity {
      ...Large
    }
    msg
    failed
    input
  }
}
`

const DeleteMutation = createQueryStrLazy(`${DeleteMutationStr}`, LargeFragment)

export const DeleteAsyncAction = createAsyncGraphQLAction2(DeleteMutation)
