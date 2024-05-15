import React, { useEffect } from "react";
import { useLocation, Route, Routes } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import Index from '../views/Index.js';
import Tables from '../views/examples/Tables.js';
const Admin = () => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  return (
    <>
      <Sidebar />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar />
        <Routes>
          <Route path="/index" element={<Index />} />
          <Route path="/tables" element={<Tables />} />
        </Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

const AdminHome = () => {
  return <div>Welcome to the Admin Dashboard</div>;
};

export default Admin;
export { AdminHome };
