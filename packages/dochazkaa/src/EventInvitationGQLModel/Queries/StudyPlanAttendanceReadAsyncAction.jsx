import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const StudyPlanAttendanceQueryStr = `
query studyPlanAttendance($id: UUID!) {
  studyPlanById(id: $id) {
    __typename
    id
    event {
      __typename
      id
      name
      nameEn
      startdate
      enddate
      subevents {
        __typename
        id
        name
        nameEn
        startdate
        enddate
        place
        userInvitations {
          __typename
          id
          lastchange
          userId
          stateId
          user {
            __typename
            id
            fullname
            email
          }
          state {
            __typename
            id
            name
            nameEn
            order
            statemachine {
              __typename
              id
              states {
                __typename
                id
                name
                nameEn
                order
              }
            }
          }
        }
      }
    }
  }
}
`

const StudyPlanAttendanceQuery = createQueryStrLazy(`${StudyPlanAttendanceQueryStr}`)

export const StudyPlanAttendanceReadAsyncAction = createAsyncGraphQLAction2(StudyPlanAttendanceQuery)
