export default (sequelize, Sequelize) => {
  const weekOffMaster = sequelize.define("weekOffMaster", {
    weekOffId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    weekOffName: {
      type: Sequelize.STRING(255),
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
  });
  return weekOffMaster;
};
