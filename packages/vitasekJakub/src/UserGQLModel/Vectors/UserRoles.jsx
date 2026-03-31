import { BaseUI } from "../../Base"
import { Attribute } from "../../../../_template/src/Base/Components/Attribute"
import { Table } from "../../../../_template/src/Base/Components/Table"
import { CardCapsule } from "../Components"

export const UserRoles = ({ item, children }) => {
    const { rolesOn=[] } = item || {}

    return (
        <CardCapsule item={item} title="Vedoucí">
            {children}
            <Roles roles={rolesOn} />
            {/* <AllRoles roles={rolesOn} /> */}
        </CardCapsule>
    )
}

export const AllRoles = ({ roles }) => {
    return (
        <>
            {roles.map(role => (
                <Attribute key={role.id} label={role?.roletype?.name || "Role"}>
                    <BaseUI.Link item={role?.user} />
                </Attribute>
            ))}
        </>
    )
}

export const Roles = ({ roles }) => {
    const rectors = roles?.filter(r => r?.roletype?.name === "rektor") || []
    const vicerectors = roles?.filter(r => r?.roletype?.name === "prorektor") || []
    const deans = roles?.filter(r => r?.roletype?.name === "děkan") || []
    const viceDeans = roles?.filter(r => r?.roletype?.name === "proděkan") || []
    const headOfDepartments = roles?.filter(r => r?.roletype?.name === "vedoucí katedry") || []
    return (
        <>
            {headOfDepartments.map(headOfDepartment => (
                <Attribute key={headOfDepartment.id} label="Vedoucí katedry">
                    <BaseUI.Link item={headOfDepartment?.user} />
                </Attribute>
            ))}
            {headOfDepartments.length > 0 && <hr />}    
            {deans.map(dean => (
                <Attribute key={dean.id} label="Děkan">
                    <BaseUI.Link item={dean?.user} />
                </Attribute>
            ))}
            {viceDeans.map(viceDean => (
                <Attribute key={viceDean.id} label="Proděkan">
                    <BaseUI.Link item={viceDean?.user} />
                </Attribute>
            ))}
            {(deans.length > 0 || viceDeans.length > 0) && <hr />}

            {rectors.map(rector => (
                <Attribute key={rector.id} label="Rektor">
                    <BaseUI.Link item={rector?.user} />
                </Attribute>
            ))}
            {vicerectors.map(vicerector => (
                <Attribute key={vicerector.id} label="Prorektor">
                    <BaseUI.Link item={vicerector?.user} />
                </Attribute>
            ))}
            {/* {JSON.stringify(roles.map(r => r?.roletype?.name))} */}
        </>
    )
}

export const UserRolesTable = ({ item, children }) => {
    const { roles=[], rolesOn=[] } = item || {}
    return (
        <CardCapsule item={item} title="Vedoucí">
            {children}
            <Table data={roles} />
            <hr/>
            <Table data={rolesOn} />
        </CardCapsule>
    )
}