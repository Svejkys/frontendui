import { CardCapsule, VectorItemsURI } from "../Components"
import { UpdateButton, UpdateLink } from "./Update"
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink"
import { DeleteButton } from "./Delete"
import { AddStudentButton } from "./AddStudentButton"

export const PageLink = ({ children, preserveHash = true, preserveSearch = true, ...props }) => {
    return (
        <ProxyLink
            to={VectorItemsURI}
            preserveHash={preserveHash}
            preserveSearch={preserveSearch}
            {...props}
        >
            {children}
        </ProxyLink>
    );
};


export const InteractiveMutations = ({ item }) => {
    return (
        <CardCapsule item={item} title="Nástroje">
            <UpdateLink className="btn btn-outline-success" item={item}>Upravit</UpdateLink>
            <UpdateButton className="btn btn-outline-success" item={item}>Upravit Dialog</UpdateButton>
            <AddStudentButton className="btn btn-outline-success" rbacitem={{}} item={item}>Přidat studenta</AddStudentButton>
            <DeleteButton className="btn btn-outline-danger" item={item}>Odstranit studenta</DeleteButton>
        </CardCapsule>
    )
}
