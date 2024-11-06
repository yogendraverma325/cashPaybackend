export default (sequelize, Sequelize) => {
    const employeeFamilyDetails = sequelize.define("employeefamilydetails", {
        empFamilyDetailsId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        EmployeeId: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
        },
        dob: {
            type: Sequelize.STRING,
        },
        gender: {
            type: Sequelize.STRING,
        },
        mobileNo: {
            type: Sequelize.STRING,
        },
        relationWithEmp: {
            type: Sequelize.STRING,
        },
        memberAddress: {
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
    return employeeFamilyDetails
}