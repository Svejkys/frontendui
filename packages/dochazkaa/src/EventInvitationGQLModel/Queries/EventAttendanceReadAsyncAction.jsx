import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

/**
 * Dedikovaný dotaz pro docházkovou matici: načte událost (přednášku/cvičení)
 * společně se všemi jejími pozvánkami, u každé pozvánky uživatele a stav účasti.
 *
 * Je záměrně samostatný (nezasahuje do stávajícího Event fragmentu),
 * aby docházková část byla izolovaná a odolná vůči změnám jinde.
 */
const EventAttendanceQueryStr = `
query eventAttendanceById($id: UUID!) {
  eventById(id: $id) {
    __typename
    id
    name
    nameEn
    startdate
    enddate
    place
    description
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
        statemachineId
        statemachine {
          __typename
          id
          name
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

const EventAttendanceQuery = createQueryStrLazy(`${EventAttendanceQueryStr}`)

export const EventAttendanceReadAsyncAction = createAsyncGraphQLAction2(EventAttendanceQuery)
