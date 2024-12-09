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
      { type: 'required', message: 'Ingrese el nombre del producto.' },
      {
        type: 'pattern',
        value: /^[A-Za-z]{3,}([ -][A-Za-z0-9()]+)*$/, 
        message: 'El nombre debe comenzar con al menos 3 letras y puede incluir números, paréntesis, guiones y espacios.'
      },
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
