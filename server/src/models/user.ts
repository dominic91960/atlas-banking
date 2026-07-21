import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    account_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'users',
    timestamps: false,
  }
);

export default User;