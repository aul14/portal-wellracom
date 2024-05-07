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

import verifyToken from './middlewares/verifyToken.js';

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
app.use('/users', verifyToken, usersRoute);
app.use('/roles', verifyToken, rolesRoute);
app.use('/modules', verifyToken, modulesRoute);
app.use('/permissions', verifyToken, permissionsRoute);
app.use('/access-control', verifyToken, permissionsRolesRoute);
app.use('/refresh-tokens', verifyToken, refreshTokensRoute);

app.listen(process.env.APP_PORT, () => {
    console.log(`Server up and running...`);
})