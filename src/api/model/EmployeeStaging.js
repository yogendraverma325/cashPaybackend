export default (sequelize, Sequelize) => {
    const employeeStaging = sequelize.define("employeestaging", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      empCode: {
        type: Sequelize.STRING(10),
      },
      name: {
        type: Sequelize.STRING(255),
      },
      email: {
        type: Sequelize.STRING(255),
      },
      personalEmail: {
        type: Sequelize.STRING(255),
      },
      firstName: {
        type: Sequelize.STRING(255),
      },
      middleName: {
        type: Sequelize.STRING(255), // new field
      },
      lastName: {
        type: Sequelize.STRING(255),
      },
      panNo: {
        type: Sequelize.STRING(50),
      },
      esicNo: {
        type: Sequelize.STRING(50),
      },
      uanNo: {
        type: Sequelize.STRING(50),
      },
      pfNo: {
        type: Sequelize.STRING(50),
      },
      gender: {
        type: Sequelize.STRING(50) // start new fields
      },
      maritalStatus: {
        type: Sequelize.STRING(50)
      },
      countryId: {
        type: Sequelize.INTEGER(10)
      },
      probationId: {
        type: Sequelize.INTEGER(10)
      },
      dateOfBirth: {
        type: Sequelize.DATE(45)
      },
      newCustomerName: {
        type: Sequelize.STRING(50)
      },
      IQTestApplicable: {
        type: Sequelize.STRING(5)
      },
      positionType: {
        type: Sequelize.STRING(25) // end new fields
      },
      employeeType: {
        type: Sequelize.STRING(10),
      },
      profileImage: {
        type: Sequelize.STRING(255),
      },
      password: {
        type: Sequelize.STRING(255),
      },
      officeMobileNumber: {
        type: Sequelize.STRING(20),
      },
      personalMobileNumber: {
        type: Sequelize.STRING(20),
      },
      dateOfJoining: {
        type: Sequelize.DATE(45),
      },
      wrongPasswordCount: {
        type: Sequelize.INTEGER(1),
      },
      accountRecoveryTime: {
        type: Sequelize.DATE(45),
      },
      manager: {
        type: Sequelize.INTEGER(11),
      },
      role_id: {
        type: Sequelize.INTEGER(11),
      },
      designation_id: {
        type: Sequelize.INTEGER(11),
      },
      functionalAreaId: {
        type: Sequelize.INTEGER(11),
      },
      buId: {
        type: Sequelize.INTEGER(11),
      },
      sbuId: {
        type: Sequelize.INTEGER(11),
      },
      shiftId: {
        type: Sequelize.INTEGER(11),
      },
      departmentId: {
        type: Sequelize.INTEGER(11),
      },
      companyId: {
        type: Sequelize.INTEGER(11),
      },
      lastLogin: {
        type: Sequelize.DATE(45),
      },
      buHRId: {
        type: Sequelize.INTEGER(11),
      },
      buHeadId: {
        type: Sequelize.INTEGER(11),
      },
      attendancePolicyId: {
        type: Sequelize.INTEGER(11),
      },
      companyLocationId: {
        type: Sequelize.INTEGER(11),
      },
      weekOffId: {
        type: Sequelize.INTEGER(11),
      },
      permissionAndAccess: {
        type: Sequelize.STRING(255),
      },
      createdBy:{
        type: Sequelize.INTEGER(1),
      },
      updatedBy:{
        type: Sequelize.INTEGER(11),
      },
      createdAt: {
        type: Sequelize.DATE(45),
      },
      updatedAt: {
        type: Sequelize.DATE(45),
      },
      isActive: {
        type: Sequelize.INTEGER(1),
        defaultValue: 1,
      },
      isTempPassword: {
        type: Sequelize.BOOLEAN(11),
      },
    });
    return employeeStaging;
  };
  