import { FieldValidation } from "../../shared/validators/validations.interface";

export const providersValidationConfig: FieldValidation[] = [
  {
    name: 'nitProveedor',
    rules: [
      { type: 'required', message: 'El NIT es obligatorio.' },
      { type: 'pattern', value: 'nit', message: 'Ingrese un NIT válido. (9 dígitos)' },
    ],
  },
  {
    name: 'nombreProveedor',
    rules: [
      { type: 'required', message: 'El nombre es obligatorio.' },
      { type: 'pattern', value: 'onlyLetters', message: 'Ingrese un nombre válido.' },
    ],
  },
  {
    name: 'direccionProveedor',
    rules: [{ type: 'required', message: 'La dirección es obligatoria.' }],
  },
  {
    name: 'telefonoProveedor',
    rules: [
      { type: 'required', message: 'El teléfono es obligatorio.' },
      { type: 'pattern', value: 'telefono', message: 'Ingrese un número de teléfono válido. (7-10 dígitos)' },
    ],
  },
  {
    name: 'emailProveedor',
    rules: [
      { type: 'required', message: 'El correo electrónico es obligatorio.' },
      { type: 'pattern', value: 'email', message: 'Ingrese un correo electrónico válido.' },
    ],
  },
];
