export default (sequelize, Sequelize) => {
    const separationReason = sequelize.define("separationreason", {
        separationReasonAutoId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        separationTypeAutoId: {
            type: Sequelize.INTEGER
        },
        separationReason: {
            type: Sequelize.STRING
        },
        createdDt: {
            type: Sequelize.DATE
        },
        createdBy: {
            type: Sequelize.INTEGER
        },
        updatedDt: {
            type: Sequelize.DATE
        },
        updatedBy: {
            type: Sequelize.INTEGER
        },
        isActive: {
            type: Sequelize.BOOLEAN
        },

    })
    return separationReason
}