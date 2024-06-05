export default (sequelize, Sequelize) => {
    const groupCompanyMaster = sequelize.define("groupcompanymaster", {
        groupId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        groupCode: {
            type: Sequelize.STRING
        },
        groupName: {
            type: Sequelize.STRING
        },
        groupShortName: {
            type: Sequelize.STRING
        },
        groupLogo: {
            type: Sequelize.STRING
        },
        siteURL: {
            type: Sequelize.STRING
        },
        dateOfIncorporation: {
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
    return groupCompanyMaster
}