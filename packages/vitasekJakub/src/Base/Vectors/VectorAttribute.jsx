import { CardCapsule, SimpleCardCapsule, SimpleCardCapsuleRightCorner } from "../Components/CardCapsule"
import { NonPriorityAttributeValue } from "../Components/MediumContent"
import { Table } from "../Components/Table"
import { Col } from "../Components/Col"
import { Row } from "../Components/Row"
import { useState } from "react"
import { Link } from "../Components"

export const VectorAttributeFactory = (attribute_name) => ({ item }) => {
    const attribute_value = item?.[attribute_name] || []
    return (
        <Row key={attribute_name}>
            <Col className="col-2"><b>{attribute_name}</b></Col>
            <Col className="col-10">
                <CardCapsule item={item}>
                    <Table data={attribute_value} />
                </CardCapsule>
            </Col>
        </Row>
    )
}

export const VectorAttribute = ({ attribute_name, item }) => {
    const attribute_value = item?.[attribute_name] || []
    return (
        <CardCapsule item={item} header={<Link item={item} action={attribute_name}>{attribute_name+' []'}</Link> }>
            <Table data={attribute_value} />
        </CardCapsule>
    )
}

export const MediumCardVectors = ({ item }) => {
    return (
        <CardCapsule item={item} header={"Vektorové atributy"}>
            {Object.entries(item).map(([attribute_name, attribute_value]) => {
                if (Array.isArray(attribute_value)) {
                    return <VectorAttribute key={attribute_name} attribute_name={attribute_name} item={item} />
                } else {
                    return null
                }
            })}
        </CardCapsule>
    )
}



const isPlainObject = (v) =>
    v !== null &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null);

const SimpleValue = ({ label, value }) => (<><b>{label}</b><br/> {`${value}`} </>)
// const SimpleValue = ({ datarow, name, label, value }) => (
//     <NonPriorityAttributeValue datarow={datarow} name={name} />
// )

const TreeSimpleValues = ({ item }) => {
    return (<Row>
        {Object.entries(item).map(([attribute_name, attribute_value]) => {
            if (attribute_value === null) return null
            if (Array.isArray(attribute_value)) return null
            if (isPlainObject(attribute_value)) return null
            return (
                // <Row key={attribute_name} >
                <Col key={attribute_name} >
                    <SimpleValue datarow={item} name={attribute_name} label={attribute_name} value={attribute_value} />
                </Col>
                // </Row>
            )
        })}
    </Row>)
}

const TreeDict = ({ title, item }) => {
    const [collapsed, setCollapsed] = useState(true)
    const toggle = () => setCollapsed(prev => !prev)

    return (<SimpleCardCapsule title={<>
            {`${title} `}
            <Link item={item} />
            <button className="btn btn-outline-secondary btn-sm btn-link border-0" onClick={toggle}>
                <b> {collapsed?"Open":"Close"}</b>
            </button>
        </>}>
        <TreeSimpleValues item={item} />
        {!collapsed && (<>
            {Object.entries(item).map(([attribute_name, attribute_value]) => {
                if (Array.isArray(attribute_value)) return null
                if (isPlainObject(attribute_value)) return (
                    <TreeDict key={attribute_name} title={attribute_name} item={attribute_value} />       
                )
                return null
            })}
            {Object.entries(item).map(([attribute_name, attribute_value]) => {
                if (Array.isArray(attribute_value)) return (
                    <TreeArray key={attribute_name} title={`${attribute_name}`} items={attribute_value} />
                )
                return null
            })}
        </>)}
    </SimpleCardCapsule>)
}

const TreeArray = ({ title, items }) => {
    const [collapsed, setCollapsed] = useState(true)
    const toggle = () => setCollapsed(prev => !prev)
    return (<SimpleCardCapsule title={<>
            
    {`${title}[${items?.length}]`}
            <button className="btn btn-link btn-sm btn-outline-secondary border-0" onClick={toggle}>
                <b> {collapsed ? "Open" : "Close"}</b>
            </button>
            </>
        }>
        <SimpleCardCapsuleRightCorner>
            <button className="btn btn-sm btn-outline-secondary form-control border-0" onClick={toggle}>
                {collapsed ? "Open" : "Close"}
            </button>
        </SimpleCardCapsuleRightCorner>
        
        {!collapsed && items?.map((item, index) => (
            <TreeDict key={item?.id} title={`${title}[${index}] `} item={item} />
        ))}
    </SimpleCardCapsule>)
}

export const Tree = ({ item }) => {
    return (
        <TreeDict title={"Tree"} item={item} />
        // <CardCapsule item={item} header={"Tree"}>
        //     <TreeDict title={"Tree"} item={item} />
        // </CardCapsule>
    )
}

