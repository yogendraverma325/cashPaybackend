export default (sequelize, Sequelize) => {
    const bankMaster = sequelize.define("bankmaster", {
        bankId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        bankName: {
            type: Sequelize.STRING(255)
        },
        bankIfsc: {
            type: Sequelize.STRING(255)
        },
        createdBy: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedBy: {
            type: Sequelize.INTEGER
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        isActive: {
            type: Sequelize.BOOLEAN
        }
    })
    return bankMaster
}