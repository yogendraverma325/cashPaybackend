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
        buMappingId: {
            type: Sequelize.INTEGER
        }
    })
    return sbuMapping
}
