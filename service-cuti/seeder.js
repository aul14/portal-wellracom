import db from './config/Database.js';
import JenisCuti from './models/JenisCutiModel.js';
import PengajuanCuti from './models/PengajuanCutiModel.js';
import ApprovalCuti from './models/ApprovalCutiModel.js';
import Holiday from './models/HolidayModel.js'

(async () => {
    try {
        await db.sync({ force: true, alter: true });

        await JenisCuti.bulkCreate([
            { name: 'Cuti Besar' },
            { name: 'Cuti Tahunan' },
            { name: 'Cuti Sakit' },
            { name: 'Cuti Melahirkan' },
            { name: 'Cuti Karena Alasan Penting' },
        ]);

        console.log("Database migration & seeded succesfully!");
    } catch (error) {
        console.error('Error migration & seeding database:', error);
    } finally {
        await db.close();
    }
})();