import { Link, useNavigate } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";

import { jwtDecode } from 'jwt-decode';
import { useDispatch } from "react-redux";
import { LogOut, reset } from 'features/AuthSlice';

const AdminNavbar = (props) => {
  const userData = jwtDecode(localStorage.getItem('token').replace(/["']/g, ""));
  let newUrlImage;
  if (userData.data.urlAvatar) {
    let originalUrl = userData.data.urlAvatar;
    let newBaseUrl = process.env.REACT_APP_API_BASE_URL;
    let urlParts = originalUrl.split('/');
    let protocolAndHost = urlParts[0] + '//' + urlParts[2];
    newUrlImage = originalUrl.replace(protocolAndHost, newBaseUrl);
  } else {
    newUrlImage = null;
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/auth/login");
  }

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            Portal Wellracom
          </Link>

          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={newUrlImage ? newUrlImage : require("../../assets/img/theme/user-default.png")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {userData.data.name}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0 text-dark">Welcome!</h6>
                </DropdownItem>

                <DropdownItem divider />
                <DropdownItem href="#" onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-circle-08" />
                  <span>User Profile</span>
                </DropdownItem>
                <DropdownItem href="#" onClick={logout}>
                  <i className="ni ni-button-power" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
