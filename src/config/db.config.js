import Sequelize from 'sequelize';
import Employee from '../api/model/employee.js';
import Band from '../api/model/BandMaster.js';
import Bu from '../api/model/BuMaster.js';
import CostCenter from '../api/model/CostCenterMaster.js';
import Designation from '../api/model/DesignationMaster.js';
import Grade from '../api/model/GradeMaster.js';
import JobLevel from '../api/model/JobLevelMaster.js';

const sequelize = new Sequelize('hrms', 'root', '{Manish@876452}', {
    port: "3306",
    host: 'localhost',
    dialect: 'mysql',
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
    console.log(`DB Connection Success`)
}).catch((error) => {
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

db.employeeMaster.hasMany(db.employeeMaster, { foreignKey: 'manager', sourceKey: 'id', as: 'reportie' })

export default db;