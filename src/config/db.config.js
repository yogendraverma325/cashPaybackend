import Sequelize from 'sequelize';
import logger from '../helper/logger.js';
import Employee from '../api/model/Employee.js';
import Band from '../api/model/BandMaster.js';
import Bu from '../api/model/BuMaster.js';
import CostCenter from '../api/model/CostCenterMaster.js';
import Designation from '../api/model/DesignationMaster.js';
import Grade from '../api/model/GradeMaster.js';
import JobLevel from '../api/model/JobLevelMaster.js';
import FunctionalArea from '../api/model/FunctionalAreaMaster.js';
import State from '../api/model/StateMaster.js';
import Role from '../api/model/RoleMaster.js';
import Region from '../api/model/RegionMaster.js';
import City from '../api/model/CityMaster.js';
import CompanyLocation from '../api/model/CompanyLocationMaster.js';
import Company from '../api/model/CompanyMaster.js';
import CompanyType from '../api/model/CompanyTypeMaster.js';
import Country from '../api/model/CountryMaster.js';
import Currency from '../api/model/CurrencyMaster.js';
import Department from '../api/model/DepartmentMaster.js';
import District from '../api/model/DistrictMaster.js';
import EmployeeType from '../api/model/EmployeeTypeMaster.js';
import Industry from '../api/model/industryMaster.js';
import PinCode from '../api/model/PinCodeMaster.js';
import TimeZone from '../api/model/Timezone.js';
import GroupCompany from '../api/model/GroupCompany.js';
import BuMapping from '../api/model/BuMapping.js';
import SbuMapping from '../api/model/SbuMapping.js';
import EmployeeBiographicalDetails from '../api/model/EmployeeBiographicalDetails.js';
import EmployeeJobDetails from '../api/model/EmployeeJobDetails.js';
import EmployeeEmergencyContact from '../api/model/EmployeeEmergencyContact.js';
import EmployeeFamilyDetails from '../api/model/EmployeeFamilyDetails.js';
import DegreeMaster from '../api/model/DegreeMaster.js';
import EmployeeEducationDetails from '../api/model/EmployeeEducationDetails.js';
import EmployeePaymentDetails from '../api/model/EmployeePaymentDetails.js';
import EmployeeVaccinationDetails from '../api/model/EmployeeVaccinationDetails.js';
import DepartmentMapping from '../api/model/DepartmentMapping.js';
import FunctionalAreaMapping from '../api/model/FunctionalAreaMapping.js';
import SalaryComponent from '../api/model/SalaryComponent.js';
import PayElements from '../api/model/PayElements.js';
import PaySlip from '../api/model/PaySlip.js';
import PaySlipComponent from '../api/model/PaySlipComponent.js';
import PayPackage from '../api/model/PayPackage.js';
import SbuMaster from '../api/model/sbumaster.js';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        freezeTableName: true,
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false,
    timezone: '+05:30',
});

sequelize.authenticate().then(() => {
    logger.info(`DB Connection Success --> ${process.env.DB_NAME} (${process.env.DB_USER})`)
    console.log(`DB Connection Success --> ${process.env.DB_NAME} (${process.env.DB_USER})`)
}).catch((error) => {
    logger.error(`DB Connection Failed --> ${error}`)
    console.log(`DB Connection Failed --> {(${error.name})<<--->>(${error.message})}`)
})

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.employeeMaster = Employee(sequelize, Sequelize)
db.bandMaster = Band(sequelize, Sequelize)
db.buMaster = Bu(sequelize, Sequelize)
db.costCenterMaster = CostCenter(sequelize, Sequelize)
db.designationMaster = Designation(sequelize, Sequelize)
db.gradeMaster = Grade(sequelize, Sequelize)
db.jobLevelMaster = JobLevel(sequelize, Sequelize)
db.roleMaster = Role(sequelize, Sequelize)
db.functionalAreaMaster = FunctionalArea(sequelize, Sequelize)
db.stateMaster = State(sequelize, Sequelize)
db.regionMaster = Region(sequelize, Sequelize)
db.cityMaster = City(sequelize, Sequelize)
db.companyLocationMaster = CompanyLocation(sequelize, Sequelize)
db.companyMaster = Company(sequelize, Sequelize)
db.companyTypeMaster = CompanyType(sequelize, Sequelize)
db.countryMaster = Country(sequelize, Sequelize)
db.currencyMaster = Currency(sequelize, Sequelize)
db.departmentMaster = Department(sequelize, Sequelize)
db.districtMaster = District(sequelize, Sequelize)
db.employeeTypeMaster = EmployeeType(sequelize, Sequelize)
db.industryMaster = Industry(sequelize, Sequelize)
db.pinCodeMaster = PinCode(sequelize, Sequelize)
db.timeZoneMaster = TimeZone(sequelize, Sequelize)
db.groupCompanyMaster = GroupCompany(sequelize, Sequelize)
db.buMapping = BuMapping(sequelize, Sequelize)
db.sbuMapping = SbuMapping(sequelize, Sequelize)
db.biographicalDetails = EmployeeBiographicalDetails(sequelize, Sequelize)
db.jobDetails = EmployeeJobDetails(sequelize, Sequelize)
db.emergencyDetails = EmployeeEmergencyContact(sequelize, Sequelize)
db.familyDetails = EmployeeFamilyDetails(sequelize, Sequelize)
db.degreeMaster = DegreeMaster(sequelize, Sequelize)
db.educationDetails = EmployeeEducationDetails(sequelize, Sequelize)
db.paymentDetails = EmployeePaymentDetails(sequelize, Sequelize)
db.vaccinationDetails = EmployeeVaccinationDetails(sequelize, Sequelize)
db.departmentMapping = DepartmentMapping(sequelize, Sequelize)
db.functionalAreaMapping = FunctionalAreaMapping(sequelize, Sequelize)
db.salaryComponent = SalaryComponent(sequelize, Sequelize)
db.payElements = PayElements(sequelize, Sequelize)
db.paySlips = PaySlip(sequelize, Sequelize)
db.paySlipComponent = PaySlipComponent(sequelize, Sequelize)
db.payPackage = PayPackage(sequelize, Sequelize)
db.sbuMaster = SbuMaster(sequelize, Sequelize)


db.employeeMaster.hasMany(db.employeeMaster, { foreignKey: 'manager', sourceKey: 'id', as: 'reportie' })
db.employeeMaster.hasOne(db.employeeMaster, { foreignKey: 'id', sourceKey: 'manager', as: 'managerData' })
db.employeeMaster.hasOne(db.roleMaster, { foreignKey: 'role_id', sourceKey: 'role_id' })
db.employeeMaster.hasOne(db.designationMaster, { foreignKey: 'designationId', sourceKey: 'designation_id' })
db.buMapping.hasOne(db.buMaster, { foreignKey: 'buId', sourceKey: 'buId' })
db.employeeMaster.hasOne(db.functionalAreaMaster, { foreignKey: 'functionalAreaId', sourceKey: 'functionalAreaId' })
db.employeeMaster.hasOne(db.buMaster, { foreignKey: 'buId', sourceKey: 'buId' })
db.employeeMaster.hasOne(db.departmentMaster, { foreignKey: 'departmentId', sourceKey: 'departmentId' })
db.employeeMaster.hasOne(db.companyMaster, { foreignKey: 'companyId', sourceKey: 'companyId' })
db.companyMaster.hasOne(db.groupCompanyMaster, { foreignKey: 'groupId', sourceKey: 'groupId' })
db.employeeMaster.hasOne(db.biographicalDetails, { foreignKey: 'userId', sourceKey: 'id' })
db.employeeMaster.hasOne(db.jobDetails, { foreignKey: 'userId', sourceKey: 'id' })
db.employeeMaster.hasOne(db.emergencyDetails, { foreignKey: 'userId', sourceKey: 'id' })
db.employeeMaster.hasMany(db.familyDetails, { foreignKey: 'EmployeeId', sourceKey: 'id' })
db.employeeMaster.hasMany(db.educationDetails, { foreignKey: 'userId', sourceKey: 'id' })
db.employeeMaster.hasOne(db.paymentDetails, { foreignKey: 'userId', sourceKey: 'id' })
db.employeeMaster.hasOne(db.vaccinationDetails, { foreignKey: 'userId', sourceKey: 'id' })
db.educationDetails.hasOne(db.degreeMaster, { foreignKey: 'degreeId', sourceKey: 'educationDegree' })
db.sbuMapping.hasOne(db.buMaster, { foreignKey: 'buId', sourceKey: 'sbuId' })
db.departmentMapping.hasOne(db.departmentMaster, { foreignKey: 'departmentId', sourceKey: 'departmentId' })
db.functionalAreaMapping.hasOne(db.functionalAreaMaster, { foreignKey: 'functionalAreaId', sourceKey: 'functionalAreaId' })
db.payElements.hasOne(db.salaryComponent, { foreignKey: 'salaryComponentAutoId', sourceKey: 'salaryComponentAutoId' })
db.payElements.hasOne(db.employeeMaster, { foreignKey: 'id', sourceKey: 'EmployeeId' })
db.paySlips.hasOne(db.employeeMaster, { foreignKey: 'id', sourceKey: 'EmployeeId' })
db.paySlipComponent.hasOne(db.employeeMaster, { foreignKey: 'id', sourceKey: 'EmployeeId' })
db.paySlipComponent.hasOne(db.salaryComponent, { foreignKey: 'salaryComponentAutoId', sourceKey: 'salaryComponentAutoId' })
db.paySlips.hasMany(db.paySlipComponent, { foreignKey: 'paySlipAutoId', sourceKey: 'paySlipAutoId' })
db.buMaster.hasOne(db.sbuMapping, {foreignKey:'buId',sourceKey:'buId'})
db.sbuMapping.hasOne(db.sbuMaster,{foreignKey:'id',sourceKey:'sbuId'})

export default db;