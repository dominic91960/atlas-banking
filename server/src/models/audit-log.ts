import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const AuditLog = sequelize.define(
  "AuditLog",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },

    user_agent: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    resource: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    details: {
      type: DataTypes.JSONB,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "audit_logs",
    timestamps: false,
  }
);

export default AuditLog;
