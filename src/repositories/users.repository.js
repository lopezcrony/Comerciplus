const User = require('../models/users.model');

const getAllUsers = async () => {
  return await User.findAll();
};

const getOneUser = async (id) => {
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

const updateUserStatus = async (id, status) => {

  const user = await findUserById(id);
  if (user) {
      return await user.update({estadoUsuario : status});
  }
  throw new Error('Usuario no encontrado');
};

const deleteOneUser = async (id) => {
  return await User.destroy({
    where: { idUsuario: id }
  });
};

module.exports = {
  getAllUsers,
  getOneUser,
  createNewUser,
  updateOneUser,
  updateUserStatus,
  deleteOneUser
};
