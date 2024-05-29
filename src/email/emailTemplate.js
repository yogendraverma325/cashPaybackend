const regularizationRequestMail = async (data) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Regularization Request</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f7f8f9;
            color: #000000;
          }
    
          .title {
            text-align: center;
            margin-top: 20px;
            font-size: 22px;
            font-weight: 400;
          }
    
          .text {
            text-align: center;
            font-size: 14px;
            line-height: 1.4;
            margin: 20px 0;
          }
    
          .button-container {
            text-align: center;
            margin-bottom: 20px;
          }
    
          .button {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 4px;
            text-decoration: none;
          }
    
          .green {
            background-color: #187c06;
            color: #ffffff;
          }
    
          .red {
            background-color: #b5103e;
            color: #ffffff;
          }
        </style>
      </head>
    
      <body>
        <h1 class="title">Regularization Request</h1>
        <p class="text"><b>${data.requesterName}</b> Requested for Attendance Regularization of <b>${data.attendenceDate}</b></p>
        <div class="button-container">
          <a href="#" class="button green">Approve</a>
          <a href="#" class="button red">Reject</a>
        </div>
      </body>
    </html>`
}

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
</html>`
}

const revokeRegularizeMail = async (data) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <div style="margin: 0 auto; background: #f2f5f7">
          <table
            style="
              margin: auto;
              background: linear-gradient(#51e1ed, #383cc1) top center no-repeat;
              padding: 35px 0 20px;
              width: 750px;
            "
            cellpadding="0"
            cellspacing="0"
            border="0"
          >
            <tbody>
              <tr>
                <td align="center" valign="middle" style="margin: 0; padding: 0">
                  <table width="750" border="0" cellpadding="0" cellspacing="0" style="width: 750px; margin: auto">
                    <tbody>
                      <tr>
                        <td align="left" valign="middle" style="padding: 0 30px 24px; margin: 0">
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
        
                        <td align="right" valign="middle" style="padding: 0 30px 24px; margin: 0">
                          <a
                            href="https://intranet.teamcomputers.com/markme/"
                            target="_blank"
                            data-saferedirecturl="https://www.google.com/url?q=https://intranet.teamcomputers.com/markme/#/&amp;source=gmail&amp;ust=1661580113733000&amp;usg=AOvVaw0okwhUzXsLVdn4Co7nYCZk"
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
                        <td align="left" valign="top" style="padding: 50px 54px 0; margin: 0" colspan="2">
                        <p style="font-size: 17px; color: #666666; font-family: sans-serif; margin: 0">
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
                            ${data.name} has Revoked their Attendance Regularization request for ${data.attendanceDate}.
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
                        <td align="left" valign="top" style="padding: 10px 54px 0; margin: 0" colspan="2">
                          <a
                            style="
                              border-color: #0bacbc !important;
                              background: linear-gradient(#51e1ed, #383cc1) !important;
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
                            href="https://intranet.teamcomputers.com/markme/#/"
                            target="_blank"
                            data-saferedirecturl="https://www.google.com/url?q=https://intranet.teamcomputers.com/markme/#/&amp;source=gmail&amp;ust=1661580113733000&amp;usg=AOvVaw1Qlq_4rkMZfsudpGmVVjqf"
                            >Click here</a
                          >
                          <p style="font-size: 17px; color: #666666; font-family: sans-serif; margin: 0">
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
                            Team HRM<br />
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
                      <table border="0" cellpadding="0" cellspacing="0" width="750" style="width: 750px; margin: auto">
                        <tbody>
                          <tr>
                            <td
                              align="center"
                              valign="top"
                              style="padding: 20px; margin: 0; color: #ebe3e3; font-size: 13px; font-family: sans-serif"
                            >
                              <p>Copyright © 2024 Team Computers Pvt. Ltd. | All rights reserved.</p>
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
  </html>`
}

export default {
  regularizationRequestMail,
  resetPasswordMail,
  revokeRegularizeMail
}