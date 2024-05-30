export default (sequelize, Sequelize) => {
    const dashboardCard = sequelize.define("dashboardcard", {
        cardId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cardName: {
            type: Sequelize.STRING,
        },
        urlWeb: {
            type: Sequelize.STRING,
        },
        urlApp: {
            type: Sequelize.STRING,
        },
        fontColorWeb: {
            type: Sequelize.STRING,
        },
        fontColorApp: {
            type: Sequelize.STRING,
        },
        positionWeb: {
            type: Sequelize.INTEGER,
        },
        positionApp: {
            type: Sequelize.INTEGER,
        },
        iconWeb: {
            type: Sequelize.STRING,
        },
        iconApp: {
            type: Sequelize.STRING,
        },
        backgroundColorWeb:{
            type: Sequelize.STRING,
        },
        backgroundColorApp:{
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
        isActiveWeb: {
            type: Sequelize.BOOLEAN
        },
        isActiveApp: {
            type: Sequelize.BOOLEAN
        }
    })
    return dashboardCard
}