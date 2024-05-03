import express from 'express';
import FileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import usersRoute from './routes/users.js';

const app = express();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
}))

// app.use(express.json());
app.use(FileUpload());
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.static("public"));
app.use('/users', usersRoute);


app.listen(process.env.APP_PORT, () => {
    console.log(`Server up and running...`);
})