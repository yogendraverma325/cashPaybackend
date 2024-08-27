import Joi from "joi";

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;,<.>?/~\\-]).{8,}$/

const loginSchema = Joi.object({
  tmc: Joi.string().required().label("TMC"),
  password: Joi.string().required().label("Password"),
});

const userCreationSchema = Joi.object({
  name: Joi.string().trim().required().label("Name"),
  email: Joi.string().trim().email().required().label("Email"),
  personalEmail: Joi.string().trim().email().required().label("Personal Email"),
  firstName: Joi.string().trim().required().label("First Name"),
  lastName: Joi.string().trim().required().label("Last Name"),

  panNo: Joi.string().trim().required().label("PAN Number"),
  esicNo: Joi.string().trim().required().label("ESIC Number"),
  uanNo: Joi.string().trim().required().label("UAN Number"),
  pfNo: Joi.string().trim().required().label("PF Number"),
  employeeType: Joi.string().trim().required().label("Employee Type"),
  image: Joi.string(),

  officeMobileNumber: Joi.string().trim().length(10).label("Office Mobile Number"),
  personalMobileNumber: Joi.string().trim().length(10).required().label("Office Mobile Number"),
  dateOfJoining: Joi.string().trim().label("Date Of Joining"),
  manager: Joi.number().required().label("Manager"),
  designation_id: Joi.number().required().label("Designation"),
  functionalAreaId: Joi.number().required().label("Functional Area"),
  buId: Joi.number().required().label("Business Unit"),

  sbuId: Joi.number().required().label("Sub Business Unit"),
  shiftId: Joi.number().required().label("Shift"),
  departmentId: Joi.number().required().label("Department"),
  companyId: Joi.number().required().label("Company"),
  buHRId: Joi.number().required().label("Business Unit HR"),
  buHeadId: Joi.number().required().label("Business Unit Head"),

  attendancePolicyId: Joi.number().required().label("Attendance Policy"),
  companyLocationId: Joi.number().required().label("Company Location"),
  weekOffId: Joi.number().required().label("Week Off")
});

const attendanceSchema = Joi.object({
  locationType: Joi.string().trim().max(250).label("Location Type"),
  remark: Joi.string().trim().max(250).label("Remark").allow(""),
  location: Joi.string().trim().label("Location"),
  latitude: Joi.string().trim().label("Latitude"),
  longitude: Joi.string().trim().label("Longitude"),
});

const regularizeRequest = Joi.object({
  fromDate: Joi.string().trim().label("From Date"),
  toDate: Joi.string().trim().label("To Date"),
  locationType: Joi.string().label("Location Type"),
  punchInTime: Joi.string().label("Punch In Time"),
  punchOutTime: Joi.string().label("Punch Out Time"),
  reason: Joi.string().label("Reason"),
  attendanceAutoId: Joi.number(),
  remark: Joi.string().trim().required().max(100).label("Remark"),
});

const approveRegularizationRequestSchema = Joi.object({
  status: Joi.number().valid(0, 1),
  regularizeId: Joi.number(),
  remark: Joi.string()
    .trim()
    .max(100)
    .when("status", {
      is: Joi.number().valid(0),
      then: Joi.required().label("Remark"),
      otherwise: Joi.optional().allow("").label("Remark"),
    }),
});

const bankDetailsSchema = Joi.object({
  userId: Joi.number().optional(),
  paymentAccountNumber: Joi.string().required(),
  paymentBankName: Joi.string().required(),
  paymentBankIfsc: Joi.string().required(),
  paymentHolderName: Joi.string().required(),
});

const unlockAccountSchema = Joi.object({
  employeeCode: Joi.string().trim().required().label("Employee Code"),
});

const updateBiographicalDetailsSchema = Joi.object({
  userId: Joi.number().label("User ID"),
  maritalStatus: Joi.number().required().label("Marital Status"),
  mobileAccess: Joi.number().required().label("Mobile Access"),
  laptopSystem: Joi.string().trim().label("System"),
  nationality: Joi.string().trim().label("Nationality"),
  backgroundVerification: Joi.number()
    .required()
    .label("Background Verification"),
  gender: Joi.string().trim().label("Gender"),
  dateOfBirth: Joi.string().trim().label("Date of Birth"),
});

const addFamilyDetailsSchema = Joi.object({
  userId: Joi.number().label("User ID"),
  name: Joi.string().required().trim().label("Name"),
  dob: Joi.string().trim().label("DOB"),
  gender: Joi.string().trim().label("Gender"),
  mobileNo: Joi.string().trim().label("Mobile Number"),
  relationWithEmp: Joi.string().trim().label("Relation"),
});

const updateFamilyDetailsSchema = Joi.object({
  empFamilyDetailsId: Joi.number().required(),
  name: Joi.string().required().trim().label("Name"),
  dob: Joi.string().trim().label("DOB"),
  gender: Joi.string().trim().label("Gender"),
  mobileNo: Joi.string().trim().label("Mobile Number"),
  relationWithEmp: Joi.string().trim().label("Relation"),
});

const addEducationDetailsSchema = Joi.object({
  educationCompletionDate: Joi.date().iso().required(),
  educationDegree: Joi.number().integer().required(),
  educationInstitute: Joi.string().required(),
  educationSpecialisation: Joi.string().required(),
  educationStartDate: Joi.date().iso().required(),
  userId: Joi.number().integer().required()
});

const updateEducationDetailsSchema = Joi.object({
  educationActivities: Joi.string().allow('N/A', null).required(),
  educationAttachments: Joi.string().allow('N/A', null).required(),
  educationCompletionDate: Joi.date().iso().required(),
  educationDegree: Joi.number().integer().required(),
  educationId: Joi.number().integer().required(),
  educationInstitute: Joi.string().required(),
  educationRemark: Joi.string().allow('N/A', null).required(),
  educationSpecialisation: Joi.string().allow('N/A', null).required(),
  educationStartDate: Joi.date().iso().required(),
  isHighestEducation: Joi.string().required().allow(null),
  userId: Joi.number().integer().required()
});

const updatePaymentDetailsSchema = Joi.object({
  userId: Joi.number().label("User ID"),
  paymentAccountNumber: Joi.string().trim().required().label("Account Number"),
  paymentBankName: Joi.string().trim().required().label("Bank Name"),
  paymentBankIfsc: Joi.string()
    .trim()
    .required()
    .max(11)
    .label("Bank Ifsc Code"),
  paymentHolderName: Joi.string()
    .trim()
    .required()
    .label("Account Holder Name"),
});

const addPaymentDetailsSchema = Joi.object({
  userId: Joi.number().label("User ID"),
  paymentAccountNumber: Joi.string().trim().required().label("Account Number"),
  paymentBankName: Joi.string().trim().required().label("Bank Name"),
  paymentBankIfsc: Joi.string()
    .trim()
    .required()
    .max(18)
    .label("Bank Ifsc Code"),
  paymentHolderName: Joi.string()
    .trim()
    .required()
    .label("Account Holder Name"),
});

const deleteFamilyMemberDetailsSchema = Joi.object({
  empFamilyDetailsId: Joi.number().required(),
});

const updateLeaveRequest = Joi.object({
  employeeLeaveTransactionsIds: Joi.string()
    .trim()
    .required()
    .label("Leave ID"),
  status: Joi.string()
    .trim()
    .required()
    .valid("approved", "rejected")
    .label("status"),
  remark: Joi.string()
    .trim()
    .max(100)
    .when("status", {
      is: Joi.string().valid("rejected"),
      then: Joi.required().label("Remark"),
      otherwise: Joi.optional().allow("").label("Remark"),
    }),
});

const leaveRequestSchema = Joi.object({
  attachment: Joi.string().allow("").optional(),
  employeeId: Joi.number().required().label("Employee ID"),
  leaveAutoId: Joi.number().required().label("Leave Type"),
  recipientsIds: Joi.string().optional().allow(""),
  fromDate: Joi.date().required(),
  toDate: Joi.date().required().min(Joi.ref("fromDate")),
  firstDayHalf: Joi.number().optional().valid(0, 1, 2),
  lastDayHalf: Joi.number().optional().valid(0, 1, 2),
  reason: Joi.string().optional().max(45),
  message: Joi.string().trim().required().max(100).label("Message"),
}).options({ abortEarly: false });

const revoekLeaveRequest = Joi.object({
  employeeLeaveTransactionsIds: Joi.string()
    .trim()
    .required()
    .label("Leave ID"),
});

const attendanceDetails = Joi.object({
  employeeId: Joi.number().required().label("Employee ID")
})

const changePasswordSchema = Joi.object({
  password: Joi.string().trim().max(14).min(8).pattern(new RegExp(passwordRegex)).required().label("Password").messages({
    'string.pattern.base': "Password should contain at least Uppercase, Lowercase, Special Character, and Number"
  })
})

const remainingLeaves = Joi.object({
  leaveAutoId: Joi.number().required().label("Leave Type"),
  employeeFor: Joi.number().required().label("For Employee"),
  startDate: Joi.date().required(),
  endDate: Joi.date().required().min(Joi.ref("startDate")),
  leaveFirstHalf: Joi.number().required(),
  leaveSecondHalf: Joi.number().required()
})

const addJobDetailsSchema = Joi.object({
  userId: Joi.number().label("User ID"),
  dateOfJoining: Joi.string().label("Date Of Joining").optional(),
  probationPeriod: Joi.string().label("Probation Period").optional(),
  languagesSpoken: Joi.string().label("Language Spoken").optional()
})

const updateManagerSchema = Joi.array().required().items(
  Joi.object({
    user: Joi.number().required().label("User"),
    manager: Joi.number().required().label("Manager"),
    date: Joi.string().allow("").label("Date")
  })
).messages({
  'array.base': 'Please Select Atleaset One User'
})

const updateProfilePictureSchema = Joi.object({
  user: Joi.number().required().label("User"),
  image: Joi.string(),
})

const emergencyContactDetails = Joi.object({
  userId: Joi.number().label("User ID"),
  emergencyContactName: Joi.string().label("Emergency Contact Name").optional(),
  emergencyContactNumber: Joi.string().label("Emergency Contact Number").optional(),
  emergencyContactRelation: Joi.string().label("Emergency Contact Relation").optional()
})

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().label("Email")
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
  addFamilyDetailsSchema,
  updateFamilyDetailsSchema,
  updatePaymentDetailsSchema,
  deleteFamilyMemberDetailsSchema,
  addPaymentDetailsSchema,
  updateLeaveRequest,
  leaveRequestSchema,
  revoekLeaveRequest,
  attendanceDetails,
  changePasswordSchema,
  remainingLeaves,
  addJobDetailsSchema,
  updateEducationDetailsSchema,
  addEducationDetailsSchema,
  updateManagerSchema,
  updateProfilePictureSchema,
  emergencyContactDetails,
  forgotPasswordSchema
};
