const User = require('../models/users.model');

const getAllUsers = async () => {
  return await User.findAll();
};

const getOneUsers = async (id) => {
  return await User.findByPk(id);
};

const createNewUser = async (user) => {
  return await User.create(user);
};

const updateOneUser = async (id, user) => {
  return await User.update(user, {
    where: { idUsuario: id }
  });
};

const deleteOneUser = async (id) => {
  return await User.destroy({
    where: { idUsuario: id }
  });
};

module.exports = {
  getAllUsers,
  getOneUsers,
  createNewUser,
  updateOneUser,
  deleteOneUser,
};
