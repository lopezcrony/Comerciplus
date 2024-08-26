import { FieldValidation } from '../../shared/validators/validations.interface';

export const lossValidationConfig: FieldValidation[] = [
  {
    name: 'idCodigoBarra',
    rules: [
      { type: 'required', message: 'El código de barras es obligatorio.' },
      { type: 'pattern', value: 'onlyNumbers', message: 'El código de barras solo debe contener números.' },
    ],
  },
  {
    name: 'cantidad',
    rules: [
      { type: 'required', message: 'Ingrese la cantidad.' },
      { type: 'pattern', value: 'onlyNumbers', message: 'La cantidad solo debe contener números.' },
      { type: 'min', value: 1 , message: 'Debe ser mayor a 0.' },
    ],
  },
  {
    name: 'fechaDeBaja',
    rules: [
      { type: 'required', message: 'La fecha es obligatoria.' },
      // { type: 'pattern', value: '', message: '' },
    ],
  },
  {
    name: 'motivo',
    rules: [
      { type: 'required', message: 'Ingrese el motivo de la pérdida.' },
      { type: 'pattern', value: 'onlyLetters', message: 'El motivo solo debe contener letras.' },
    ],
  },
 
];