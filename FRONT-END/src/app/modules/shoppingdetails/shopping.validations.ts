import { FieldValidation } from '../../shared/validators/validations.interface';

export const shoppingValidation: FieldValidation[] = [
 
  {
    name: 'idProveedor',
    rules: [
      { type: 'required', message: 'Ingrese el id del proveedor.' }
    ]
  },
  {
    name: 'fechaCompra',
    rules: [
      { type: 'required', message: 'Ingrese la fecha de compra.' },
    ]
  },
  {
    name: 'numeroFactura',
    rules: [
      { type: 'required', message: 'Ingrese el numero de factura.' },
      { type: 'pattern', value: 'onlyNumbers', message: 'Ingrese solo numeros' }

    ]
  },
  {
    name: 'idProducto',
    rules: [
      { type: 'required', message: 'Ingrese el proveedor' },
    ]
  },
  {
    name: 'codigoBarra',
    rules: [
      { type: 'required', message: 'Ingrese el codigo de barra' },
      { type: 'pattern', value: 'onlyNumbers', message: 'Ingrese solo numeros' }

    ]
  },
  {
    name: 'cantidadProducto',
    rules: [
      { type: 'required', message: 'Ingrese la cantidad de productos.' },
      { type: 'pattern', value: 'onlyNumbers', message: 'Ingrese una cantidad valida.' }
    ]
  },
  {
    name: 'precioCompraUnidad',
    rules: [
      { type: 'required', message: 'Ingrese el precio de compra.' },
      { type: 'pattern', value: 'price', message: 'Ingrese un valor valido.' }
    ]
  },
];
