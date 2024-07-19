export default (sequelize, Sequelize) => {
  const DaysMaster = sequelize.define("daysMaster", {
    dayId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dayName: {
      type: Sequelize.STRING(255),
    },
  });
  return DaysMaster;
};
