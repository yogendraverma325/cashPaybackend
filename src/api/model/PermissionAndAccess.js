export default (sequelize, Sequelize) => {
    const permissoinandaccess = sequelize.define("permissoinandaccess", {
        permissoinandaccessId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role_id: {
            type: Sequelize.INTEGER,
        },
        permissionType: {
            type: Sequelize.STRING,
        },
        permissionValue: {
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
            type: Sequelize.INTEGER
        }
    })
    return permissoinandaccess
}