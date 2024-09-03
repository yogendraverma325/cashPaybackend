export default (sequelize, Sequelize) => {
    const probationMaster = sequelize.define("probationmaster", {
        probationId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        probationName: {
            type: Sequelize.STRING(255)
        },
        setProbationPeriodInDays: {
            type: Sequelize.STRING(255)
        },
        setProbationPeriodInMonths: {
            type: Sequelize.STRING(255)
        },
        durationOfProbation: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        showInProbationExtension: {
            type: Sequelize.STRING(255)
        },
        extendConfirmation: {
            type: Sequelize.STRING(255)
        },
        startProbationPeriodFromAssignedDate: {
            type: Sequelize.STRING(255)
        },
        isActive: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        createdAt: {
            type: Sequelize.DATE
        },
        createdBy: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        updatedBy: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    })
    return probationMaster
}