export default (sequelize, Sequelize) => {
    const calenderYear = sequelize.define("calenderyear", {
        calenderId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: Sequelize.INTEGER,
        },
        month: {
            type: Sequelize.INTEGER,
        },
        year: {
            type: Sequelize.INTEGER
        },
        fullDate:{
            type: Sequelize.STRING
        }
    })
    return calenderYear
}