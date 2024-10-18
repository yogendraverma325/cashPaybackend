import Sequelize from "sequelize";
import logger from "../helper/logger.js";
import Employee from "../api/model/Employee.js";
import Band from "../api/model/BandMaster.js";
import Bu from "../api/model/BuMaster.js";
import CostCenter from "../api/model/CostCenterMaster.js";
import Designation from "../api/model/DesignationMaster.js";
import Grade from "../api/model/GradeMaster.js";
import JobLevel from "../api/model/JobLevelMaster.js";
import FunctionalArea from "../api/model/FunctionalAreaMaster.js";
import State from "../api/model/StateMaster.js";
import Role from "../api/model/RoleMaster.js";
import Region from "../api/model/RegionMaster.js";
import City from "../api/model/CityMaster.js";
import CompanyLocation from "../api/model/CompanyLocationMaster.js";
import Company from "../api/model/CompanyMaster.js";
import CompanyType from "../api/model/CompanyTypeMaster.js";
import Country from "../api/model/CountryMaster.js";
import Currency from "../api/model/CurrencyMaster.js";
import Department from "../api/model/DepartmentMaster.js";
import District from "../api/model/DistrictMaster.js";
import EmployeeType from "../api/model/EmployeeTypeMaster.js";
import Industry from "../api/model/industryMaster.js";
import PinCode from "../api/model/PinCodeMaster.js";
import TimeZone from "../api/model/Timezone.js";
import GroupCompany from "../api/model/GroupCompany.js";
import BuMapping from "../api/model/BuMapping.js";
import SbuMapping from "../api/model/SbuMapping.js";
import EmployeeBiographicalDetails from "../api/model/EmployeeBiographicalDetails.js";
import EmployeeJobDetails from "../api/model/EmployeeJobDetails.js";
import EmployeeEmergencyContact from "../api/model/EmployeeEmergencyContact.js";
import EmployeeFamilyDetails from "../api/model/EmployeeFamilyDetails.js";
import DegreeMaster from "../api/model/DegreeMaster.js";
import EmployeeEducationDetails from "../api/model/EmployeeEducationDetails.js";
import EmployeePaymentDetails from "../api/model/EmployeePaymentDetails.js";
import EmployeeVaccinationDetails from "../api/model/EmployeeVaccinationDetails.js";
import DepartmentMapping from "../api/model/DepartmentMapping.js";
import FunctionalAreaMapping from "../api/model/FunctionalAreaMapping.js";
import SalaryComponent from "../api/model/SalaryComponent.js";
import PayElements from "../api/model/PayElements.js";
import PaySlip from "../api/model/PaySlip.js";
import PaySlipComponent from "../api/model/PaySlipComponent.js";
import PayPackage from "../api/model/PayPackage.js";
import ShiftMaster from "../api/model/ShiftMaster.js";
import AttendanceMaster from "../api/model/AttendanceMaster.js";
import RegularizationMaster from "../api/model/RegularizationMaster.js";
import SbuMaster from "../api/model/SbuMaster.js";
import BusinessLogic from "../api/model/BusinessLogic.js";
import DashboardCard from "../api/model/DashboardCard.js";
import Leave from "../api/model/LeaveMaster.js";
import LeaveMapping from "../api/model/LeaveMapping.js";
import holidayMaster from "../api/model/HolidayMaster.js";
import holidayCompanyLocationConfiguration from "../api/model/holidayCompanyLocationConfiguration.js";
import attendancePolicymaster from "../api/model/attendancePolicymaster.js";
import employeeLeaveTransactions from "../api/model/EmployeeLeaveTransactions.js";
import LoginDetails from "../api/model/LoginDetails.js";
import DaysMaster from "../api/model/DaysMaster.js";
import weekOffMaster from "../api/model/weekOffMaster.js";
import weekOffDayMappingMaster from "../api/model/weekOffDayMappingMaster.js";
import CalenderYear from "../api/model/CalenderYear.js";
import permissoinandaccess from "../api/model/PermissionAndAccess.js";
import ManagerHistory from "../api/model/ManagerHistory.js";
import employeeJobDetailsHistory from "../api/model/EmployeeJobDetailsHistory.js";
import EmployeeEducationDetailsHistory from "../api/model/EmployeeEducationDetailsHistory.js";
import FamilyMemberHistory from "../api/model/FamilyMemberHistory.js";
import AttendanceHistory from "../api/model/AttendanceHistory.js";
import SalutationMaster from "../api/model/salutationMaster.js";
import UnionCodeIncrementMaster from "../api/model/UnionIncrementCodeMaster.js";
import EmployeeAddress from "../api/model/EmployeeAddress.js";
import EmployeeWorkExperience from "../api/model/EmployeeWorkExperience.js";
import HrLetters from "../api/model/HrLetters.js";
import HrDocumentMaster from "../api/model/HrDocumentMaster.js";
import EmployeeCertificates from "../api/model/EmployeeCertificates.js";
import SeparationMaster from "../api/model/SeparationMaster.js";
import NoticePeriodMaster from "../api/model/NoticePeriodMaster.js";
import SeparationType from "../api/model/SeparationType.js";
import SeparationReason from "../api/model/SeparationReason.js";
import SeparationStatus from "../api/model/SeparationStatus.js";
import EmployeeStaging from "../api/model/EmployeeStaging.js";
import ProbationMaster from "../api/model/ProbationMaster.js";
import LwfDesignationMaster from "../api/model/LwfDesignationMaster.js";
import NewCustomerNameMaster from "../api/model/NewCustomerNameMaster.js";
import ReportModuleMaster from "../api/model/ReportModuleMaster.js";
import ReportType from "../api/model/ReportType.js";
import SeparationTrails from "../api/model/SeparationTrails.js";
import TaskFilterMaster from "../api/model/taskFilterMaster.js";
import SeparationTaskMaster from "../api/model/SeparationTaskMaster.js";
import SeparationTaskConfig from "../api/model/SeparationTaskConfig.js";
import SeparationTaskOwner from "../api/model/SeparationTaskOwner.js";
import SeparationTaskMapping from "../api/model/SeparationTaskMapping.js";
import SeparationTaskFields from "../api/model/SeparationTaskFields.js";
import SeparationFieldsValues from "../api/model/SeparationFieldsValues.js";
import SeparationInitiatedTask from "../api/model/SeparationInitiatedTask.js";
import CategoryMaster from "../api/model/CategoryMaster.js";
import SubCategoryMaster from "../api/model/SubCategoryMaster.js";
import PTLocationMaster from "../api/model/PTLocationMaster.js";

import PolicyHistory from "../api/model/PolicyHistory.js";
import literal from "sequelize";
import QueryTypes from "sequelize";
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    define: {
      charset: "utf8",
      collate: "utf8_general_ci",
      freezeTableName: true,
      timestamps: false,
    },
    pool: {
      max: 2000,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
    timezone: "+05:30",
  }
);

sequelize
  .authenticate()
  .then(() => {
    logger.info(
      `DB Connection Success --> ${process.env.DB_NAME} (${process.env.DB_USER})`
    );
    console.log(
      `DB Connection Success --> ${process.env.DB_NAME} (${process.env.DB_USER})`
    );
  })
  .catch((error) => {
    logger.error(`DB Connection Failed --> ${error}`);
    console.log(
      `DB Connection Failed --> {(${error.name})<<--->>(${error.message})}`
    );
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.literal = literal;
db.QueryTypes = QueryTypes;
db.employeeMaster = Employee(sequelize, Sequelize);
db.bandMaster = Band(sequelize, Sequelize);
db.buMaster = Bu(sequelize, Sequelize);
db.costCenterMaster = CostCenter(sequelize, Sequelize);
db.designationMaster = Designation(sequelize, Sequelize);
db.gradeMaster = Grade(sequelize, Sequelize);
db.jobLevelMaster = JobLevel(sequelize, Sequelize);
db.roleMaster = Role(sequelize, Sequelize);
db.functionalAreaMaster = FunctionalArea(sequelize, Sequelize);
db.stateMaster = State(sequelize, Sequelize);
db.regionMaster = Region(sequelize, Sequelize);
db.cityMaster = City(sequelize, Sequelize);
db.companyLocationMaster = CompanyLocation(sequelize, Sequelize);
db.companyMaster = Company(sequelize, Sequelize);
db.companyTypeMaster = CompanyType(sequelize, Sequelize);
db.countryMaster = Country(sequelize, Sequelize);
db.currencyMaster = Currency(sequelize, Sequelize);
db.departmentMaster = Department(sequelize, Sequelize);
db.districtMaster = District(sequelize, Sequelize);
db.employeeTypeMaster = EmployeeType(sequelize, Sequelize);
db.industryMaster = Industry(sequelize, Sequelize);
db.pinCodeMaster = PinCode(sequelize, Sequelize);
db.timeZoneMaster = TimeZone(sequelize, Sequelize);
db.groupCompanyMaster = GroupCompany(sequelize, Sequelize);
db.buMapping = BuMapping(sequelize, Sequelize);
db.sbuMapping = SbuMapping(sequelize, Sequelize);
db.biographicalDetails = EmployeeBiographicalDetails(sequelize, Sequelize);
db.jobDetails = EmployeeJobDetails(sequelize, Sequelize);
db.emergencyDetails = EmployeeEmergencyContact(sequelize, Sequelize);
db.familyDetails = EmployeeFamilyDetails(sequelize, Sequelize);
db.degreeMaster = DegreeMaster(sequelize, Sequelize);
db.educationDetails = EmployeeEducationDetails(sequelize, Sequelize);
db.paymentDetails = EmployeePaymentDetails(sequelize, Sequelize);
db.vaccinationDetails = EmployeeVaccinationDetails(sequelize, Sequelize);
db.departmentMapping = DepartmentMapping(sequelize, Sequelize);
db.functionalAreaMapping = FunctionalAreaMapping(sequelize, Sequelize);
db.salaryComponent = SalaryComponent(sequelize, Sequelize);
db.payElements = PayElements(sequelize, Sequelize);
db.paySlips = PaySlip(sequelize, Sequelize);
db.paySlipComponent = PaySlipComponent(sequelize, Sequelize);
db.payPackage = PayPackage(sequelize, Sequelize);
db.shiftMaster = ShiftMaster(sequelize, Sequelize);
db.attendanceMaster = AttendanceMaster(sequelize, Sequelize);
db.regularizationMaster = RegularizationMaster(sequelize, Sequelize);
db.sbuMaster = SbuMaster(sequelize, Sequelize);
db.BusinessLogic = BusinessLogic(sequelize, Sequelize);
db.DashboardCard = DashboardCard(sequelize, Sequelize);
db.leaveMaster = Leave(sequelize, Sequelize);
db.leaveMapping = LeaveMapping(sequelize, Sequelize);
db.holidayMaster = holidayMaster(sequelize, Sequelize);
db.holidayCompanyLocationConfiguration = holidayCompanyLocationConfiguration(
  sequelize,
  Sequelize
);
db.attendancePolicymaster = attendancePolicymaster(sequelize, Sequelize);
db.employeeLeaveTransactions = employeeLeaveTransactions(sequelize, Sequelize);

db.DaysMaster = DaysMaster(sequelize, Sequelize);
db.weekOffMaster = weekOffMaster(sequelize, Sequelize);
db.weekOffDayMappingMaster = weekOffDayMappingMaster(sequelize, Sequelize);
db.CalenderYear = CalenderYear(sequelize, Sequelize);
db.loginDetails = LoginDetails(sequelize, Sequelize);
db.permissoinandaccess = permissoinandaccess(sequelize, Sequelize);
db.managerHistory = ManagerHistory(sequelize, Sequelize);
db.employeeJobDetailsHistory = employeeJobDetailsHistory(sequelize, Sequelize);
db.employeeEducationDetailsHistory = EmployeeEducationDetailsHistory(
  sequelize,
  Sequelize
);
db.familyMemberHistory = FamilyMemberHistory(sequelize, Sequelize);
db.attendanceHistory = AttendanceHistory(sequelize, Sequelize);
db.unionCodIncrementMaster = UnionCodeIncrementMaster(sequelize, Sequelize);
db.salutationMaster = SalutationMaster(sequelize, Sequelize);
db.employeeAddress = EmployeeAddress(sequelize, Sequelize);
db.employeeWorkExperience = EmployeeWorkExperience(sequelize, Sequelize);
db.hrLetters = HrLetters(sequelize, Sequelize);
db.hrDocumentMaster = HrDocumentMaster(sequelize, Sequelize);
db.employeeCertificates = EmployeeCertificates(sequelize, Sequelize);
db.separationMaster = SeparationMaster(sequelize, Sequelize);
db.noticePeriodMaster = NoticePeriodMaster(sequelize, Sequelize);
db.separationType = SeparationType(sequelize, Sequelize);
db.separationReason = SeparationReason(sequelize, Sequelize);
db.managerHistory = ManagerHistory(sequelize, Sequelize);
db.employeeJobDetailsHistory = employeeJobDetailsHistory(sequelize, Sequelize);
db.employeeEducationDetailsHistory = EmployeeEducationDetailsHistory(
  sequelize,
  Sequelize
);
db.familyMemberHistory = FamilyMemberHistory(sequelize, Sequelize);
db.attendanceHistory = AttendanceHistory(sequelize, Sequelize);
db.employeeStagingMaster = EmployeeStaging(sequelize, Sequelize);
db.probationMaster = ProbationMaster(sequelize, Sequelize);
db.separationStatus = SeparationStatus(sequelize, Sequelize);
db.lwfDesignationMaster = LwfDesignationMaster(sequelize, Sequelize);
db.newCustomerNameMaster = NewCustomerNameMaster(sequelize, Sequelize);
db.reportModuleMaster = ReportModuleMaster(sequelize, Sequelize);
db.reportType = ReportType(sequelize, Sequelize);
db.separationTrail = SeparationTrails(sequelize, Sequelize);
db.taskFilterMaster = TaskFilterMaster(sequelize, Sequelize);
db.separationTaskMaster = SeparationTaskMaster(sequelize, Sequelize);
db.separationTaskConfig = SeparationTaskConfig(sequelize, Sequelize);
db.separationTaskOwner = SeparationTaskOwner(sequelize, Sequelize);
db.separationTaskMapping = SeparationTaskMapping(sequelize, Sequelize);
db.separationTaskFields = SeparationTaskFields(sequelize, Sequelize);
db.separationFieldValues = SeparationFieldsValues(sequelize, Sequelize);
db.separationInitiatedTask = SeparationInitiatedTask(sequelize, Sequelize);
db.categoryMaster = CategoryMaster(sequelize, Sequelize);
db.subCategoryMaster = SubCategoryMaster(sequelize, Sequelize);
db.PolicyHistory = PolicyHistory(sequelize, Sequelize);
db.ptLocationMaster = PTLocationMaster(sequelize, Sequelize);

db.holidayCompanyLocationConfiguration.hasOne(db.holidayMaster, {
  foreignKey: "holidayId",
  sourceKey: "holidayId",
  as: "holidayDetails",
});

db.employeeMaster.hasMany(db.employeeMaster, {
  foreignKey: "manager",
  sourceKey: "id",
  as: "reportie",
});
db.employeeMaster.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "manager",
  as: "managerData",
});
db.employeeMaster.hasOne(db.roleMaster, {
  foreignKey: "role_id",
  sourceKey: "role_id",
});
db.employeeMaster.hasOne(db.designationMaster, {
  foreignKey: "designationId",
  sourceKey: "designation_id",
});
db.buMapping.hasOne(db.buMaster, { foreignKey: "buId", sourceKey: "buId" });
db.employeeMaster.hasOne(db.functionalAreaMaster, {
  foreignKey: "functionalAreaId",
  sourceKey: "functionalAreaId",
});
db.employeeMaster.hasOne(db.buMaster, {
  foreignKey: "buId",
  sourceKey: "buId",
});
db.employeeMaster.hasOne(db.sbuMaster, {
  foreignKey: "sbuId",
  sourceKey: "sbuId",
});
db.employeeMaster.hasOne(db.departmentMaster, {
  foreignKey: "departmentId",
  sourceKey: "departmentId",
});
db.employeeMaster.hasOne(db.companyMaster, {
  foreignKey: "companyId",
  sourceKey: "companyId",
});
db.companyMaster.hasOne(db.groupCompanyMaster, {
  foreignKey: "groupId",
  sourceKey: "groupId",
});
db.employeeMaster.hasOne(db.biographicalDetails, {
  foreignKey: "userId",
  sourceKey: "id",
});
db.employeeMaster.hasOne(db.jobDetails, {
  foreignKey: "userId",
  sourceKey: "id",
});
db.employeeMaster.hasOne(db.emergencyDetails, {
  foreignKey: "userId",
  sourceKey: "id",
});
db.employeeMaster.hasOne(db.shiftMaster, {
  foreignKey: "shiftId",
  sourceKey: "shiftId",
});
db.employeeMaster.hasMany(db.familyDetails, {
  foreignKey: "EmployeeId",
  sourceKey: "id",
});
db.employeeMaster.hasMany(db.educationDetails, {
  foreignKey: "userId",
  sourceKey: "id",
});
db.employeeMaster.hasOne(db.paymentDetails, {
  foreignKey: "userId",
  sourceKey: "id",
});
db.employeeMaster.hasOne(db.vaccinationDetails, {
  foreignKey: "userId",
  sourceKey: "id",
});
db.educationDetails.hasOne(db.degreeMaster, {
  foreignKey: "degreeId",
  sourceKey: "educationDegree",
});
db.sbuMapping.hasOne(db.sbuMaster, { foreignKey: "sbuId", sourceKey: "sbuId" });
db.departmentMapping.hasOne(db.departmentMaster, {
  foreignKey: "departmentId",
  sourceKey: "departmentId",
});
db.functionalAreaMapping.hasOne(db.functionalAreaMaster, {
  foreignKey: "functionalAreaId",
  sourceKey: "functionalAreaId",
});
db.payElements.hasOne(db.salaryComponent, {
  foreignKey: "salaryComponentAutoId",
  sourceKey: "salaryComponentAutoId",
});
db.payElements.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "EmployeeId",
});
db.paySlips.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "EmployeeId",
});
db.paySlipComponent.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "EmployeeId",
});
db.paySlipComponent.hasOne(db.salaryComponent, {
  foreignKey: "salaryComponentAutoId",
  sourceKey: "salaryComponentAutoId",
});
db.paySlips.hasMany(db.paySlipComponent, {
  foreignKey: "paySlipAutoId",
  sourceKey: "paySlipAutoId",
});
db.attendanceMaster.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "employeeId",
});
db.employeeMaster.hasOne(db.attendanceMaster, {
  foreignKey: "employeeId",
  sourceKey: "id",
});
db.attendanceMaster.hasOne(db.shiftMaster, {
  foreignKey: "shiftId",
  sourceKey: "attendanceShiftId",
});
db.attendanceMaster.hasOne(db.attendancePolicymaster, {
  foreignKey: "attendancePolicyId",
  sourceKey: "attendancePolicyId",
});
db.attendanceMaster.hasOne(db.weekOffMaster, {
  foreignKey: "weekOffId",
  sourceKey: "weekOffId",
});
db.regularizationMaster.hasOne(db.attendanceMaster, {
  foreignKey: "attendanceAutoId",
  sourceKey: "attendanceAutoId",
});
db.regularizationMaster.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "updatedBy",
  as: "attendanceUpdatedBy",
});

db.employeeLeaveTransactions.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "updatedBy",
  as: "leaveUpdatedBy",
});
db.attendanceMaster.hasMany(db.regularizationMaster, {
  foreignKey: "attendanceAutoId",
  sourceKey: "attendanceAutoId",
  as: "latest_Regularization_Request",
});
db.leaveMapping.hasOne(db.leaveMaster, {
  foreignKey: "leaveId",
  sourceKey: "leaveAutoId",
});
db.leaveMapping.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "EmployeeId",
});
db.employeeMaster.hasOne(db.attendancePolicymaster, {
  foreignKey: "attendancePolicyId",
  sourceKey: "attendancePolicyId",
});
db.employeeMaster.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "buHRId",
  as: "buhrData",
});

db.employeeMaster.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "buHeadId",
  as: "buHeadData",
});

db.attendanceMaster.hasMany(db.employeeLeaveTransactions, {
  foreignKey: "appliedFor",
  sourceKey: "attendanceDate",
  as: "employeeLeaveTransactionDetails",
});

db.employeeLeaveTransactions.hasMany(db.leaveMaster, {
  foreignKey: "leaveId",
  sourceKey: "leaveAutoId",
  as: "leaveMasterDetails",
});

db.employeeLeaveTransactions.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "employeeId",
});

db.employeeMaster.belongsTo(db.employeeLeaveTransactions, {
  foreignKey: "id",
  sourceKey: "employeeId",
});

db.attendanceMaster.hasMany(db.holidayCompanyLocationConfiguration, {
  foreignKey: "holidayCompanyLocationConfigurationID",
  sourceKey: "holidayCompanyLocationConfigurationID",
  as: "holidayLocationMappingDetails",
});

db.employeeMaster.hasOne(db.weekOffMaster, {
  foreignKey: "weekOffId",
  sourceKey: "weekOffId",
});

db.weekOffMaster.hasMany(db.weekOffDayMappingMaster, {
  foreignKey: "weekOffId",
  sourceKey: "weekOffId",
});

db.employeeMaster.hasMany(db.holidayCompanyLocationConfiguration, {
  foreignKey: "companyLocationId",
  sourceKey: "companyLocationId",
});
db.employeeMaster.hasOne(db.companyLocationMaster, {
  foreignKey: "companyLocationId",
  sourceKey: "companyLocationId",
});

db.employeeMaster.hasMany(db.loginDetails, {
  foreignKey: "employeeId",
  sourceKey: "id",
});
db.buMapping.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "headId",
  as: "buHeadData",
});
db.buMapping.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "buHrId",
  as: "buhrData",
});
db.jobDetails.hasOne(db.unionCodIncrementMaster, {
  foreignKey: "unionCodeId",
  sourceKey: "unionId",
  as: "incrementCycle",
});
db.jobDetails.hasOne(db.bandMaster, {
  foreignKey: "bandId",
  sourceKey: "bandId",
});
db.jobDetails.hasOne(db.gradeMaster, {
  foreignKey: "gradeId",
  sourceKey: "gradeId",
});
db.jobDetails.hasOne(db.jobLevelMaster, {
  foreignKey: "jobLevelId",
  sourceKey: "jobLevelId",
});
db.employeeMaster.hasOne(db.salutationMaster, {
  foreignKey: "salutationId",
  sourceKey: "salutationId",
});
db.biographicalDetails.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "userId",
});
db.jobDetails.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "userId",
});
db.companyLocationMaster.hasOne(db.cityMaster, {
  foreignKey: "cityId",
  sourceKey: "cityId",
});
db.companyLocationMaster.hasOne(db.stateMaster, {
  foreignKey: "stateId",
  sourceKey: "stateId",
});
db.employeeMaster.hasOne(db.employeeAddress, {
  foreignKey: "employeeId",
  sourceKey: "id",
});
db.employeeAddress.hasOne(db.cityMaster, {
  foreignKey: "cityId",
  sourceKey: "currentCityId",
  as: "currentcity",
});
db.employeeAddress.hasOne(db.cityMaster, {
  foreignKey: "cityId",
  sourceKey: "permanentCityId",
  as: "permanentcity",
});
db.employeeAddress.hasOne(db.cityMaster, {
  foreignKey: "cityId",
  sourceKey: "emergencyCityId",
  as: "emergencycity",
});
db.employeeAddress.hasOne(db.stateMaster, {
  foreignKey: "stateId",
  sourceKey: "currentStateId",
  as: "currentstate",
});
db.employeeAddress.hasOne(db.stateMaster, {
  foreignKey: "stateId",
  sourceKey: "permanentStateId",
  as: "permanentstate",
});
db.employeeAddress.hasOne(db.stateMaster, {
  foreignKey: "stateId",
  sourceKey: "emergencyStateId",
  as: "emergencystate",
});
db.employeeAddress.hasOne(db.countryMaster, {
  foreignKey: "countryId",
  sourceKey: "currentCountryId",
  as: "currentcountry",
});
db.employeeAddress.hasOne(db.countryMaster, {
  foreignKey: "countryId",
  sourceKey: "permanentCountryId",
  as: "permanentcountry",
});
db.employeeAddress.hasOne(db.countryMaster, {
  foreignKey: "countryId",
  sourceKey: "emergencyCountryId",
  as: "emergencycountry",
});
db.employeeAddress.hasOne(db.pinCodeMaster, {
  foreignKey: "pincodeId",
  sourceKey: "currentPincodeId",
  as: "currentpincode",
});
db.employeeAddress.hasOne(db.pinCodeMaster, {
  foreignKey: "pincodeId",
  sourceKey: "permanentPincodeId",
  as: "permanentpincode",
});
db.employeeAddress.hasOne(db.pinCodeMaster, {
  foreignKey: "pincodeId",
  sourceKey: "emergencyPincodeId",
  as: "emergencypincode",
});
db.jobDetails.hasOne(db.stateMaster, {
  foreignKey: "stateId",
  sourceKey: "lwfState",
  as: "lwfStateName",
});
db.jobDetails.hasOne(db.lwfDesignationMaster, {
  foreignKey: "lwfDesignationId",
  sourceKey: "lwfDesignation",
  as: "lwfDesignationName",
});
db.employeeMaster.hasMany(db.employeeWorkExperience, {
  foreignKey: "userId",
  sourceKey: "id",
});
db.employeeMaster.hasMany(db.hrLetters, {
  foreignKey: "userId",
  sourceKey: "id",
});
db.employeeMaster.hasMany(db.employeeCertificates, {
  foreignKey: "userId",
  sourceKey: "id",
});
db.hrLetters.hasOne(db.hrDocumentMaster, {
  foreignKey: "documentId",
  sourceKey: "documentType",
});
db.separationMaster.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "employeeId",
});
db.separationMaster.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "createdBy",
  as: "initiatedByUser",
});
db.employeeMaster.hasOne(db.noticePeriodMaster, {
  foreignKey: "noticePeriodAutoId",
  sourceKey: "noticePeriodAutoId",
});

db.companyLocationMaster.hasOne(db.cityMaster, {
  foreignKey: "cityId",
  sourceKey: "cityId",
});
db.companyLocationMaster.hasOne(db.pinCodeMaster, {
  foreignKey: "pincodeId",
  sourceKey: "pincodeId",
});

db.employeeStagingMaster.hasOne(db.roleMaster, {
  foreignKey: "role_id",
  sourceKey: "role_id",
});
db.employeeStagingMaster.hasOne(db.designationMaster, {
  foreignKey: "designationId",
  sourceKey: "designation_id",
});
db.employeeStagingMaster.hasOne(db.functionalAreaMaster, {
  foreignKey: "functionalAreaId",
  sourceKey: "functionalAreaId",
});
db.employeeStagingMaster.hasOne(db.buMaster, {
  foreignKey: "buId",
  sourceKey: "buId",
});
db.employeeStagingMaster.hasOne(db.sbuMaster, {
  foreignKey: "sbuId",
  sourceKey: "sbuId",
});
db.employeeStagingMaster.hasOne(db.departmentMaster, {
  foreignKey: "departmentId",
  sourceKey: "departmentId",
});
db.employeeStagingMaster.hasOne(db.companyMaster, {
  foreignKey: "companyId",
  sourceKey: "companyId",
});
db.employeeStagingMaster.hasOne(db.shiftMaster, {
  foreignKey: "shiftId",
  sourceKey: "shiftId",
});
db.employeeStagingMaster.hasOne(db.companyLocationMaster, {
  foreignKey: "companyLocationId",
  sourceKey: "companyLocationId",
});
db.separationMaster.hasOne(db.separationStatus, {
  foreignKey: "separationStatusAutoId",
  sourceKey: "finalStatus",
});
db.separationMaster.hasOne(db.separationType, {
  foreignKey: "separationTypeAutoId",
  sourceKey: "l2SeparationType",
  as: "l2Separationtype",
});
db.separationMaster.hasOne(db.separationReason, {
  foreignKey: "separationReasonAutoId",
  sourceKey: "l2ReasonOfSeparation",
  as: "l2ReasonofSeparation",
});

db.separationMaster.hasOne(db.separationReason, {
  foreignKey: "separationReasonAutoId",
  sourceKey: "empReasonOfResignation",
  as: "empReasonofResignation",
});
db.separationMaster.hasOne(db.separationReason, {
  foreignKey: "separationReasonAutoId",
  sourceKey: "l1ReasonOfResignation",
  as: "l1ReasonofResignation",
});

db.employeeMaster.hasMany(db.leaveMapping, {
  foreignKey: "EmployeeId",
  sourceKey: "id",
  as: "employeeLeaves",
});

db.reportModuleMaster.hasMany(db.reportType, {
  foreignKey: "reportModuleId",
  sourceKey: "reportModuleId",
});
db.separationStatus.hasOne(db.separationTrail, {
  foreignKey: "separationStatus",
  sourceKey: "separationStatusAutoId",
});

db.separationTrail.hasOne(db.separationMaster, {
  foreignKey: "resignationAutoId",
  sourceKey: "separationAutoId",
});
db.separationMaster.hasMany(db.separationTrail, {
  foreignKey: "separationAutoId",
  sourceKey: "resignationAutoId",
});
db.separationMaster.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "pendingAt",
  as: "pending",
});
db.separationTrail.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "pendingAt",
  as: "pendingat",
});
db.separationTaskMapping.hasOne(db.separationTaskConfig, {
  foreignKey: "taskConfigAutoId",
  sourceKey: "taskConfigAutoId",
});
db.separationTaskMapping.hasOne(db.separationTaskMaster, {
  foreignKey: "taskAutoId",
  sourceKey: "taskAutoId",
});
db.separationTaskMapping.hasOne(db.companyMaster, {
  foreignKey: "companyId",
  sourceKey: "companyId",
});
db.separationTaskMapping.hasOne(db.buMaster, {
  foreignKey: "buId",
  sourceKey: "buId",
});
db.separationTaskMapping.hasOne(db.sbuMaster, {
  foreignKey: "sbuId",
  sourceKey: "sbuId",
});
db.separationTaskMapping.hasOne(db.functionalAreaMaster, {
  foreignKey: "functionalAreaId",
  sourceKey: "functionalAreaId",
});
db.separationTaskOwner.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "taskOwner",
});
db.separationTaskMapping.hasMany(db.separationTaskOwner, {
  foreignKey: "taskMappingAutoId",
  sourceKey: "taskMappingAutoId",
});
db.separationTaskMaster.hasMany(db.separationTaskFields, {
  foreignKey: "taskAutoId",
  sourceKey: "taskAutoId",
});
db.separationInitiatedTask.hasOne(db.separationTaskMapping, {
  foreignKey: "taskAutoId",
  sourceKey: "taskAutoId",
});
db.separationInitiatedTask.hasOne(db.separationTaskMaster, {
  foreignKey: "taskAutoId",
  sourceKey: "taskAutoId",
});
db.separationInitiatedTask.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "employeeId",
});
db.separationMaster.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "employeeId",
});
db.employeeMaster.hasOne(db.separationMaster, {
  foreignKey: "employeeId",
  sourceKey: "id",
});
db.categoryMaster.hasMany(db.subCategoryMaster, {
  foreignKey: "categoryAutoId",
  sourceKey: "categoryAutoId",
});

db.managerHistory.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "managerId",
  as: "managerHistoryDate",
});

db.PolicyHistory.hasOne(db.shiftMaster, {
  foreignKey: "shiftId",
  sourceKey: "shiftPolicy",
  as: "historyshiftMaster",
});
db.PolicyHistory.hasOne(db.attendancePolicymaster, {
  foreignKey: "attendancePolicyId",
  sourceKey: "attendancePolicy",
  as: "historyattendanceMaster",
});
db.PolicyHistory.hasOne(db.weekOffMaster, {
  foreignKey: "weekOffId",
  sourceKey: "weekOffPolicy",
  as: "historyweekOffMaster",
});
db.PolicyHistory.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "createdBy",
  as: "PolicyUpdaterDetails",
});
db.attendanceMaster.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "createdBy",
  as: "punchInCreatedBy",
});
db.attendanceMaster.hasOne(db.employeeMaster, {
  foreignKey: "id",
  sourceKey: "updatedBy",
  as: "punchOutCreatedBy",
});

db.separationTaskFields.hasOne(db.separationFieldValues, {
  sourceKey: "taskFieldsAutoId",
  foreignKey: "fields",
});

export default db;
