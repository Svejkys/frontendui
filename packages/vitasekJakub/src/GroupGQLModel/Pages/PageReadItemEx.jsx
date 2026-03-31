import { ReadItemURI } from "../Components"
import { ReadAsyncAction } from "../Queries"
import { GroupMemberships } from "../Vectors/GroupMemberships"
import { GroupRoles } from "../Vectors/GroupRoles"
import { GroupRolesOn } from "../Vectors/GroupRolesOn"
import { GroupSubgroups } from "../Vectors/GroupSubgroups"
import { PageReadItem } from "./PageReadItem"

export const RolesOnURI = ReadItemURI.replace("view", "roleson")
export const RolesURI = ReadItemURI.replace("view", "roles")
export const SubgroupsURI = ReadItemURI.replace("view", "subgroups")
export const MembershipsURI = ReadItemURI.replace("view", "memberships")
/**
 * Základní obálka pro „read“ stránku entity podle `:id` z routy.
 *
 * Využívá `PageItemBase`, který zajistí:
 * - získání `id` z URL (`useParams`)
 * - načtení entity přes `AsyncActionProvider` pomocí `queryAsyncAction`
 * - vložení navigace (`PageNavbar`)
 *
 * Uvnitř provideru vykreslí `ReadWithComponent`, který si vezme načtený `item`
 * z `useGQLEntityContext()` a zobrazí ho v zadané komponentě (defaultně `LargeCard`).
 *
 * @component
 * @param {object} props
 * @param {Function} [props.queryAsyncAction=ReadAsyncAction]
 *   Async action (např. thunk) pro načtení entity z backendu/GraphQL dle `id`.
 * @param {Object<string, any>} [props]
 *   Další props předané do `ReadWithComponent` (např. `Component`, layout props).
 *
 * @returns {import("react").JSX.Element}
 */
export const PageReadItemRolesOn = ({ queryAsyncAction=ReadAsyncAction}) => (
    <PageReadItem queryAsyncAction={queryAsyncAction} SubPage={GroupRolesOn}/>
)

// export const PageReadItemRoles = ({ queryAsyncAction=ReadAsyncAction}) => (
//     <PageReadItem queryAsyncAction={queryAsyncAction} SubPage={GroupRoles}/>
// )

const CombinedRoles = ({ item }) => <>
    <GroupRoles item={item} />
    <GroupRolesOn item={item} />
</>

export const PageReadItemRoles = ({ queryAsyncAction=ReadAsyncAction}) => (
    <PageReadItem queryAsyncAction={queryAsyncAction} SubPage={CombinedRoles}/>
)

export const PageReadItemSubgroups = ({ queryAsyncAction=ReadAsyncAction}) => (
    <PageReadItem queryAsyncAction={queryAsyncAction} SubPage={GroupSubgroups}/>
)

export const PageReadItemMemberships = ({ queryAsyncAction=ReadAsyncAction}) => (
    <PageReadItem queryAsyncAction={queryAsyncAction} SubPage={GroupMemberships}/>
)

