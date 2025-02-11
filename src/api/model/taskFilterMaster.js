export default (sequelize, Sequelize) => {
    const taskFilterMaster = sequelize.define("taskfiltermaster", {
        taskFilterId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        taskFilterName: {
            type: Sequelize.STRING
        },
        taskFor: {
            type: Sequelize.STRING
        },
        taskForWeb:{
           type: Sequelize.INTEGER,
        },
        taskForApp:{
           type: Sequelize.INTEGER,
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
    return taskFilterMaster
}