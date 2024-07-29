export default (sequelize, Sequelize) => {
  const employeeLeaveTransactions = sequelize.define(
    "employeeleavetransactions",
    {
      employeeLeaveTransactionsId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      employeeId: {
        type: Sequelize.INTEGER,
      },
      attendanceShiftId: {
        type: Sequelize.INTEGER,
      },
      attendancePolicyId: {
        type: Sequelize.INTEGER,
      },
      leaveAutoId: {
        type: Sequelize.INTEGER,
      },
      appliedOn: {
        type: Sequelize.DATE,
      },
      appliedFor: {
        type: Sequelize.DATE,
      },
      isHalfDay: {
        type: Sequelize.INTEGER,
      },
      halfDayFor: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
      },
      reason: {
        type: Sequelize.STRING,
      },
      message: {
        type: Sequelize.STRING,
      },
       batch_id: {
        type: Sequelize.STRING,
      },
      pendingAt: {
        type: Sequelize.INTEGER,
      },
      employeeId: {
        type: Sequelize.INTEGER,
      },
      leaveAttachment: {
        type: Sequelize.STRING,
      },
        leaveCount: {
        type: Sequelize.DECIMAL(10, 1),
        defaltValue: 0,
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
    }
  );
  employeeLeaveTransactions.addScope("latest", {
    order: [["createdAt", "DESC"]],
    limit: 1,
  });
  return employeeLeaveTransactions;
};
