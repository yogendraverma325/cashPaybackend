export default (sequelize, Sequelize) => {
    const employeeWorkExperience = sequelize.define("employeeworkexperience", {
        workExperienceId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER
        },
        companyName: {
            type: Sequelize.STRING
        },
        jobTitle: {
            type: Sequelize.STRING
        },
        jobLocation: {
            type: Sequelize.STRING
        },
        currentlyWorking: {
            type: Sequelize.BOOLEAN
        },
        fromDate: {
            type: Sequelize.STRING
        },
        toDate: {
            type: Sequelize.STRING
        },
        jobSummary: {
            type: Sequelize.STRING
        },
        Skills: {
            type: Sequelize.STRING
        },
        experienceletter: {
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
    return employeeWorkExperience
}