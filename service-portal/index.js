import express from 'express';
import FileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import moment from 'moment-timezone';

import AuthRoute from './routes/AuthRoute.js';
import UserRoute from './routes/UserRoute.js';
import ModuleRoute from './routes/ModuleRoute.js';
import RefreshToken from './routes/RefreshTokenRoute.js';
import RoleRoute from './routes/RoleRoute.js';
import PermissionRoute from './routes/PermissionRoute.js';
import PermissionRoleRoute from './routes/PermissionRoleRoute.js';
dotenv.config();

const app = express();

moment.tz.setDefault('Asia/Jakarta');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(FileUpload());
app.use(express.static("public"));

app.use(UserRoute);
app.use(RoleRoute);
app.use(ModuleRoute);
app.use(PermissionRoute);
app.use(RefreshToken);
app.use(AuthRoute);
app.use(PermissionRoleRoute);

const port = process.env.APP_PORT || 5000;

app.listen(port, () => {
    console.log(`Server up and running in port ${port} ...`);
})