export default (sequelize, Sequelize) => {
    const separationTaskConfig = sequelize.define("separationtaskconfig", {
        taskConfigAutoId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        taskConfigName: {
            type: Sequelize.STRING(255)
        },
        isActive: {
            type: Sequelize.TINYINT(1)
        },
        companyId: {
            type: Sequelize.STRING
        },
        buId: {
            type: Sequelize.STRING
        },
        sbuId: {
            type: Sequelize.STRING
        },
        jobLevelId: {
            type: Sequelize.STRING
        },
        functionalAreaId: {
            type: Sequelize.STRING
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
    return separationTaskConfig
}