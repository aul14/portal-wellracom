import { Link } from "react-router-dom";
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

const AdminNavbar = () => {
  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
        <div className="px-4">
          <NavbarBrand to="/" tag={Link}>
            <img
              alt="..."
              src={require("../../assets/img/brand/logo.png")}
              style={{ width: '60px', height: '60px' }}
            />
            <span className="navbar-brand-text text-white ml-3" style={{ fontSize: '20px' }}>PT Wellracom Industri Komputindo</span>
          </NavbarBrand>
          <button className="navbar-toggler" id="navbar-collapse-main">
            <span className="navbar-toggler-icon" />
          </button>
        </div>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
