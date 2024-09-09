export default (sequelize, Sequelize) => {
    const HrDocumentMaster = sequelize.define("hrdocumentmaster", {
        documentId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        documentName: {
            type: Sequelize.STRING,
        },
        typeUpdate: {
            type: Sequelize.INTEGER,
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
    return HrDocumentMaster
}