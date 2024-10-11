import Joi from "joi";

const companyTypeMasterSchema = Joi.object({
  typeName: Joi.string().required().label("Company Type Name")
});

const bandMasterSchema = Joi.object({
  bandCode: Joi.string().required().label("Band Code"),
  bandDesc: Joi.string().allow('').label("Band Description")
});

const jobLevelMasterSchema = Joi.object({
  jobLevelName: Joi.string().required().label("Job Level Name"),
  jobLevelCode: Joi.string().allow('').label("job Level Code")
});

export default {
  companyTypeMasterSchema,
  bandMasterSchema,
  jobLevelMasterSchema
};
