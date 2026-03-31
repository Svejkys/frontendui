import { Col } from "./Col";
import { Row } from "./Row";
import { MediumCard } from "./MediumCard";
import { SimpleCardCapsuleRightCorner } from "./CardCapsule";
import { Link } from "./Link";

export const LargeCard = ({ item, children }) => {
    return (
        <Row>
            <Col className="col-3">
                <MediumCard item={item}>
                    <SimpleCardCapsuleRightCorner>
                        <Link className="btn btn-sm border-0" item={item} action="__def">Definice</Link>
                    </SimpleCardCapsuleRightCorner>
                </MediumCard>
            </Col>
            <Col className="col-9">
                {children}
            </Col>
        </Row>
    );
}