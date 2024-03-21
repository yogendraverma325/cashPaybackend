export default (sequelize, Sequelize) => {
    const cityMaster = sequelize.define("citymaster", {
        cityId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cityCode: {
            type: Sequelize.STRING
        },
        cityType: {
            type: Sequelize.STRING
        },
        cityName: {
            type: Sequelize.STRING
        },
        stateId: {
            type: Sequelize.INTEGER,
        },
        createdAt: {
            type: Sequelize.DATE
        },
        createdBy: {
            type: Sequelize.INTEGER,
        },
        updatedAt: {
            type: Sequelize.INTEGER,
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        isActive: {
            type: Sequelize.BOOLEAN
        }
    })
    return cityMaster
}