import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

const { JWT_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                status: 'error',
                msg: err.message
            });
        }

        req.user = decoded;
        next();
    });
};

export default authMiddleware;