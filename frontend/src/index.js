import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './app/store';

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/css/argon-dashboard-react.min.css";
import "assets/css/styles.css"

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import PrivateRoute from './features/PrivateRoute.js';

import Index from './views/Index.js';
import Tables from './views/examples/Tables.js';
import Modules from './views/modules/Index.js';

import axios from 'axios';
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<PrivateRoute />}>
            <Route path="" element={<AdminLayout />}>
              {/* Define nested routes here */}
              <Route path="index" element={<Index />} />
              <Route path="tables" element={<Tables />} />
              <Route path="modules" element={<Modules />} />
              <Route path="*" element={<Navigate to="/admin/index" replace />} />
            </Route>
          </Route>
          <Route path="/auth/*" element={<AuthLayout />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
