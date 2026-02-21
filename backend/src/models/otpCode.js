import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const OtpCode = sequelize.define(
  "OtpCode",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    phone: DataTypes.STRING,
    code: DataTypes.STRING,
    expiresAt: DataTypes.DATE,
  },
  {
    tableName: "otp_codes",
    timestamps: true,
  },
);

export default OtpCode;
