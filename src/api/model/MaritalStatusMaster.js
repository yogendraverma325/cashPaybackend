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
        }
    })
    return maritalStatusMaster
}