export default (sequelize, Sequelize) => {
    const separationTaskMaster = sequelize.define("separationtaskmaster", {
        taskAutoId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        taskCode: {
            type: Sequelize.STRING(100)
        },
        taskName: {
            type: Sequelize.STRING(100)
        },
        taskDependent: {
            type: Sequelize.INTEGER
        },
        isActive: {
            type: Sequelize.TINYINT(1)
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
        },
    })
    return separationTaskMaster
}