import { Col } from "../../../../_template/src/Base/Components/Col"
import { Row } from "../../../../_template/src/Base/Components/Row"
import { Link } from "./Link"

const SectionTitle = ({ children }) => (
    <Row className="mt-3 mb-2">
        <Col className="col-12">
            <h5>{children}</h5>
        </Col>
    </Row>
)

const formatDate = (value) => {
    if (!value) return ""
    return new Date(value).toLocaleString("cs-CZ")
}

const KeyValueRow = ({ label, value, isLink = false, item = null }) => {
    if (value === null || value === undefined || value === "") return null

    return (
        <Row className="mb-1">
            <Col className="col-4">
                <b>{label}</b>
            </Col>
            <Col className="col-8">
                {isLink && item ? <Link item={item}>{value}</Link> : String(value)}
            </Col>
        </Row>
    )
}

const ObjectList = ({ items, emptyText = "Žádné položky" }) => {
    if (!items || items.length === 0) {
        return <div>{emptyText}</div>
    }

    return (
        <>
            {items.map((subitem, index) => (
                <div key={subitem?.id || index} className="mb-2">
                    <Link item={subitem}>
                        {subitem?.name || subitem?.nameEn || subitem?.id || `Položka ${index + 1}`}
                    </Link>
                </div>
            ))}
        </>
    )
}

export const MediumContent = ({ item, children }) => {
    const subeventsCount = item?.subevents?.length ?? 0
    const userInvitationsCount = item?.userInvitations?.length ?? 0

    return (
        <>
            <SectionTitle>Základní informace</SectionTitle>

            <KeyValueRow label="Typ modelu" value={item?.__typename} />
            <KeyValueRow label="ID" value={item?.id} isLink item={item} />
            <KeyValueRow label="Název" value={item?.name} isLink item={item} />
            <KeyValueRow label="Název EN" value={item?.nameEn} />

            <SectionTitle>Čas a stav</SectionTitle>
            
            <KeyValueRow label="Vytvořeno" value={formatDate(item?.created)} />
            <KeyValueRow label="Poslední změna" value={formatDate(item?.lastchange)} />
            <KeyValueRow label="Začátek" value={formatDate(item?.startdate)} />
            <KeyValueRow label="Konec" value={formatDate(item?.enddate)} />
            <KeyValueRow label="Validní" value={item?.valid} />

            <SectionTitle>Detaily</SectionTitle>

            <KeyValueRow label="Popis" value={item?.description} />
            <KeyValueRow label="Místo" value={item?.place} />
            <KeyValueRow label="Cesta" value={item?.path} />

            <SectionTitle>Souhrn</SectionTitle>

            <KeyValueRow label="Počet subevents" value={subeventsCount} />
            <KeyValueRow label="Počet účastí" value={userInvitationsCount} />

            <SectionTitle>Vazby</SectionTitle>

            <Row className="mb-3">
                <Col className="col-4">
                    <b>Subeventy</b>
                </Col>
                <Col className="col-8">
                    <ObjectList items={item?.subevents} emptyText="Žádné subeventy" />
                </Col>
            </Row>

            <Row className="mb-3">
                <Col className="col-4">
                    <b>Účasti</b>
                </Col>
                <Col className="col-8">
                    <ObjectList items={item?.userInvitations} emptyText="Žádné účasti" />
                </Col>
            </Row>

            {children}
        </>
    )
}