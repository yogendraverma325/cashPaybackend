export default (sequelize, Sequelize) => {
    const sbuMapping = sequelize.define("sbumapping", {
        sbuMappingId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sbuId: {
            type: Sequelize.INTEGER
        },
        buMappingId: {
            type: Sequelize.INTEGER
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
    return sbuMapping
}
