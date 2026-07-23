import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const CustomerAccount = sequelize.define(
  "CustomerAccount",
  {
    account_number: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    nic: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    account_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
  },
  {
    tableName: "customer_accounts",
    timestamps: false,
  },
);

export default CustomerAccount;
