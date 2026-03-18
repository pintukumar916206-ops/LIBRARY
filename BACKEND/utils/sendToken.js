// export const sendToken = (user, statusCode, res) => {
//   const token = user.generateToken();
//   res
//     .status(statusCode)
//     .cookie("token", token, {
//       expires: new Date(
//         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//       ),
//       httpOnly: true,
//     })
//     .json({
//       success: true,
//       user,
//       message,
//       token,
//     });
// };

export const sendToken = (user, statusCode, message, res) => {
  console.log("SMTP PASSWORD =", JSON.stringify(process.env.SMTP_PASSWORD));

  const token = user.generateToken();
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true, // Always true for production HTTPS
    sameSite: "None", // Required for cross-site cookies
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      user,
      token,
    });
};
