import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const BankTransaction = sequelize.define(
  "BankTransaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    transfer_request_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
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

    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "COMPLETED",
    },

    reference: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    sender_balance_after: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },

    receiver_balance_after: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "bank_transactions",
    timestamps: false,
  }
);

export default BankTransaction;