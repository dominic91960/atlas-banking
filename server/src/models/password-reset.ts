import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const PasswordReset = sequelize.define(
  "PasswordReset",
  {
    account_number: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },

    /*
     * Store only a SHA-256 hash of the reset token.
     * The actual token is sent to the customer's email.
     */
    token_hash: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },

    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "password_resets",
    timestamps: false,
  }
);

export default PasswordReset;