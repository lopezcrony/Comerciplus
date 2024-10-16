const Permission = require('../models/permissions.model');

const getAllPermissions = async () => {
  return await Permission.findAll();
};

module.exports = {
  getAllPermissions,
};
