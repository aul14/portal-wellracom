import React, { useEffect } from "react";
import { useLocation, Route, Routes } from "react-router-dom";
import { CheckExpToken } from 'features/CheckExpToken.js';
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import Index from 'views/Index.js';
import Tables from 'views/examples/Tables.js';
import Modules from 'views/modules/Index.js';
import CreateModule from 'views/modules/Create.js';
import EditModule from 'views/modules/Edit.js';
import Permissions from 'views/permissions/Index.js';
import CreatePermission from 'views/permissions/Create.js';
import EditPermission from 'views/permissions/Edit.js';
import Roles from 'views/roles/Index.js';
import CreateRole from 'views/roles/Create.js';
import EditRole from 'views/roles/Edit.js';
import RoleAccess from 'views/roles/RoleAccess.js';
import Users from 'views/users/Index.js';
import CreateUser from 'views/users/Create.js';
import EditUser from 'views/users/Edit.js';
import IndexCuti from 'views/form/cuti/Index.js';
import SidebarCuti from 'views/form/cuti/SidebarCuti.js';

const tokenExp = process.env.REACT_APP_TOKEN_EXPIRY;

const Admin = () => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Mulai interval untuk memeriksa dan memperbarui token
    // CheckExpToken();
    const intervalId = setInterval(() => {
      CheckExpToken();
    }, parseInt(tokenExp) * 60 * 1000); // miliseconds

    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;

    // Membersihkan interval saat komponen unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [location]);

  const isCutiPage = location.pathname === "/admin/cuti";

  return (
    <>
      <Sidebar />
      {isCutiPage ? <SidebarCuti /> : <Sidebar />}
      <div className="main-content" ref={mainContent}>
        <AdminNavbar />
        <Routes>
          <Route path="/index" element={<Index />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/modules/add" element={<CreateModule />} />
          <Route path="/modules/edit/:id" element={<EditModule />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/permissions/add" element={<CreatePermission />} />
          <Route path="/permissions/edit/:id" element={<EditPermission />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/roles/add" element={<CreateRole />} />
          <Route path="/roles/edit/:id" element={<EditRole />} />
          <Route path="/roles/role-access/:id" element={<RoleAccess />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<CreateUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
          <Route path="/cuti" element={<IndexCuti />} />
        </Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
