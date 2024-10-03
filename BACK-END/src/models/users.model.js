const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idRol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "idRol",
      },
    },
    cedulaUsuario: {
      type: DataTypes.STRING,
      unique: {
        name: "unique_cedulaUsuario", // Nombre del índice existente
        msg: "La cedula del usuario debe ser única.",
      },
      allowNull: false,
    },
    nombreUsuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellidoUsuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefonoUsuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correoUsuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    claveUsuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estadoUsuario: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        if (user.claveUsuario) {
          console.log(
            "Encriptando contraseña antes de crear:",
            user.claveUsuario
          );
          user.claveUsuario = await bcrypt.hash(user.claveUsuario, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("claveUsuario") && !user.claveUsuario.startsWith('$2b$')) {
          user.claveUsuario = await bcrypt.hash(user.claveUsuario, 10);
        }
      },
    },
  }
);

User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.claveUsuario);
};

User.associate = (models) => {
  User.belongsTo(models.Role, { foreignKey: "idRol" });
};

module.exports = User;
