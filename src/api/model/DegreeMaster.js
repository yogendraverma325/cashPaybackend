export default (sequelize, Sequelize) => {
    const degreeMaster = sequelize.define("degreemaster", {
        degreeId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        degreeName: {
            type: Sequelize.STRING,
        },
        degreeCode: {
            type: Sequelize.STRING,
        },
        degreeType: {
            type: Sequelize.STRING,
        },
        durationInYears: {
            type: Sequelize.INTEGER
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
    return degreeMaster
}