export default (sequelize, Sequelize) => {
    const separationTrail = sequelize.define("separationtrail", {
        separationTrailAutoId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        separationAutoId: {
            type: Sequelize.INTEGER
        },
        separationStatus: {
            type: Sequelize.INTEGER
        },
        pending: {
            type: Sequelize.BOOLEAN
        },
        actionDate: {
            type: Sequelize.DATE,
        },
        pendingAt: {
            type: Sequelize.INTEGER
        },
        createdBy: {
            type: Sequelize.INTEGER
        },
        createdDt: {
            type: Sequelize.DATE,
        },
        updatedBy: {
            type: Sequelize.INTEGER
        },
        updatedDt: {
            type: Sequelize.DATE
        },
    })
    return separationTrail
}