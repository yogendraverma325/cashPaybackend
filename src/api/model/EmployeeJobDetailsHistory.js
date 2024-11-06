export default (sequelize, Sequelize) => {
    const employeeJobDetailsHistory = sequelize.define("employeejobdetailshistory", {
        jobHistoryId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER,
        },
        dateOfJoining: {
            type: Sequelize.DATE,
        },
        probationPeriod: {
            type: Sequelize.STRING,
        },
        languagesSpoken: {
            type: Sequelize.STRING,
        },
        unionId: {
            type: Sequelize.INTEGER,
        },
        bandId: {
            type: Sequelize.INTEGER,
        },
        gradeId: {
            type: Sequelize.INTEGER,
        },
        jobLevelId: {
            type: Sequelize.INTEGER,
        },
        residentEng: {
            type: Sequelize.BOOLEAN
        },
        customerName: {
            type: Sequelize.STRING,
        },
        epsApplicability: {
            type: Sequelize.BOOLEAN
        },
        esicApplicable: {
            type: Sequelize.BOOLEAN
        },
        lwfApplicable: {
            type: Sequelize.BOOLEAN
        },
        pfRestricted: {
            type: Sequelize.BOOLEAN
        },
        pfApplicability: {
            type: Sequelize.BOOLEAN
        },
        epfApplicable: {
            type: Sequelize.BOOLEAN
        },
        esicNumber: {
            type: Sequelize.STRING
        },
        pfNumber: {
            type: Sequelize.STRING
        },
        uanNumber: {
            type: Sequelize.STRING
        },
        lwfDesignation: {
            type: Sequelize.INTEGER,
        },
        lwfState: {
            type: Sequelize.INTEGER,
        },
        restrictCompanyPf: {
            type: Sequelize.BOOLEAN
        },
        pranNumber: {
            type: Sequelize.STRING
        },
        npsNumber: {
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
        }
    })
    return employeeJobDetailsHistory
}