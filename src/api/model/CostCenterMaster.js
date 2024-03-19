export default (sequelize, Sequelize) => {
    const costCenterMaster = sequelize.define("costcentermaster", {
        costCenterId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        costCenterName: {
            type: Sequelize.STRING,
        },
        costCenterCode: {
            type: Sequelize.STRING,
        },
        costCenterHead: {
            type: Sequelize.STRING,
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
    return costCenterMaster
}