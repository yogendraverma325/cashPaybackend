
export default (sequelize, Sequelize) => {
    const lwfDesignationMaster = sequelize.define("lwfdesignationmaster", {
        lwfDesignationId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        lwfDesignationName: {
            type: Sequelize.STRING,
            allowNull: false
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
    return lwfDesignationMaster
}