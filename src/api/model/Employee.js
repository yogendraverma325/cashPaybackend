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
    personalEmail: {
      type: Sequelize.STRING(255),
    },
    firstName: {
      type: Sequelize.STRING(255),
    },
    lastName: {
      type: Sequelize.STRING(255),
    },
    middleName:{
      type: Sequelize.STRING(255),
    },
    panNo: {
      type: Sequelize.STRING(255),
    },
    panImg:{
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
    noticePeriodAutoId: {
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
    weekOffId: {
      type: Sequelize.INTEGER,
    },
    permissionAndAccess: {
      type: Sequelize.STRING(255),
    },
    salutationId:{
      type: Sequelize.INTEGER,
    },
    adhrNo:{
      type: Sequelize.STRING(255),
    },
    drivingLicence:{
      type: Sequelize.STRING(255),
    },
    dlImg:{
      type: Sequelize.STRING(255),
    },
    adhrFront:{
      type: Sequelize.STRING(255),
    },
    adhrBack:{
      type: Sequelize.STRING(255),
    },
    passportNumber:{
      type: Sequelize.STRING(255),
    },
    passportImg:{
      type: Sequelize.STRING(255),
    },
    abstractReasoning:{
      type: Sequelize.STRING,
    },
    numericalSequences:{
      type: Sequelize.STRING,
    },
    numericalCalculation:{
      type: Sequelize.STRING,
    },
    mbtiType:{
      type: Sequelize.STRING,
    },
    dataCardAdmin:{
      type: Sequelize.INTEGER,
    },
    visitingCardAdmin:{
      type: Sequelize.INTEGER,
    },
    workstationAdmin:{
      type: Sequelize.INTEGER,
    },
    lastIncrementDate:{
      type: Sequelize.STRING
    },
    iqTestApplicable:{
      type: Sequelize.INTEGER,
    },
    mobileAdmin:{
      type: Sequelize.INTEGER,
    },
    recruiterName:{
      type: Sequelize.STRING,
    },
    createdBy:{
      type: Sequelize.INTEGER,
    },
    costId:{
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
  return employeeMaster;
};
