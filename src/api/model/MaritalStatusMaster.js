export default (sequelize, Sequelize) => {
    const maritalStatusMaster = sequelize.define("maritalstatusmaster", {
        maritalstatusmasterId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(45)
        },
        code: {
            type: DataTypes.STRING(45)
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
    return maritalStatusMaster
}