export default (sequelize, Sequelize) => {
    const loginDetails = sequelize.define("logindetails", {
        loginDetailsId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        employeeId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        loginIP: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        loginDevice: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        createdDt: {
            type: Sequelize.DATE,
            allowNull: false
        }
    })
    return loginDetails
}