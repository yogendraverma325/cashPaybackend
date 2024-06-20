export default (sequelize, Sequelize) => {
  const holidayMaster = sequelize.define("holidayMaster", {
    holidayId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    holidayName: {
      type: Sequelize.STRING,
    },
    holidayDate: {
      type: Sequelize.DATE,
    },
    createdAt: {
      type: Sequelize.DATE,
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
  return holidayMaster;
};
