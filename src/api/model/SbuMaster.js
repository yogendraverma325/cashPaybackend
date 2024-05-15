export default (sequelize, Sequelize) => {
    const sbuMaster = sequelize.define("sbumaster", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sbuname: {
            type: Sequelize.STRING,
        }
    })
    return sbuMaster
}