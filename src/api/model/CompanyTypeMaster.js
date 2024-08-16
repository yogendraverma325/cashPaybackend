export default (sequelize, Sequelize) => {
    const companyTypeMaster = sequelize.define("companytypemaster", {
        companyTypeId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        typeName: {
            type: Sequelize.STRING
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
        },
        isDeleted: {
            type: Sequelize.BOOLEAN
        }
    })
    return companyTypeMaster
}
