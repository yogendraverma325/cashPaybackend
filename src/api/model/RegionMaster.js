export default (sequelize, Sequelize) => {
    const stateMaster = sequelize.define("regionmaster", {
        regionId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        regionName: {
            type: Sequelize.STRING
        },
        regionCode: {
            type: Sequelize.STRING
        },
        countryId: {
            type: Sequelize.INTEGER,
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
    return stateMaster
}


