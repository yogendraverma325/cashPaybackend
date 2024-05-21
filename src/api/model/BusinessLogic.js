export default (sequelize, Sequelize) => {
    const businessLogic = sequelize.define("businesslogic", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        redis: {
            type: Sequelize.INTEGER,
        }
    })
    return businessLogic
}