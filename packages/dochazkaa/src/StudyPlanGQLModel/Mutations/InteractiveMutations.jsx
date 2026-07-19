import { CardCapsule, VectorItemsURI } from "../Components"
import { UpdateButton, UpdateLink } from "./Update"
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink"
import { DeleteButton } from "./Delete"
import { AddStudentButton } from "./AddStudentButton"
import { RemoveStudentButton } from "./RemoveStudentButton"

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
            <AddStudentButton className="btn btn-outline-success" rbacitem={{}} item={item}>Přidat studenta</AddStudentButton>
            <RemoveStudentButton className="btn btn-outline-danger" rbacitem={{}} item={item}>Odstranit studenta</RemoveStudentButton>
        </CardCapsule>
    )
}
