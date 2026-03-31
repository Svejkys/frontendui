import { Link, SimpleCardCapsule } from "../../../../_template/src/Base/Components"
import { Col as Col_ } from "../../../../_template/src/Base/Components/Col"
import { Row } from "../../../../_template/src/Base/Components/Row"

export const RBACObject = ({ item }) => {
    const { currentUserRoles=[] } = item || {}

    return (
        <SimpleCardCapsule title="Moje oprávnění">

            {currentUserRoles.map(role => (
                <Row key={role?.id}>
                    <Col_>
                        <Link item={role?.roletype} />@
                        <Link item={role?.group} />
                    </Col_>
                </Row>
            ))}

        </SimpleCardCapsule>
    )
}