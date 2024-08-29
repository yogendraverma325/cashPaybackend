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
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedBy: {
            type: Sequelize.INTEGER,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
        isActive: {
            type: Sequelize.BOOLEAN,
        },
    });
    return AttendanceStatusMaster
}
