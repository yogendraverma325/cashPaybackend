export default (sequelize, Sequelize) => {
    const ptLocationMaster = sequelize.define("ptlocationmaster", {
        ptLocationId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ptLocationCode: {
            type: Sequelize.STRING
        },
        ptLocationName: {
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
    return ptLocationMaster
}