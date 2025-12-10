import crypto from "crypto";

export const verifyPayOsCheckSum = (data, checkSumKey, receivedCheck) => {
  const jsonString = JSON.stringify(data);
  const hash = crypto
    .createHmac("sha256", checkSumKey)
    .update(jsonString)
    .digest("hex");

  return hash === receivedCheck;
};
