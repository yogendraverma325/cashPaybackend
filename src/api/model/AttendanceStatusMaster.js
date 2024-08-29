export default (sequelize, Sequelize) => {
    const AttendanceStatusMaster = sequelize.define('attendancestatusmaster', {
        attendanceStatusMasterID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        code: {
            type: Sequelize.STRING(45),
        },
        name: {
            type: Sequelize.STRING(45),
        },
        colorCode: {
            type: Sequelize.STRING(45),
        }
    });
    return AttendanceStatusMaster
}
