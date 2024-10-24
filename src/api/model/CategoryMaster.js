export default (sequelize, Sequelize) => {
    const CategoryMstr = sequelize.define("categorymstr", {
        categoryAutoId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        categoryName: {
            type: Sequelize.STRING(255)
        },
        categoryDesc: {
            type: Sequelize.STRING(255)
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
        updatedAt: {
            type: Sequelize.DATE
        },
        updatedBy: {
            type: Sequelize.STRING(10)
        },
    })
    return CategoryMstr
}