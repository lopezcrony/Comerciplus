const Roles = require('./roles.model');
const Permissions = require('./permissions.model');

Roles.belongsToMany(Permissions, {
  through: 'PermissionRole',
  foreignKey: 'idRol',
  otherKey: 'idPermiso'
});

Permissions.belongsToMany(Roles, {
  through: 'PermissionRole',
  foreignKey: 'idPermiso',
  otherKey: 'idRol'
});

module.exports = {
  Roles,
  Permissions
};