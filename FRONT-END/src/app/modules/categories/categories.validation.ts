import { FieldValidation } from '../../shared/validators/validations.interface';

export const categoriesValidationConfig: FieldValidation[] = [
  {
    name: 'nombreCategoria',
    rules: [
      { type: 'required', message: 'El nombre de la categoria es obligatorio.' },
      { type: 'pattern', value: 'onlyLetters', message: 'El nombre solo debe contener letras.' },
    ],
  },
  {
    name: 'descripcionCategoria',
    rules: [
      { type: 'pattern', value: 'onlyLetters', message: 'La descripción solo debe contener letras.' },
    ],
  },
 
];
