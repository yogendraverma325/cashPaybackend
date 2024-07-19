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
    isActive: {
      type: Sequelize.BOOLEAN,
    },
  });
  return weekOffMaster;
};
