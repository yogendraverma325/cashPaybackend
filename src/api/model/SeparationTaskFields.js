export default (sequelize, Sequelize) => {
    const separationTaskFields = sequelize.define("separationtaskfields", {
        taskFieldsAutoId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        taskAutoId: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        fieldsCode: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        label: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        isRequired: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        fieldsValidation: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        createdDt: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    })
    return separationTaskFields
}