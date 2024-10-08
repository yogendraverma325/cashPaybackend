export default (sequelize, Sequelize) => {
    const separationTaskValues = sequelize.define("separationtaskvalues", {
        seaprationTaskValuesAutoId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        initiatedTaskAutoId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        taskAutoId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        fields: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        employeeId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        fieldValues: {
            type: Sequelize.TEXT,
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
    return separationTaskValues
}