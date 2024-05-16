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

export default {
  regularizationRequestMail
}