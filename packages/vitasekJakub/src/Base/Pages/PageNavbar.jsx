import { Nav, Navbar } from "react-bootstrap"
import { BoxArrowInLeft, BoxArrowRight, HouseFill, PersonCircle } from "react-bootstrap-icons";
import { Link } from "../Components";

export const HomeButton = ({indexURL}) => {
    return (
        <div className="mb-0">
            <ProxyLink to={indexURL} aria-label="Home" className="mr-3">
                <HouseFill size={32} />
            </ProxyLink>                        
        </div>
    )
}

export const PersonButton = ({
    item
}) => {
    return (
        <Nav.Item className="ml-lg-3" style={{ marginLeft: '16px' }}>
            <Link item={item} aria-label="Profile">
                <PersonCircle size={32} />
            </Link>
        </Nav.Item>
    )
}

export const SearchBox = ({handleSearchChange}) => {
    return (
        <Form className="d-flex align-items-center mb-3 mb-lg-0">
            <Row>
                <Col xs="auto">
                    <Form.Control
                        type="text"
                        placeholder="Search"
                        onChange={handleSearchChange}
                    />
                </Col>
            </Row>
        </Form>
    )
}

const DummyComponent = ()=>null
export const PageNavbar = ({
    indexUrl,
    item,
    children,
    handleSearchChange,
    HomeButton: HomeButton_ = DummyComponent,
    PersonButton: PersonButton_ = DummyComponent,
    SearchBox: SearchBox_ = DummyComponent
}) => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav variant="tabs" className="align-items-center w-100 flex-column flex-lg-row">
                    <HomeButton_ indexURL={indexUrl} />
                    <div className="mx-auto d-flex align-items-center flex-column flex-lg-row mb-0">
                        {children}
                    </div>
                    <div className="d-flex flex-column flex-lg-row align-items-center ml-lg-auto">
                        <SearchBox_ handleSearchChange={handleSearchChange} />
                    </div>
                    <PersonButton_ item={item} />
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}