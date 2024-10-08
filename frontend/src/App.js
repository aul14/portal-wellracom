import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import PrivateRoute from 'features/PrivateRoute.js';
import Forbidden from 'views/errors/Forbidden.js';

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/css/argon-dashboard-react.min.css";
import "assets/css/styles.css"

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/acces-denied" element={<Forbidden />} />

                    <Route path="/admin/*" element={<PrivateRoute />}>
                        <Route path="" element={<AdminLayout />}>
                            <Route path="*" element={<Navigate to="/admin/index" replace />} />
                        </Route>
                    </Route>

                    <Route path="/auth/*" element={<AuthLayout />} />
                    <Route path="*" element={<Navigate to="/auth/login" replace />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;