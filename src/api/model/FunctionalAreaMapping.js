export default (sequelize, Sequelize) => {
    const functionalAreaMapping = sequelize.define("functionalareamapping", {
        functionalAreaMappingId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        functionalAreaId: {
            type: Sequelize.INTEGER
        },
        departmentMappingId: {
            type: Sequelize.INTEGER
        },
    })
    return functionalAreaMapping
}
