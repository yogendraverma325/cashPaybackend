export default (sequelize, Sequelize) => {
    const HrLetters = sequelize.define("hrletters", {
        letterId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      documentType:{
        type: Sequelize.INTEGER,
      },
      documentImage:{
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      createdBy:{
        type: Sequelize.INTEGER,
      },
      updatedBy: {
        type: Sequelize.INTEGER,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
      },
    });
    return HrLetters;
  };
  