export default (sequelize, Sequelize) => {
  const employeeMaster = sequelize.define("employee", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    empCode: {
      type: Sequelize.STRING(255),
    },
    name: {
      type: Sequelize.STRING(255),
    },
    email: {
      type: Sequelize.STRING(255),
    },
    firstName: {
      type: Sequelize.STRING(255),
    },
    lastName: {
      type: Sequelize.STRING(255),
    },
    panNo: {
      type: Sequelize.STRING(255),
    },
    esicNo: {
      type: Sequelize.STRING(255),
    },
    uanNo: {
      type: Sequelize.STRING(255),
    },
    pfNo: {
      type: Sequelize.STRING(255),
    },
    employeeType: {
      type: Sequelize.STRING(255),
    },
    profileImage: {
      type: Sequelize.STRING(255),
    },
    password: {
      type: Sequelize.STRING(255),
    },
    officeMobileNumber: {
      type: Sequelize.STRING(45),
    },
    personalMobileNumber: {
      type: Sequelize.STRING(45),
    },
    wrongPasswordCount: {
      type: Sequelize.INTEGER,
    },
    accountRecoveryTime: {
      type: Sequelize.DATE,
    },
    manager: {
      type: Sequelize.INTEGER,
    },
    role_id: {
      type: Sequelize.INTEGER,
    },
    designation_id: {
      type: Sequelize.INTEGER,
    },
    functionalAreaId: {
      type: Sequelize.INTEGER,
    },
    buId: {
      type: Sequelize.INTEGER,
    },
    sbuId: {
      type: Sequelize.INTEGER,
    },
    shiftId: {
      type: Sequelize.INTEGER,
    },
    departmentId: {
      type: Sequelize.INTEGER,
    },
    companyId: {
      type: Sequelize.INTEGER,
    },
    lastLogin: {
      type: Sequelize.DATE,
    },
    buHRId: {
      type: Sequelize.INTEGER,
    },
    buHeadId: {
      type: Sequelize.INTEGER,
    },
    attendancePolicyId: {
      type: Sequelize.INTEGER,
    },
    companyLocationId: {
      type: Sequelize.INTEGER,
    },
<<<<<<< HEAD
    isActive: {
=======
     weekOffId: {
      type: Sequelize.INTEGER,
    },
     isActive: {
>>>>>>> b833b46cc88913f2f35970d3220718241fef0840
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
  });
  return employeeMaster;
};
