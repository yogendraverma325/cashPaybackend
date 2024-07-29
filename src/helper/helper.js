import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import moment from "moment";
import db from "../config/db.config.js";
import sendGrid from "@sendgrid/mail";
import bcrypt from "bcrypt";

const generateJwtToken = async (data) => {
  const token = jwt.sign(data, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};

const fileUpload = async (base64String, fileName, filepath) => {
  checkFolder();
  let dir = filepath;
  if (!dir) dir = path.resolve(dir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const fileExt = base64String.slice(
    base64String.indexOf("/") + 1,
    base64String.indexOf(";")
  );
  const base64Data = base64String.replace(/^data:(.+);base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  const finalFilePath = `${dir}/${fileName}.${fileExt}`;
  fs.writeFileSync(finalFilePath, buffer);
  return finalFilePath;
};
const checkFolder = async () => {
  const folder = ["uploads"];
  for (const iterator of folder) {
    let dir = iterator;
    if (!dir) dir = path.resolve(iterator);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
};

const checkActiveUser = async (data) => {
  const existUser = await db.employeeMaster.findOne({
    raw: true,
    where: {
      id: data,
      isActive: 1
    },
  });
  return existUser;
};

const mailService = async (data) => {
  sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    // to: data.to,
    to: "example@teamcomputers.com",
    from: process.env.SENDER_MAIL,
    subject: data.subject,
    text: data.text,
    html: data.html,
    cc: data.cc,
  };
  let result = await sendGrid.sendMultiple(msg);
  return result;
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
  let actualMoment = moment(actualTime, "HH:mm:ss");
  let scheduledTime = moment(scheduleTime, "HH:mm:ss");

  if (actualMoment.isAfter(scheduledTime)) {
    let duration = moment.duration(actualMoment.diff(scheduledTime));
    let hours = Math.floor(duration.asHours());
    let minutes = Math.floor(duration.minutes());
    let seconds = Math.floor(duration.seconds());
    return moment
      .utc()
      .startOf("day")
      .add({ hours: hours, minutes: minutes, seconds: seconds })
      .format("HH:mm:ss");
  } else {
    return "00:00:00";
  }
};

const calculateTime = async (time) => {
  if (time.length === 0) {
    return "00:00:00";
  }

  let sumDuration = moment.duration(0);
  time.forEach((duration) => {
    const [hours, minutes, seconds] = duration.split(":");
    sumDuration.add(
      moment.duration({
        hours: parseInt(hours),
        minutes: parseInt(minutes),
        seconds: parseInt(seconds),
      })
    );
  });

  return moment.utc(sumDuration.asMilliseconds()).format("HH:mm:ss");
};

const calculateAverageHours = async (workingHours) => {
  function parseDuration(timeStr) {
    let [hours, minutes, seconds] = timeStr.split(":");
    return moment.duration({
      hours: parseInt(hours),
      minutes: parseInt(minutes),
      seconds: parseInt(seconds),
    });
  }

  let totalDuration = moment.duration();
  workingHours.forEach((timeStr) => {
    let duration = parseDuration(timeStr);
    totalDuration.add(duration);
  });

  let averageDurationMs = totalDuration.asMilliseconds() / workingHours.length;
  let averageDuration = moment.duration(averageDurationMs);

  let averageHours = Math.floor(averageDuration.asHours());
  let averageMinutes = averageDuration.minutes();
  let averageSeconds = averageDuration.seconds();

  return moment
    .utc()
    .startOf("day")
    .add({
      hours: averageHours,
      minutes: averageMinutes,
      seconds: averageSeconds,
    })
    .format("HH:mm:ss");
};

const ip = async (data) => {
  const lastIndex = data.lastIndexOf(':');
  const result = data.substring(lastIndex + 1);
  return result
}

const generateRandomPassword = async () => {
  let length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

const encryptPassword = async (data) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(data, salt);
  return hashPassword;
};

const getEmpProfile = async (EMP_ID) => {
  const EMP_DATA = await db.employeeMaster.findOne({
    where: {
      id: EMP_ID,
    },
    attributes: {
      exclude: ["password", "role_id", "designation_id"],
    },
    include: [
      {
        model: db.functionalAreaMaster,
        required: true,
        attributes: [
          "functionalAreaId",
          "functionalAreaName",
          "functionalAreaCode",
        ],
      },
      {
        model: db.buMaster,
        required: true,
        attributes: ["buId", "buName", "buCode"],
      },
      {
        model: db.departmentMaster,
        required: true,
        attributes: ["departmentId", "departmentCode", "departmentName"],
      },
      {
        model: db.companyMaster,
        required: true,
        attributes: ["companyId", "companyName", "companyCode"],
        include: [
          {
            model: db.groupCompanyMaster,
            required: true,
            attributes: ["groupId", "groupCode", "groupName", "groupShortName"],
          },
        ],
      },
      {
        model: db.employeeMaster,
        required: false,
        attributes: ["id", "name", "profileImage"],
        as: "managerData",
        include: [
          {
            model: db.roleMaster,
            required: false,
          },
          {
            model: db.designationMaster,
            required: false,
            attributes: ["designationId", "name"],
          },
        ],
      },
      {
        model: db.roleMaster,
        required: true,
        attributes: ["name"],
      },
      {
        model: db.designationMaster,
        required: true,
        attributes: ["designationId", "name"],
      },
      {
        model: db.employeeMaster,
        as: "reportie",
        required: false,
        attributes: {
          exclude: ["password", "role_id", "designation_id"],
        },
        include: [
          {
            model: db.roleMaster,
            required: true,
          },
          {
            model: db.designationMaster,
            required: true,
            attributes: ["designationId", "name"],
          },
        ],
      },
      {
        model: db.employeeMaster,
        required: false,
        attributes: ["id", "name"],
        as: "buHeadData",
      },
      {
        model: db.employeeMaster,
        required: false,
        attributes: ["id", "name"],
        as: "buhrData",
      },
      {
        model: db.companyLocationMaster,
        required: false,
        attributes: ["address1", "address2"],
      },
    ],
  });
  return EMP_DATA;
};
const empLeaveDetails = async function (userId, type) {
  let leaveData = 0;
  if (type == 0) {
    leaveData = await db.leaveMapping.findAll({
      where: {
        EmployeeId: userId,
      },
      include: [
        {
          model: db.leaveMaster,
          attributes: {
            exclude: [
              "createdAt",
              "createdBy",
              "updatedBy",
              "updatedAt",
              "isActive",
            ],
          },
        },
      ],
    });
  } else {
    leaveData = await db.leaveMapping.findOne({
      where: {
        EmployeeId: userId,
        leaveAutoId: type,
      },
    });
  }

  return leaveData;
};
const empMarkLeaveOfGivenDate = async function (userId, inputData, batch) {
  let empLeave = await empLeaveDetails(userId, inputData.leaveAutoId);
  if (inputData.leaveAutoId != 6) {
    let pendingLeaveCountList = await db.employeeLeaveTransactions.findAll({
      where: {
        status: "pending",
        employeeId: userId,
        leaveAutoId: inputData.leaveAutoId,
      },
    });
    let pendingLeaveCount = 0;

    pendingLeaveCountList.map((el) => {
      pendingLeaveCount += parseFloat(el.leaveCount);
    });

    if (
      pendingLeaveCount + inputData.leaveCount >=
      parseFloat(empLeave.availableLeave)
    ) {
      inputData.leaveAutoId = 6;
    }
    inputData.batch_id = batch;
    await db.employeeLeaveTransactions.create(inputData);
  }
  return 1;
};

const remainingLeaveCount = async function (
  startDate,
  endDate,
  weekOffId,
  companyLocationId
) {
  const daysDifferenceReq = moment(endDate).diff(moment(startDate), "days");
  var workingCount = 0;

  for (let i = 0; i <= daysDifferenceReq; i++) {
    let appliedFor = moment(startDate).add(i, "days").format("YYYY-MM-DD");

    let lastDayDateAnotherFormat = moment(appliedFor).format("DD-MM-YYYY");
    let parsedDate = moment(lastDayDateAnotherFormat, "DD-MM-YYYY");
    let dayCode = parseInt(moment(appliedFor).format("d")) + 1;

    let dayOfMonth = parsedDate.date();
    let occurrence = Math.ceil(dayOfMonth / 7);

    // Output the result
    let occurrenceDayCondition = {};
    switch (occurrence) {
      case 1:
        occurrenceDayCondition = {
          dayId: dayCode,
          isfirstDayOff: 1,
        };
        break;
      case 2:
        occurrenceDayCondition = {
          dayId: dayCode,
          isSecondDayOff: 1,
        };
        break;
      case 3:
        occurrenceDayCondition = {
          dayId: dayCode,
          isThirdyDayOff: 1,
        };
        break;
      case 4:
        occurrenceDayCondition = {
          dayId: dayCode,
          isFourthDayOff: 1,
        };
        break;
      case 5:
        occurrenceDayCondition = {
          dayId: dayCode,
          isFivethDayOff: 1,
        };
        break;
      default:
        occurrenceDayCondition = {};
    }
    const existEmployees = await db.weekOffMaster.findOne({
      where: {
        weekOffId: weekOffId,
      },
      include: [
        {
          model: db.weekOffDayMappingMaster,
          required: false,
          where: occurrenceDayCondition,
        },
      ],
    });

    if (existEmployees.weekOffDayMappingMasters.length == 0) {
      let employeeHolidays =
        await db.holidayCompanyLocationConfiguration.findOne({
          where: { companyLocationId: companyLocationId },
          include: {
            model: db.holidayMaster,
            where: { holidayDate: appliedFor },
            as: "holidayDetails",
            required: true,
          },
        });
      if (!employeeHolidays) {
        workingCount += 1;
      }
    }
  }
  return workingCount;
};

const getCombineValue = async function (leaveFirstHalf, leaveSecondHalf) {
  let combineValue = "0.00";

  if ((leaveFirstHalf === 1 || leaveFirstHalf === 2) && leaveSecondHalf === 0) {
    combineValue = "0.50";
  } else if (leaveFirstHalf === 0 && (leaveSecondHalf === 1 || leaveSecondHalf === 2)) {
    combineValue = "0.50";
  } else if ((leaveFirstHalf === 1 || leaveFirstHalf === 2) && (leaveSecondHalf === 1 || leaveSecondHalf === 2)) {
    combineValue = "1.00";
  } else if (leaveFirstHalf === 0 && leaveSecondHalf === 0) {
    combineValue = "0.00";
  }

  return combineValue;
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
  encryptPassword,
  getEmpProfile,
  empLeaveDetails,
  empMarkLeaveOfGivenDate,
  remainingLeaveCount,
  getCombineValue,
  ip
};
