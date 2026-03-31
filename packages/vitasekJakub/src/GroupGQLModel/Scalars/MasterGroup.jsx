import { BaseUI } from "../../Base"
import { Attribute } from "../../../../_template/src/Base/Components/Attribute"
import { Link } from "../../../../_template/src/Base/Components/Link"

export const MasterGroup = ({ item }) => {
    const { mastergroup } = item || {}
    // const { currentUserRoles=[] } = rbacobject || {}
    return (
        <BaseUI.CardCapsule item={{}} title="Moje role vůči této entitě">
            <Attribute label={"Nadřízený"}>
                <Link item={mastergroup} />
            </Attribute>
        </BaseUI.CardCapsule>
    )
}