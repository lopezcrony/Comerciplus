const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Roles = sequelize.define('Roles', {
  idRol: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  nombreRol: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  }
}, {
  tableName: 'roles',
  timestamps: false
});

Roles.associate = (models) => {
  Roles.hasMany(models.User, { foreignKey: 'idRol' });
  Roles.hasMany(models.PermissionRole, { foreignKey: 'idRol' });
};

module.exports = Roles;
