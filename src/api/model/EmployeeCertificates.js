export default (sequelize, Sequelize) => {
    const employeeCertificates = sequelize.define("employeecertificates", {
        certificateId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER
        },
        certification: {
            type: Sequelize.STRING,
        },
        expiryDate: {
            type: Sequelize.STRING,
        },
        programName: {
            type: Sequelize.STRING,
        },
        skillProduct: {
            type: Sequelize.STRING,
        },
        oem: {
            type: Sequelize.STRING,
        },
        completionStatus: {
            type: Sequelize.STRING,
        },
        certificationAndValidityFirst: {
            type: Sequelize.STRING
        },
        certificationAndValiditySecond: {
            type: Sequelize.STRING
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
    return employeeCertificates
}