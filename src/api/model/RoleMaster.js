export default (sequelize, Sequelize) => {
    const roleMaster = sequelize.define("role", {
        role_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        }
    })
    return roleMaster
}