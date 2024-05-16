export default (sequelize, Sequelize) => {
    const attendanceMaster = sequelize.define("attendancemaster", {
        attendanceAutoId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        employeeId: {
            type: Sequelize.INTEGER,
        },
        attendanceShiftId: {
            type: Sequelize.INTEGER,
        },
        attendanceDate: {
            type: Sequelize.DATE
        },
        attandanceShiftStartDate: {
            type: Sequelize.DATE
        },
        attendanceShiftEndDate: {
            type: Sequelize.DATE
        },
        attendancePunchInTime: {
            type: Sequelize.STRING,
        },
        attendancePunchOutTime: {
            type: Sequelize.STRING,
        },
        attendancePunchInRemark: {
            type: Sequelize.STRING,
        },
        attendancePunchOutRemark: {
            type: Sequelize.STRING,
        },
        attendancePunchInLocationType: {
            type: Sequelize.STRING,
        },
        attendancePunchOutLocationType: {
            type: Sequelize.STRING,
        },
        attendanceStatus: {
            type: Sequelize.STRING,
        },
        attendancePresentStatus: {
            type: Sequelize.STRING,
        },
        attendanceRegularizePunchInTime: {
            type: Sequelize.STRING,
        },
        attendanceRegularizePunchOutTime: {
            type: Sequelize.STRING,
        },
        attendanceRegularizeStatus: {
            type: Sequelize.STRING,
        },
        attendanceManagerUpdateDate: {
            type: Sequelize.DATE
        },
        attendancePunchInLocation: {
            type: Sequelize.STRING,
        },
        attendancePunchInLatitude: {
            type: Sequelize.STRING
        },
        attendancePunchInLongitude: {
            type: Sequelize.STRING
        },
        attendancePunchOutLocation: {
            type: Sequelize.STRING,
        },
        attendancePunchOutLatitude: {
            type: Sequelize.STRING
        },
        attendancePunchOutLongitude: {
            type: Sequelize.STRING
        },
        attendanceWorkingTime: {
            type: Sequelize.STRING,
        },
        attendanceRegularizeReason: {
            type: Sequelize.STRING,
        },
        attendanceRegularizeUserRemark: {
            type: Sequelize.STRING,
        },
        attendanceRegularizeManagerRemark: {
            type: Sequelize.STRING,
        },
        attendanceRegularizeCount: {
            type: Sequelize.INTEGER,
            default: 0
        },
        createdBy: {
            type: Sequelize.INTEGER,
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedBy: {
            type: Sequelize.INTEGER,
        },
        updatedAt: {
            type: Sequelize.DATE
        },
    })
    return attendanceMaster
}