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
                                  ${data.leaveType} (${data.leaveDuration}) has been generated and
                                  auto-approved by system because you have not
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
                                    "
                                    valign="middle"
                                  >
                                    <img
                                      height="45"
                                      src="https://ci3.googleusercontent.com/meips/ADKq_NbwnPEGpqJ0nWC0Q4z_VTG7sQLFnUMREkRspdz5EI3URfaCFTh14Ba7wz6gouTI4u4BJy4XsW6RVfNgTFFJgqYofKCehSWx60UYmy9nCAOlszWJbpzI5C2lJXWuJaP7uvxnURJDW0ubMhe30U9STuJIWvSak8Lm6Tjxxx9wowzVok9B4NQV2RDz4PgsW1t8Nf901ypwAKUKdgUqFbwsl1HVWg=s0-d-e1-ft#https://darwinbox-data-prod-mum.s3.ap-south-1.amazonaws.com/INSTANCE4_5f4533721b7ce_81/logo/a60f00e4c540d5__tenant-avatar-81_2114260795.png"
                                      alt="Logo"
                                      class="CToWUd"
                                      data-bit="iit"
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
  separationApprovalAcknowledgementToUser
};
