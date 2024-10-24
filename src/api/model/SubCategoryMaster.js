export default (sequelize, Sequelize) => {
    const SubCategoryMstr = sequelize.define("subcategorymstr", {
        subCategoryId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        categoryAutoId: {
            type: Sequelize.INTEGER
        },
        subCategoryDesc: {
            type: Sequelize.STRING(255)
        },
        subCategoryName: {
            type: Sequelize.STRING(255)
        },
        subCategoryValue: {
            type: Sequelize.TEXT
        },
        isActive: {
            type: Sequelize.TINYINT
        },
        createdDt: {
            type: Sequelize.DATE
        },
        createdBy: {
            type: Sequelize.STRING(10)
        },
        updatedDt: {
            type: Sequelize.DATE
        },
        updatedBy: {
            type: Sequelize.STRING(10)
        },
    })
    return SubCategoryMstr
}