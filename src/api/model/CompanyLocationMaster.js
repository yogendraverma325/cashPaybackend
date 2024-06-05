export default (sequelize, Sequelize) => {
    const companyLocationMaster = sequelize.define("companylocationmaster", {
        companyLocationId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        gstNo: {
            type: Sequelize.STRING
        },
        companyId: {
            type: Sequelize.INTEGER,
        },
        countryId: {
            type: Sequelize.INTEGER,
        },
        stateId: {
            type: Sequelize.INTEGER,
        },
        districtId: {
            type: Sequelize.INTEGER,
        },
        cityId: {
            type: Sequelize.INTEGER,
        },
        pincodeId: {
            type: Sequelize.INTEGER,
        },
        address1: {
            type: Sequelize.STRING
        },
        address2: {
            type: Sequelize.STRING
        },
        mobileNo: {
            type: Sequelize.STRING
        },
        phoneNo: {
            type: Sequelize.STRING
        },
        isHeadquarter: {
            type: Sequelize.BOOLEAN
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
    return companyLocationMaster
}