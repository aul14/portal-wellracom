import express from 'express';
import FileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authsRoute from './routes/auths.js';
import usersRoute from './routes/users.js';
import rolesRoute from './routes/roles.js';
import modulesRoute from './routes/modules.js';
import permissionsRoute from './routes/permissions.js';
import permissionsRolesRoute from './routes/permissionsRoles.js';
import refreshTokensRoute from './routes/refreshToken.js';

const app = express();

app.use(cors({
    credentials: true,
    origin: [`http://localhost:${process.env.APP_PORT}`]
}))

app.use(FileUpload());
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.static("public"));

app.use('/auth', authsRoute);
app.use('/users', usersRoute);
app.use('/roles', rolesRoute);
app.use('/modules', modulesRoute);
app.use('/permissions', permissionsRoute);
app.use('/access-control', permissionsRolesRoute);
app.use('/refresh-tokens', refreshTokensRoute);

app.listen(process.env.APP_PORT, () => {
    console.log(`Server up and running...`);
})