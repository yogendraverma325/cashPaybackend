export default (sequelize, Sequelize) => {
    const separationTaskMapping = sequelize.define("separationtaskmapping", {
        taskMappingAutoId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        taskConfigAutoId: {
            type: Sequelize.INTEGER
        },
        taskAutoId: {
            type: Sequelize.INTEGER
        },
        companyId: {
            type: Sequelize.INTEGER
        },
        buId: {
            type: Sequelize.INTEGER
        },
        sbuId: {
            type: Sequelize.INTEGER
        },
        functionalAreaId: {
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
    return separationTaskMapping
}