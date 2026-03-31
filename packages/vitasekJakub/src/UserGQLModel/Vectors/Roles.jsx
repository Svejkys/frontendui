import { Link as GroupLink } from "../../GroupGQLModel/Components/Link";
import { Link as RoleLink } from "../../RoleGQLModel/Components/Link";

const Role = ({ role }) => {
    return (
        <div>
            {role?.roletype?.name} - <RoleLink item={role} /> <GroupLink item={role?.group} /> ({role?.startdate} to {role?.enddate})
            <hr />
            <pre>{JSON.stringify(role, null, 2)}</pre>
        </div>
    )
}

export const Roles = ({ item }) => {
    const { roles=[] } = item;
    return (
        <div>
            {roles?.map(role => (
                <Role key={role.id} role={role} />
            ))}
        </div>
    )
}