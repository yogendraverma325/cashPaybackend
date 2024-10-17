export default (sequelize, Sequelize) => {
    const separationTaskOwners = sequelize.define("separationtaskowners", {
        taskOwnerAutoId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        taskMappingAutoId: {
            type: Sequelize.INTEGER
        },
        taskOwner: {
            type: Sequelize.INTEGER
        },
        isActive: {
            type: Sequelize.BOOLEAN
        },
        createdBy: {
            type: Sequelize.INTEGER
        },
        createdDt: {
            type: Sequelize.DATE
        },
        updatedBy: {
            type: Sequelize.INTEGER
        },
        updatedDt: {
            type: Sequelize.DATE
        }
    })
    return separationTaskOwners
}

