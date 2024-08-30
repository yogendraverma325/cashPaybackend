export default (sequelize, Sequelize) => {
    const buMapping = sequelize.define("bumapping", {
        buMappingId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        buId: {
            type: Sequelize.INTEGER
        },
        companyId: {
            type: Sequelize.INTEGER
        },
        createdBy: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedBy: {
            type: Sequelize.INTEGER
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        isActive: {
            type: Sequelize.BOOLEAN
        },
        headId: {
            type: Sequelize.INTEGER
        },
        buHrId: {
            type: Sequelize.INTEGER
        }
    })
    return buMapping
}
