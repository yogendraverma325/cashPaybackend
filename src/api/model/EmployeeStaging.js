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
      type: Sequelize.INTEGER
    },
    maritalStatusSince: {
      type: Sequelize.STRING(50)
    },
    nationality: {
      type: Sequelize.STRING(50)
    },
    probationId: {
      type: Sequelize.INTEGER
    },
    dateOfBirth: {
      type: Sequelize.DATE
    },
    newCustomerNameId: {
      type: Sequelize.INTEGER
    },
    iqTestApplicable: {
      type: Sequelize.INTEGER
    },
    positionType: {
      type: Sequelize.STRING(25) // end new fields
    },
    employeeType: {
      type: Sequelize.INTEGER,
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
      type: Sequelize.DATE,
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
    jobLevelId: {
      type: Sequelize.INTEGER
    },
    weekOffId: {
      type: Sequelize.INTEGER,
    },
    permissionAndAccess: {
      type: Sequelize.STRING(255),
    },
    selfService: {
      type: Sequelize.INTEGER
    },
    mobileAccess: {
      type: Sequelize.INTEGER
    },
    laptopSystem: {
      type: Sequelize.STRING
    },
    backgroundVerification: {
      type: Sequelize.INTEGER
    },
    workstationAdmin: {
      type: Sequelize.INTEGER,
    },
    mobileAdmin: {
      type: Sequelize.INTEGER,
    },
    dataCardAdmin: {
      type: Sequelize.INTEGER,
    },
    visitingCardAdmin: {
      type: Sequelize.INTEGER,
    },
    recruiterName: {
      type: Sequelize.STRING,
    },
    offRoleCTC: {
      type: Sequelize.INTEGER,
    },
    highestQualification: {
      type: Sequelize.STRING
    },
    ESICPFDeduction: {
      type: Sequelize.STRING
    },
    fatherName: {
      type: Sequelize.STRING
    },
    paymentAccountNumber: {
      type: Sequelize.STRING
    },
    paymentBankName: {
      type: Sequelize.STRING
    },
    paymentBankIfsc: {
      type: Sequelize.STRING
    },
    noticePeriodAutoId: {
      type: Sequelize.INTEGER,
    },
    createdBy: {
      type: Sequelize.INTEGER,
    },
    updatedBy: {
      type: Sequelize.INTEGER,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
    isActive: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    isTempPassword: {
      type: Sequelize.BOOLEAN,
    },
  });
  return employeeStaging;
};
