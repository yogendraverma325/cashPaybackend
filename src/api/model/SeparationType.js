export default (sequelize, Sequelize) => {
    const separationType = sequelize.define("separationtype", {
        separationTypeAutoId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        separationTypeName: {
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
    return separationType
}