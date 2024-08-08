export default (sequelize, Sequelize) => {
    const employeeJobDetailsHistory = sequelize.define("employeejobdetailshistory", {
        jobHistoryId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER,
        },
        dateOfJoining: {
            type: Sequelize.DATE,
        },
        probationPeriod: {
            type: Sequelize.STRING,
        },
        languagesSpoken: {
            type: Sequelize.STRING,
        },
        createdAt: {
            type: Sequelize.DATE
        },
        createdBy: {
            type: Sequelize.INTEGER,
        },
        updatedBy: {
            type: Sequelize.INTEGER,
        },
        updatedAt: {
            type: Sequelize.DATE
        }
    })
    return employeeJobDetailsHistory
}