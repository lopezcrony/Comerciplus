const User = require('../models/users.model');

// const getAllUsers = async () => {
//   return await User.findAll();
// };

// const getOneUser = async (id) => {
//   return await User.findByPk(id);
// };

const getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['claveUsuario'] }
  });
};


const getOneUser = async (id) => {
  return await User.findByPk(id, {
    attributes: { exclude: ['claveUsuario'] }
  });
};

const createNewUser = async (user) => {
  return await User.create(user);
};

const updateOneUser = async (id, userData) => {
  // Encuentra el usuario por ID
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Actualiza los campos del usuario
  Object.assign(user, userData);

  // Guarda el usuario actualizado
  await user.save();

  return user;
};

const updateUserStatus = async (id, status) => {

  const user = await getOneUser(id);
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
