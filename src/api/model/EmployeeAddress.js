export default (sequelize, Sequelize) => {
    const employeeAddress = sequelize.define("employeeaddress", {
        addressId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        employeeId: {
            type: Sequelize.INTEGER,
        },
        addressType: {
            type: Sequelize.INTEGER,
        },
        currentHouse: {
            type: Sequelize.STRING,
        },
        currentStreet: {
            type: Sequelize.STRING,
        },
        currentStateId: {
            type: Sequelize.INTEGER
        },
        currentCityId: {
            type: Sequelize.INTEGER
        },
        currentCountryId: {
            type: Sequelize.INTEGER
        },
        currentPincodeId: {
            type: Sequelize.STRING
        },
        currentLandmark: {
            type: Sequelize.STRING
        },
        permanentCityId: {
            type: Sequelize.INTEGER
        },
        permanentStateId: {
            type: Sequelize.INTEGER
        },
        permanentCountryId: {
            type: Sequelize.INTEGER
        },
        permanentPincodeId: {
            type: Sequelize.STRING
        },
        permanentStreet: {
            type: Sequelize.STRING
        },
        permanentHouse: {
            type: Sequelize.STRING
        },
        permanentLandmark: {
            type: Sequelize.STRING
        },
        emergencyStreet: {
            type: Sequelize.STRING
        },
        emergencyHouse: {
            type: Sequelize.STRING
        },
        emergencyCityId: {
            type: Sequelize.INTEGER
        },
        emergencyStateId: {
            type: Sequelize.INTEGER
        },
        emergencyCountryId: {
            type: Sequelize.INTEGER
        },
        emergencyPincodeId: {
            type: Sequelize.STRING
        },
        emergencyLandmark: {
            type: Sequelize.STRING
        },
        // laptopSystem: {
        //     type: Sequelize.STRING
        // },
        // backgroundVerification: {
        //     type: Sequelize.BOOLEAN
        // },
        // gender: {
        //     type: Sequelize.STRING
        // },
        // dateOfBirth: {
        //     type: Sequelize.DATE
        // },
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
    return employeeAddress
}