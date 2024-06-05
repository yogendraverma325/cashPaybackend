export default (sequelize, Sequelize) => {
    const bandMaster = sequelize.define("bandmaster", {
        bandId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        bandCode: {
            type: Sequelize.STRING(255)
        },
        bandDesc: {
            type: Sequelize.STRING(255)
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
    return bandMaster
}
