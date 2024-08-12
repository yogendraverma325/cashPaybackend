const message = {
  SOMETHING_WENT_WRONG: "Something Went Wrong",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  TOO_MANY_REQUESTS: "Too Many Requests",
  BAD_REQUEST: "Bad request",
  UNAUTHORIZED_ACCESS: "Unauthorized Access",
  NOT_FOUND: "Not Found",
  UNPROCESSABLE_ENTITY: "Unprocessable Entity",
  INVALID_AUTH: "Invalid Authentication",
  USER_NOT_EXIST: "User Doesn't Exists.",
  RADIUS_MESSAGE: "Unable to mark attendance. You are not within the required #-meter range",
  INVALID_TOKEN: "Invalid Token.",
  INSERT_SUCCESS: "Inserted Successfully.",
  SESSION_EXPIRED: "Session Expired, Please Login Again!",
  INVALID_CREDENTIALS: "Invalid TMC ID or Password",
  LOGIN_SUCCESS: "Login Successfully.",
  UPDATE_SUCCESS: "<module> Updated Successfully.",
  ALREADY_EXISTS: "<module> Already Exists.",
  PUNCH_IN_SUCCESS: "Successfully Punch In.",
  PUNCH_OUT_SUCCESS: "Successfully Punch Out.",
  ATTENDANCE_NOT_AVAILABLE: "Attendance Data Not Available.",
  MAXIMUM_REGULARIZATION_LIMIT:
    "You have reached maximum regularization limit.",
  ATTENDANCE_DATE_CANNOT_AFTER_TODAY: "Attendance date cannot be after today.",
  REGULARIZE_REQUEST_SUCCESSFULL: "Regularization Requested Successfully.",
  REGULARIZATION_ACTION: "Regularization Request <status>",
  ALREADY_REQUESTED: "<module> Already Requested.",
  PASSWORD_CHANGED: "Password Changed Successfully.",
  ACCOUNT_LOCKED:
    "Your account has been locked, Please Contact to admin to recover your account.",
  REACHED_WRONG_PASSWORD_LIMIT:
    "Your account has been locked, Please Contact to admin to recover your account.",
  ACCOUNT_UNLOCKED: "Account Unlocked",
  REGULARIZE_REQUEST_NOT_FOUND: "Regularize Request Not Found.",
  REGULARIZE_REQUEST_REVOKED: "Regularization Request Revoked.",
  DETAILS_NOT_FOUND: "<module> Details Not Found.",
  DETAILS_DELETED: "<module> Details Deleted.",
  DETAILS_ADDED: "<module> Details Added Successfully.",
  ATTENDANCE_POLICY_DID_NOT_MAP:
    "No Attendance policy Is assign to you, you can't mark attendance",
  DATA_FETCHED: "Data fetched successfully",
  DATA_BLANK: "No data available",
  ZERO_TIME:"Invalid punchIn/punchOut time",
  NOT_SAME: "Punch in time and punch out time can't be same",
  TIME_LESS: "Punch in time can't be gretater than punch out time",
  SHIFT: {
    NO_SHIFT: "No Shift Is assign to you, you can't mark attendance",
    SHIFT_TIME_INVALID: "Invalid Shift Time",
  },
  LEAVE: {
    RECORDED: "Leave Request has been submitted",
    NO_UPDATE: "Can't Update Status Currently",
    DATES_NOT_APPLICABLE: "You Can't Request For Given Dates",
    APPROVED: "Leave Request Approved",
    REJECTED: "Leave Request Rejected",
    REVOKED: "Leave Request Revoked",
    REMAINING_LEAVES: "Available Leaves",
    LEAVE_LIMIT: "Can't apply leave more than # days",
    LEAVE_NOT_APPLICABLE: "You can't apply leave on weekOff/holidays"
  },
  PROFILE_PICTURE_UPDATED: "Profile Picture Updated."
};

export default message;
