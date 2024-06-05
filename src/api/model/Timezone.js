export default (sequelize, Sequelize) => {
    const timeZoneMaster = sequelize.define("timezonemaster", {
        timezoneId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        timezoneCode: {
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
        },
        isActive: {
            type: Sequelize.BOOLEAN
        }
    })
    return timeZoneMaster
}