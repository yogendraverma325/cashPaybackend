export default (sequelize, Sequelize) => {
    const employeeBiographicalDetails = sequelize.define("employeebiographicaldetails", {
        biographicalId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER,
        },
        nationality: {
            type: Sequelize.STRING,
        },
        maritalStatus: {
            type: Sequelize.BOOLEAN
        },
        mobileAccess: {
            type: Sequelize.BOOLEAN
        },
        laptopSystem: {
            type: Sequelize.STRING
        },
        backgroundVerification: {
            type: Sequelize.BOOLEAN
        },
        gender: {
            type: Sequelize.STRING
        },
        dateOfBirth: {
            type: Sequelize.DATE
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
    return employeeBiographicalDetails
}