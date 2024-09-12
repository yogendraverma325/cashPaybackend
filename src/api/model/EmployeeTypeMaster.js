export default (sequelize, Sequelize) => {
    const employeeTypeMaster = sequelize.define("employeetypemaster", {
        empTypeId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        empTypeCode: {
            type: Sequelize.STRING,
        },
        parentEmpTypeId: {
            type: Sequelize.INTEGER,
        },
        startingIndex:{
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
    return employeeTypeMaster
}