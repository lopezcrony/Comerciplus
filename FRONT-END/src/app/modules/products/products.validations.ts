import { FieldValidation } from '../../shared/validators/validations.interface';

export const productsValidationConfig: FieldValidation[] = [
  {
    name: 'idProducto',
    rules: [
      { type: 'required', message: 'El ID del producto es obligatorio.' }
    ]
  },
  {
    name: 'idCategoria',
    rules: [
      { type: 'required', message: 'Ingrese la categoría' }
    ]
  },
  {
    name: 'imagenProducto',
    rules: [

    ]
  },
  {
    name: 'nombreProducto',
    rules: [
      { type: 'required', message: 'Ingrese el nombre del producto.' }
    ]
  },
  {
    name: 'stock',
    rules: [

    ]
  },
  {
    name: 'precioVenta',
    rules: [
      { type: 'required', message: 'Ingrese el precio de venta.' },
      { type: 'pattern', value: 'price', message: 'Ingrese un precio válido.' }
    ]
  },
];
