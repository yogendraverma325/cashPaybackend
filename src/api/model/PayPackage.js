export default (sequelize, Sequelize) => {
    const payPackage = sequelize.define("paypackage", {
        payPackageAutoId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        EmployeeId: {
            type: Sequelize.INTEGER,
        },
        payPackageFinancialYear: {
            type: Sequelize.STRING
        },
        payPackageEffectiveDate: {
            type: Sequelize.DATE
        },
        payPackageMonthlyCTC: {
            type: Sequelize.DECIMAL(10, 2)
        },
        payPackageTotalCTC: {
            type: Sequelize.DECIMAL(10, 2)
        },
        payPackageSalaryStructure: {
            type: Sequelize.STRING
        },
        payPackageType: {
            type: Sequelize.STRING
        },
        createdBy: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedBy: {
            type: Sequelize.INTEGER
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        isActive: {
            type: Sequelize.BOOLEAN
        }
    })
    return payPackage
}