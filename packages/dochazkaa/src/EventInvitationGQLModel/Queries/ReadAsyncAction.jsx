import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const ReadQueryStr = `
query eventInvitationById($id: UUID!) {
  eventInvitationById(id: $id) {
    ...InvitationLarge
  }
}
`

const ReadQuery = createQueryStrLazy(`${ReadQueryStr}`, LargeFragment)

/**
 * Async akce pro načtení jedné pozvánky podle `id`.
 *
 * @example
 * dispatch(ReadAsyncAction({ id: "..." })).then(r => console.log(r.eventInvitationById))
 */
export const ReadAsyncAction = createAsyncGraphQLAction2(ReadQuery)
