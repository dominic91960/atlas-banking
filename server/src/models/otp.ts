import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const OTP = sequelize.define(
  "OTP",
  {
    account_number: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },

    // Stores a bcrypt hash, not the actual six-digit OTP
    otp_code: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "otp_verifications",
    timestamps: false,
  }
);

export default OTP;