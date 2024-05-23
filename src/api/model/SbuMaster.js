export default (sequelize, Sequelize) => {
    const sbuMaster = sequelize.define("sbumaster", {
        sbuId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sbuname: {
            type: Sequelize.STRING,
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
    return sbuMaster
}