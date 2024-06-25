/*eslint-disable*/
import { useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";

// reactstrap components
import {
    Collapse,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    NavbarBrand,
    Navbar,
    NavItem,
    NavLink,
    Nav,
    Container,
    Row,
    Col,
} from "reactstrap";


var ps;

const Sidebar = (props) => {

    const [collapseOpen, setCollapseOpen] = useState();
    // toggles collapse between opened and closed (true/false)
    const toggleCollapse = () => {
        setCollapseOpen((data) => !data);
    };

    const { bgColor, routes, logo } = props;
    let navbarBrandProps;
    if (logo && logo.innerLink) {
        navbarBrandProps = {
            to: logo.innerLink,
            tag: Link,
        };
    } else if (logo && logo.outterLink) {
        navbarBrandProps = {
            href: logo.outterLink,
            target: "_blank",
        };
    }

    return (
        <Navbar
            className="navbar-vertical fixed-left navbar-light bg-white"
            expand="md"
            id="sidenav-main"
        >
            <Container fluid>
                {/* Toggler */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleCollapse}
                >
                    <span className="navbar-toggler-icon" />
                </button>
                {/* Brand */}
                <NavbarBrand className="pt-0 pb-0" {...navbarBrandProps}>
                    <img
                        alt="..."
                        className="navbar-brand-img"
                        src={require("assets/img/brand/logo.png")}
                    />
                    <span className="navbar-brand-text ml-3">Wellracom</span>
                </NavbarBrand>
                {/* User */}
                <Nav className="align-items-center d-md-none">
                    <UncontrolledDropdown nav>
                        <DropdownToggle nav>
                            <Media className="align-items-center">
                                <span className="avatar avatar-sm rounded-circle">
                                    <img
                                        alt="..."
                                        src={require("assets/img/theme/team-1-800x800.jpg")}
                                    />
                                </span>
                            </Media>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                                <i className="ni ni-button-power" />
                                <span>Logout</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
                {/* Collapse */}
                <Collapse navbar isOpen={collapseOpen}>
                    {/* Collapse header */}
                    <div className="navbar-collapse-header d-md-none">
                        <Row>
                            {logo ? (
                                <Col className="collapse-brand" xs="6">
                                    {logo.innerLink ? (
                                        <Link to={logo.innerLink}>
                                            <img alt={logo.imgAlt} src={logo.imgSrc} />
                                        </Link>
                                    ) : (
                                        <a href={logo.outterLink}>
                                            <img alt={logo.imgAlt} src={logo.imgSrc} />
                                        </a>
                                    )}
                                </Col>
                            ) : null}
                            <Col className="collapse-close" xs="6">
                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    onClick={toggleCollapse}
                                >
                                    <span />
                                    <span />
                                </button>
                            </Col>
                        </Row>
                    </div>
                    {/* Navigation */}
                    <Nav navbar>
                        <NavItem>
                            <NavLink to="/admin/index" tag={NavLinkRRD}>
                                <i className="ni ni-tv-2" />
                                Dashboard
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <hr className="my-1" />
                    <h6 className="navbar-heading text-muted">Management Cuti</h6>
                    <Nav className="md-3" navbar>
                        <NavItem>
                            <NavLink to="/admin/cuti" tag={NavLinkRRD}>
                                <i className="fas fa-book" />
                                List Pengajuan Cuti
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/admin/cuti-waiting" tag={NavLinkRRD}>
                                <i className="ni ni-time-alarm" />
                                Menunggu Approval
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <hr className="my-1" />
                    <h6 className="navbar-heading text-muted">Data Pengajuan Cuti</h6>
                    <Nav className="md-3" navbar>
                        <NavItem>
                            <NavLink to="/admin/cuti-pending" tag={NavLinkRRD}>
                                <i className="ni ni-watch-time" />
                                Pending
                            </NavLink>
                            <NavLink to="/admin/cuti-disetujui" tag={NavLinkRRD}>
                                <i className="ni ni-check-bold" />
                                Disetejui
                            </NavLink>
                            <NavLink to="/admin/cuti-tidak-disetujui" tag={NavLinkRRD}>
                                <i className="ni ni-fat-remove" />
                                Tidak Disetujui
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <Nav className="mb-md-3" navbar>
                        <NavItem>
                            <NavLink to="#" tag={NavLinkRRD}>
                                <i className="fa fa-history" />
                                History Cuti
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    );
};

Sidebar.defaultProps = {
    routes: [{}],
};

Sidebar.propTypes = {
    // links that will be displayed inside the component
    routes: PropTypes.arrayOf(PropTypes.object),
    logo: PropTypes.shape({
        // innerLink is for links that will direct the user within the app
        // it will be rendered as <Link to="...">...</Link> tag
        innerLink: PropTypes.string,
        // outterLink is for links that will direct the user outside the app
        // it will be rendered as simple <a href="...">...</a> tag
        outterLink: PropTypes.string,
        // the image src of the logo
        imgSrc: PropTypes.string.isRequired,
        // the alt for the img
        imgAlt: PropTypes.string.isRequired,
    }),
};

export default Sidebar;
