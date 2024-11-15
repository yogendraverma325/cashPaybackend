export default (sequelize, Sequelize) => {
    const separationInitiatedTask = sequelize.define("separationinitiatedtask", {
        initiatedTaskAutoId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        employeeId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        taskAutoId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        resignationAutoId: {
            type: Sequelize.INTEGER,
        },
        status: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        createdDt: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        createdBy: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        updatedBy: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        isActive: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
            allowNull: false,
        },
    })
    return separationInitiatedTask
}