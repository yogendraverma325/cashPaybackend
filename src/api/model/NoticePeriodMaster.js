export default (sequelize, Sequelize) => {
    const noticePeriodMaster = sequelize.define("noticeperiodmaster", {
        noticePeriodAutoId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        noticePeriodName: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        noticePeriodCode: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
        },
        nPDaysAfterConfirmation:{
            type: Sequelize.INTEGER,
        },
        nPDaysInProbation:{
            type: Sequelize.INTEGER,
        },
        createdDt: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        createdBy: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        updatedDt: {
            type: Sequelize.DATEONLY,
            allowNull: true,
        },
        updatedBy: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
    })
    return noticePeriodMaster
}