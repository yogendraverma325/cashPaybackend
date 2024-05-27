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

export default {
  regularizationRequestMail,
  resetPasswordMail
}