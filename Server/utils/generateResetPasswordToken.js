import crypto from "crypto";

export const generateResetPasswordToken = () => {
  //generate a random Byte and in string form
  const resetToken = crypto.randomBytes(20).toString("hex");
  //hash the random byter
  const hashedToken = crypto
    .createHash("sha256") //hashing technique
    .update(resetToken)
    .digest("hex");

  const resetPasswordExpireTime = Date.now() + 15 * 60 * 1000; // 15 minutes ..millisecond

  return { hashedToken, resetPasswordExpireTime, resetToken };
};
/**
  Crypto is used to generate a secure, random reset token and
  store its hashed version to prevent misuse even if the database is compromised. */