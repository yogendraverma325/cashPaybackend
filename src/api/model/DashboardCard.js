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
        url: {
            type: Sequelize.STRING,
        },
        fontColor: {
            type: Sequelize.STRING,
        },
        position: {
            type: Sequelize.INTEGER,
        },
        icon: {
            type: Sequelize.STRING,
        },
        backgroundColor:{
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
    return dashboardCard
}