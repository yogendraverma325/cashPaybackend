export default (sequelize, Sequelize) => {
    const districtMaster = sequelize.define("districtmaster", {
        districtId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        districtCode: {
            type: Sequelize.STRING,
        },
        districtName: {
            type: Sequelize.STRING,
        },
        stateId: {
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
    return districtMaster
}