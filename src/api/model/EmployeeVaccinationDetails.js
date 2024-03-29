export default (sequelize, Sequelize) => {
    const employeeVaccinationDetails = sequelize.define("employeevaccinationdetails", {
        vaccinationId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER
        },
        vaccinationStatus: {
            type: Sequelize.STRING
        },
        vaccinationFirstDoseName: {
            type: Sequelize.STRING
        },
        vaccinationFirstDoseDate: {
            type: Sequelize.DATE
        },
        vaccinationFirstDoseAttachments: {
            type: Sequelize.STRING
        },
        vaccinationSecondDoseName: {
            type: Sequelize.STRING
        },
        vaccinationSecondDoseDate: {
            type: Sequelize.DATE
        },
        vaccinationSecondDoseAttachments: {
            type: Sequelize.STRING
        },
        vaccinationCovidStatus: {
            type: Sequelize.STRING
        },
        vaccinationCovidStatusOn: {
            type: Sequelize.DATE
        },
        vaccinationReferenceNumber: {
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
    return employeeVaccinationDetails
}