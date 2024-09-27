import moment from "moment";

const regularizationRequestMail = async (data) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Regularization Request</title>
  </head>
  <body>
    <table
      style="
        border-collapse: collapse;
        max-width: 635px;
        min-width: 550px;
        width: auto;
        margin: 0 auto;
        border: 0.5px solid #eee;
      "
      align="center"
    >
      <tbody>
        <tr>
          <td>
            <table
              style="border-collapse: collapse; margin: 0 auto; width: 100%"
              align="center"
            >
              <tbody>
                <tr style="background: #fff">
                  <td
                    colspan="2"
                    style="padding: 20px; padding-bottom: 0"
                    valign="top"
                  >
                    <table style="width: 100%">
                      <tbody>
                        <tr>
                          <td
                            colspan="2"
                            style="
                              padding-bottom: 20px;
                              text-align: left;
                              border-bottom: 1px solid #eee;
                              width: 100%;
                            "
                            valign="middle"
                          >
                            <img
                              height="45"
                              src="${process.env.PROXY_URL}/api/uploads/assets/team-new.png"
                              alt="Logo"
                            />
                            <img
                              height="45"
                              src="${process.env.PROXY_URL}/api/uploads/assets/tara_small.png"
                              alt="Logo"
                               style="float:right"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr style="min-height: 300px; background: #fff">
                  <td colspan="2" style="padding: 20px" valign="top">
                    <div
                      style="line-height: 1; line-height: 1; line-height: 1.8"
                    >
                      <p>Hi <b>${data.managerName}</b>,</p>
                      <p>
                        <b>${data.requesterName
    }</b> has requested for Attendance
                        Request from ${moment(data.attendenceFromDate).format(
      "MMMM D, YYYY"
    )} to ${moment(data.attendenceToDate).format(
      "MMMM D, YYYY"
    )}. <br />
                      </p>
                      <p>
                        Request message : ${data.userRemark}
                      </p>
                      <p>
                        <a
                          href='${process.env.CLIENT_URL
    }#/TaskBox?selectedTab=0&selectedMode=assignedToMe'
                          style="
                            padding: 5px 10px;
                            background: #0173c5;
                            color: #fff;
                            text-decoration: none;
                            border-radius: 2px;
                            font-size: 14px;
                            display: inline-block;
                          "
                          target="_blank"
                          >Click Here</a
                        >
                        to view the full attendance request<br />
                      </p>
                      <p>Regards,</p>
                      <p>TARA HRMS<br /></p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;
};

const leaveRequestMail = async (data) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Leave Request</title>
  </head>
  <body>
    <table
      style="
        border-collapse: collapse;
        line-height: 100% !important;
        width: 100% !important;
        font-family: sans-serif;
      "
      border="0"
      cellpadding="0"
      cellspacing="0"
      align="center"
    >
      <tbody>
        <tr>
          <td style="padding-top: 20px; padding-bottom: 20px">
            <table
              style="
                border-collapse: collapse;
                max-width: 635px;
                min-width: 550px;
                width: auto;
                margin: 0 auto;
                border: 0.5px solid #eee;
              "
              align="center"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      style="
                        border-collapse: collapse;
                        margin: 0 auto;
                        width: 100%;
                      "
                      align="center"
                    >
                      <tbody>
                        <tr style="background: #fff">
                          <td
                            colspan="2"
                            style="padding: 20px; padding-bottom: 0"
                            valign="top"
                          >
                            <table style="width: 100%">
                              <tbody>
                                <tr>
                                  <td
                            colspan="2"
                            style="
                              padding-bottom: 20px;
                              text-align: left;
                              border-bottom: 1px solid #eee;
                              width: 100%;
                            "
                            valign="middle"
                          >
                            <img
                              height="45"
                              src="${process.env.PROXY_URL}/api/uploads/assets/team-new.png"
                              alt="Logo"
                            />
                            <img
                              height="45"
                              src="${process.env.PROXY_URL}/api/uploads/assets/tara_small.png"
                              alt="Logo"
                               style="float:right"
                            />
                          </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr style="min-height: 300px; background: #fff">
                          <td colspan="2" style="padding: 20px" valign="top">
                            <div
                              style="
                                line-height: 1;
                                line-height: 1;
                                line-height: 1.8;
                              "
                            >
                              <p>Hi <b>${data.managerName}</b>,</p>
                              <p>
                                <b>${data.requesterName}</b> has requested for
                                ${data.leaveType} from ${moment(
    data.leaveFromDate
  ).format("MMMM D, YYYY")} to ${moment(data.leaveToDate).format(
    "MMMM D, YYYY"
  )}. <br />
                              </p>
                              <p>Request message : ${data.userRemark}</p>
                              <p>
                                <a
                                  href="${process.env.CLIENT_URL
    }#/TaskBox?selectedTab=1&selectedMode=assignedToMe"
                                  style="
                                    padding: 5px 10px;
                                    background: #0173c5;
                                    color: #fff;
                                    text-decoration: none;
                                    border-radius: 2px;
                                    font-size: 14px;
                                    display: inline-block;
                                  "
                                  target="_blank"
                                  >Click Here</a
                                >
                                to review the full leave request. <br />
                              </p>
                              <p><br /></p>
                              <p>Regards,</p>
                              <p>TARA HRMS<br /></p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;
};

const resetPasswordMail = async (data) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Team Computers</title>
    <link
      href="https://fonts.googleapis.com/css?family=Lato"
      rel="stylesheet"
    />
  </head>

  <body style="margin: 0; padding: 40px 0; background: #ffffff">
    <table
      width="100%"
      style="
        width: 700px;
        margin: 0 auto;
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        border-radius: 10px;
      "
    >
      <tr>
        <td
          style="
            padding-left: 2rem !important;
            padding-right: 2rem !important;
            padding-top: 1.5rem !important;
          "
        >
          <img
            src="https://www.teamcomputers.com/images/logo.png"
            style="width: 80px; padding-right: 30px; padding-bottom: 25px"
          />
        </td>
      </tr>

      <tr>
        <td
          style="padding-left: 2rem !important; padding-right: 2rem !important"
        >
          <p style="font-weight: bold">Dear User,</p>
          <p style="font-size: 15px">
            Your password has been reset successfully. Please find your
            temporary password given below: </br>
            Kindly Login and Change Your Password.
          </p>
          <br />
        </td>
      </tr>
      <tr>
        <td
          align="center"
          style="padding-left: 2rem !important; padding-right: 2rem !important"
        >
          <div
            style="
              background-color: #3cc4b7;
              width: 120px;
              height: 24px;
              color: white;
              margin-bottom: 2rem;

              padding-top: 0.5rem;
              border-radius: 10px;
              text-align: center;
            "
          >
            ${data.password}
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const revokeRegularizeMail = async (data) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <table
      style="
        border-collapse: collapse;
        line-height: 100% !important;
        width: 100% !important;
        font-family: sans-serif;
      "
      border="0"
      cellpadding="0"
      cellspacing="0"
      align="center"
    >
      <tbody>
        <tr>
          <td style="padding-top: 20px; padding-bottom: 20px">
            <table
              style="
                border-collapse: collapse;
                max-width: 635px;
                min-width: 550px;
                width: auto;
                margin: 0 auto;
                border: 0.5px solid #eee;
              "
              align="center"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      style="
                        border-collapse: collapse;
                        margin: 0 auto;
                        width: 100%;
                      "
                      align="center"
                    >
                      <tbody>
                        <tr style="background: #fff">
                          <td
                            colspan="2"
                            style="padding: 20px; padding-bottom: 0"
                            valign="top"
                          >
                            <table style="width: 100%">
                              <tbody>
                                <tr>
                                  <td
                            colspan="2"
                            style="
                              padding-bottom: 20px;
                              text-align: left;
                              border-bottom: 1px solid #eee;
                              width: 100%;
                            "
                            valign="middle"
                          >
                            <img
                              height="45"
                              src="${process.env.PROXY_URL}/api/uploads/assets/team-new.png"
                              alt="Logo"
                            />
                            <img
                              height="45"
                              src="${process.env.PROXY_URL}/api/uploads/assets/tara_small.png"
                              alt="Logo"
                               style="float:right"
                            />
                          </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr style="min-height: 300px; background: #fff">
                          <td colspan="2" style="padding: 20px" valign="top">
                            <div
                              style="
                                line-height: 1;
                                line-height: 1;
                                line-height: 1.8;
                              "
                            >
                              <p>Hi <b>${data.managerName}</b>,</p>
                              <p>
                                <b>${data.name}</b> has Revoked own
                                attendance request of ${moment(data.attendanceDate).format("MMMM D, YYYY")}<br />
                              </p>
                              <p>
                                <a
                                  href="${process.env.CLIENT_URL}"
                                  style="
                                    padding: 5px 10px;
                                    background: #0173c5;
                                    color: #fff;
                                    text-decoration: none;
                                    border-radius: 2px;
                                    font-size: 14px;
                                    display: inline-block;
                                  "
                                  target="_blank"
                                  >Click Here</a
                                >
                                to view the full attendance request.<br />
                              </p>
                              <p><br /></p>
                              <p>Regards,</p>
                              <p>TARA HRMS<br /></p>
                            </div>
                            <table
                              style="
                                width: 100%;
                                font-size: 12px;
                                font-family: Century Gothic, CenturyGothic,
                                  AppleGothic, sans-serif;
                              "
                            >
                              <tbody></tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`
}

const regularizationAcknowledgement = async (data) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <table
      style="
        border-collapse: collapse;
        line-height: 100% !important;
        width: 100% !important;
        font-family: sans-serif;
      "
      border="0"
      cellpadding="0"
      cellspacing="0"
      align="center"
    >
      <tbody>
        <tr>
          <td style="padding-top: 20px; padding-bottom: 20px">
            <table
              style="
                border-collapse: collapse;
                max-width: 635px;
                min-width: 550px;
                width: auto;
                margin: 0 auto;
                border: 0.5px solid #eee;
              "
              align="center"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      style="
                        border-collapse: collapse;
                        margin: 0 auto;
                        width: 100%;
                      "
                      align="center"
                    >
                      <tbody>
                        <tr style="background: #fff">
                          <td
                            colspan="2"
                            style="padding: 20px; padding-bottom: 0"
                            valign="top"
                          >
                            <table style="width: 100%">
                              <tbody>
                                <tr>
                                  <td
                            colspan="2"
                            style="
                              padding-bottom: 20px;
                              text-align: left;
                              border-bottom: 1px solid #eee;
                              width: 100%;
                            "
                            valign="middle"
                          >
                            <img
                              height="45"
                              src="${process.env.PROXY_URL}/api/uploads/assets/team-new.png"
                              alt="Logo"
                            />
                            <img
                              height="45"
                              src="${process.env.PROXY_URL}/api/uploads/assets/tara_small.png"
                              alt="Logo"
                               style="float:right"
                            />
                          </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr style="min-height: 300px; background: #fff">
                          <td colspan="2" style="padding: 20px" valign="top">
                            <div
                              style="
                                line-height: 1;
                                line-height: 1;
                                line-height: 1.8;
                              "
                            >
                              <p>Hi <b>${data.requesterName}</b>,</p>
                              
                              <p>
                                <b>${data.managerName}</b> has ${data.status
    } your Attendance
                                Request from ${moment(data.fromDate).format(
      "MMMM D, YYYY"
    )} to ${moment(data.toDate).format(
      "MMMM D, YYYY"
    )}.
                              </p>
                              <p>
                                <a 
                                style="
                                    padding: 5px 10px;
                                    background: #0173c5;
                                    color: #fff;
                                    text-decoration: none;
                                    border-radius: 2px;
                                    font-size: 14px;
                                    display: inline-block;
                                  "
                                  target="_blank"
                                href="${process.env.CLIENT_URL}">Click Here</a> to view the
                                full request. <br />
                              </p>
                              <p><br /></p>
                              <p>Regards,</p>
                              <p>TARA HRMS<br /></p>
                            </div>
                            <table
                              style="
                                width: 100%;
                                font-size: 12px;
                                font-family: Century Gothic, CenturyGothic,
                                  AppleGothic, sans-serif;
                              "
                            >
                              <tbody></tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;
};

const leaveAcknowledgement = async (data) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <table
      style="
        border-collapse: collapse;
        line-height: 100% !important;
        width: 100% !important;
        font-family: sans-serif;
      "
      border="0"
      cellpadding="0"
      cellspacing="0"
      align="center"
    >
      <tbody>
        <tr>
          <td style="padding-top: 20px; padding-bottom: 20px">
            <table
              style="
                border-collapse: collapse;
                max-width: 635px;
                min-width: 550px;
                width: auto;
                margin: 0 auto;
                border: 0.5px solid #eee;
              "
              align="center"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      style="
                        border-collapse: collapse;
                        margin: 0 auto;
                        width: 100%;
                      "
                      align="center"
                    >
                      <tbody>
                        <tr style="background: #fff">
                          <td
                            colspan="2"
                            style="padding: 20px; padding-bottom: 0"
                            valign="top"
                          >
                            <table style="width: 100%">
                              <tbody>
                                <tr>
                                  <td
                            colspan="2"
                            style="
                              padding-bottom: 20px;
                              text-align: left;
                              border-bottom: 1px solid #eee;
                              width: 100%;
                            "
                            valign="middle"
                          >
                            <img
                              height="45"
                              src="${process.env.PROXY_URL}/api/uploads/assets/team-new.png"
                              alt="Logo"
                            />
                            <img
                              height="45"
                              src="${process.env.PROXY_URL}/api/uploads/assets/tara_small.png"
                              alt="Logo"
                               style="float:right"
                            />
                          </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr style="min-height: 300px; background: #fff">
                          <td colspan="2" style="padding: 20px" valign="top">
                            <div
                              style="
                                line-height: 1;
                                line-height: 1;
                                line-height: 1.8;
                              "
                            >
                              <p>Hi <b>${data.requesterName}</b>,</p>
                             
                              <p>
                                <b>${data.managerName}</b> has ${data.status
    } your leave
                                request ${data.leaveType} from ${moment(
      data.fromDate
    ).format("MMMM D, YYYY")} to
                                ${moment(data.toDate).format(
      "MMMM D, YYYY"
    )} <br />
                              </p>
                              <p>
                                <a
                                  style="
                                    padding: 5px 10px;
                                    background: #0173c5;
                                    color: #fff;
                                    text-decoration: none;
                                    border-radius: 2px;
                                    font-size: 14px;
                                    display: inline-block;
                                  "
                                  target="_blank"
                                  href="${process.env.CLIENT_URL}"
                                  >Click Here</a
                                >
                                to view the full leave request.<br />
                              </p>
                              <p><br /></p>
                              <p>Regards,</p>
                              <p>TARA HRMS<br /></p>
                            </div>
                            <table
                              style="
                                width: 100%;
                                font-size: 12px;
                                font-family: Century Gothic, CenturyGothic,
                                  AppleGothic, sans-serif;
                              "
                            >
                              <tbody></tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;
};

const forgotPasswordMail = async (data) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Team Computers</title>
    <link
      href="https://fonts.googleapis.com/css?family=Lato"
      rel="stylesheet"
    />
  </head>

  <body style="margin: 0; padding: 40px 0; background: #ffffff; color: #000000;">
    <table
      width="100%"
      style="
        width: 700px;
        margin: 0 auto;
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        border-radius: 10px;
      "
    >
      <tr>
        <td
          style="
            padding-left: 2rem !important;
            padding-right: 2rem !important;
            padding-top: 1.5rem !important;
          "
        >
          <img
            src="https://www.teamcomputers.com/images/logo.png"
            style="width: 80px; padding-right: 30px; padding-bottom: 25px"
          />
        </td>
      </tr>

      <tr>
        <td
          style="padding-left: 2rem !important; padding-right: 2rem !important"
        >
          <p style="font-weight: bold; font-size: 16px;">Dear User,</p>
          <p style="font-size: 15px; line-height: 1.6; color: #000000;">
            We received a request to reset the password for your account associated with this email address. 
            To proceed with resetting your password, please use the following One-Time Password (OTP):
          </p>
          <p style="font-size: 16px;">
            <span style="color: #000000;">Your One-Time Password (OTP): </span><strong>${data.otp}</strong>
          </p>
          <!--  
          <p style="font-size: 15px; line-height: 1.6; color: #000000;">
            This OTP is valid for the next 10 minutes. Please do not share this code with anyone. 
            If you did not request a password reset, you can safely ignore this email, and no changes will be made to your account.
          </p>  
          -->
          <p style="font-size: 15px; line-height: 1.6; color: #000000;">
            For your security, this OTP is valid for 5 minutes. After entering the OTP, you will be prompted to create a new password.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #000000;">
            If you encounter any issues or have questions, please contact our support team.
          </p>
          
          <p style="font-size: 15px; line-height: 1.6; color: #000000;">
            Regards,<br />
            TARA HRMS
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const revokeLeaveRequestMail = async (data) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <table
      style="
        border-collapse: collapse;
        line-height: 100% !important;
        width: 100% !important;
        font-family: sans-serif;
      "
      border="0"
      cellpadding="0"
      cellspacing="0"
      align="center"
    >
      <tbody>
        <tr>
          <td style="padding-top: 20px; padding-bottom: 20px">
            <table
              style="
                border-collapse: collapse;
                max-width: 635px;
                min-width: 550px;
                width: auto;
                margin: 0 auto;
                border: 0.5px solid #eee;
              "
              align="center"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      style="
                        border-collapse: collapse;
                        margin: 0 auto;
                        width: 100%;
                      "
                      align="center"
                    >
                      <tbody>
                        <tr style="background: #fff">
                          <td
                            colspan="2"
                            style="padding: 20px; padding-bottom: 0"
                            valign="top"
                          >
                            <table style="width: 100%">
                              <tbody>
                                <tr>
                                  <td
                            colspan="2"
                            style="
                              padding-bottom: 20px;
                              text-align: left;
                              border-bottom: 1px solid #eee;
                              width: 100%;
                            "
                            valign="middle"
                          >
                            <img
                              height="45"
                              src="${process.env.PROXY_URL}/api/uploads/assets/team-new.png"
                              alt="Logo"
                            />
                            <img
                              height="45"
                              src="${process.env.PROXY_URL}/api/uploads/assets/tara_small.png"
                              alt="Logo"
                               style="float:right"
                            />
                          </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr style="min-height: 300px; background: #fff">
                          <td colspan="2" style="padding: 20px" valign="top">
                            <div
                              style="
                                line-height: 1;
                                line-height: 1;
                                line-height: 1.8;
                              "
                            >
                              <p>Hi <b>${data.managerName}</b>,</p>
                              
                              <p>
                                <b>${data.empName}</b> has Revoked the own leave
                                request ${data.leaveType} from ${moment(data.fromDate).format("MMMM D, YYYY")} to ${moment(data.toDate).format("MMMM D, YYYY")}.<br />
                              </p>
                              <p>
                                <a
                                  href="${process.env.CLIENT_URL}"
                                  style="
                                    padding: 5px 10px;
                                    background: #0173c5;
                                    color: #fff;
                                    text-decoration: none;
                                    border-radius: 2px;
                                    font-size: 14px;
                                    display: inline-block;
                                  "
                                  target="_blank"
                                  >Click Here</a
                                >
                                to view the full leave request.<br />
                              </p>
                              <p><br /></p>
                              <p>Regards,</p>
                              <p>TARA HRMS<br /></p>
                            </div>
                            <table
                              style="
                                width: 100%;
                                font-size: 12px;
                                font-family: Century Gothic, CenturyGothic,
                                  AppleGothic, sans-serif;
                              "
                            >
                              <tbody></tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`
}

const autoLeaveDeduction = async (data) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <table
      style="
        border-collapse: collapse;
        line-height: 100% !important;
        width: 100% !important;
        font-family: sans-serif;
      "
      border="0"
      cellpadding="0"
      cellspacing="0"
      align="center"
    >
      <tbody>
        <tr>
          <td style="padding-top: 20px; padding-bottom: 20px">
            <table
              style="
                border-collapse: collapse;
                max-width: 635px;
                min-width: 550px;
                width: auto;
                margin: 0 auto;
                border: 0.5px solid #eee;
              "
              align="center"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      style="
                        border-collapse: collapse;
                        margin: 0 auto;
                        width: 100%;
                      "
                      align="center"
                    >
                      <tbody>
                        <tr style="background: #fff">
                          <td
                            colspan="2"
                            style="padding: 20px; padding-bottom: 0"
                            valign="top"
                          >
                            <table style="width: 100%">
                              <tbody>
                                <tr>
                                  <td
                                    colspan="2"
                                    style="
                                      padding-bottom: 20px;
                                      text-align: left;
                                      border-bottom: 1px solid #eee;
                                      width: 100%;
                                    "
                                    valign="middle"
                                  >
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/team-new.png"
                                      alt="Logo"
                                    />
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/tara_small.png"
                                      alt="Logo"
                                      style="float: right"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr style="min-height: 300px; background: #fff">
                          <td colspan="2" style="padding: 20px" valign="top">
                            <p>Dear&nbsp;${data.name},</p>
                            <p></p>
                            <div
                              style="
                                line-height: 1;
                                color: rgb(34, 34, 34);
                                font-family: Arial, Helvetica, sans-serif;
                                font-size: small;
                                font-style: normal;
                                font-variant-ligatures: normal;
                                font-variant-caps: normal;
                                font-weight: 400;
                                letter-spacing: normal;
                                text-align: start;
                                text-indent: 0px;
                                text-transform: none;
                                word-spacing: 0px;
                                white-space: normal;
                                background-color: rgb(255, 255, 255);
                                text-decoration-style: initial;
                                text-decoration-color: initial;
                              "
                            >
                              <div
                                dir="ltr"
                                class="gmail_signature"
                                data-smartmail="gmail_signature"
                              ></div>
                            </div>
                            <p></p>
                            <div
                              class="gmail_default"
                              style="
                                color: rgb(34, 34, 34);
                                font-style: normal;
                                font-variant-ligatures: normal;
                                font-variant-caps: normal;
                                letter-spacing: normal;
                                text-align: start;
                                text-indent: 0px;
                                text-transform: none;
                                word-spacing: 0px;
                                white-space: normal;
                                background-color: rgb(255, 255, 255);
                                text-decoration-style: initial;
                                text-decoration-color: initial;
                                font-family: verdana, sans-serif;
                                font-size: small;
                              "
                            >
                              Auto-Leave Deduction Notification. Please find the
                              details&nbsp;below.
                            </div>

                            <ul>
                              <li
                                style="
                                  padding: 0px 0 10px 0;
                                  line-height: 18px;
                                  font-size: 13px;
                                  color: #444;
                                "
                              >
                                <p
                                  style="
                                    padding: 0px 0 10px 0;
                                    line-height: 20px;
                                    font-size: 13px;
                                    color: #444;
                                  "
                                >
                                  On ${moment(data.date).format("DD-MM-YYYY")}<br /><br />
                                  ${data.leaveType} (${data.leaveDuration}) has been generated by system and
                                  ${data.leaveReason} because you have not
                                  satisfied the attendance policy.
                                </p>
                                <p
                                  style="
                                    padding: 0px 0 10px 0;
                                    line-height: 20px;
                                    font-size: 13px;
                                    color: #444;
                                  "
                                >
                                  Assigned Shift : ${moment(data.shiftStartTime, 'HH:mm:ss').format('hh:mm:ss A')} - ${moment(data.shiftEndTime, 'HH:mm:ss').format('hh:mm:ss A')}
                                  <br />
                                  Leave Type : ${data.leaveType} (${data.leaveDuration}) <br />
                                  Clock-in : ${moment(data.punchInTime, 'HH:mm:ss').format('hh:mm:ss A')} <br />
                                  Clock-out : ${moment(data.punchOutTime, 'HH:mm:ss').format('hh:mm:ss A')} <br />
                                </p>
                                <p
                                  style="
                                    padding: 0px 0 10px 0;
                                    line-height: 20px;
                                    font-size: 13px;
                                    color: #444;
                                  "
                                >
                                  To view the full message
                                  <a
                                    href="${process.env.CLIENT_URL}#/dashbaord"
                                    rel="noreferrer"
                                    style="
                                      padding: 5px 10px;
                                      background: #0173c5;
                                      color: #fff;
                                      text-decoration: none;
                                      border-radius: 2px;
                                      font-size: 14px;
                                      display: inline-block;
                                    "
                                    target="_blank"
                                    >Click Here</a
                                  >
                                </p>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`
}

const initiateSeparation = async (data) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <table
      style="
        border-collapse: collapse;
        line-height: 100% !important;
        width: 100% !important;
        font-family: sans-serif;
      "
      border="0"
      cellpadding="0"
      cellspacing="0"
      align="center"
    >
      <tbody>
        <tr>
          <td style="padding-top: 20px; padding-bottom: 20px">
            <table
              style="
                border-collapse: collapse;
                max-width: 635px;
                min-width: 550px;
                width: auto;
                margin: 0 auto;
                border: 0.5px solid #eee;
              "
              align="center"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      style="
                        border-collapse: collapse;
                        margin: 0 auto;
                        width: 100%;
                      "
                      align="center"
                    >
                      <tbody>
                        <tr style="background: #fff">
                          <td
                            colspan="2"
                            style="padding: 20px; padding-bottom: 0"
                            valign="top"
                          >
                            <table style="width: 100%">
                              <tbody>
                                <tr>
                                  <td
                                    colspan="2"
                                    style="
                                      padding-bottom: 20px;
                                      text-align: left;
                                      border-bottom: 1px solid #eee;
                                      width: 100%;
                                    "
                                    valign="middle"
                                  >
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/team-new.png"
                                      alt="Logo"
                                    />
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/tara_small.png"
                                      alt="Logo"
                                      style="float: right"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr style="min-height: 300px; background: #fff">
                          <td colspan="2" style="padding: 20px" valign="top">
                            <p>Hi ${data.recipientName},</p>
                            <p></p>
                            <p style="text-align: justify">
                              The&nbsp;<span style="font-weight: bolder"
                                >${data.empName}, ${data.empDesignation}&nbsp;
                                -&nbsp;&nbsp;${data.empDepartment}</span
                              >&nbsp;has resigned from the company.
                            </p>
                            <p style="text-align: justify">
                              Go to the 'Separation' tab in the
                              respective employee's profile to take action.<br />
                            </p>
                            <p style="text-align: justify"><br /></p>
                            <div style="text-align: center">
                              Click&nbsp;<span style="font-weight: 700"
                                ><a
                                  href="${process.env.CLIENT_URL}"
                                  style="
                                    padding: 5px 10px;
                                    background: #0173c5;
                                    color: #fff;
                                    text-decoration: none;
                                    border-radius: 2px;
                                    font-size: 14px;
                                    display: inline-block;
                                  "
                                  >Click Here</a
                                ></span
                              >&nbsp;to view the page.&nbsp;
                            </div>
                            <p></p>
                            <p>
                              Regards,<br />
                              HR Team,<br /><span style="font-weight: 700"
                                >${data.companyName}</span
                              >
                            </p>
                            <table
                              style="
                                width: 100%;
                                font-size: 12px;
                                font-family: Century Gothic, CenturyGothic,
                                  AppleGothic, sans-serif;
                              "
                            >
                              <tbody></tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`
}

const separationAcknowledgementToUser = async (data) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <table
      style="
        border-collapse: collapse;
        line-height: 100% !important;
        width: 100% !important;
        font-family: sans-serif;
      "
      border="0"
      cellpadding="0"
      cellspacing="0"
      align="center"
    >
      <tbody>
        <tr>
          <td style="padding-top: 20px; padding-bottom: 20px">
            <table
              style="
                border-collapse: collapse;
                max-width: 635px;
                min-width: 550px;
                width: auto;
                margin: 0 auto;
                border: 0.5px solid #eee;
              "
              align="center"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      style="
                        border-collapse: collapse;
                        margin: 0 auto;
                        width: 100%;
                      "
                      align="center"
                    >
                      <tbody>
                        <tr style="background: #fff">
                          <td
                            colspan="2"
                            style="padding: 20px; padding-bottom: 0"
                            valign="top"
                          >
                            <table style="width: 100%">
                              <tbody>
                                <tr>
                                  <td
                                    colspan="2"
                                    style="
                                      padding-bottom: 20px;
                                      text-align: left;
                                      border-bottom: 1px solid #eee;
                                      width: 100%;
                                    "
                                    valign="middle"
                                  >
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/team-new.png"
                                      alt="Logo"
                                    />
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/tara_small.png"
                                      alt="Logo"
                                      style="float: right"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr style="min-height: 300px; background: #fff">
                          <td colspan="2" style="padding: 20px" valign="top">
                            <p>Hi,</p>
                            <p style="text-align: justify">
                              Your separation request has been submitted
                              successfully. Please visit Profile &gt;
                              Separation or&nbsp;<span
                                style="font-weight: bolder"
                                ><a
                                  href="${process.env.CLIENT_URL}"
                                  style="
                                    padding: 5px 10px;
                                    background: #0173c5;
                                    color: #fff;
                                    text-decoration: none;
                                    border-radius: 2px;
                                    font-size: 14px;
                                    display: inline-block;
                                  "
                                  >Click Here</a
                                ></span
                              >&nbsp;for further details
                            </p>
                            <p></p>
                            <p>
                              Regards,<br />
                              HR Team,<br /><span style="font-weight: bolder"
                                >${data.companyName}</span
                              >
                            </p>
                            <table
                              style="
                                width: 100%;
                                font-size: 12px;
                                font-family: Century Gothic, CenturyGothic,
                                  AppleGothic, sans-serif;
                              "
                            >
                              <tbody></tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`
}

const separationApprovalAcknowledgementToUser = async (data) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <table
      style="
        border-collapse: collapse;
        line-height: 100% !important;
        width: 100% !important;
        font-family: sans-serif;
      "
      border="0"
      cellpadding="0"
      cellspacing="0"
      align="center"
    >
      <tbody>
        <tr>
          <td style="padding-top: 20px; padding-bottom: 20px">
            <table
              style="
                border-collapse: collapse;
                max-width: 635px;
                min-width: 550px;
                width: auto;
                margin: 0 auto;
                border: 0.5px solid #eee;
              "
              align="center"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      style="
                        border-collapse: collapse;
                        margin: 0 auto;
                        width: 100%;
                      "
                      align="center"
                    >
                      <tbody>
                        <tr style="background: #fff">
                          <td
                            colspan="2"
                            style="padding: 20px; padding-bottom: 0"
                            valign="top"
                          >
                            <table style="width: 100%">
                              <tbody>
                                <tr>
                                  <td
                                    colspan="2"
                                    style="
                                      padding-bottom: 20px;
                                      text-align: left;
                                      border-bottom: 1px solid #eee;
                                      width: 100%;
                                    "
                                    valign="middle"
                                  >
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/team-new.png"
                                      alt="Logo"
                                    />
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/tara_small.png"
                                      alt="Logo"
                                      style="float: right"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr style="min-height: 300px; background: #fff">
                          <td colspan="2" style="padding: 20px" valign="top">
                            <p>Hi&nbsp;${data.recipientName},</p>
                            <p></p>
                            <p style="text-align: justify">
                              The resignation has been accepted by the manager
                              and is awaiting confirmation from HR. Go to the
                              'Separation' tab to view the proposed
                              recovery days and last day.
                            </p>
                            <p>
                              Regards,<br />
                              HR Team,<br /><span style="font-weight: 700"
                                >${data.companyName}</span
                              >
                            </p>
                            <table
                              style="
                                width: 100%;
                                font-size: 12px;
                                font-family: Century Gothic, CenturyGothic,
                                  AppleGothic, sans-serif;
                              "
                            >
                              <tbody></tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`
}

const separationRejectedByBUHR = async (data) => {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <table
      style="
        border-collapse: collapse;
        line-height: 100% !important;
        width: 100% !important;
        font-family: sans-serif;
      "
      border="0"
      cellpadding="0"
      cellspacing="0"
      align="center"
    >
      <tbody>
        <tr>
          <td style="padding-top: 20px; padding-bottom: 20px">
            <table
              style="
                border-collapse: collapse;
                max-width: 635px;
                min-width: 550px;
                width: auto;
                margin: 0 auto;
                border: 0.5px solid #eee;
              "
              align="center"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      style="
                        border-collapse: collapse;
                        margin: 0 auto;
                        width: 100%;
                      "
                      align="center"
                    >
                      <tbody>
                        <tr style="background: #fff">
                          <td
                            colspan="2"
                            style="padding: 20px; padding-bottom: 0"
                            valign="top"
                          >
                            <table style="width: 100%">
                              <tbody>
                                <tr>
                                  <td
                                    colspan="2"
                                    style="
                                      padding-bottom: 20px;
                                      text-align: left;
                                      border-bottom: 1px solid #eee;
                                      width: 100%;
                                    "
                                    valign="middle"
                                  >
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/team-new.png"
                                      alt="Logo"
                                    />
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/tara_small.png"
                                      alt="Logo"
                                      style="float: right"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr style="min-height: 300px; background: #fff">
                          <td colspan="2" style="padding: 20px" valign="top">
                            <p>
                              <span
                                style="
                                  color: rgb(51, 51, 51);
                                  font-family: Calibri;
                                "
                                >Hi,&nbsp;</span
                              ><span style="font-family: Calibri"
                                >${data.empName}&nbsp;</span
                              ><span
                                style="
                                  color: rgb(51, 51, 51);
                                  font-family: Calibri;
                                "
                                >&nbsp;(</span
                              ><span style="font-family: Calibri"
                                >${data.empCode}</span
                              ><span
                                style="
                                  color: rgb(51, 51, 51);
                                  font-family: Calibri;
                                "
                                >),</span
                              >
                            </p>
                            <p style="text-align: justify">
                              <span
                                style="
                                  color: rgb(51, 51, 51);
                                  text-align: justify;
                                  font-family: Calibri;
                                "
                                >BU HR has rejected your resignation.</span
                              >
                            </p>
                            <p style="color: rgb(51, 51, 51)">
                              <span style="font-family: Calibri">Regards,</span
                              ><br /><span style="font-family: Calibri"
                                >TARA HRMS</span
                              >
                            </p>
                            <table
                              style="
                                width: 100%;
                                font-size: 12px;
                                font-family: Century Gothic, CenturyGothic,
                                  AppleGothic, sans-serif;
                              "
                            >
                              <tbody></tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`
}

const managerRejectsSeparation = async (data) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <table
      style="
        border-collapse: collapse;
        line-height: 100% !important;
        width: 100% !important;
        font-family: sans-serif;
      "
      border="0"
      cellpadding="0"
      cellspacing="0"
      align="center"
    >
      <tbody>
        <tr>
          <td style="padding-top: 20px; padding-bottom: 20px">
            <table
              style="
                border-collapse: collapse;
                max-width: 635px;
                min-width: 550px;
                width: auto;
                margin: 0 auto;
                border: 0.5px solid #eee;
              "
              align="center"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      style="
                        border-collapse: collapse;
                        margin: 0 auto;
                        width: 100%;
                      "
                      align="center"
                    >
                      <tbody>
                        <tr style="background: #fff">
                          <td
                            colspan="2"
                            style="padding: 20px; padding-bottom: 0"
                            valign="top"
                          >
                            <table style="width: 100%">
                              <tbody>
                                <tr>
                                  <td
                                    colspan="2"
                                    style="
                                      padding-bottom: 20px;
                                      text-align: left;
                                      border-bottom: 1px solid #eee;
                                      width: 100%;
                                    "
                                    valign="middle"
                                  >
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/team-new.png"
                                      alt="Logo"
                                    />
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/tara_small.png"
                                      alt="Logo"
                                      style="float: right"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr style="min-height: 300px; background: #fff">
                          <td colspan="2" style="padding: 20px" valign="top">
                            <p>
                              <span style="font-family: Calibri"
                                >Hi&nbsp;${data.recipientName}</span
                              >
                            </p>
                            <p></p>
                            <p style="text-align: justify">
                              <span style="font-family: Calibri"
                                >The manager has rejected the resignation.</span
                              >
                            </p>
                            <p style="text-align: justify">
                              <span
                                style="
                                  color: rgb(0, 0, 0);
                                  text-align: start;
                                  font-family: Calibri;
                                "
                                >Name:&nbsp;</span
                              ><span
                                style="
                                  color: rgb(0, 0, 0);
                                  text-align: start;
                                  font-family: Calibri;
                                "
                                >${data.empName} (</span
                              ><span style="font-family: Calibri"
                                >${data.empCode})</span
                              ><span
                                style="
                                  color: rgb(0, 0, 0);
                                  text-align: start;
                                  font-family: Calibri;
                                "
                                ><br /></span
                              ><span
                                style="
                                  color: rgb(0, 0, 0);
                                  text-align: start;
                                  font-family: Calibri;
                                "
                                >Designation:&nbsp;</span
                              ><span
                                style="
                                  color: rgb(0, 0, 0);
                                  text-align: start;
                                  font-family: Calibri;
                                "
                                >${data.designation}</span
                              ><span
                                style="
                                  color: rgb(0, 0, 0);
                                  text-align: start;
                                  font-family: Calibri;
                                "
                                ><br /></span
                              ><span
                                style="
                                  color: rgb(0, 0, 0);
                                  text-align: start;
                                  font-family: Calibri;
                                "
                                >Department:&nbsp;</span
                              ><span
                                style="
                                  color: rgb(0, 0, 0);
                                  text-align: start;
                                  font-family: Calibri;
                                "
                                >${data.department}</span
                              ><span
                                style="
                                  color: rgb(0, 0, 0);
                                  text-align: start;
                                  font-family: Calibri;
                                "
                                ><br /></span
                              ><span
                                style="
                                  color: rgb(0, 0, 0);
                                  text-align: start;
                                  font-family: Calibri;
                                "
                                >Reporting Head:&nbsp;</span
                              ><span
                                style="
                                  color: rgb(0, 0, 0);
                                  text-align: start;
                                  font-family: Calibri;
                                "
                                >${data.reportingManager}</span
                              ><br />
                            </p>
                            <p>
                              <span style="font-family: Calibri">Regards,</span
                              ><br /><span style="font-family: Calibri"
                                >HR Team,</span
                              ><br /><span
                                style="font-weight: 700; font-family: Calibri"
                                >${data.companyName}</span
                              >
                            </p>
                            <table
                              style="
                                width: 100%;
                                font-size: 12px;
                                font-family: Century Gothic, CenturyGothic,
                                  AppleGothic, sans-serif;
                              "
                            >
                              <tbody></tbody>
                            </table>
                          </td>
                        </tr>
                       
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`
}

const managerApprovesSeparation = async (data) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <table
      style="
        border-collapse: collapse;
        line-height: 100% !important;
        width: 100% !important;
        font-family: sans-serif;
      "
      border="0"
      cellpadding="0"
      cellspacing="0"
      align="center"
    >
      <tbody>
        <tr>
          <td style="padding-top: 20px; padding-bottom: 20px">
            <table
              style="
                border-collapse: collapse;
                max-width: 635px;
                min-width: 550px;
                width: auto;
                margin: 0 auto;
                border: 0.5px solid #eee;
              "
              align="center"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      style="
                        border-collapse: collapse;
                        margin: 0 auto;
                        width: 100%;
                      "
                      align="center"
                    >
                      <tbody>
                        <tr style="background: #fff">
                          <td
                            colspan="2"
                            style="padding: 20px; padding-bottom: 0"
                            valign="top"
                          >
                            <table style="width: 100%">
                              <tbody>
                                <tr>
                                  <td
                                    colspan="2"
                                    style="
                                      padding-bottom: 20px;
                                      text-align: left;
                                      border-bottom: 1px solid #eee;
                                      width: 100%;
                                    "
                                    valign="middle"
                                  >
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/team-new.png"
                                      alt="Logo"
                                    />
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/tara_small.png"
                                      alt="Logo"
                                      style="float: right"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr style="min-height: 300px; background: #fff">
                          <td colspan="2" style="padding: 20px" valign="top">
                            <p>
                              Hi&nbsp;<strong>${data.recipientName}</strong>,&nbsp;
                            </p>
                            <p style="text-align: justify">
                              <b>${data.empName}</b
                              ><span style="font-weight: bolder">,</span
                              ><span style="font-weight: bolder"
                                >${data.empCode}</span
                              ><span style="font-weight: bolder"
                                >,${data.bu}</span
                              >&nbsp;has resigned from the company. The request
                              has been approved by the reporting manager
                              (<strong>${data.managerName}</strong>) and is
                              pending your approval. Go to the employee's
                              'Separation' tab in the respective
                              employee's profile to take action,<br /><br />
                            </p>
                            <div style="text-align: center">
                              or Click&nbsp;<span style="font-weight: bolder"
                                ><a
                                  href="${process.env.CLIENT_URL}"
                                  style="
                                    padding: 5px 10px;
                                    background: #0173c5;
                                    color: #fff;
                                    text-decoration: none;
                                    border-radius: 2px;
                                    font-size: 14px;
                                    display: inline-block;
                                  "
                                  >Click Here</a
                                ></span
                              >&nbsp;to view the page.<br />
                            </div>
                            <p></p>
                            <p>
                              Regards,<br />
                              Team - HRM
                            </p>
                            <table
                              style="
                                width: 100%;
                                font-size: 12px;
                                font-family: Century Gothic, CenturyGothic,
                                  AppleGothic, sans-serif;
                              "
                            >
                              <tbody></tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`
}

const separationApproveByBUHR = async (data) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <table
      style="
        border-collapse: collapse;
        line-height: 100% !important;
        width: 100% !important;
        font-family: sans-serif;
      "
      border="0"
      cellpadding="0"
      cellspacing="0"
      align="center"
    >
      <tbody>
        <tr>
          <td style="padding-top: 20px; padding-bottom: 20px">
            <table
              style="
                border-collapse: collapse;
                max-width: 635px;
                min-width: 550px;
                width: auto;
                margin: 0 auto;
                border: 0.5px solid #eee;
              "
              align="center"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      style="
                        border-collapse: collapse;
                        margin: 0 auto;
                        width: 100%;
                      "
                      align="center"
                    >
                      <tbody>
                        <tr style="background: #fff">
                          <td
                            colspan="2"
                            style="padding: 20px; padding-bottom: 0"
                            valign="top"
                          >
                            <table style="width: 100%">
                              <tbody>
                                <tr>
                                  <td
                                    colspan="2"
                                    style="
                                      padding-bottom: 20px;
                                      text-align: left;
                                      border-bottom: 1px solid #eee;
                                      width: 100%;
                                    "
                                    valign="middle"
                                  >
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/team-new.png"
                                      alt="Logo"
                                    />
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/tara_small.png"
                                      alt="Logo"
                                      style="float: right"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr style="min-height: 300px; background: #fff">
                          <td colspan="2" style="padding: 20px" valign="top">
                            <div
                              style="
                                color: rgb(34, 34, 34);
                                font-family: Arial, Helvetica, Verdana,
                                  sans-serif;
                                font-size: 13px;
                              "
                            >
                              <span style="font-weight: bolder"
                                ><span style="font-family: Arial"
                                  >Dear&nbsp;</span
                                ></span
                              ><strong>${data.empName}</strong
                              ><br style="font-size: 12px" /><br
                                style="font-size: 12px"
                              /><span
                                style="font-size: 12px; font-family: Arial"
                                >This is to inform you that we have accepted
                                your resignation dated&nbsp;</span
                              ><span style="font-family: Georgia"
                                ><span
                                  style="
                                    font-weight: bolder;
                                    font-family: Arial;
                                  "
                                  >${moment(data.dateOfResignation).format("DD-MM-YYYY")}</span
                                ></span
                              ><span style="font-size: 12px"
                                ><span style="font-family: Arial"
                                  >&nbsp;and your last working day in ${data.companyName} would be&nbsp;</span
                                ></span
                              ><b>${moment(data.lastWorkingDay).format("DD-MM-YYYY")}</b
                              ><span style="font-family: Georgia"
                                ><span style="font-family: Arial">.</span></span
                              >
                            </div>
                            <div
                              style="
                                color: rgb(34, 34, 34);
                                font-family: Arial, Helvetica, Verdana,
                                  sans-serif;
                                font-size: 13px;
                              "
                            >
                              <br style="font-size: 12px" /><span
                                style="font-weight: bolder; font-size: 12px"
                                ><span style="font-family: Arial"
                                  >Note:-</span
                                ></span
                              ><span style="font-size: 12px; font-family: Arial"
                                >Incase a shortfall in notice period amount will
                                be deducted from your FNF.</span
                              ><br />
                            </div>
                            <div
                              style="
                                font-family: Arial, Helvetica, Verdana,
                                  sans-serif;
                                font-size: 13px;
                              "
                            >
                              <div style="color: rgb(34, 34, 34)">
                                <br style="font-size: 12px" /><span
                                  style="font-size: 12px; font-family: Arial"
                                  >Please follow the process listed below for a
                                  smooth exit and F&amp;F
                                  settlement:-&nbsp;</span
                                ><br style="font-size: 12px" /><br
                                  style="font-size: 12px"
                                /><span
                                  style="font-weight: bolder; font-size: 12px"
                                  ><span style="font-family: Arial"
                                    >For No due Clearance &amp; Exit
                                    Interview:-</span
                                  ></span
                                >
                              </div>
                              <div style="color: rgb(34, 34, 34)">
                                <br />
                              </div>
                              <ul
                                style="color: rgb(34, 34, 34); font-size: 12px"
                              >
                                <li style="margin-left: 15px">
                                  <span style="font-family: Arial"
                                    >Go to Separation &gt;&gt;&nbsp;</span
                                  ><span style="font-weight: bolder"
                                    ><span style="font-family: Arial"
                                      >Separation Flow&nbsp;</span
                                    ></span
                                  ><span style="font-family: Arial"
                                    >and&nbsp;check your</span
                                  ><span style="font-weight: bolder"
                                    ><span style="font-family: Arial"
                                      >&nbsp;NO DUES&nbsp;</span
                                    ></span
                                  ><span style="font-family: Arial"
                                    >clearance status.</span
                                  >
                                </li>
                                <li style="margin-left: 15px">
                                  <span style="font-family: Arial"
                                    >If any clearance is pending for more than 3
                                    days,you can send an email to the concerned
                                    person. Contact details of concerned persons
                                    are mentioned in the clearance form.</span
                                  >
                                </li>
                                <li style="margin-left: 15px">
                                  <span style="font-family: Arial"
                                    >Login your darwin box Go to&nbsp;</span
                                  ><span style="font-weight: bolder"
                                    ><span style="font-family: Arial"
                                      >Task Box</span
                                    ></span
                                  ><span style="font-family: Arial"
                                    >&gt;&gt;Click Exit Feedback &amp; fill exit
                                    feedback form.</span
                                  ><span
                                    style="
                                      background-color: yellow;
                                      font-family: Georgia;
                                    "
                                    ><span
                                      style="
                                        font-weight: bolder;
                                        font-family: Arial;
                                      "
                                      >&nbsp;This is mandatory for the relieving
                                      process.</span
                                    ></span
                                  >
                                </li>
                                <li style="margin-left: 15px">
                                  <span style="font-family: Arial"
                                    >Please Contact</span
                                  ><span style="font-weight: bolder"
                                    ><span style="font-family: Arial"
                                      >&nbsp;</span
                                    ><span style="font-family: Arial"
                                      ><a
                                        href="mailto:exit.hrcare@teamcomputers.com"
                                        style="
                                          color: rgb(17, 85, 204);
                                          font-family: georgia, serif;
                                          font-size: large;
                                          font-weight: 400;
                                        "
                                        target="_blank"
                                        ><span
                                          style="
                                            font-family: Arial;
                                            font-size: 12px;
                                          "
                                          >exit.hrcare@<wbr />teamcomputers.com</span
                                        ></a
                                      ><span
                                        style="
                                          font-family: georgia, serif;
                                          font-size: large;
                                          font-weight: 400;
                                        "
                                        >&nbsp;</span
                                      ></span
                                    ></span
                                  ><span style="font-family: Arial"
                                    >from HR for Full and Final settlement and
                                    documents on your last working day.</span
                                  >
                                </li>
                                <li style="margin-left: 15px">
                                  <span style="font-family: Arial"
                                    >Please ensure you handover your&nbsp;</span
                                  ><span style="font-weight: bolder"
                                    ><span style="font-family: Arial"
                                      >ID card/Business Card</span
                                    ></span
                                  ><span style="font-family: Arial"
                                    >&nbsp;on your last working day to
                                    the&nbsp;</span
                                  ><span style="font-weight: bolder"
                                    ><span style="font-family: Arial"
                                      >Reception Desk</span
                                    ></span
                                  ><span style="font-family: Arial"
                                    >. This is a prerequisite to process your
                                    final settlement.</span
                                  ><br /><span style="font-family: Arial"
                                    >You would need to handover the assets which
                                    have been assigned to you by TCPL ;ie, like
                                    Laptop, Bag,SIM, Datacard etc.</span
                                  >
                                </li>
                              </ul>
                              <div style="color: rgb(34, 34, 34)">
                                <span
                                  style="font-weight: bolder; font-size: 12px"
                                  ><span style="font-family: Arial"
                                    >For Final Settlement:-</span
                                  ></span
                                >
                              </div>
                              <div style="color: rgb(34, 34, 34)">
                                <br style="font-size: 12px" />
                              </div>
                              <ul style="font-size: 12px">
                                <li
                                  style="
                                    color: rgb(34, 34, 34);
                                    margin-left: 15px;
                                  "
                                >
                                  <span style="font-family: Arial"
                                    >Please note that your salary for the last
                                    month (the month in which you are getting
                                    relieved) will be put on hold&nbsp;</span
                                  ><span style="font-family: Arial"
                                    >and will be released along with your final
                                    settlement and not on the salary date.</span
                                  >
                                </li>
                                <li
                                  style="
                                    color: rgb(34, 34, 34);
                                    margin-left: 15px;
                                  "
                                >
                                  <span style="font-family: Arial"
                                    >No Leaves are allowed during notice period
                                    ,In case of emergency leave his/her notice
                                    period will be extended by the same number
                                    of days as leave taken.</span
                                  >
                                </li>
                                <li
                                  style="
                                    color: rgb(34, 34, 34);
                                    margin-left: 15px;
                                  "
                                >
                                  <span style="font-family: Arial"
                                    >In case your last date is before the 15th
                                    of the month, then the previous month's
                                    salary along with the current month (till
                                    last date) will be processed together in the
                                    final settlement.</span
                                  >
                                </li>
                                <li
                                  style="
                                    color: rgb(34, 34, 34);
                                    margin-left: 15px;
                                  "
                                >
                                  <span style="font-family: Arial"
                                    >If all your clearance has been cleared on
                                    or before the last working date; your
                                    relieving letter will be issued within next
                                    2 working day on the last working day in
                                    your personal mail ID.</span
                                  >
                                </li>
                                <li style="margin-left: 15px">
                                  <span
                                    style="
                                      font-weight: bolder;
                                      background-color: rgb(255, 255, 0);
                                    "
                                    ><span style="font-family: Arial"
                                      >The Full &amp; Final amount would be
                                      released to you within 45-60 days of your
                                      exit (Last Working Day), provided all dues
                                      are cleared.</span
                                    ><span style="font-family: Arial"
                                      >&nbsp;</span
                                    ></span
                                  >
                                </li>
                                <li
                                  style="
                                    color: rgb(34, 34, 34);
                                    margin-left: 15px;
                                  "
                                >
                                  <span style="font-family: Arial"
                                    >For form-16 related issues / queries,
                                    please get in touch with Naval Singh -
                                    "</span
                                  ><a
                                    rel="noreferrer"
                                    href="mailto:naval@teamcomputers.com"
                                    style="color: rgb(17, 85, 204)"
                                    target="_blank"
                                    ><span style="font-family: Arial"
                                      >naval@teamcomputers.com</span
                                    ></a
                                  ><span style="font-family: Arial">".</span>
                                </li>
                                <li
                                  style="
                                    color: rgb(34, 34, 34);
                                    margin-left: 15px;
                                  "
                                >
                                  <span style="font-family: Arial"
                                    >For PF related issues / queries, please get
                                    in touch with Vijay Bisht - "</span
                                  ><a
                                    rel="noreferrer"
                                    href="mailto:durgesh.k@teamcomputers.com"
                                    style="color: rgb(17, 85, 204)"
                                    target="_blank"
                                    ><span style="font-family: Arial"
                                      >vijay.bisht@teamcomputers.com</span
                                    ></a
                                  ><span style="font-family: Arial"
                                    ><wbr />".</span
                                  >
                                </li>
                                <li
                                  style="
                                    color: rgb(34, 34, 34);
                                    margin-left: 15px;
                                  "
                                >
                                  <span style="font-family: Arial"
                                    >Would request you to ensure that your no
                                    dues are cleared before your last working
                                    day so that your relieving document will be
                                    shared with your personal mail ID.</span
                                  >
                                </li>
                              </ul>
                            </div>
                            <p></p>
                            <div style="text-align: center">
                              <span style="font-weight: bolder"
                                ><span
                                  style="font-family: Arial; font-size: 18px"
                                  >Regards,</span
                                ></span
                              >
                            </div>
                            <p></p>
                            <div
                              style="box-sizing: border-box; text-align: center"
                            >
                              <b
                                style="
                                  box-sizing: border-box;
                                  font-weight: bolder;
                                "
                                ><span
                                  style="
                                    box-sizing: border-box;
                                    font-family: Arial;
                                    font-size: 18px;
                                  "
                                  >Team HR</span
                                ></b
                              >
                            </div>
                            <table
                              style="
                                width: 100%;
                                font-size: 12px;
                                font-family: Century Gothic, CenturyGothic,
                                  AppleGothic, sans-serif;
                              "
                            >
                              <tbody></tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`
}

const clearanceInitiated = async (data) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <table
      style="
        border-collapse: collapse;
        line-height: 100% !important;
        width: 100% !important;
        font-family: sans-serif;
      "
      border="0"
      cellpadding="0"
      cellspacing="0"
      align="center"
    >
      <tbody>
        <tr>
          <td style="padding-top: 20px; padding-bottom: 20px">
            <table
              style="
                border-collapse: collapse;
                max-width: 635px;
                min-width: 550px;
                width: auto;
                margin: 0 auto;
                border: 0.5px solid #eee;
              "
              align="center"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      style="
                        border-collapse: collapse;
                        margin: 0 auto;
                        width: 100%;
                      "
                      align="center"
                    >
                      <tbody>
                        <tr style="background: #fff">
                          <td
                            colspan="2"
                            style="padding: 20px; padding-bottom: 0"
                            valign="top"
                          >
                            <table style="width: 100%">
                              <tbody>
                                <tr>
                                  <td
                                    colspan="2"
                                    style="
                                      padding-bottom: 20px;
                                      text-align: left;
                                      border-bottom: 1px solid #eee;
                                      width: 100%;
                                    "
                                    valign="middle"
                                  >
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/team-new.png"
                                      alt="Logo"
                                    />
                                    <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/tara_small.png"
                                      alt="Logo"
                                      style="float: right"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr style="min-height: 300px; background: #fff">
                          <td colspan="2" style="padding: 20px" valign="top">
                            <div style="line-height: 1.2">
                              <span
                                style="font-family: Calibri; font-size: 14px"
                                >Dear ${data.recipientName},</span
                              >
                            </div>
                            <div style="line-height: 1.2">
                              <br /><br /><span
                                style="font-family: Calibri; font-size: 14px"
                                >This is to inform you that&nbsp;</span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >${data.empName}&nbsp;</span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >has resigned, please block all the transactions
                                &amp; application access as per (last working
                                date) mentioned below:</span
                              >
                            </div>
                            <div style="line-height: 1.2">
                              <br />
                            </div>
                            <div style="line-height: 1.2">
                              <span
                                style="font-family: Calibri; font-size: 14px"
                                ><b><u>Member Details</u></b></span
                              >
                            </div>
                            <div style="line-height: 1.2">
                              <br />
                            </div>
                            <div style="line-height: 1.2">
                              <span
                                style="font-family: Calibri; font-size: 14px"
                                >Member TMC No:&nbsp;</span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >${data.empCode}</span
                              >
                            </div>
                            <div style="line-height: 1.2">
                              <span
                                style="font-family: Calibri; font-size: 14px"
                                >Member's Name: </span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >${data.empName}</span
                              >
                            </div>
                            <div style="line-height: 1.2">
                              <span
                                style="font-family: Calibri; font-size: 14px"
                                ><span
                                  style="font-family: Calibri; font-size: 14px"
                                  >Branch Name:&nbsp;</span
                                ></span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >${data.officeLocation}</span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                ><br /></span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >Department Name: </span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >${data.department}</span
                              >
                            </div>
                            <div style="line-height: 1.2">
                              <span
                                style="font-family: Calibri; font-size: 14px"
                                >Mobile Number:</span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >${data.officeMobileNumber}</span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                ><br /></span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >SBU Name:&nbsp;</span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >${data.sbuName}</span
                              ><span style="font-family: Calibri"><br /></span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                ><span
                                  style="font-family: Calibri; font-size: 14px"
                                  >Reporting Head :&nbsp;</span
                                ></span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >${data.reportingName}</span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                ><br /></span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >Date of Joining:&nbsp;</span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >${moment(data.dateOfJoining).format("DD-MM-YYYY")}</span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                ><br /><span
                                  style="font-family: Calibri; font-size: 14px"
                                  >Date of Resignation: ${moment(data.dateOfResignation).format("DD-MM-YYYY")}</span
                                ></span
                              ><br /><span
                                style="font-family: Calibri; font-size: 14px"
                                >Last Working Day:&nbsp;</span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >${moment(data.lastWorkingDay).format("DD-MM-YYYY")}</span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                ><br /></span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >Personal Email ID:&nbsp;</span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >${data.personalMailID}</span
                              >
                            </div>
                            <div style="line-height: 1.2">
                              <span
                                style="font-family: Calibri; font-size: 14px"
                                >Personal Contact Number:&nbsp;</span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >${data.personalMobileNumber}</span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                ><br
                              /></span>
                            </div>
                            <div style="line-height: 1.2"><br /><br /></div>
                            <div style="line-height: 1.2">
                              <span
                                style="font-family: Calibri; font-size: 14px"
                                ><span
                                  style="font-family: Calibri; font-size: 14px"
                                  >Regards,</span
                                ><br /></span
                              ><span
                                style="font-family: Calibri; font-size: 14px"
                                >Team HRD</span
                              >
                            </div>
                            <table
                              style="
                                width: 100%;
                                font-size: 12px;
                                font-family: Century Gothic, CenturyGothic,
                                  AppleGothic, sans-serif;
                              "
                            >
                              <tbody></tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`
}

const onboardingEmployee = async (data) => {
  return `
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
</head>

<body>
  <table style="border-collapse:collapse;line-height:100%!important;width:100%!important;font-family:sans-serif"
    border="0" cellpadding="0" cellspacing="0" align="center">
    <tbody>
      <tr>
        <td style="padding-top:20px;padding-bottom:20px">
          <table
            style="border-collapse:collapse;max-width:635px;min-width:550px;width:auto;margin:0 auto;border:0.5px solid #eee"
            align="center">
            <tbody>
              <tr>
                <td>
                  <table style="border-collapse:collapse;margin:0 auto;width:100%" align="center">
                    <tbody>
                      <tr style="background:#fff">
                        <td colspan="2" style="padding:20px;padding-bottom:0" valign="top">
                          <table style="width:100%">
                            <tbody>
                              <tr>
                                <td colspan="2" style="padding-bottom:20px;text-align:left;border-bottom:1px solid #eee"
                                  valign="middle">
                                  <img
                                      height="45"
                                      src="${process.env.PROXY_URL}/api/uploads/assets/team-new.png"
                                      alt="Logo"
                                  />
                                  <img
                                    height="45"
                                    src="${process.env.PROXY_URL}/api/uploads/assets/tara_small.png"
                                    alt="Logo"
                                    style="float: right"
                                  />
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr style="min-height:300px;background:#fff">
                        <td colspan="2" style="padding:20px" valign="top">
                          <div style="line-height:1.5">
                            <span style="font-family:Calibri;font-size:14px">Dear ${data.firstName},</span>
                          </div>
                          <div style="line-height:1.5">
                            <br>
                          </div>
                          <div style="line-height:1.5">
                            <span style="font-family:Calibri;font-size:14px">Welcome to Tara, To start using your new
                              HRMS platform, please do the following -&nbsp;</span>
                          </div>
                          <div style="line-height:1.5">
                            <br>
                          </div>
                          <div style="line-height:1.5">
                            <span style="font-family:Calibri;font-size:14px"><b>Mobile App -&nbsp;</b></span>
                          </div>
                          <ol>
                            <li style="line-height:1.5"><span style="font-family:Calibri;font-size:14px">Download the
                                TARA HRMS application from Play Store/Apple Store</span></li>
                            <li style="line-height:1.5"><span style="font-family:Calibri;font-size:14px">Your User ID
                                (Employee ID)&nbsp; -&nbsp;</span><span style="font-family:Calibri;font-size:14px">${data.empCode}</span></li>
                            <li style="line-height:1.5"><span style="font-family:Calibri;font-size:14px">Password
                                -&nbsp;</span><span style="font-family:Calibri;font-size:14px">${data.password}</span></li>
                          </ol>
                          <div style="line-height:1.5">
                            <br>
                          </div>
                          <div style="line-height:1.5">
                            <span style="font-family:Calibri;font-size:14px"><b>Laptop/PC -&nbsp;</b></span>
                          </div>
                          <ol>
                            <li style="line-height:1.5"><span style="font-family:Calibri;font-size:14px">Please use the
                                following URL -&nbsp;</span><span style="font-family:Calibri;font-size:14px"><u><a
                                    href="https://tara.teamcomputers.com" target="_blank"
                                    data-saferedirecturl="https://www.google.com/url?q=https://tara.teamcomputers.com/&amp;source=gmail&amp;ust=1727407654468000&amp;usg=AOvVaw0u4ezRJDHPE2alMMkynFks">tara.teamcomputers.com</a></u></span>
                            </li>
                            <li style="line-height:1.5"><span style="font-family:Calibri;font-size:14px">Your User ID
                                (Employee ID) -&nbsp;</span><span style="font-family:Calibri;font-size:14px">${data.empCode}</span></li>
                            <li style="line-height:1.5"><span style="font-family:Calibri;font-size:14px">Password
                                -&nbsp;</span><span style="font-family:Calibri;font-size:14px">${data.password}</span></li>
                          </ol>
                          <div style="line-height:1.5">
                            <span style="font-family:Calibri;font-size:14px"><br><span
                                style="font-size:14px;font-family:Calibri">In case you face any problems, please contact
                                us!</span></span>
                          </div>
                          <div style="line-height:1.5">
                            <span style="font-family:Calibri"><br><span
                                style="font-size:14px;font-family:Calibri">Regards,</span></span><span
                              style="font-family:Calibri"><br></span><span
                              style="font-size:14px;font-family:Calibri">Team HRM</span><span
                              style="font-family:Calibri"><span
                                style="font-size:14px;font-family:Calibri"><br></span></span><span
                              style="font-family:Calibri;font-size:14px">Team Computers</span>
                          </div><br>
                          <table
                            style="width:100%;font-size:12px;font-family:Century Gothic,CenturyGothic,AppleGothic,sans-serif">
                            <tbody></tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>

</html>`
}

export default {
  regularizationRequestMail,
  resetPasswordMail,
  revokeRegularizeMail,
  leaveRequestMail,
  regularizationAcknowledgement,
  leaveAcknowledgement,
  forgotPasswordMail,
  revokeLeaveRequestMail,
  autoLeaveDeduction,
  initiateSeparation,
  separationAcknowledgementToUser,
  separationApprovalAcknowledgementToUser,
  separationRejectedByBUHR,
  managerRejectsSeparation,
  managerApprovesSeparation,
  separationApproveByBUHR,
  clearanceInitiated,
  onboardingEmployee
};
