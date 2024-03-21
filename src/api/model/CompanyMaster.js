export default (sequelize, Sequelize) => {
    const companyMaster = sequelize.define("companymaster", {
        companyId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        companyName: {
            type: Sequelize.STRING
        },
        companyCode: {
            type: Sequelize.STRING
        },
        groupId: {
            type: Sequelize.INTEGER,
        },
        currencyId: {
            type: Sequelize.INTEGER,
        },
        timeZoneId: {
            type: Sequelize.INTEGER,
        },
        headerColor: {
            type: Sequelize.STRING
        },
        finacialYearBegin: {
            type: Sequelize.STRING
        },
        industryId: {
            type: Sequelize.INTEGER,
        },
        siteUrl: {
            type: Sequelize.STRING
        },
        companyTypeId: {
            type: Sequelize.INTEGER,
        },
        dateOfIncorporation: {
            type: Sequelize.DATE
        },
        panNo: {
            type: Sequelize.STRING
        },
        tanNo: {
            type: Sequelize.STRING
        },
        vatRegNo: {
            type: Sequelize.STRING
        },
        cstRegNo: {
            type: Sequelize.STRING
        },
        pfRegNo: {
            type: Sequelize.STRING
        },
        gstNo: {
            type: Sequelize.STRING
        },
        esiRegNo: {
            type: Sequelize.STRING
        },
        companyLogo: {
            type: Sequelize.STRING
        },
        officialMail: {
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATE
        },
        createdBy: {
            type: Sequelize.INTEGER,
        },
        updatedAt: {
            type: Sequelize.INTEGER,
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        isActive: {
            type: Sequelize.BOOLEAN
        }
    })
    return companyMaster
}