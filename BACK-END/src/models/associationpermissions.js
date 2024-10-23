const Roles = require('./roles.model');
const Permissions = require('./permissions.model');
const PermissionRole = require('./permissionsRoles.model')

Roles.belongsToMany(Permissions, {
  through: PermissionRole,
  foreignKey: 'idRol',
  otherKey: 'idPermiso'
});

Permissions.belongsToMany(Roles, {
  through: PermissionRole,
  foreignKey: 'idPermiso',
  otherKey: 'idRol'
});

module.exports = {
  Roles,
  Permissions
};