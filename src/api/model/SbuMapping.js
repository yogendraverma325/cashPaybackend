export default (sequelize, Sequelize) => {
    const sbuMapping = sequelize.define("sbumapping", {
        sbuMappingId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sbuId: {
            type: Sequelize.INTEGER
        },
        buId: {
            type: Sequelize.INTEGER
        },
        companyId: {
            type: Sequelize.INTEGER
        },
    })
    return sbuMapping
}
