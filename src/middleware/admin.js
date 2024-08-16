import Joi from "joi";

const companyTypeMasterSchema = Joi.object({
  typeName: Joi.string().required().label("Company Type Name")
});

const bandMasterSchema = Joi.object({
    bandCode: Joi.string().required().label("Band Code"),
    bandDesc: Joi.string().allow('').label("Band Description")
});

export default {
    companyTypeMasterSchema,
    bandMasterSchema
};
