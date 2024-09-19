import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import moment from "moment";
import db from "../config/db.config.js";
import sendGrid from "@sendgrid/mail";
import bcrypt from "bcrypt";
import { Op, where } from "sequelize";
import eventEmitter from "../services/eventService.js";

const generateJwtToken = async (data) => {
  const token = jwt.sign(data, process.env.JWT_KEY, {
    expiresIn: (data.user.device === 'desktop') ? process.env.JWT_EXPIRY : process.env.JWT_EXPIRY_MOBILE,
  });
  return token;
};

const generateJwtOTPEncrypt = async (data) => {
  const token = jwt.sign(data, process.env.JWT_KEY, { expiresIn: "5m" });
  return token;
};

const generateJwtOTPDecrypt = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  return decoded;
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

  // if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
  //   sharp(buffer).resize(300, 300)
  //     .toFormat('jpeg')
  //     .jpeg({ quality: 80 })
  //     .toFile(finalFilePath);
  // } else {
  fs.writeFileSync(finalFilePath, buffer);
  // }
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
      isActive: 1,
    },
  });
  return existUser;
};

const mailService = async (data) => {
  sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  const filteredCc = data.cc
    ? data.cc.filter((email) => !data.to.includes(email))
    : undefined;

  const testMail = parseInt(process.env.TEST_MAIL);
  const testMailIDs = process.env.TEST_MAIL_ID.split(',');
  console.log("Incoming Mail--->>", data.to)
  const msg = {
    to: testMail ? testMailIDs : data.to,
    from: {
      email: process.env.SENDER_MAIL,
      name: process.env.SENDER_NAME,
    },
    subject: data.subject,
    text: data.text,
    html: data.html,
    cc: testMail ? undefined : filteredCc,
    // bcc: (testMail) ? undefined : testMailIDs
  };
  let result = await sendGrid.sendMultiple(msg);
  return result;
};

const timeDifference = async (start, end) => {
  let startTime = moment(start, "YYYY-MM-DD HH:mm:ss");
  let endTime = moment(end, "YYYY-MM-DD HH:mm:ss");

  let hours = moment.utc(endTime.diff(startTime)).format("HH");
  let minutes = moment.utc(endTime.diff(startTime)).format("mm");
  let sec = moment.utc(endTime.diff(startTime)).format("ss");
  const time = [hours, minutes, sec].join(":");
  return time;
};

const timeDifferenceNew = async (start, end) => {
  console.log("start", start);
  console.log("end", end);
  // let startTime = moment(start, "YYYY-MM-DD HH:mm:ss");
  // let endTime = moment(end, "YYYY-MM-DD HH:mm:ss");
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
  const lastIndex = data.lastIndexOf(":");
  const result = data.substring(lastIndex + 1);
  return result;
};

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
        model: db.noticePeriodMaster,
        attributes: ['noticePeriodDuration']
      },
      {
        model: db.buMaster,
        required: true,
        attributes: ["buId", "buName", "buCode"],
      },
      {
        model: db.sbuMaster,
        seperate: true,
        attributes: ["sbuname", "code"]
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
      // {
      //   model: db.employeeMaster,
      //   required: false,
      //   attributes: ["id", "name"],
      //   as: "buHeadData",
      // },
      // {
      //   model: db.employeeMaster,
      //   required: false,
      //   attributes: ["id", "name"],
      //   as: "buhrData",
      // },
      {
        model: db.companyLocationMaster,
        required: false,
        attributes: ["address1", "address2"],
      },
    ],
  });
  if (EMP_DATA) {
    const headAndHrData = await db.buMapping.findOne({
      where: { buId: EMP_DATA.buId, companyId: EMP_DATA.companyId },
      include: [
        {
          model: db.employeeMaster,
          attributes: ["id", "name"],
          as: "buHeadData",
        },
        {
          model: db.employeeMaster,
          attributes: ["id", "name"],
          as: "buhrData",
        },
      ],
    });

    if (headAndHrData) {
      EMP_DATA.dataValues.buHeadData = headAndHrData.buHeadData;
      EMP_DATA.dataValues.buhrData = headAndHrData.buhrData;
    }
  }

  return EMP_DATA;
};
const empLeaveDetails = async function (userId, type) {
  let leaveData = 0;
  if (type == 0) {
    let countApproved = await db.employeeLeaveTransactions.findAll({
      attributes: [
        [
          db.Sequelize.fn("sum", db.Sequelize.col("leaveCount")),
          "totalLeaveCount",
        ],
      ],
      where: {
        EmployeeId: userId, status: "approved", leaveAutoId: 6, source: {
          [Op.ne]: "system_generated",
        },
      },
      raw: true,
    });

    let countPending = await db.employeeLeaveTransactions.findAll({
      attributes: [
        [
          db.Sequelize.fn("sum", db.Sequelize.col("leaveCount")),
          "totalLeaveCount",
        ],
      ],
      where: { EmployeeId: userId, status: "pending", leaveAutoId: 6 },
      raw: true,
    });

    let countSystemDeducting = await db.employeeLeaveTransactions.findAll({
      attributes: [
        [
          db.Sequelize.fn("sum", db.Sequelize.col("leaveCount")),
          "totalLeaveCount",
        ],
      ],
      where: {
        EmployeeId: userId,
        leaveAutoId: 6,
        status: "approved",
        [Op.or]: [{ source: null }, { source: "system_generated" }],
      },
      raw: true,
    });

    let totalLeaveCountApproved = countApproved
      ? countApproved[0].totalLeaveCount || "0"
      : 0;
    let totalLeaveCountPending = countPending
      ? countPending[0].totalLeaveCount || "0"
      : 0;
    let totalLeaveCountSystemDeducting = countSystemDeducting
      ? countSystemDeducting[0].totalLeaveCount || "0"
      : 0;

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
    // Check if leaveData is an array and process each item
    leaveData.forEach((item) => {
      if (item.leaveAutoId === 6 && item.leavemaster) {
        item.leavemaster.dataValues.countApproved = totalLeaveCountApproved;
        item.leavemaster.dataValues.countPending = totalLeaveCountPending;
        item.leavemaster.dataValues.countSystemDeducting =
          totalLeaveCountSystemDeducting;
      }
    });
  } else {
    leaveData = await db.leaveMapping.findOne({
      where: {
        EmployeeId: userId,
        leaveAutoId: type,
      },
    });
    // If leaveData is an object, handle it directly
    if (leaveData && leaveData.leaveAutoId === 6 && leaveData.leavemaster) {
      let countApproved = await db.employeeLeaveTransactions.findAll({
        attributes: [
          [
            db.Sequelize.fn("sum", db.Sequelize.col("leaveCount")),
            "totalLeaveCount",
          ],
        ],
        where: {
          EmployeeId: userId, status: "approved", leaveAutoId: 6,
          source: {
            [Op.ne]: "system_generated",
          },
        },
        raw: true,
      });
      console.log("countApproved", countApproved)

      let countPending = await db.employeeLeaveTransactions.findAll({
        attributes: [
          [
            db.Sequelize.fn("sum", db.Sequelize.col("leaveCount")),
            "totalLeaveCount",
          ],
        ],
        where: { EmployeeId: userId, status: "pending", leaveAutoId: 6 },
        raw: true,
      });

      let countSystemDeducting = await db.employeeLeaveTransactions.findAll({
        attributes: [
          [
            db.Sequelize.fn("sum", db.Sequelize.col("leaveCount")),
            "totalLeaveCount",
          ],
        ],
        where: {
          EmployeeId: userId,
          leaveAutoId: 6,
          [Op.or]: [{ source: null }, { source: "system_generated" }],
        },
        raw: true,
      });
      let totalLeaveCountApproved = countApproved
        ? countApproved[0].totalLeaveCount || "0"
        : 0;
      let totalLeaveCountPending = countPending
        ? countPending[0].totalLeaveCount || "0"
        : 0;
      let totalLeaveCountSystemDeducting = countSystemDeducting
        ? countSystemDeducting[0].totalLeaveCount || "0"
        : 0;

      leaveData.leavemaster.dataValues.countApproved = totalLeaveCountApproved;
      leaveData.leavemaster.dataValues.countPending = totalLeaveCountPending;
      leaveData.leavemaster.dataValues.countSystemDeducting =
        totalLeaveCountSystemDeducting;
    }
  }

  return leaveData;
};

const empMarkLeaveOfGivenDate = async function (userId, inputData, batch) {
  inputData.source = "system_generated";
  // console.log("inputData", inputData)
  // console.log("inputData", inputData.leaveAutoId)
  if (inputData.leaveAutoId != 6) {
    let empLeave = await empLeaveDetails(userId, inputData.leaveAutoId);
    if (empLeave) {
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
    } else {
      inputData.leaveAutoId = 6;
    }

  } else {
    inputData.leaveAutoId = 6;
  }
  inputData.batch_id = batch;
  await db.employeeLeaveTransactions.create(inputData); // Push data to leave transaction table for that employee

  //start code :leave deducation code if auto approve only
  if (inputData.status == 'approved') {
    if (inputData.leaveAutoId == 6) { //IF leave type if LWP
      const lwpLeave = await db.leaveMapping.findOne({
        where: {
          EmployeeId: userId,
          leaveAutoId: inputData.leaveAutoId,
        },
      });

      if (lwpLeave) {
        await db.leaveMapping.increment(
          { utilizedThisYear: parseFloat(inputData.leaveCount) },
          {
            where: {
              EmployeeId: userId,
              leaveAutoId: inputData.leaveAutoId,
            },
          }
        );
      } else {
        await db.leaveMapping.create({
          EmployeeId: userId,
          leaveAutoId: inputData.leaveAutoId,
          availableLeave: 0,
          utilizedThisYear: parseFloat(inputData.leaveCount),
          creditedFromLastYear: 0,
          annualAllotment: 0,
          accruedThisYear: 0,
        });
      }

    } else { // Else leave is other than LWP
      await db.leaveMapping.increment(
        { utilizedThisYear: parseFloat(inputData.leaveCount) },
        {
          where: {
            EmployeeId: userId,
            leaveAutoId: inputData.leaveAutoId
          },
        }
      );
      await db.leaveMapping.increment(
        { availableLeave: -parseFloat(inputData.leaveCount) },
        {
          where: {
            EmployeeId: userId,
            leaveAutoId: inputData.leaveAutoId
          },
        }
      );
    }

  }
  //end code :leave deducation code if auto approve only 

  const leaveDeductionData = await db.employeeMaster.findOne({
    raw: true,
    where: {
      id: inputData.employeeId
    },
    attributes: ['name', 'email'],
    include: [{
      model: db.shiftMaster,
      attributes: ['shiftStartTime', 'shiftEndTime']
    }]
  })

  const leaveData = await db.leaveMaster.findOne({
    raw: true,
    where: {
      leaveId: inputData.leaveAutoId
    },
    attributes: ['leaveName']
  })

  eventEmitter.emit("autoLeaveDeductionMail", JSON.stringify({
    email: leaveDeductionData.email,
    name: leaveDeductionData.name,
    date: inputData.appliedFor,
    shiftStartTime: leaveDeductionData['shiftsmaster.shiftStartTime'],
    shiftEndTime: leaveDeductionData['shiftsmaster.shiftEndTime'],
    leaveType: leaveData.leaveName,
    leaveDuration: (inputData.leaveCount === 0.5) ? "Half Day" : "Full Day",
    punchInTime: inputData.punchInTime,
    punchOutTime: inputData.punchOutTime
  }))


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

const isDayWorking = async function (startDate, weekOffId, companyLocationId) {
  let appliedFor = moment(startDate).add(0, "days").format("YYYY-MM-DD");

  let lastDayDateAnotherFormat = moment(appliedFor).format("DD-MM-YYYY");
  let parsedDate = moment(lastDayDateAnotherFormat, "DD-MM-YYYY");
  let dayCode = parseInt(moment(appliedFor).format("d")) + 1;

  let dayOfMonth = parsedDate.date();
  let occurrence = Math.ceil(dayOfMonth / 7);
  var workingCount = 0;
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
    let employeeHolidays = await db.holidayCompanyLocationConfiguration.findOne(
      {
        where: { companyLocationId: companyLocationId },
        include: {
          model: db.holidayMaster,
          where: { holidayDate: appliedFor },
          as: "holidayDetails",
          required: true,
        },
      }
    );
    if (!employeeHolidays) {
      workingCount += 1;
    }
  }
  return workingCount;
};

// const getCombineValue = async function (leaveFirstHalf, leaveSecondHalf) {
//   let combineValue = "0.00";

//   if ((leaveFirstHalf === 1 || leaveFirstHalf === 2) && leaveSecondHalf === 0) {
//     combineValue = "0.50";
//   } else if (leaveFirstHalf === 0 && (leaveSecondHalf === 1 || leaveSecondHalf === 2)) {
//     combineValue = "0.50";
//   } else if ((leaveFirstHalf === 1 || leaveFirstHalf === 2) && (leaveSecondHalf === 1 || leaveSecondHalf === 2)) {
//     combineValue = "1.00";
//   } else if (leaveFirstHalf === 0 && leaveSecondHalf === 0) {
//     combineValue = "0.00";
//   }

//   return combineValue;
// };

const getCombineValue = async function (
  leaveFirstHalf,
  leaveSecondHalf,
  startDate,
  endDate,
  companyLocationId,
  weekOffId
) {
  let combineValue = "0.00";
  let isDayWorkingStartDate = await isDayWorking(
    startDate,
    weekOffId,
    companyLocationId
  );
  let isDayWorkingToDate = await isDayWorking(
    endDate,
    weekOffId,
    companyLocationId
  );
  if (isDayWorkingStartDate == 1 && isDayWorkingToDate == 1 && (leaveFirstHalf == 1 || leaveFirstHalf == 2) && (leaveSecondHalf == 1 || leaveSecondHalf == 2)) {
    combineValue = "1.00";
  }
  if (isDayWorkingStartDate == 1 && isDayWorkingToDate == 0 && (leaveFirstHalf == 1 || leaveFirstHalf == 2) && leaveSecondHalf == 0) {
    combineValue = "0.50";
  }
  if (isDayWorkingStartDate == 0 && isDayWorkingToDate == 1 && leaveFirstHalf == 0 && (leaveSecondHalf == 1 || leaveSecondHalf == 2)) {
    combineValue = "0.50";
  }
  if (isDayWorkingStartDate == 1 && isDayWorkingToDate == 0 && (leaveFirstHalf == 1 || leaveFirstHalf == 2) && (leaveSecondHalf == 1 || leaveSecondHalf == 2)) {
    combineValue = "0.50";
  }
  if (isDayWorkingStartDate == 0 && isDayWorkingToDate == 1 && (leaveFirstHalf == 1 || leaveFirstHalf == 2) && (leaveSecondHalf == 1 || leaveSecondHalf == 2)) {
    combineValue = "0.50";
  }
  if (isDayWorkingStartDate == 1 && isDayWorkingToDate == 1 && (leaveFirstHalf == 1 || leaveFirstHalf == 2) && leaveSecondHalf == 0) {
    combineValue = "0.50";
  }
  if (isDayWorkingStartDate == 1 && isDayWorkingToDate == 1 && leaveFirstHalf == 0 && (leaveSecondHalf == 1 || leaveSecondHalf == 2)) {
    combineValue = "0.50";
  }

  return combineValue;
};

const generateOTP = async function (length) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return Math.floor(Math.random() * (max - min + 1)) + min;
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
  timeDifferenceNew,
  isDayWorking,
  ip,
  generateOTP,
  generateJwtOTPEncrypt,
  generateJwtOTPDecrypt,
};
