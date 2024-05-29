import jwt from "jsonwebtoken";
import fs from 'fs'
import path from "path";
import moment from "moment";
import db from '../config/db.config.js'
import sendGrid from "@sendgrid/mail";
import bcrypt from "bcrypt";

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

const calculateLateBy = async (actualTime, scheduleTime) => {
    let actualMoment = moment(actualTime, 'HH:mm:ss');
    let scheduledTime = moment(scheduleTime, 'HH:mm:ss');

    if (actualMoment.isAfter(scheduledTime)) {
        let duration = moment.duration(actualMoment.diff(scheduledTime));
        let hours = Math.floor(duration.asHours());
        let minutes = Math.floor(duration.minutes());
        let seconds = Math.floor(duration.seconds());
        return moment.utc().startOf('day').add({ hours: hours, minutes: minutes, seconds: seconds }).format('HH:mm:ss');
    } else {
        return '00:00:00'
    }
}

const calculateTime = (time) => {

    if (time.length === 0) {
        return '00:00:00'
    }

    let sumDuration = moment.duration(0);
    time.forEach(duration => {
        const [hours, minutes, seconds] = duration.split(':');
        sumDuration.add(moment.duration({
            hours: parseInt(hours),
            minutes: parseInt(minutes),
            seconds: parseInt(seconds)
        }));
    });

    return moment.utc(sumDuration.asMilliseconds()).format('HH:mm:ss');
}

const calculateAverageHours = (workingHours) => {
    function parseDuration(timeStr) {
        let [hours, minutes, seconds] = timeStr.split(':');
        return moment.duration({
            hours: parseInt(hours),
            minutes: parseInt(minutes),
            seconds: parseInt(seconds)
        });
    }

    let totalDuration = moment.duration();
    workingHours.forEach(timeStr => {
        let duration = parseDuration(timeStr);
        totalDuration.add(duration);
    });


    let averageDurationMs = totalDuration.asMilliseconds() / workingHours.length;
    let averageDuration = moment.duration(averageDurationMs);

    let averageHours = Math.floor(averageDuration.asHours());
    let averageMinutes = averageDuration.minutes();
    let averageSeconds = averageDuration.seconds();

    return moment.utc().startOf('day').add({
        hours: averageHours,
        minutes: averageMinutes,
        seconds: averageSeconds
    }).format('HH:mm:ss');
}

const generateRandomPassword = async () => {
    let length = 8,
        charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};

const encryptPassword = async data => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data, salt);
    return hashPassword;
};

export default {
    generateJwtToken,
    checkFolder,
    checkActiveUser,
    fileUpload,
    mailService,
    timeDifference,
    calculateLateBy,
    calculateTime,
    calculateAverageHours,
    generateRandomPassword,
    encryptPassword
}