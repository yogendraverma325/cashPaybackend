export default (sequelize, Sequelize) => {
    const dashboardCard = sequelize.define("dashboardcard", {
        cardId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cardName: {
            type: Sequelize.STRING(45)
        },
        webUrl: {
            type: Sequelize.STRING(255)
        },
        webFontColor: {
            type: Sequelize.STRING(255)
        },
        webIcon: {
            type: Sequelize.STRING(255)
        },
        webBackgroundColor: {
            type: Sequelize.STRING(255)
        },
        webPosition: {
            type: Sequelize.INTEGER
        },
        mobileUrl: {
            type: Sequelize.STRING(255)
        },
        mobileLightFontColor: {
            type: Sequelize.STRING(255)
        },
        mobileIcon: {
            type: Sequelize.STRING(255)
        },
        mobileLightBackgroundColor: {
            type: Sequelize.STRING(255)
        },
        mobilePosition: {
            type: Sequelize.INTEGER
        },
        mobileDarkFontColor: {
            type: Sequelize.STRING(255)
        },
        mobileDarkBackgroundColor: {
            type: Sequelize.STRING(255)
        },
        isCardWorking:{
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE(3)
        },
        updatedAt: {
            type: Sequelize.DATE(3)
        },
        createdBy: {
            type: Sequelize.INTEGER
        },
        updatedBy: {
            type: Sequelize.INTEGER
        },
        isActive:{
            type: Sequelize.INTEGER
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