const rolService = require('../services/Roles.service');

const getAllRoles = async (req, res) => {
  try {
    const roles = await rolService.getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOneRole = async (req, res) => {
  try {
    const role = await rolService.getOneRole(req.params.id);
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNewRole = async (req, res) => {
  const { nombreRol, estadoRol, permissions } = req.body;
  try {
    const newRole = await rolService.createNewRole({ nombreRol, estadoRol }, permissions);
    res.status(201).json({
      message: "Rol creado exitosamente.",
      newRole
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const updatedRole = await rolService.updateRole(req.params.id, req.body);
    res.status(200).json({ message: 'Rol actualizado exitosamente', updatedRole });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRoleStatus = async (req, res) => {
  try {
    let { estadoRol } = req.body;
    if (estadoRol === '0' || estadoRol === 0) {
      estadoRol = false;
    } else if (estadoRol === '1' || estadoRol === 1) {
      estadoRol = true;
    } else if (estadoRol !== true && estadoRol !== false) {
      return res.status(400).json({ message: 'El estado debe ser un valor booleano' });
    }

    await rolService.updateRoleStatus(req.params.id, estadoRol);
    res.json({ message: 'Estado actualizado con éxito.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOneRole = async (req, res) => {
  try {
    await rolService.deleteOneRole(req.params.id);
    res.json({ message: 'Rol eliminado con éxito.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllRoles,
  getOneRole,
  createNewRole,
  updateRole,
  updateRoleStatus,
  deleteOneRole
};