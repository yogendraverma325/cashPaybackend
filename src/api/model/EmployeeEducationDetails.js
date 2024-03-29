export default (sequelize, Sequelize) => {
    const employeeEducationDetails = sequelize.define("employeeeducationdetails", {
        educationId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER,
        },
        educationDegree: {
            type: Sequelize.INTEGER,
        },
        educationSpecialisation: {
            type: Sequelize.STRING,
        },
        educationStartDate: {
            type: Sequelize.DATE,
        },
        educationCompletionDate: {
            type: Sequelize.DATE,
        },
        educationInstitute: {
            type: Sequelize.STRING,
        },
        educationAttachments: {
            type: Sequelize.STRING,
        },
        educationRemark: {
            type: Sequelize.STRING,
        },
        educationActivities: {
            type: Sequelize.STRING,
        },
        isHighestEducation: {
            type: Sequelize.BOOLEAN,
        },
        createdBy: {
            type: Sequelize.INTEGER,
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

    })
    return employeeEducationDetails
}