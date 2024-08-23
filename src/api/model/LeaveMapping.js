export default (sequelize, Sequelize) => {
    const leaveMapping = sequelize.define("leavemapping", {
        leaveMappingId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        EmployeeId: {
            type: Sequelize.INTEGER
        },
        leaveAutoId: {
            type: Sequelize.INTEGER
        },
        availableLeave: {
            type: Sequelize.DECIMAL(10, 2)
        },
        accruedThisYear: {
            type: Sequelize.DECIMAL(10, 2)
        },
        creditedFromLastYear: {
            type: Sequelize.DECIMAL(10, 2)
        },
        annualAllotment: {
            type: Sequelize.DECIMAL(10, 2)
        },
        utilizedThisYear: {
            type: Sequelize.DECIMAL(10, 2)
        },
    })
    return leaveMapping
}