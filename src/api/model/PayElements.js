export default (sequelize, Sequelize) => {
    const payElements = sequelize.define("payelement", {
        payElementAutoId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        EmployeeId: {
            type: Sequelize.INTEGER
        },
        salaryComponentAutoId: {
            type: Sequelize.INTEGER
        },
        payElementAmount: {
            type: Sequelize.STRING
        },
        payElementEffectiveFrom: {
            type: Sequelize.DATE
        },
        payElementEffectiveTo: {
            type: Sequelize.DATE
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
    return payElements
}