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

const attendanceSchema = Joi.object({
    locationType: Joi.string().trim().max(250).label("Location Type"),
    remark: Joi.string().trim().max(250).label("Remark"),
    location: Joi.string().trim().label("Location"),
    latitude: Joi.string().trim().label("Latitude"),
    longitude: Joi.string().trim().label("Longitude"),
})

const regularizeRequest = Joi.object({
    fromDate: Joi.string().trim().label("From Date"),
    toDate: Joi.string().trim().label("To Date"),
    locationType: Joi.string(),
    punchInTime: Joi.string(),
    punchOutTime: Joi.string(),
    reason: Joi.string(),
    attendanceAutoId: Joi.number(),
    remark: Joi.string(),
})

const approveRegularizationRequestSchema = Joi.object({
    regularizeId: Joi.number(),
    remark: Joi.string().trim().max(250),
    status: Joi.number().valid(0, 1)
})

const bankDetailsSchema = Joi.object({
    userId: Joi.number().optional(),
    paymentAccountNumber: Joi.string().required(),
    paymentBankName: Joi.string().required(),
    paymentBankIfsc: Joi.string().required(),
    paymentHolderName: Joi.string().required()
})

const unlockAccountSchema = Joi.object({
    employeeCode: Joi.string().trim().required().label("Employee Code")
})

const updateBiographicalDetailsSchema = Joi.object({
    userId: Joi.number().label("User ID"),
    maritalStatus: Joi.number().required().label("Marital Status"),
    mobileAccess: Joi.number().required().label("Mobile Access"),
    laptopSystem: Joi.string().trim().label("System"),
    backgroundVerification: Joi.number().required().label("Background Verification"),
    gender: Joi.string().trim().label("Gender"),
    dateOfBirth: Joi.string().trim().label("Date of Birth"),
})

const updateFamilyDetailsSchema = Joi.object({
    empFamilyDetailsId: Joi.number().required(),
    name: Joi.string().required().trim().label("Name"),
    dob: Joi.string().trim().label("DOB"),
    gender: Joi.string().trim().label("Gender"),
    mobileNo: Joi.string().trim().label("Mobile Number"),
    relationWithEmp: Joi.string().trim().label("Relation")
})

const updatePaymentDetailsSchema = Joi.object({
    userId: Joi.number().label("User ID"),
    paymentAccountNumber: Joi.string().trim().required().label("Account Number"),
    paymentBankName: Joi.string().trim().required().label("Bank Name"),
    paymentBankIfsc: Joi.string().trim().required().max(11).label("Bank Ifsc Code"),
    paymentHolderName: Joi.string().trim().required().label("Account Holder Name")
})

const addPaymentDetailsSchema = Joi.object({

})

export default {
    loginSchema,
    userCreationSchema,
    attendanceSchema,
    regularizeRequest,
    approveRegularizationRequestSchema,
    bankDetailsSchema,
    unlockAccountSchema,
    updateBiographicalDetailsSchema,
    updateFamilyDetailsSchema,
    updatePaymentDetailsSchema
}
