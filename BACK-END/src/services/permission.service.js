const PermissionRepository = require('../repositories/permissions.repository');

const getAllPermissions = async () => {
  try {
    return await PermissionRepository.findAllPermissions();
  } catch (error) {
    throw error;
  }
};

const getPermissionsByRole = async (id) => {
  try {
    return await PermissionRepository.findPermissionById(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllPermissions,
  getPermissionsByRole
};
