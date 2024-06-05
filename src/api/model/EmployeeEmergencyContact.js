export default (sequelize, Sequelize) => {
    const employeeEmergencyContact = sequelize.define("employeeemergencycontact", {
        emergencyContactId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER,
        },
        emergencyContactName: {
            type: Sequelize.STRING,
        },
        emergencyContactNumber: {
            type: Sequelize.STRING,
        },
        emergencyContactRelation: {
            type: Sequelize.STRING,
        },
        createdAt: {
            type: Sequelize.DATE
        },
        createdBy: {
            type: Sequelize.INTEGER,
        },
        updatedBy: {
            type: Sequelize.INTEGER,
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        isActive: {
            type: Sequelize.BOOLEAN
        }
    })
    return employeeEmergencyContact
}