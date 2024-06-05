export default (sequelize, Sequelize) => {
    const stateMaster = sequelize.define("statemaster", {
        stateId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        stateCode: {
            type: Sequelize.INTEGER,
        },
        stateName: {
            type: Sequelize.INTEGER,
        },
        countryId: {
            type: Sequelize.INTEGER,
        },
        regionId: {
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