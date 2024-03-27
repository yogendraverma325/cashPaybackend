export default (sequelize, Sequelize) => {
    const buMapping = sequelize.define("bumapping", {
        buMappingId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        buId: {
            type: Sequelize.INTEGER
        },
        companyId: {
            type: Sequelize.INTEGER
        },
    })
    return buMapping
}
