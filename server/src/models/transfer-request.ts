import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const TransferRequest = sequelize.define(
  "TransferRequest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    sender_account_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    receiver_account_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },

    otp_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM("PENDING", "COMPLETED", "EXPIRED", "CANCELLED"),
      allowNull: false,
      defaultValue: "PENDING",
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "transfer_requests",
    timestamps: false,
  },
);

export default TransferRequest;
