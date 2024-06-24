import Holiday from '../models/HolidayModel.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const { URL_API_HOLIDAY } = process.env;

export const checkAndInsertHoliday = async () => {
    try {
        const year = new Date().getFullYear();

        const getHoliday = await Holiday.findAll({
            where: {
                year: year
            }
        })

        if (getHoliday.length === 0) {
            const response = await axios.get(`${URL_API_HOLIDAY}/api?year=${year}`)
            const data = response.data;

            // Filter data untuk hanya menyertakan objek dengan is_national_holiday: true
            const nationalHolidays = data.filter(holiday => holiday.is_national_holiday === true);

            // Menambahkan field 'year' dengan tahun sekarang
            const currentYear = new Date().getFullYear();
            nationalHolidays.forEach(holiday => {
                holiday.year = currentYear;
            });
            const saveToDb = await Holiday.bulkCreate(nationalHolidays);

            return saveToDb;
        } else {
            return getHoliday;
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: error.message
        })
    }
}