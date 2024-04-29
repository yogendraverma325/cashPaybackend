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
            type: Sequelize.DECIMAL(10, 2)
        },
        paySlipTotalPay: {
            type: Sequelize.DECIMAL(10, 2)
        },
        paySlipNetPay: {
            type: Sequelize.DECIMAL(10, 2)
        },
        paySlipTotalDeduction: {
            type: Sequelize.DECIMAL(10, 2)
        },
        paySlipTDS: {
            type: Sequelize.DECIMAL(10, 2)
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