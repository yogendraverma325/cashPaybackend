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
                            "
                            valign="middle"
                          >
                            <img
                              height="45"
                              src="https://www.teamcomputers.com/images/logo.png"
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
                    <div
                      style="line-height: 1; line-height: 1; line-height: 1.8"
                    >
                      <p>Hi <b>${data.managerName}</b>,</p>
                      <p><br /></p>
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
                      <p>Teams TARA<br /></p>
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
                                    "
                                    valign="middle"
                                  >
                                    <img
                                      height="45"
                                      src="https://www.teamcomputers.com/images/logo.png"
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
                            <div
                              style="
                                line-height: 1;
                                line-height: 1;
                                line-height: 1.8;
                              "
                            >
                              <p>Hi <b>${data.managerName}</b>,</p>
                              <p><br /></p>
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
                              <p>Teams TARA<br /></p>
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
    <div style="margin: 0 auto; background: #f2f5f7">
      <table
        style="
          margin: auto;
          background: linear-gradient(#51e1ed, #383cc1) top center no-repeat;
          padding: 35px 0 20px;
          max-width: 635px;
          min-width: 550px;
        "
        cellpadding="0"
        cellspacing="0"
        border="0"
      >
        <tbody>
          <tr>
            <td align="center" valign="middle" style="margin: 0; padding: 0">
              <table
               
              >
                <tbody>
                  <tr>
                    <td
                      align="left"
                      valign="middle"
                      style="padding: 0 30px 24px; margin: 0"
                    >
                      <a
                        href="https://www.teamcomputers.com"
                        target="_blank"
                        data-saferedirecturl="https://www.google.com/url?q=https://www.teamcomputers.com&amp;source=gmail&amp;ust=1661580113732000&amp;usg=AOvVaw1Ap0syGrGqaM6cnwqLC6CP"
                      >
                        <img
                          src="https://www.teamcomputers.com/repositry/team-intranet-imgs/teams-logo.png"
                          alt=""
                          class="CToWUd"
                          data-bit="iit"
                        />
                      </a>
                    </td>

                    <td
                      align="right"
                      valign="middle"
                      style="padding: 0 30px 24px; margin: 0"
                    >
                      <a
                        href="${process.env.CLIENT_URL}"
                        target="_blank"
                      >
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                width="750"
                border="0"
                cellpadding="0"
                cellspacing="0"
                style="
                  width: 750px;
                  margin: auto;
                  background: url(https://ci4.googleusercontent.com/proxy/Ic7NVCs2Hj_DUbcW_VKD5QvRjPm2GWgt48QKJi4p_q_TwwHtaNtOUd4PVcqphtxPXNMQDPBpwtKKV8j66a1_vVo9p_9KaGNuw6eYmf36zKEmWv6w00ZEoep59VD08NHGsqUhTzzGjkXpAs91f5FZLAggHNgiejaDrJ8=s0-d-e1-ft#https://www.teamcomputers.com/repositry/edm/customer-order-tracking/order-received/image/content-bg.png)
                    top center no-repeat;
                  padding: 0 0 21px;
                "
              >
                <tbody>
                  <tr>
                    <td
                      align="left"
                      valign="top"
                      style="padding: 50px 54px 0; margin: 0"
                      colspan="2"
                    >
                      <p
                        style="
                          font-size: 17px;
                          color: #666666;
                          font-family: sans-serif;
                          margin: 0;
                        "
                      >
                        Dear <strong>${data.managerName}</strong> ,
                      </p>

                      <p
                        style="
                          font-size: 17px;
                          color: #666666;
                          font-family: sans-serif;
                          margin-bottom: 0;
                          height: 40px;
                          line-height: 1.4;
                        "
                      >
                        ${data.name} has Revoked their Attendance Regularization
                        request for ${data.attendanceDate}.
                      </p>
                      <p
                        style="
                          font-size: 17px;
                          color: #666666;
                          font-family: sans-serif;
                          margin-bottom: 0;
                          height: 40px;
                          line-height: 1.4;
                        "
                      >
                        Click on below button to view the full request.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td
                      align="left"
                      valign="top"
                      style="padding: 10px 54px 0; margin: 0"
                      colspan="2"
                    >
                      <a
                        style="
                          border-color: #0bacbc !important;
                          background: linear-gradient(
                            #51e1ed,
                            #383cc1
                          ) !important;
                          border-radius: 1.3rem;
                          text-transform: uppercase;
                          color: #fff !important;
                          width: 194px;
                          margin: 0 auto 32px;
                          color: #fff;
                          font-size: 13px;
                          font-family: sans-serif;
                          padding: 16px 0;
                          max-height: 49px;
                          display: block;
                          text-align: center;
                          font-weight: 600;
                          text-decoration: none;
                          padding-left: 7px;
                          padding-right: 7px;
                        "
                        href="${process.env.CLIENT_URL}"
                        target="_blank"
                        >Click here</a
                      >
                      <p
                        style="
                          font-size: 17px;
                          color: #666666;
                          font-family: sans-serif;
                          margin: 0;
                        "
                      >
                        In case you face any problems, please contact us!
                      </p>
                      <p
                        style="
                          font-size: 17px;
                          color: #666666;
                          font-family: sans-serif;
                          margin-bottom: 0;
                          height: 70px;
                          line-height: 1.4;
                        "
                      >
                        Regards,<br />
                        Team Tara<br />
                        Team Computers
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div>
                <div class="adm">
                  <div id="q_19" class="ajR h4"><div class="ajT"></div></div>
                </div>
                <div class="h5">
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="750"
                    style="width: 750px; margin: auto"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="center"
                          valign="top"
                          style="
                            padding: 20px;
                            margin: 0;
                            color: #ebe3e3;
                            font-size: 13px;
                            font-family: sans-serif;
                          "
                        >
                          <p>
                            Copyright © 2024 Team Computers Pvt. Ltd. | All
                            rights reserved.
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
`;
};

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
                                    "
                                    valign="middle"
                                  >
                                    <img
                                      height="45"
                                       src="https://www.teamcomputers.com/images/logo.png"
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
                            <div
                              style="
                                line-height: 1;
                                line-height: 1;
                                line-height: 1.8;
                              "
                            >
                              <p>Hi <b>${data.requesterName}</b>,</p>
                              <p><br /></p>
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
                              <p>Teams TARA<br /></p>
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
                                    "
                                    valign="middle"
                                  >
                                    <img height="45" alt="Logo"
                                     src="https://www.teamcomputers.com/images/logo.png"
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
                              <p><br /></p>
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
                              <p>Team TARA<br /></p>
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
            Team TARA
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

export default {
  regularizationRequestMail,
  resetPasswordMail,
  revokeRegularizeMail,
  leaveRequestMail,
  regularizationAcknowledgement,
  leaveAcknowledgement,
  forgotPasswordMail,
};
