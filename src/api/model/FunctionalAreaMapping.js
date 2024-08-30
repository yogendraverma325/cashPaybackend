export default (sequelize, Sequelize) => {
    const functionalAreaMapping = sequelize.define("functionalareamapping", {
        functionalAreaMappingId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        functionalAreaId: {
            type: Sequelize.INTEGER
        },
        departmentMappingId: {
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
        }
    })
    return functionalAreaMapping
}
