export default (sequelize, Sequelize) => {
    const currencyMaster = sequelize.define("currencymaster", {
        currencyId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        currencyCode: {
            type: Sequelize.STRING,
        },
        currencyName: {
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
    return currencyMaster
}