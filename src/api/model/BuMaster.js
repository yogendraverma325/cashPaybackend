export default (sequelize, Sequelize) => {
    const buMaster = sequelize.define("bumaster", {
        buId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        buName: {
            type: Sequelize.STRING,
        },
        buCode: {
            type: Sequelize.STRING,
        },
        parentBuId: {
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
    return buMaster
}