import jwt from "jsonwebtoken";
import db from "../models/index.js";

const { User, OtpCode } = db;

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const requestOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone is required" });
  }

  const code = Math.floor(1000 + Math.random() * 9000).toString();

  await OtpCode.create({
    phone,
    code,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  console.log("OTP for", phone, ":", code);

  res.json({ success: true });
};

export const verifyOtp = async (req, res) => {
  const { phone, code } = req.body;

  const record = await OtpCode.findOne({
    where: { phone },
    order: [["createdAt", "DESC"]],
  });

  if (!record || record.code !== code || record.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  let user = await User.findOne({ where: { phone } });

  if (!user) {
    user = await User.create({ phone });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, user });
};
