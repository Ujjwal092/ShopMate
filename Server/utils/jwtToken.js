export const sendToken = (user, statusCode, message, res) => {
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",   // ⭐ REQUIRED
      secure: false,     // ⭐ REQUIRED for http (localhost)
      expires: new Date(
        Date.now() +
          process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
    })
    .json({
      success: true,
      user,
      message,
      token, // (optional — frontend doesn’t need this if using cookies)
    });
};
