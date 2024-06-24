import express from 'express';
import FileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Jakarta');

import PengajuanCutiRoute from './routes/PengajuanCutiRoute.js';
import ApprovalCutiRoute from './routes/ApprovalCutiRoute.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(FileUpload());
app.use(express.static("public"));

app.use(PengajuanCutiRoute);
app.use(ApprovalCutiRoute);

const port = process.env.APP_PORT || 5001;

app.listen(port, () => {
    console.log(`Server up and running in port ${port} ...`);
})

