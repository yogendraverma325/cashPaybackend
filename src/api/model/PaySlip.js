export default (sequelize, Sequelize) => {
    const paySlips = sequelize.define("payslip", {
        paySlipAutoId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        EmployeeId: {
            type: Sequelize.INTEGER
        },
        paySlipMonth: {
            type: Sequelize.INTEGER
        },
        paySlipYear: {
            type: Sequelize.INTEGER
        },
        paySlipDuration: {
            type: Sequelize.STRING
        },
        paySlipTotalDays: {
            type: Sequelize.INTEGER
        },
        paySlipWorkingDays: {
            type: Sequelize.INTEGER
        },
        paySlipAbsentDays: {
            type: Sequelize.INTEGER
        },
        paySlipArrearDays: {
            type: Sequelize.INTEGER
        },
        paySlipGrossEarning: {
            type: Sequelize.INTEGER
        },
        paySlipTotalPay: {
            type: Sequelize.INTEGER
        },
        paySlipNetPay: {
            type: Sequelize.INTEGER
        },
        createdBy: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE
        }
    })
    return paySlips
}