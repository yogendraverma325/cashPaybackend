import Joi from "joi";
import moment from "moment";

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
  firstName: Joi.string()
    .trim()
    .label("First Name")
    .allow(null)
    .max(30)
    .optional(),
  mobileAdmin: Joi.number().label("Mobile Admin").optional(),
  dataCardAdmin: Joi.number().label("Data Card").optional(),
  visitingCardAdmin: Joi.number().label("Visiting Card").optional(),
  workstationAdmin: Joi.number().label("Work Station").optional(),
  lastIncrementDate: Joi.string()
    .allow(null)
    .label("Last Increment Date")
    .optional(),
  iqTestApplicable: Joi.number().label("IQ Test Applicable").optional(),
  recruiterName: Joi.string()
    .trim()
    .label("Recruiter Name")
    .allow(null)
    .max(30)
    .optional(),
  nomineeName: Joi.string()
    .trim()
    .label("Nominee Name")
    .allow(null)
    .max(30)
    .optional(),
  nomineeRelation: Joi.string()
    .trim()
    .label("Nominee Relation")
    .allow(null)
    .max(30)
    .optional(),
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
  isHighestEducation: Joi.boolean().allow(null).optional(),
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
  isHighestEducation: Joi.boolean().required().allow(null),
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
  ptApplicability: Joi.boolean().optional(),
  tdsApplicability: Joi.boolean().optional(),
  itrFiling: Joi.boolean().optional(),
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
  epsApplicability: Joi.boolean().allow("").label("EPS Applicability"),
  esicApplicable: Joi.boolean().allow("").label("ESIC Applicable"),
  lwfApplicable: Joi.boolean().allow("").label("LWF Applicable"),
  pfRestricted: Joi.boolean().allow("").label("PF Restricted"),
  pfApplicability: Joi.boolean().allow("").label("PF Applicability"),
  epfApplicable: Joi.boolean().allow("").label("EPF Applicable"),
  pfNumber: Joi.string().label("PF Number").optional(),
  lwfDesignation: Joi.number().label("LWF Designation").optional(),
  lwfState: Joi.number().label("LWF State").optional(),
  restrictCompanyPf: Joi.boolean().allow("").label("Restrict Company PF"),
  pranNumber: Joi.string().label("PRAN Number").optional(),
  npsNumber: Joi.string().label("NPS Number").optional(),
  companyLocationId: Joi.number().label("Company Location").optional(),
  unionId: Joi.number().label("Union Code").optional(),
  bandId: Joi.number().label("Band").optional(),
  gradeId: Joi.number().label("Grade").optional(),
  jobLevelId: Joi.number().label("Job Level").optional(),
  residentEng: Joi.boolean().label("Resident Engineer").optional(),
  customerName: Joi.string().label("Customer Name").optional(),
});

const updateManagerSchema = Joi.array()
  .required()
  .items(
    Joi.object({
      user: Joi.number().required().label("User"),
      manager: Joi.number().required().label("Manager"),
      date: Joi.string().label("Date").required(),
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
  empReasonOfResignation: Joi.number()
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
  empRemark: Joi.string().trim().max(100).allow("").label("Remark"),
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
  remark: Joi.string().trim().max(100).allow("").label("Comment"),
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
  l1ReasonOfResignation: Joi.number().required().label("Reason Of Resignation"),
  l1BillingType: Joi.string(),
  l1ProposedRecoveryDays: Joi.number().label("Recovery Days"),
  l1CustomerName: Joi.string().trim().allow("").label("Customer Name"),
  replacementRequired: Joi.boolean().label("Replacement Required"),
  replacementRequiredBy: Joi.string()
    .allow("")
    .label("Replacement Required By"),
  l1Remark: Joi.string().trim().max(100).allow("").label("Remark"),
  l1Attachment: Joi.string().allow(""),
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
  name: Joi.string()
    .pattern(/^[A-Za-z\s.]*$/, "Name should only contain letters and spaces")
    .trim()
    .required()
    .label("Name"),
  email: Joi.string().trim().email().allow("").label("Email"),
  personalEmail: Joi.string().trim().email().required().label("Personal Email"),
  firstName: Joi.string()
    .pattern(
      /^[A-Za-z\s.]*$/,
      "First Name should only contain letters and spaces"
    )
    .trim()
    .required()
    .label("First Name"),
  middleName: Joi.string()
    .pattern(
      /^[A-Za-z\s]*$/,
      "Middle Name should only contain letters and spaces"
    )
    .trim()
    .allow("")
    .label("Middle Name"),
  lastName: Joi.string()
    .pattern(
      /^[A-Za-z\s]*$/,
      "Last Name should only contain letters and spaces"
    )
    .trim()
    .allow("")
    .label("Last Name"),

  panNo: Joi.string()
    .pattern(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "PAN should be in the format: AAAAA9999A"
    )
    .trim()
    .allow("")
    .label("PAN Number"),
  uanNo: Joi.string()
    .pattern(/^[0-9]{12}$/, "UAN should be exactly 12 digits")
    .trim()
    .allow("")
    .label("UAN Number"),
  pfNo: Joi.string().trim().allow("").label("PF Number"),
  employeeType: Joi.number().required().label("Employee Type"),
  image: Joi.string().allow(""),

  officeMobileNumber: Joi.string()
    .pattern(/^[0-9]*$/, "Office Mobile number should only contain numbers")
    .trim()
    .length(10)
    .allow("")
    .label("Office Mobile Number"),
  personalMobileNumber: Joi.string()
    .pattern(/^[0-9]*$/, "Personal Mobile number should only contain numbers")
    .trim()
    .length(10)
    .required()
    .label("Personal Mobile Number"),
  dateOfJoining: Joi.string().required().label("Date Of Joining"),
  manager: Joi.number().required().label("Manager"),
  designation_id: Joi.number().required().label("Designation"),
  functionalAreaId: Joi.number().required().label("Functional Area"),
  buId: Joi.number().required().label("Business Unit"),

  sbuId: Joi.number().required().label("Sub Business Unit"),
  shiftId: Joi.number().allow(0).label("Shift"),
  departmentId: Joi.number().required().label("Department"),
  companyId: Joi.number().required().label("Company"),
  buHRId: Joi.number().required().label("Business Unit HR"),
  buHeadId: Joi.number().required().label("Business Unit Head"),
  attendancePolicyId: Joi.number().allow(0).label("Attendance Policy"),
  companyLocationId: Joi.number().required().label("Company Location"),
  weekOffId: Joi.number().allow(0).label("Week Off"),

  gender: Joi.string().required().label("Gender"),
  maritalStatus: Joi.number().required().label("Marital Status"),
  maritalStatusSince: Joi.string().allow("").label("Marital Status Since"),
  nationality: Joi.string().required().label("Nationality"),
  probationId: Joi.number().required().label("Probation"),
  jobLevelId: Joi.number().required().label("Job Level Name"),
  dateOfBirth: Joi.string().required().label("Date Of Birth"),
  newCustomerNameId: Joi.number().allow(0).label("New Customer Name"),
  iqTestApplicable: Joi.number().required().label("IQ Test Applicable"),
  positionType: Joi.string().required().label("Position Type"),
  profileImage: Joi.string().allow(null),
  id: Joi.string().allow(""),

  selfService: Joi.number().required().label("Self Service"),
  mobileAccess: Joi.number().required().label("Mobile Access"),
  laptopSystem: Joi.string().required().label("Laptop Access"),
  backgroundVerification: Joi.number()
    .required()
    .label("Background Verification"),
  mobileAdmin: Joi.number().required().label("Mobile Admin"),
  dataCardAdmin: Joi.number().required().label("Data Card"),
  visitingCardAdmin: Joi.number().required().label("Visiting Card"),
  workstationAdmin: Joi.number().required().label("Work Station"),
  recruiterName: Joi.string().required().label("Recruiter Name"),
  offRoleCTC: Joi.number()
    .allow("")
    .default("NA")
    .when("employeeType", {
      is: "Off-Roll",
      then: Joi.required().label("off Role CTC"),
      otherwise: Joi.optional(),
    }),
  highestQualification: Joi.string().required().label("Highest Qualification"),
  ESICPFDeduction: Joi.string().allow("").label("ESIC/PF Deduction"),
  fatherName: Joi.string().trim().allow("").label("Father Name"),
  paymentAccountNumber: Joi.string()
    .trim()
    .max(20)
    .allow("")
    .label("Account Number"),
  paymentBankName: Joi.string().trim().allow("").label("Bank Name"),
  paymentBankIfsc: Joi.string()
    .trim()
    .allow("")
    .min(11)
    .max(11)
    .label("Bank Ifsc Code"),
  noticePeriodAutoId: Joi.number().required().label("Notice Period"),
});

const createTMCSchema = Joi.object({
  selectedUsers: Joi.array().items().required(),
});

const onBehalfSeperationByBUHr = Joi.object({
  userId: Joi.number(),
  resignationDate: Joi.string().required().label("Resignation Date"),
  l2LastWorkingDay: Joi.string().required().label("Proposed last Working Day"),
  l2RecoveryDays: Joi.number().label("Recovery Days"),
  l2RecoveryDaysReason: Joi.string()
    .required()
    .label("Reason for Proposed Recovery Days"),
  l2SeparationType: Joi.string()
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
  l2CustomerName: Joi.string()
    .trim()
    .required()
    .allow("")
    .label("Customer Name"),
  shortFallPayoutBasis: Joi.string().trim().required().label("Payout Basis"),
  shortFallPayoutDays: Joi.number().required().label("Payout Days"),
  ndaConfirmation: Joi.boolean().valid(0, 1).label("NDA Confirmation"),
  holdFnf: Joi.boolean().valid(0, 1).label("Hold FNF"),
  holdFnfTillDate: Joi.string().trim().allow("").label("FNF Till Date"),
  holdFnfReason: Joi.string().trim().allow("").label("Hold FNF Reason"),
  l2Remark: Joi.string().trim().allow("").required().label("Remark"),
  l2Attachment: Joi.string().allow("").optional(),
  submitType: Joi.number(),
});

const revokeSeparation = Joi.object({
  reason: Joi.number().required().label("Reason"),
  remark: Joi.string().trim().allow("").label("Remark"),
});

const importOnboardEmployeeSchema = Joi.object({
  email: Joi.string().trim().email().allow("").label("Email"),
  personalEmail: Joi.string().trim().email().required().label("Personal Email"),
  firstName: Joi.string()
    .pattern(
      /^[A-Za-z\s.]*$/,
      "First Name should only contain letters and spaces"
    )
    .trim()
    .required()
    .label("First Name"),
  middleName: Joi.string()
    .pattern(
      /^[A-Za-z\s]*$/,
      "Middle Name should only contain letters and spaces"
    )
    .trim()
    .allow("")
    .label("Middle Name"),
  lastName: Joi.string()
    .pattern(
      /^[A-Za-z\s]*$/,
      "Last Name should only contain letters and spaces"
    )
    .trim()
    .allow("")
    .label("Last Name"),

  panNo: Joi.string()
    .pattern(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "PAN should be in the format: AAAAA9999A"
    )
    .trim()
    .allow(""),
  uanNo: Joi.string()
    .pattern(/^[0-9]{12}$/, "UAN should be exactly 12 digits")
    .trim()
    .allow(""),
  pfNo: Joi.string().trim().allow(""),
  employeeType: Joi.string().required().label("Employee Type"),
  image: Joi.string().allow(""),

  officeMobileNumber: Joi.string()
    .pattern(/^[0-9]*$/, "Offical Mobile number should only contain numbers")
    .trim()
    .length(10)
    .allow("")
    .label("Office Mobile Number"),
  personalMobileNumber: Joi.string()
    .pattern(/^[0-9]*$/, "Personal Mobile number should only contain numbers")
    .trim()
    .length(10)
    .required()
    .label("Personal Mobile Number"),
  dateOfBirth: Joi.string().required().label("Date Of Birth"),
  dateOfJoining: Joi.string().required().label("Date Of Joining"),
  manager: Joi.number().required().label("Manager"),
  designation: Joi.string().required().label("Designation"),
  functionalArea: Joi.string().required().label("Functional Area"),
  bu: Joi.string().required().label("Business Unit"),

  sbu: Joi.string().required().label("Sub Business Unit"),
  shift: Joi.string().allow("").label("Shift"),
  department: Joi.string().required().label("Department"),
  company: Joi.string().required().label("Company"),
  attendancePolicy: Joi.string().allow("").label("Attendance Policy"),
  companyLocation: Joi.string().required().label("Company Location"),
  weekOff: Joi.string().allow("").label("Week Off"),

  gender: Joi.string()
    .valid("Male", "Female", "Do not want to disclose", "Transgender", "Other")
    .required()
    .label("Gender"),
  maritalStatus: Joi.string()
    .valid("Married", "Single", "Divorced", "Separated", "Widowed", "Others")
    .required()
    .label("Marital Status"),
  maritalStatusSince: Joi.string()
    .allow("")
    .default("NA")
    .label("Marital Status Date"),
  nationality: Joi.string().valid("Indian").required().label("Nationality"),
  probation: Joi.string().required().label("Probation"),
  jobLevel: Joi.string().required().label("Job Level"),
  newCustomerName: Joi.string().allow("").label("Customer Name"),
  iqTestApplicable: Joi.string()
    .valid("Yes", "No")
    .required()
    .label("IQ Test Applicable"),
  positionType: Joi.string()
    .valid("New", "Replacement")
    .required()
    .label("Position Type"),

  selfService: Joi.number().required().label("Self Service"),
  mobileAccess: Joi.number().optional().label("Mobile Access"),
  laptopSystem: Joi.string()
    .valid("Mac", "Linux", "Windows")
    .required()
    .label("Laptop Access"),
  backgroundVerification: Joi.number()
    .required()
    .label("Background Verification"),
  mobileAdmin: Joi.number().required().label("Mobile Admin"),
  dataCardAdmin: Joi.number().required().label("Data Card"),
  visitingCardAdmin: Joi.number().required().label("Visiting Card"),
  workstationAdmin: Joi.number().required().label("Work Station"),
  recruiterName: Joi.string().required().label("Recruiter Name"),
  offRoleCTC: Joi.number().allow("").default("NA").label("Off Role CTC"),
  highestQualification: Joi.string()
    .valid("Education", "Degree Master")
    .required()
    .label("Highest Qualification"),
  ESICPFDeduction: Joi.string()
    .valid("Yes", "No", "Only PF", "Only ESIC")
    .optional()
    .label("ESIC/PF Deduction"),
  fatherName: Joi.string().allow("").label("Father Name"),
  paymentAccountNumber: Joi.string()
    .allow("")
    .default("NA")
    .trim()
    .max(20)
    .label("Account Number"),
  paymentBankName: Joi.string()
    .allow("")
    .default("NA")
    .trim()
    .label("Bank Name"),
  paymentBankIfsc: Joi.string()
    .allow("")
    .default("NA")
    .trim()
    .min(11)
    .max(11)
    .label("Bank Ifsc Code"),
  noticePeriodAutoId: Joi.string().required().label("Notice Period"),
});

const updatePolicyOfEMP = Joi.array()
  .required()
  .items(
    Joi.object({
      user: Joi.number().required().label("User"),
      shiftPolicy: Joi.number().label("shiftPolicy").allow(null),
      currentshiftPolicy: Joi.number().label("currentshiftPolicy").allow(null),
      attendancePolicy: Joi.number().label("attendancePolicy").allow(null),
      currentattendancePolicy: Joi.number()
        .label("currentattendancePolicy")
        .allow(null),
      weekOffPolicy: Joi.number().label("weekOffPolicy").allow(null),
      currentweekOffPolicy: Joi.number()
        .label("currentweekOffPolicy")
        .allow(null),
      date: Joi.string().label("Date").required(),
    })
  )
  .messages({
    "array.base": "Please Select Atleaset One User",
  });
const updateIQDetailsSchema = Joi.object({
  userId: Joi.number().label("User ID"),
  abstractReasoning: Joi.string().optional().label("Abstract Reasoning"),
  numericalSequences: Joi.string().optional().label("Abstract Reasoning"),
  numericalCalculation: Joi.string().optional().label("Abstract Reasoning"),
  mbtiType: Joi.string().optional().label("Abstract Reasoning"),
});

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
  revokeSeparation,
  importOnboardEmployeeSchema,
  updatePolicyOfEMP,
  updateIQDetailsSchema,
};
