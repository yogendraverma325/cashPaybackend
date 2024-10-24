export default (sequelize, Sequelize) => {
    const reportModuleMaster = sequelize.define("reportmodulemaster", {
        reportModuleId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        reportModuleName: {
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
    return reportModuleMaster
}