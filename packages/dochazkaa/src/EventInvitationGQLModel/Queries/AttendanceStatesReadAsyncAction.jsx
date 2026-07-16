import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

/**
 * Stavový automat "Docházka" se stavy Pozván / Potvrzeno / Odmítnuto.
 *
 * Stavy se čtou odsud, a ne z `invitation.state.statemachine.states`, protože
 * pozvánka vzniká bez stavu (`stateId: null`). Přes pozvánku by tak nabídka
 * zůstala navždy prázdná a stav by nešlo nastavit.
 */
export const ATTENDANCE_STATEMACHINE_ID = "99db657c-f954-4f7c-a986-e921dba50a53"

const AttendanceStatesQueryStr = `
query attendanceStates($id: UUID!) {
  statemachineById(id: $id) {
    __typename
    id
    name
    states(limit: 100) {
      __typename
      id
      name
      nameEn
      order
    }
  }
}
`

const AttendanceStatesQuery = createQueryStrLazy(`${AttendanceStatesQueryStr}`)

export const AttendanceStatesReadAsyncAction = createAsyncGraphQLAction2(AttendanceStatesQuery)
