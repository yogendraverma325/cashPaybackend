import jwt from "jsonwebtoken";
import fs from 'fs'
import path from "path";

const generateJwtToken = async data => {
    const token = jwt.sign(data, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_EXPIRY,
    });
    return token;
};

const fileUpload = (base64String, fileName, filepath) => {
    checkFolder();
    let dir = filepath;
    if (!dir) dir = path.resolve(dir);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const finalFilePath = `${dir}/${fileName}`;
    fs.writeFileSync(finalFilePath, buffer);
    return finalFilePath;
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

const checkActiveUser = async (data) => {
    return true
}

export default {
    generateJwtToken,
    checkFolder,
    checkActiveUser,
    fileUpload
}