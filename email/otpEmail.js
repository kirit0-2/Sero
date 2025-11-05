export const otpEmail = (otp) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5; padding: 50px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="500" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                            <h1 style="color: #393d47; font-size: 25px; margin: 0 0 20px 0;">Login Verification</h1>
                            <p style="color: #393d47; font-size: 14px; line-height: 1.5; margin: 0 0 30px 0;">
                                We received a login request for your account. Use the following OTP to complete your login:
                            </p>
                            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 0 0 30px 0;">
                                <h2 style="color: #7747FF; font-size: 36px; letter-spacing: 8px; margin: 0; font-weight: bold;">
                                    ${otp}
                                </h2>
                            </div>
                            <p style="color: #393d47; font-size: 13px; line-height: 1.5; margin: 0;">
                                <strong>Note:</strong> This OTP will expire in 10 minutes. If you did not request this login, please ignore this email and secure your account.
                            </p>
                            <p style="color: #393d47; font-size: 13px; margin: 20px 0 0 0;">
                                Thank you,<br />
                                <strong>Sero Team</strong>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;

  return html;
};
