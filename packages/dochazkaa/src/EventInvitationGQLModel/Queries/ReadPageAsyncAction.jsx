import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const ReadPageQueryStr = `
query eventInvitationPage($skip: Int, $limit: Int, $orderby: String, $where: EventInvitationInputFilter) {
  eventInvitationPage(skip: $skip, limit: $limit, orderby: $orderby, where: $where) {
    ...InvitationLarge
  }
}
`

const ReadPageQuery = createQueryStrLazy(`${ReadPageQueryStr}`, LargeFragment)

/**
 * Async akce pro načtení stránky pozvánek.
 *
 * Pro získání všech účastí jedné události použij filtr na `event_id`:
 * @example
 * dispatch(ReadPageAsyncAction({
 *   limit: 500,
 *   where: { event_id: { _eq: eventId } }
 * }))
 */
export const ReadPageAsyncAction = createAsyncGraphQLAction2(ReadPageQuery)
