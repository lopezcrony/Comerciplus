import { FieldValidation } from "../../shared/validators/validations.interface";

export const creditsValidationConfig: FieldValidation[] = [
  
  {
    name: 'montoAbonado',
    rules: [
      { type: 'required', message: 'El nombre es obligatorio.' },
      { type: 'pattern', value: 'price', message: 'Ingrese un valor válido.' },
    ],
  },
  
];
