import jwt from "jsonwebtoken";
import fs from 'fs'

const generateSessionToken = async data => {
    const token = jwt.sign(data, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_EXPIRY,
    });
    return token;
};

const checkFolder = async () => {
    const folder = ['uploads', 'docs']
    for (const iterator of folder) {
        let dir = iterator;
        if (!dir) dir = path.resolve(iterator);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
}

export default {
    generateSessionToken,
    checkFolder
}