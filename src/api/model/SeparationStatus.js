export default (sequelize, Sequelize) => {
    const separationStatus = sequelize.define("separationstatus", {
        separationStatusAutoId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        separationStatusCode: {
            type: Sequelize.STRING(50)
        },
        separationStatusDesc: {
            type: Sequelize.STRING(255)
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
            type: Sequelize.TINYINT(1),
            defaultValue: 1
        }
    })
    return separationStatus
}