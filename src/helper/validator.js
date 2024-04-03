import Joi from "joi";

const loginSchema = Joi.object({
    tmc: Joi.string().required().label("TMC"),
    password: Joi.string().required().label("Password")
})

const userCreationSchema = Joi.object({
    name: Joi.string().trim().required().label("Name"),
    email: Joi.string().trim().email().required().label("Email"),
    firstName: Joi.string().trim().required().label("First Name"),
    lastName: Joi.string().trim().required().label("Last Name"),
    officeMobileNumber: Joi.string().trim().length(10).label("Office Mobile Number"),
    personalMobileNumber: Joi.string().trim().length(10).required().label("Office Mobile Number"),
    manager: Joi.number().required().label("Manager"),
    designation_id: Joi.number().required().label("Designation"),
    functionalAreaId: Joi.number().required().label("Functional Area"),
    buId: Joi.number().required().label("Business Unit"),
    departmentId: Joi.number().required().label("Department"),
    companyId: Joi.number().required().label("Company"),
    image: Joi.string()
})

export default {
    loginSchema,
    userCreationSchema
}
