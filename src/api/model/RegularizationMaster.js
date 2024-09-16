export default (sequelize, Sequelize) => {
  const regularizationMaster = sequelize.define("regularization", {
    regularizeId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    attendanceAutoId: {
      type: Sequelize.INTEGER,
    },
    regularizePunchInDate: {
      type: Sequelize.DATE,
    },
    regularizePunchOutDate: {
      type: Sequelize.DATE,
    },
    regularizeUserRemark: {
      type: Sequelize.STRING,
    },
    regularizeMailSentDate: {
      type: Sequelize.DATE,
    },
    regularizeManagerId: {
      type: Sequelize.INTEGER,
    },
    regularizePunchInTime: {
      type: Sequelize.TIME,
    },
    regularizePunchOutTime: {
      type: Sequelize.TIME,
    },
    regularizeReason: {
      type: Sequelize.STRING,
    },
    regularizeStatus: {
      type: Sequelize.STRING,
    },
    regularizeManagerRemark: {
      type: Sequelize.STRING,
    },
    regularizeLocationType:{
      type: Sequelize.STRING,
    },  
    createdBy: {
      type: Sequelize.INTEGER,
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
  });
  regularizationMaster.addScope("latest", {
    order: [["createdAt", "DESC"]],
    limit: 1,
  });
  return regularizationMaster;
};
