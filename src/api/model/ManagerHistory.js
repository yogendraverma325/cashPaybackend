export default (sequelize, Sequelize) => {
    const managerHistory = sequelize.define("managerhistory", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        managerId: {
            type: Sequelize.INTEGER
        },
        fromDate: {
            type: Sequelize.INTEGER
        },
        toDate: {
            type: Sequelize.INTEGER
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
        }
    })
    return managerHistory
}