import jwt from "jsonwebtoken";
import fs from 'fs'
import path from "path";
import moment from "moment";
import db from '../config/db.config.js'
import sendGrid from "@sendgrid/mail";
import attendanceController from "../api/v1/attendance/attendance.controller.js";
import cron from 'node-cron'

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
    const folder = ['uploads']
    for (const iterator of folder) {
        let dir = iterator;
        if (!dir) dir = path.resolve(iterator);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
}

const checkActiveUser = async (data) => {
    const existUser = await db.employeeMaster.findOne({
        raw: true,
        where: {
            id: data
        }
    })
    return (existUser) ? true : false
}

const mailService = async (data) => {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: data.to,
        from: process.env.SENDER_MAIL,
        subject: data.subject,
        text: data.text,
        html: data.html,
        cc: data.cc
    }
    let result = await sendGrid.sendMultiple(msg)
    return result
};

const timeDifference = async (start, end) => {
    let startTime = moment(start, "HH:mm:ss");
    let endTime = moment(end, "HH:mm:ss");

    let hours = moment.utc(endTime.diff(startTime)).format("HH");
    let minutes = moment.utc(endTime.diff(startTime)).format("mm");
    let sec = moment.utc(endTime.diff(startTime)).format("ss");
    const time = [hours, minutes, sec].join(":");
    return time;
};

const updateAttendance = () => {
    cron.schedule("* * * * *", async () => {
        await attendanceController.updateAttendance()
    });
};


export default {
    generateJwtToken,
    checkFolder,
    checkActiveUser,
    fileUpload,
    mailService,
    timeDifference,
    updateAttendance
}