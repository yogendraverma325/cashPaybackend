export default (sequelize, Sequelize) => {
  const attendancePolicymaster = sequelize.define("attendancePolicymaster", {
    attendancePolicyId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    policyName: {
      type: Sequelize.STRING,
    },
    policyCode: {
      type: Sequelize.STRING,
    },
    policyDescription: {
      type: Sequelize.STRING,
    },
    requestLimit: {
      type: Sequelize.INTEGER,
    },
    allowRequestFromHome: {
      type: Sequelize.INTEGER,
    },
    allowRequestFromDuty: {
      type: Sequelize.INTEGER,
    },
    graceTimeClockIn: {
      type: Sequelize.INTEGER,
    },
    graceTimeClockOut: {
      type: Sequelize.INTEGER,
    },
    allowBufferTime: {
      type: Sequelize.INTEGER,
    },
    bufferTimePre: {
      type: Sequelize.INTEGER,
    },
    bufferTimePost: {
      type: Sequelize.INTEGER,
    },
    isleaveDeductPolicyLateDuration: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    leaveDeductPolicyLateDurationHalfDayTime: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    leaveDeductPolicyLateDurationFullDayTime: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    leaveDeductPolicyLateDurationLeaveType: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    isleaveDeductPolicyWorkDuration: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    leaveDeductPolicyWorkDurationHalfDayTime: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    leaveDeductPolicyWorkDurationFullDayTime: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    leaveDeductPolicyWorkDurationLeaveType: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
    isActive: {
      type: Sequelize.BOOLEAN,
    },
  });
  return attendancePolicymaster;
};
