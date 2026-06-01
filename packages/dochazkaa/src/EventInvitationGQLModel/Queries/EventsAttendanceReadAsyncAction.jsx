import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

/**
 * Načte stránku událostí i s jejich pozvánkami a stavy — vstup pro plnou
 * docházkovou matici (řádky = události, sloupce = studenti).
 */
const EventsAttendanceQueryStr = `
query eventsAttendancePage($skip: Int, $limit: Int, $orderby: String, $where: EventInputFilter) {
  eventPage(skip: $skip, limit: $limit, orderby: $orderby, where: $where) {
    __typename
    id
    name
    nameEn
    startdate
    enddate
    place
    invitations {
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
`

const EventsAttendanceQuery = createQueryStrLazy(`${EventsAttendanceQueryStr}`)

export const EventsAttendanceReadAsyncAction = createAsyncGraphQLAction2(EventsAttendanceQuery)
