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
    })
    return degreeMaster
}