export default (sequelize, Sequelize) => {
  const managerHistory = sequelize.define("managerhistory", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeId: {
      type: Sequelize.INTEGER,
    },
    managerId: {
      type: Sequelize.INTEGER,
    },
    fromDate: {
      type: Sequelize.DATE,
    },
    toDate: {
      type: Sequelize.DATE,
    },
    needAttendanceCron: {
      type: Sequelize.INTEGER,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    createdBy: {
      type: Sequelize.INTEGER,
    },
    updatedBy: {
      type: Sequelize.INTEGER,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
  });
  return managerHistory;
};
