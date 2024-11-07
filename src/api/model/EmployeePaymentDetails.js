export default (sequelize, Sequelize) => {
    const employeePaymentDetails = sequelize.define("employeepaymentdetails", {
        paymentId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER
        },
        paymentAccountNumber: {
            type: Sequelize.STRING
        },
        paymentBankName: {
            type: Sequelize.STRING
        },
        paymentBankIfsc: {
            type: Sequelize.STRING
        },
        paymentHolderName: {
            type: Sequelize.STRING
        },
        paymentAttachment: {
            type: Sequelize.STRING
        },
        ptApplicability: {
            type: Sequelize.BOOLEAN
        },
        ptStateId: {
            type: Sequelize.INTEGER
        },
        ptLocationId: {
            type: Sequelize.INTEGER
        },
        tdsApplicability: {
            type: Sequelize.BOOLEAN
        },
        itrFiling: {
            type: Sequelize.BOOLEAN
        },
        status: {
            type: Sequelize.STRING
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
        },
        isActive: {
            type: Sequelize.BOOLEAN
        }
    })
    return employeePaymentDetails
}