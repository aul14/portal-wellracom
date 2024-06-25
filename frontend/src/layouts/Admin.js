import React, { useEffect } from "react";
import { useLocation, Route, Routes } from "react-router-dom";
import { CheckExpToken } from 'features/CheckExpToken';
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar";
import AdminFooter from "components/Footers/AdminFooter";
import Sidebar from "components/Sidebar/Sidebar";

import Index from 'views/Index';
import Tables from 'views/examples/Tables';
import Modules from 'views/modules/Index';
import CreateModule from 'views/modules/Create';
import EditModule from 'views/modules/Edit';
import Permissions from 'views/permissions/Index';
import CreatePermission from 'views/permissions/Create';
import EditPermission from 'views/permissions/Edit';
import Roles from 'views/roles/Index';
import CreateRole from 'views/roles/Create';
import EditRole from 'views/roles/Edit';
import RoleAccess from 'views/roles/RoleAccess';
import Users from 'views/users/Index';
import CreateUser from 'views/users/Create';
import EditUser from 'views/users/Edit';
import IndexCuti from 'views/form/cuti/Index';
import CreateCuti from 'views/form/cuti/Create';
import IndexCutiWaiting from 'views/form/cuti/IndexWaiting';
import IndexCutiPending from 'views/form/cuti/IndexPending';
import IndexCutiDisetujui from 'views/form/cuti/IndexDisetujui';
import IndexCutiTidakDisetujui from 'views/form/cuti/IndexTidakDisetujui';
import SidebarCuti from 'views/form/cuti/SidebarCuti';

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

  const isCutiPage = location.pathname === "/admin/cuti" || location.pathname === "/admin/cuti/add" || location.pathname === "/admin/cuti-waiting" || location.pathname === "/admin/cuti-pending" || location.pathname === "/admin/cuti-disetujui" || location.pathname === "/admin/cuti-tidak-disetujui";

  return (
    <>
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
          <Route path="/cuti/add" element={<CreateCuti />} />
          <Route path="/cuti-waiting" element={<IndexCutiWaiting />} />
          <Route path="/cuti-pending" element={<IndexCutiPending />} />
          <Route path="/cuti-disetujui" element={<IndexCutiDisetujui />} />
          <Route path="/cuti-tidak-disetujui" element={<IndexCutiTidakDisetujui />} />
        </Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
