export default (sequelize, Sequelize) => {
    const newCustomerNameMaster = sequelize.define("newcustomernamemaster", {
        newCustomerNameId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        newCustomerName: {
            type: Sequelize.STRING(255)
        },
        isActive: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        createdAt: {
            type: Sequelize.DATE
        },
        createdBy: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        updatedBy: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        }
    })
    return newCustomerNameMaster
}