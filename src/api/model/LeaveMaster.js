export default (sequelize, Sequelize) => {
    const leaveMaster = sequelize.define("leavemaster", {
        leaveId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        leaveName: {
            type: Sequelize.STRING(50)
        },
        leaveCode: {
            type: Sequelize.STRING(50)
        },
        defaultLeaveCount: {
            type: Sequelize.DECIMAL(10, 2)
        },
        iterationDistribution: {
            type: Sequelize.DECIMAL(10, 2)
        },
        canCarryForwardAhead: {
            type: Sequelize.BOOLEAN
        },
        systemGenerated: {
            type: Sequelize.BOOLEAN
        },
        creditDayOfMonth: {
            type: Sequelize.INTEGER
        },
        canTakeHalfDay: {
            type: Sequelize.BOOLEAN
        },
        minConsecutiveDay: {
            type: Sequelize.INTEGER
        },
        maxConsecutiveDay: {
            type: Sequelize.INTEGER
        },
        attachmentRequired: {
            type: Sequelize.BOOLEAN
        },
        messageRequired: {
            type: Sequelize.BOOLEAN
        },
        createdAt: {
            type: Sequelize.DATE
        },
        createdBy: {
            type: Sequelize.INTEGER
        },
        updatedBy: {
            type: Sequelize.INTEGER
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        isActive: {
            type: Sequelize.TINYINT
        }
    })

    return leaveMaster
}