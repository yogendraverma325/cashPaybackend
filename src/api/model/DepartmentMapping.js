export default (sequelize, Sequelize) => {
    const departmentMapping = sequelize.define("departmentmapping", {
        departmentMappingId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        departmentId: {
            type: Sequelize.INTEGER
        },
        sbuMappingId: {
            type: Sequelize.INTEGER
        },
    })
    return departmentMapping
}
