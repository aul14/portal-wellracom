import express from 'express';
import FileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import moment from 'moment-timezone';

import PengajuanCutiRoute from './routes/PengajuanCutiRoute.js';

dotenv.config();

const app = express();
moment.tz.setDefault('Asia/Jakarta');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(FileUpload());
app.use(express.static("public"));

app.use(PengajuanCutiRoute);

const port = process.env.APP_PORT || 5001;

app.listen(port, () => {
    console.log(`Server up and running in port ${port} ...`);
})

