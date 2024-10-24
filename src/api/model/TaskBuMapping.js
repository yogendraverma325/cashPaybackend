export default (sequelize, Sequelize) => {
    const TaskBuMapping = sequelize.define("taskbumapping", {
        taskBuMappingAutoID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        companyId: {
            type: Sequelize.STRING,
        },
        bu: {
            type: Sequelize.STRING,
        },
        departmentId: {
            type: Sequelize.STRING,
        },
        ownerId: {
            type: Sequelize.STRING,
        },
        taskAutoId: {
            type: Sequelize.INTEGER,
        },
    })
    return TaskBuMapping
}