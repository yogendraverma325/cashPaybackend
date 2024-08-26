export default (sequelize, Sequelize) => {
    const jobLevelMaster = sequelize.define("joblevelmaster", {
        jobLevelId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        jobLevelName: {
            type: Sequelize.STRING
        },
        jobLevelCode: {
            type: Sequelize.STRING
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
    return jobLevelMaster
}