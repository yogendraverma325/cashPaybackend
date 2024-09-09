export default (sequelize, Sequelize) => {
    const costCenterMaster = sequelize.define("costCenterMaster", {
        costCenterId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        costCenterName: {
            type: Sequelize.STRING
        },
        costCenterCode: {
            type: Sequelize.STRING
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
    return costCenterMaster
}