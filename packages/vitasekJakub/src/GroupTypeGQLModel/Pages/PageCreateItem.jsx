import { ReadAsyncAction } from "../Queries"
import { Row } from "../../../../_template/src/Base/Components/Row";
import { Col as Col_ } from "../../../../_template/src/Base/Components/Col";
import { LinkURI } from "../Components";
import { PageBase } from "./PageBase";
import { CreateBody } from "../Mutations/Create";

export const PageCreateItem = ({ children, queryAsyncAction=ReadAsyncAction, ...props }) => {
    return (
        <PageBase>
            <Row>
                <Col_></Col_>
                <Col_></Col_>
                <Col_>
                    <CreateBody {...props} />
                </Col_>
                <Col_></Col_>
            </Row>
        </PageBase>
    )
}
