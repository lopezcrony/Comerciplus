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
      { type: 'required', message: 'Solo estan permitidos numeros' },
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
      { type: 'pattern', value: 'onlyNumbers', message: 'Ingrese solo numeros' },
      { type: 'min', value: 1, message: 'La cantidad debe ser mayor a 0.' },
      { type: 'min', value: 0, message: 'La cantidad no puede ser negativa.' }
    ]
  },
  {
    name: 'cantidadProducto',
    rules: [
      { type: 'required', message: 'Ingrese la cantidad de productos.' },
      { type: 'pattern', value: 'onlyNumbers', message: 'Ingrese una cantidad valida.' },
      { type: 'min', value: 1, message: 'La cantidad debe ser mayor a 0.' },
      { type: 'min', value: 0, message: 'La cantidad no puede ser negativa.' }
    ]
  },
  {
    name: 'precioCompraUnidad',
    rules: [
      { type: 'required', message: 'Ingrese el precio de compra.' },
      { type: 'pattern', value: 'price', message: 'Ingrese un valor valido.' },
      { type: 'min', value: 0.01, message: 'El precio debe ser mayor que 0.' }, // No permite 0
      { type: 'min', value: 0, message: 'El precio no puede ser negativo.' }
    ]
  },
];
