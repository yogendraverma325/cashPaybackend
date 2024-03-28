export default (sequelize, Sequelize) => {
    const functionalAreaMaster = sequelize.define("functionalareamaster", {
        functionalAreaId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        functionalAreaName: {
            type: Sequelize.STRING
        },
        functionalAreaCode: {
            type: Sequelize.STRING
        },
        parentFunctionalAreaId: {
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
    return functionalAreaMaster
}