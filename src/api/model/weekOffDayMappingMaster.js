export default (sequelize, Sequelize) => {
  const weekOffDayMappingMaster = sequelize.define("weekOffDayMappingMaster", {
    weekOffDayMappingMasterID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    weekOffId: {
      type: Sequelize.INTEGER,
    },
    dayId: {
      type: Sequelize.INTEGER,
    },
    isfirstDayOff: {
      type: Sequelize.INTEGER,
    },
    isSecondDayOff: {
      type: Sequelize.INTEGER,
    },
    isThirdyDayOff: {
      type: Sequelize.INTEGER,
    },
    isFourthDayOff: {
      type: Sequelize.INTEGER,
    },
    isFivethDayOff: {
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
  });
  return weekOffDayMappingMaster;
};
