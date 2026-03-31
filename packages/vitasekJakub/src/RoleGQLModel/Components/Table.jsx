import { Table as BaseTable, KebabMenu } from "../../../../_template/src/Base/Components/Table" 
import { Link as BaseLink } from "../../../../_template/src/Base/Components/Link" 
import { Link, LinkURI } from "./Link"
import { useNavigate } from "react-router"
import { UpdateLink } from "../Mutations/Update"
import { DeleteButton } from "../Mutations/Delete"

const CellName = ({ row, name }) => (
    <td key={name}>
        <Link item={row} />
    </td>
)

const CellGroup = ({ row, name }) => (
    <td key={name}>
        <BaseLink item={row?.group || {}} />
    </td>
)

const CellUser = ({ row, name }) => (
    <td key={name}>
        <BaseLink item={row?.user || {}} />
    </td>
)

const CellRoleType = ({ row, name }) => (
    <td key={name}>
        <BaseLink item={row?.roletype || {}} />
    </td>
)


const CellTools = ({ row, name }) => {
    const navigate = useNavigate()
    const {id, name: name_}  = row || {}
    return (
        <td>
            <KebabMenu actions={[
                { 
                    // label: "Editovat", 
                    label: "Editovat " + name_, 
                    onClick: () => navigate(`${LinkURI.replace("view", "edit")}${id}`),
                    children: (<UpdateLink item={row} className="form-control btn btn-outline-secondary border-0">Upravit</UpdateLink>)
                    // children: (<UpdateLink item={row} className="btn btn-outline-secondary">{name}</UpdateLink>)
                },
                { 
                    // label: "Editovat", 
                    label: "Smazat " + name_, 
                    onClick: () => navigate(`${LinkURI.replace("view", "edit")}${id}`),
                    children: (<DeleteButton item={row} className="form-control btn btn-outline-secondary border-0">Odstranit</DeleteButton>)
                    // children: (<UpdateLink item={row} className="btn btn-outline-secondary">{name}</UpdateLink>)
                }
            ]} />
        </td>
    )
}

const table_def = {
    "roletype": {
        label: "Typ role",
        component: CellRoleType
    },
    "user": {
        label: "Uživatel",
        component: CellUser
    },
    "group": {
        label: "Skupina",
        component: CellGroup
    },
    
    "tools": {
        label: "Nástroje",
        component: CellTools
    }
}

export const Table = ({ data }) => {
    return (
        <BaseTable data={data} table_def={table_def}/>
    )
}