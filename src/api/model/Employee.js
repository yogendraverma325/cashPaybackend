export default (sequelize, Sequelize) => {
    const employeeMaster = sequelize.define("employee", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(255)
        },
        email: {
            type: Sequelize.STRING(255)
        },
        firstName: {
            type: Sequelize.STRING(255)
        },
        lastName: {
            type: Sequelize.STRING(255)
        },
        password: {
            type: Sequelize.STRING(255)
        },
        officeMobileNumber: {
            type: Sequelize.STRING(45)
        },
        personalMobileNumber: {
            type: Sequelize.STRING(45)
        },
        dateOfJoining: {
            type: Sequelize.DATE
        },
        manager: {
            type: Sequelize.INTEGER,
        },
        role_id: {
            type: Sequelize.INTEGER,
        },
        designation_id: {
            type: Sequelize.INTEGER,
        },
        functionalAreaId: {
            type: Sequelize.INTEGER,
        },
        buId: {
            type: Sequelize.INTEGER,
        },
        departmentId: {
            type: Sequelize.INTEGER,
        },
        companyId: {
            type: Sequelize.INTEGER,
        },
    })
    return employeeMaster
}