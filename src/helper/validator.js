import Joi from "joi";

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;,<.>?/~\\-]).{8,}$/;

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
  employeeType: Joi.number().required().label("Employee Type"),
  image: Joi.string().allow(""),

  officeMobileNumber: Joi.string()
    .trim()
    .length(10)
    .label("Office Mobile Number"),
  personalMobileNumber: Joi.string()
    .trim()
    .length(10)
    .required()
    .label("Office Mobile Number"),
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
  weekOffId: Joi.number().required().label("Week Off"),
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
  maritalStatus: Joi.number().allow(null).required().label("Marital Status"),
  mobileAccess: Joi.number().label("Mobile Access").optional(),
  laptopSystem: Joi.string().trim().label("System").optional(),
  nationality: Joi.string()
    .trim()
    .label("Nationality")
    .min(3)
    .max(30)
    .required(),
  middleName: Joi.string()
    .trim()
    .label("Middle Name")
    .allow(null)
    .max(30)
    .optional(),
  lastName: Joi.string()
    .trim()
    .label("Last Name")
    .allow(null)
    .max(30)
    .optional(),
  backgroundVerification: Joi.number()
    .label("Background Verification")
    .optional(),
  gender: Joi.string().trim().label("Gender").allow(null).optional(),
  dateOfBirth: Joi.string()
    .trim()
    .label("Date of Birth")
    .allow(null)
    .optional(),
  maritalStatusSince: Joi.string()
    .trim()
    .label("Marital Status Since")
    .allow(null)
    .optional(),
  salutationId: Joi.number().required().label("Salutation"),
});

const addFamilyDetailsSchema = Joi.object({
  userId: Joi.number().label("User ID"),
  name: Joi.string().required().trim().label("Name").allow(null).optional(),
  dob: Joi.string().trim().label("DOB").allow(null).optional(),
  gender: Joi.string().trim().label("Gender").allow(null).optional(),
  mobileNo: Joi.string()
    .trim()
    .label("Mobile Number")
    .allow(null)
    .min(10)
    .max(10)
    .optional(),
  relationWithEmp: Joi.string().trim().label("Relation").allow(null).optional(),
  memberAddress: Joi.string().trim().label("Address").allow(null).optional(),
});

const updateFamilyDetailsSchema = Joi.object({
  empFamilyDetailsId: Joi.number().required().required(),
  name: Joi.string().required().trim().label("Name").allow(null).optional(),
  dob: Joi.string().trim().label("DOB").allow(null).optional(),
  gender: Joi.string().trim().label("Gender").allow(null).optional(),
  mobileNo: Joi.string()
    .trim()
    .label("Mobile Number")
    .min(10)
    .max(10)
    .allow(null)
    .optional(),
  relationWithEmp: Joi.string().trim().label("Relation").allow(null).optional(),
  memberAddress: Joi.string().trim().label("Address").allow(null).optional(),
});

const addEducationDetailsSchema = Joi.object({
  educationDegree: Joi.number().integer().allow(null).required(),
  educationInstitute: Joi.string().allow(null).required(),
  educationSpecialisation: Joi.string().allow(null).required(),
  educationStartDate: Joi.date().iso().allow(null).required(),
  educationCompletionDate: Joi.date()
    .iso()
    .allow(null)
    .greater(Joi.ref("educationStartDate"))
    .messages({
      "date.greater": "End date must be greater than the start date",
    })
    .required(),
  educationAttachments: Joi.string().allow("").optional(),
  educationRemark: Joi.string().allow(null).optional(),
  educationActivities: Joi.string().allow(null).optional(),
  userId: Joi.number().integer().allow(null).required(),
  isHighestEducation: Joi.number().integer().allow(null).optional(),
});

const updateEducationDetailsSchema = Joi.object({
  educationActivities: Joi.string().allow(null).optional(),
  educationAttachments: Joi.string().allow("").optional(),
  educationDegree: Joi.number().integer().allow(null).required(),
  educationId: Joi.number().integer().required(),
  educationInstitute: Joi.string().allow(null).required(),
  educationRemark: Joi.string().allow(null).required(),
  educationSpecialisation: Joi.string().allow(null).required(),
  educationStartDate: Joi.date().iso().allow(null).required(),
  educationCompletionDate: Joi.date()
    .iso()
    .allow(null)
    .greater(Joi.ref("educationStartDate"))
    .messages({
      "date.greater": "End date must be greater than the start date",
    })
    .required(),
  isHighestEducation: Joi.string().required().allow(null),
  userId: Joi.number().integer().required(),
});

const updatePaymentDetailsSchema = Joi.object({
  userId: Joi.number().label("User ID"),
  paymentAccountNumber: Joi.string().trim().required().label("Account Number"),
  paymentBankName: Joi.string().trim().required().label("Bank Name"),
  paymentBankIfsc: Joi.string()
    .trim()
    .required()
    .max(20)
    .label("Bank Ifsc Code"),
  paymentHolderName: Joi.string()
    .trim()
    .required()
    .label("Account Holder Name"),
});

const addPaymentDetailsSchema = Joi.object({
  userId: Joi.number().label("User ID"),
  paymentAccountNumber: Joi.string()
    .trim()
    .max(20)
    .required()
    .label("Account Number"),
  paymentBankName: Joi.string().trim().required().label("Bank Name"),
  paymentBankIfsc: Joi.string()
    .trim()
    .required()
    .min(11)
    .max(11)
    .label("Bank Ifsc Code"),
  paymentHolderName: Joi.string()
    .trim()
    .allow(null)
    .optional()
    .label("Account Holder Name"),
  ptStateId: Joi.number().integer().optional(),
  ptLocationId: Joi.number().integer().optional(),
  ptApplicability: Joi.number().integer().optional(),
  tdsApplicability: Joi.number().integer().optional(),
  itrFiling: Joi.number().integer().optional(),
  paymentAttachment: Joi.string()
    .label("Payment Attachemnt")
    .allow("")
    .optional(),
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
  employeeId: Joi.number().required().label("Employee ID"),
});

const changePasswordSchema = Joi.object({
  password: Joi.string()
    .trim()
    .max(14)
    .min(8)
    .pattern(new RegExp(passwordRegex))
    .required()
    .label("Password")
    .messages({
      "string.pattern.base":
        "Password should contain at least Uppercase, Lowercase, Special Character, and Number",
    }),
});

const remainingLeaves = Joi.object({
  leaveAutoId: Joi.number().required().label("Leave Type"),
  employeeFor: Joi.number().required().label("For Employee"),
  startDate: Joi.date().required(),
  endDate: Joi.date().required().min(Joi.ref("startDate")),
  leaveFirstHalf: Joi.number().required(),
  leaveSecondHalf: Joi.number().required(),
});

const addJobDetailsSchema = Joi.object({
  userId: Joi.number().label("User ID"),
  dateOfJoining: Joi.string().label("Date Of Joining").optional(),
  probationPeriod: Joi.string().label("Probation Period").optional(),
  languagesSpoken: Joi.string().label("Language Spoken").allow(null).optional(),
  esicNumber: Joi.string()
    .label("ESIC Number")
    .allow(null)
    .min(17)
    .max(17)
    .optional(),
  uanNumber: Joi.string()
    .label("UAN Number")
    .allow(null)
    .min(12)
    .max(12)
    .optional(),
});

const updateManagerSchema = Joi.array()
  .required()
  .items(
    Joi.object({
      user: Joi.number().required().label("User"),
      manager: Joi.number().required().label("Manager"),
      date: Joi.string().allow("").label("Date"),
    })
  )
  .messages({
    "array.base": "Please Select Atleaset One User",
  });

const updateProfilePictureSchema = Joi.object({
  user: Joi.number().required().label("User"),
  image: Joi.string(),
});

const emergencyContactDetails = Joi.object({
  userId: Joi.number().label("User ID"),
  emergencyContactName: Joi.string()
    .label("Emergency Contact Name")
    .allow(null)
    .optional(),
  emergencyContactNumber: Joi.string()
    .label("Emergency Contact Number")
    .allow(null)
    .min(10)
    .max(10)
    .optional(),
  emergencyContactRelation: Joi.string()
    .label("Emergency Contact Relation")
    .allow(null)
    .optional(),
  emergencyBloodGroup: Joi.string().label("Blood Group").allow(null).optional(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
});

const employeeUpdateInfo = Joi.object({
  userId: Joi.number().label("User ID").optional(),
  adhrNo: Joi.string()
    .trim()
    .min(12)
    .max(12)
    .required()
    .label("Aadhaar Number"),
  panNo: Joi.string().min(10).max(10),
  drivingLicence: Joi.string().allow(null).max(20).optional(),
  passportNumber: Joi.string().allow(null).max(20).optional(),
});

const addemployeeWorkInfo = Joi.object({
  userId: Joi.number().label("User ID").optional(),
  companyName: Joi.string().label("Company Name").allow(null).optional(),
  jobTitle: Joi.string().label("Job Title").allow(null).optional(),
  jobLocation: Joi.string().label("Job Location").allow(null).optional(),
  currentlyWorking: Joi.number()
    .label("Currently Working")
    .allow(null)
    .optional(),
  fromDate: Joi.string().label("From Date").allow(null).optional(),
  toDate: Joi.string().label("to Date").allow(null).optional(),
  jobSummary: Joi.string().label("job Summary").allow(null).optional(),
  Skills: Joi.string().label("skill").allow(null).optional(),
  experienceletter: Joi.string()
    .label("experience letter")
    .allow("")
    .optional(),
});

const updateemployeeWorkInfo = Joi.object({
  userId: Joi.number().label("User ID").optional(),
  workExperienceId: Joi.number().label("Work Id").required(),
  companyName: Joi.string().label("Company Name").allow(null).optional(),
  jobTitle: Joi.string().label("Job Title").allow(null).optional(),
  jobLocation: Joi.string().label("Job Location").allow(null).optional(),
  currentlyWorking: Joi.number()
    .label("Currently Working")
    .allow(null)
    .optional(),
  fromDate: Joi.string().label("From Date").allow(null).optional(),
  toDate: Joi.string().label("to Date").allow(null).optional(),
  jobSummary: Joi.string().label("job Summary").allow(null).optional(),
  Skills: Joi.string().label("skill").allow(null).optional(),
  experienceletter: Joi.string()
    .label("experience letter")
    .allow("")
    .optional(),
});

const addEmployeeCertificates = Joi.object({
  userId: Joi.number().label("User ID").required(),
  certification: Joi.string().label("certification").allow(null).optional(),
  expiryDate: Joi.string().label("Expiry Date").allow(null).optional(),
  programName: Joi.string().label("Program Name").allow(null).optional(),
  skillProduct: Joi.string().label("Skill Product").allow(null).optional(),
  oem: Joi.string().label("OEM").allow(null).optional(),
  completionStatus: Joi.string().label("Status").allow(null).optional(),
  certificationAndValidityFirst: Joi.string()
    .label("Certification And Validity")
    .allow(null)
    .optional(),
  certificationAndValiditySecond: Joi.string()
    .label("Certification And Validity")
    .allow(null)
    .optional(),
});

const updateEmployeeCertificates = Joi.object({
  userId: Joi.number().label("User ID").optional(),
  certificateId: Joi.number().label("User ID").optional(),
  certification: Joi.string().label("certification").allow(null).optional(),
  expiryDate: Joi.string().label("Expiry Date").allow(null).optional(),
  programName: Joi.string().label("Program Name").allow(null).optional(),
  skillProduct: Joi.string().label("Skill Product").allow(null).optional(),
  oem: Joi.string().label("OEM").allow(null).optional(),
  completionStatus: Joi.string().label("Status").allow(null).optional(),
  certificationAndValidityFirst: Joi.string()
    .label("Certification And Validity")
    .allow(null)
    .optional(),
  certificationAndValiditySecond: Joi.string()
    .label("Certification And Validity")
    .allow(null)
    .optional(),
});

const updateContactInfo = Joi.object({
  userId: Joi.number().label("User ID").required(),
  personalEmail: Joi.string()
    .email({ tlds: { allow: ["com", "in"] } })
    .label("Personal Email")
    .required(),
  //personalEmail: Joi.string().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(com|in)$')).label("Personal Email").required(),
  officeMobileNumber: Joi.string()
    .label("Office Mobile Number")
    .allow(null)
    .min(10)
    .max(10)
    .required(),
  personalMobileNumber: Joi.string()
    .label("Personal Mobile Number")
    .min(10)
    .max(10)
    .required(),
});

const separationByEmployee = Joi.object({
  resignationDate: Joi.string().required().label("Resignation Date"),
  empProposedLastWorkingDay: Joi.string().label("Proposed Last Working Days"),
  empProposedRecoveryDays: Joi.number().label("Proposed Recovery Days"),
  empReasonOfResignation: Joi.string()
    .trim()
    .required()
    .label("Reason of Resignation"),
  empNewOrganizationName: Joi.string()
    .trim()
    .allow("")
    .label("New Organization Name"),
  empSalaryHike: Joi.string().allow("").label("Salary Hike"),
  empPersonalEmailId: Joi.string().required().label("Personal Email ID"),
  empPersonalMobileNumber: Joi.string()
    .required()
    .label("Personal Mobile Number"),
  empRemark: Joi.number().required().label("Remark"),
  attachment: Joi.string().allow("").optional(),
});

const managerInputOnseparation = Joi.object({
  resignationAutoId: Joi.number(),
  l1ProposedLastWorkingDay: Joi.string()
    .required()
    .label("Proposed last Working Day"),
  l1ProposedRecoveryDays: Joi.number()
    .required()
    .label("Proposed Recovery Days"),
  l1ReasonForProposedRecoveryDays: Joi.string()
    .required()
    .label("Reason for Proposed Recovery Days"),
  l1ReasonOfResignation: Joi.number().required().label("Reason Of Resignation"),
  l1BillingType: Joi.string(),
  l1CustomerName: Joi.string().trim().max(100).allow("").label("Customer Name"),
  replacementRequired: Joi.boolean().label("Replacement Required"),
  replacementRequiredBy: Joi.string()
    .allow("")
    .label("Replacement Required By"),
  l1Remark: Joi.string().trim().max(100).allow("").label("Remark"),
  attachment: Joi.string().optional(),
});

const rejectSeparation = Joi.object({
  resignationAutoId: Joi.number(),
  reason: Joi.string().trim().label("Reason"),
  remark: Joi.string().trim().max(100).label("Remark"),
});

const buhrInputOnSeparation = Joi.object({
  resignationAutoId: Joi.number(),
  l2LastWorkingDay: Joi.string().required().label("Proposed last Working Day"),
  l2RecoveryDays: Joi.number().required().label("Proposed Recovery Days"),
  l2RecoveryDaysReason: Joi.string()
    .required()
    .label("Reason for Proposed Recovery Days"),
  l2SeparationType: Joi.number()
    .valid(1, 2, 3, 4)
    .required()
    .label("Separation Type"),
  l2ReasonOfSeparation: Joi.number().required().label("Reason Of Resignation"),
  l2NewOrganizationName: Joi.string()
    .trim()
    .allow("")
    .label("New Organization Name"),
  l2SalaryHike: Joi.string().trim().allow("").label("Salary Hike"),
  doNotReHire: Joi.boolean().valid(0, 1).label("Do Not Rehire"),
  l2BillingType: Joi.string().trim().required().label("Billing Type"),
  l2CustomerName: Joi.string().trim().max(100).allow("").label("Customer Name"),
  shortFallPayoutBasis: Joi.string().trim().required().label("Payout Basis"),
  shortFallPayoutDays: Joi.number().required().label("Payout Days"),
  ndaConfirmation: Joi.boolean().valid(0, 1).label("NDA Confirmation"),
  holdFnf: Joi.boolean().valid(0, 1).label("Hold FNF"),
  holdFnfTillDate: Joi.string().trim().allow("").label("FNF Till Date"),
  holdFnfReason: Joi.string().trim().allow("").label("Hold FNF Reason"),
  l2Remark: Joi.string().trim().max(100).allow("").label("Remark"),
  attachment: Joi.string().optional(),
});

const onBehalfSeperationByManager = Joi.object({
  userId: Joi.number(),
  resignationDate: Joi.string().required().label("Resignation Date"),
  l1ReasonForProposedRecoveryDays: Joi.string()
    .required()
    .label("Reason for Proposed Recovery Days"),
  empProposedLastWorkingDay: Joi.string().label("Proposed Last Working Days"),
  l1ProposedLastWorkingDay: Joi.string()
    .required()
    .label("Proposed last Working Day"),
  l1ReasonOfResignation: Joi.number()
    .required()
    .label("Reason Of Resignation"),
  l1BillingType: Joi.string(),
  l1CustomerName: Joi.string().trim().label("Customer Name"),
  replacementRequired: Joi.boolean().label("Replacement Required"),
  replacementRequiredBy: Joi.string().label("Replacement Required By"),
  l1Remark: Joi.string().trim().max(100).label("Remark"),
  l1Attachment: Joi.string().allow("").optional(),
  submitType: Joi.number(),
});

const updateAddress = Joi.object({
  employeeId: Joi.number().label("Proposed Recovery Days").required(),
  currentHouse: Joi.string().label("Current House").required(),
  currentStreet: Joi.string().label("Current Street").required(),
  currentStateId: Joi.number().label("current State").required(),
  currentCityId: Joi.number().label("Current City").required(),
  currentCountryId: Joi.number().label("Current Country").required(),
  currentPincodeId: Joi.number().label("Current Pincode").required(),
  currentLandmark: Joi.string().label("Current Landmark").required(),
  permanentCityId: Joi.number().label("Permanent City").allow(null).optional(),
  permanentStateId: Joi.number()
    .label("Permanent State")
    .allow(null)
    .optional(),
  permanentCountryId: Joi.number()
    .label("Permanent Country")
    .allow(null)
    .optional(),
  permanentPincodeId: Joi.number()
    .label("Permanent Pincode")
    .allow(null)
    .optional(),
  permanentStreet: Joi.string()
    .label("Permanent Street")
    .allow(null)
    .optional(),
  permanentHouse: Joi.string().label("Permanent House").allow(null).optional(),
  permanentLandmark: Joi.string()
    .label("Permanent Landmark")
    .allow(null)
    .optional(),
  emergencyStreet: Joi.string()
    .label("Emergency Street")
    .allow(null)
    .optional(),
  emergencyHouse: Joi.string().label("Emergency House").allow(null).optional(),
  emergencyCityId: Joi.number()
    .label("Emergency Country")
    .allow(null)
    .optional(),
  emergencyStateId: Joi.number()
    .label("Emergency Country")
    .allow(null)
    .optional(),
  emergencyCountryId: Joi.number()
    .label("Emergency Country")
    .allow(null)
    .optional(),
  emergencyPincodeId: Joi.number()
    .label("Emergency Country")
    .allow(null)
    .optional(),
  emergencyLandmark: Joi.string()
    .label("Emergency Landmark")
    .allow(null)
    .optional(),
});
const onboardEmployeeSchema = Joi.object({
  name: Joi.string().trim().required().label("Name"),
  email: Joi.string().trim().email().required().label("Email"),
  personalEmail: Joi.string().trim().email().required().label("Personal Email"),
  firstName: Joi.string().trim().required().label("First Name"),
  middleName: Joi.string().trim().allow("").label("Middle Name"),
  lastName: Joi.string().trim().allow("").label("Last Name"),

  panNo: Joi.string().trim().length(10).required().label("PAN Number"),
  uanNo: Joi.string().trim().length(12).allow("").label("UAN Number"),
  pfNo: Joi.string().trim().length(22).allow("").label("PF Number"),
  employeeType: Joi.number().required().label("Employee Type"),
  image: Joi.string().allow(""),

  officeMobileNumber: Joi.string()
    .trim()
    .length(10)
    .label("Office Mobile Number"),
  personalMobileNumber: Joi.string()
    .trim()
    .length(10)
    .required()
    .label("Office Mobile Number"),
  dateOfJoining: Joi.string().required().label("Date Of Joining"),
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
  weekOffId: Joi.number().required().label("Week Off"),

  gender: Joi.string().required().label("Gender"),
  maritalStatus: Joi.number().required().label("Marital Status"),
  maritalStatusSince: Joi.string().allow("").label("Marital Status Since"),
  nationality: Joi.string().required().label("Nationality"),
  probationId: Joi.number().required().label("Probation"),
  dateOfBirth: Joi.string().required().label("Date Of Birth"),
  newCustomerName: Joi.string().required().label("Customer Name"),
  iqTestApplicable: Joi.number().required().label("IQ Test Applicable"),
  positionType: Joi.string().required().label("Position Type"),
  profileImage: Joi.string().allow(null),
  id: Joi.string().allow('')
});

const createTMCSchema = Joi.object({
  selectedUsers: Joi.array().items().required(),
});

const onBehalfSeperationByBUHr = Joi.object({
  userId: Joi.number(),
  resignationDate: Joi.string().required().label("Resignation Date"),
  l2LastWorkingDay: Joi.string().required().label("Proposed last Working Day"),
  // l2RecoveryDays: Joi.number().required().label("Proposed Recovery Days"),
  l2RecoveryDaysReason: Joi.string()
    .required()
    .label("Reason for Proposed Recovery Days"),
  l2SeparationType: Joi.string()
    .valid("Voluntary", "InVoluntary", "Death", "Retired")
    .required()
    .label("Separation Type"),
  l2ReasonOfSeparation: Joi.string()
    .trim()
    .required()
    .label("Reason Of Resignation"),
  l2NewOrganizationName: Joi.string()
    .trim()
    .when("l2SeparationType", {
      is: "Voluntary",
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .label("New Organization Name"),
  l2SalaryHike: Joi.string()
    .trim()
    .when("l2NewOrganizationName", {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .label("Salary Hike"),
  doNotReHire: Joi.boolean().valid(0, 1).label("Do Not Rehire"),
  l2BillingType: Joi.string().trim().required().label("Billing Type"),
  l2CustomerName: Joi.string().trim().required().label("Customer Name"),
  shortFallPayoutBasis: Joi.string().trim().required().label("Payout Basis"),
  shortFallPayoutDays: Joi.number().required().label("Payout Days"),
  ndaConfirmation: Joi.boolean().valid(0, 1).label("NDA Confirmation"),
  holdFnf: Joi.boolean().valid(0, 1).label("Hold FNF"),
  holdFnfTillDate: Joi.string().trim().allow("").label("FNF Till Date"),
  holdFnfReason: Joi.string()
    .trim()
    .when("holdFnf", {
      is: 1,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .label("Hold FNF Reason"),
  l2Remark: Joi.string().trim().required().label("Remark"),
  l2Attachment: Joi.string().allow("").optional(),
  submitType: Joi.number(),
});

const revokeSeparation = Joi.object({
  reason: Joi.number().required().label('Reason'),
  remark: Joi.string().trim().allow("").label("Remark")
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
  forgotPasswordSchema,
  employeeUpdateInfo,
  addemployeeWorkInfo,
  updateemployeeWorkInfo,
  addEmployeeCertificates,
  updateEmployeeCertificates,
  updateContactInfo,
  separationByEmployee,
  managerInputOnseparation,
  rejectSeparation,
  buhrInputOnSeparation,
  onBehalfSeperationByManager,
  updateAddress,
  onBehalfSeperationByBUHr,
  onboardEmployeeSchema,
  createTMCSchema,
  revokeSeparation
};
