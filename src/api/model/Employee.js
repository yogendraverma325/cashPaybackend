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
        manager: {
            type: Sequelize.INTEGER,
        },
        role_id: {
            type: Sequelize.INTEGER,
        },
        designation_id: {
            type: Sequelize.INTEGER,
        }
    })
    return employeeMaster
}