import db from "../../../../config/db.config.js";
import validator from "../../../../middleware/admin.js";
import logger from "../../../../helper/logger.js";
import respHelper from "../../../../helper/respHelper.js";
import service from "./common.service.js";

class CommonController {

    /**
     * CRUD of Company Type Master
     * 
    */

    async createCompanyType(req, res) {
        try {
            const result = await validator.companyTypeMasterSchema.validateAsync(req.body);
            let model = db.companyTypeMaster;
            let query = { typeName: result.typeName };
            let moduleName = "Company Type";
            let response = await service.create(model, result, query, moduleName);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            if (error.isJoi === true) {
                return respHelper(res, {
                    status: 422,
                    msg: error.details[0].message,
                });
            }
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async companyTypeList(req, res) {
        try {
            let model = db.companyTypeMaster;
            let query = { 'isDeleted': 0 };
            let response = await service.list(model, query);
            let count = await service.count(model, query);
            let obj = { 'rows': response.data, 'count': count };
            return respHelper(res, { 'status': response.status, 'msg': response.msg, 'data': obj });

        } catch (error) {
            logger.error(error);
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async companyTypeDetails(req, res) {
        try {
            let model = db.companyTypeMaster;
            let id = req.params.id;
            let query = { 'companyTypeId': id };
            let response = await service.details(model, query);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async updateCompanyType(req, res) {
        try {
            const result = await validator.companyTypeMasterSchema.validateAsync(req.body);
            let model = db.companyTypeMaster;
            let query = { companyTypeId: req.params.id };
            let response = await service.update(model, result, query);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            if (error.isJoi === true) {
                return respHelper(res, {
                    status: 422,
                    msg: error.details[0].message,
                });
            }
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async changeStatusOfCompanyType(req, res) {
        try {
            let model = db.companyTypeMaster;
            let query = { companyTypeId: req.params.id };
            let response = await service.changeStatus(model, query);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            if (error.isJoi === true) {
                return respHelper(res, {
                    status: 422,
                    msg: error.details[0].message,
                });
            }
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async deleteOfCompanyType(req, res) {
        try {
            let model = db.companyTypeMaster;
            let query = { companyTypeId: req.params.id };
            let updateMetaData = { 'isDeleted': 1 };
            let moduleName = 'Company Type';
            let response = await service.delete(model, updateMetaData, query, moduleName);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            return respHelper(res, {
                status: 500,
            });
        }
    }

    /**
     * CRUD of Band Master
     * 
    */

    async createBand(req, res) {
        try {
            const result = await validator.bandMasterSchema.validateAsync(req.body);
            let model = db.bandMaster;
            let query = { bandCode: result.bandCode };
            let moduleName = "Band";
            let response = await service.create(model, result, query, moduleName);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            if (error.isJoi === true) {
                return respHelper(res, {
                    status: 422,
                    msg: error.details[0].message,
                });
            }
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async bandList(req, res) {
        try {
            let model = db.bandMaster;
            let query = { 'isDeleted': 0 };
            let response = await service.list(model, query);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async bandDetails(req, res) {
        try {
            let model = db.bandMaster;
            let id = req.params.id;
            let query = { 'bandId': id };
            let response = await service.details(model, query);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async updateBand(req, res) {
        try {
            const result = await validator.bandMasterSchema.validateAsync(req.body);
            let model = db.bandMaster;
            let query = { bandId: req.params.id };
            let response = await service.update(model, result, query);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            if (error.isJoi === true) {
                return respHelper(res, {
                    status: 422,
                    msg: error.details[0].message,
                });
            }
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async changeStatusOfBand(req, res) {
        try {
            let model = db.bandMaster;
            let query = { bandId: req.params.id };
            let response = await service.changeStatus(model, query);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            if (error.isJoi === true) {
                return respHelper(res, {
                    status: 422,
                    msg: error.details[0].message,
                });
            }
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async deleteOfBand(req, res) {
        try {
            let model = db.bandMaster;
            let query = { bandId: req.params.id };
            let updateMetaData = { 'isDeleted': 1 };
            let moduleName = 'Band';
            let response = await service.delete(model, updateMetaData, query, moduleName);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            return respHelper(res, {
                status: 500,
            });
        }
    }

    /**
     * CRUD of Job Level Master
     * 
    */

    async createJobLevel(req, res) {
        try {
            const result = await validator.jobLevelMasterSchema.validateAsync(req.body);
            let model = db.jobLevelMaster;
            let query = { 'jobLevelName': result.jobLevelName, 'jobLevelCode': result.jobLevelCode };
            let moduleName = "Job Level";
            let response = await service.create(model, result, query, moduleName);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            if (error.isJoi === true) {
                return respHelper(res, {
                    status: 422,
                    msg: error.details[0].message,
                });
            }
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async jobLevelList(req, res) {
        try {
            let model = db.jobLevelMaster;
            let query = { 'isDeleted': 0 };
            let response = await service.list(model, query);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async jobLevelDetails(req, res) {
        try {
            let model = db.jobLevelMaster;
            let id = req.params.id;
            let query = { 'jobLevelId': id };
            let response = await service.details(model, query);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async updateJobLevel(req, res) {
        try {
            const result = await validator.jobLevelMasterSchema.validateAsync(req.body);
            let model = db.jobLevelMaster;
            let query = { jobLevelId: req.params.id };
            let response = await service.update(model, result, query);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            if (error.isJoi === true) {
                return respHelper(res, {
                    status: 422,
                    msg: error.details[0].message,
                });
            }
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async changeStatusOfJobLevel(req, res) {
        try {
            let model = db.jobLevelMaster;
            let query = { jobLevelId: req.params.id };
            let response = await service.changeStatus(model, query);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            if (error.isJoi === true) {
                return respHelper(res, {
                    status: 422,
                    msg: error.details[0].message,
                });
            }
            return respHelper(res, {
                status: 500,
            });
        }
    }

    async deleteOfJobLevel(req, res) {
        try {
            let model = db.jobLevelMaster;
            let query = { jobLevelId: req.params.id };
            let updateMetaData = { 'isDeleted': 1 };
            let moduleName = 'Job Level';
            console.log(query)
            let response = await service.delete(model, updateMetaData, query, moduleName);
            return respHelper(res, response);

        } catch (error) {
            logger.error(error);
            return respHelper(res, {
                status: 500,
            });
        }
    }

    // close class
}


export default new CommonController();
