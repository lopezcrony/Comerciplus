// ------------------ ACCESO ------------------
const roles = require('./roles.model');
const users = require('./users.model');
const permissions = require('./permissions.model');
const permissionsRoles = require('./permissionsRoles.model');
// ------------------ PRODUCTOS ------------------
const categories = require('./categories.model');
const products = require('./products.model');
const barcode = require('./barcodes.model');
// ------------------ COMPRAS ------------------
const provider = require('./providers.model');
const shopping = require('./shopping.model');
const shoppingdetails = require('./shoppingdetails.model');
// ------------------ CRÉDITOS ------------------
const client = require('./clients.model');
const credit = require('./credits.model');
const creditDetail = require('./creditDetail.model');
const installment = require('./installments.model');
// ------------------ VENTAS ------------------
const sales = require('./sales.model')
const detailSale = require('./detailSale.model');
// ------------------ DEVOLUCIONES ------------------
const returnLoss = require('./returnLoss.model');
const returnSale = require('./returnSales.model');
const returnProvider = require('./returnProvider.model');

// Asociaciones
roles.belongsToMany(permissions, {
  through: permissionsRoles,
  foreignKey: 'idRol',
  otherKey: 'idPermiso'
});

permissions.belongsToMany(roles, {
  through: permissionsRoles,
  foreignKey: 'idPermiso',
  otherKey: 'idRol'
});

permissionsRoles.belongsTo(roles, { foreignKey: 'idRol' });
permissionsRoles.belongsTo(permissions, { foreignKey: 'idPermiso' });

const models = {
  roles,
  users,
  permissions,
  permissionsRoles,
  categories,
  products,
  barcode,
  provider,
  shopping,
  shoppingdetails,
  client,
  credit,
  creditDetail,
  installment,
  sales,
  detailSale,
  returnLoss,
  returnSale,
  returnProvider,
};

module.exports = models;