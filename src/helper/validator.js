import Joi from "joi";


    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })

    const userCreationSchema = Joi.object({
        user_role:Joi.string().min(4).max(10).required(),
        user_tmc:Joi.string().min(5).max(10).required(),
        user_name:Joi.string().min(2).max(45).required(),
        user_email:Joi.string().email().required(),
        user_contact:Joi.string().min(10).max(10),
        user_bu:Joi.string().min(4).max(10).required(),
        // user_status:Joi.string().required(),

    })


export default {
    loginSchema,
    userCreationSchema
}
