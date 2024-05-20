import React, { useEffect } from "react";
import { useLocation, Route, Routes } from "react-router-dom";
import { checkExpToken } from '../features/checkExpToken.js';
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import Index from '../views/Index.js';
import Tables from '../views/examples/Tables.js';
import Modules from '../views/modules/Index.js';
import CreateModule from '../views/modules/Create.js';
import EditModule from '../views/modules/Edit.js';

const tokenExp = process.env.REACT_APP_TOKEN_EXPIRY;

const Admin = () => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Mulai interval untuk memeriksa dan memperbarui token
    // checkExpToken();
    const intervalId = setInterval(() => {
      checkExpToken();
    }, parseInt(tokenExp) * 60 * 1000); // miliseconds

    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;

    // Membersihkan interval saat komponen unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [location]);

  return (
    <>
      <Sidebar />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar />
        <Routes>
          <Route path="/index" element={<Index />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/modules/add" element={<CreateModule />} />
          <Route path="/modules/edit/:id" element={<EditModule />} />
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
