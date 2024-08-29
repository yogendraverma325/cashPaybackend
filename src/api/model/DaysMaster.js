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
  });
  return DaysMaster;
};
