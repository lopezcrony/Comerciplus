import { ModuleValidationConfig, ValidationPatterns } from './validations.interface';

export const validationPatterns: ValidationPatterns = {
    // Validaciones generales
    onlyNumbers: /^[0-9]+$/, 
    onlyLetters: /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/,

    // validaciones específicas
    cedula: /^[0-9]{5,10}$/,  
    nit: /^[0-9]{9}$/, 
    telefono: /^[0-9]{7,10}$/,
  };
  
  export const validationConfig: ModuleValidationConfig = {

    clients: [
      {
        name: 'cedulaCliente',
        rules: [
          { type: 'required', message: 'La cédula es obligatoria.' },
          { type: 'pattern', value: 'cedula', message: 'Ingrese una cédula válida. (Mínimo 5 digitos)' }

        ]
      },
      {
        name: 'nombreCliente',
        rules: [
          { type: 'required', message: 'El nombre es obligatorio.' },
          { type: 'pattern', value: 'onlyLetters', message: 'Ingrese un nombre válido.' }
        ]
      },
      {
        name: 'apellidoCliente',
        rules: [
          { type: 'required', message: 'El apellido es obligatorio.' },
          { type: 'pattern', value: 'onlyLetters', message: 'Ingrese un apellido válido.' }
        ]
      },
      {
        name: 'direccionCliente',
        rules: [
          { type: 'required', message: 'La dirección es obligatoria.' }
        ]
      },
      {
        name: 'telefonoCliente',
        rules: [
          { type: 'required', message: 'El teléfono es obligatorio.' },
          { type: 'pattern', value: 'telefono', message: 'Ingrese un número válido.  (Mínimo 7 dígitos.)' }
        ]
      }
    ],
    
    providers: [
      {
        name: 'nitProveedor',
        rules: [
          { type: 'required', message: 'El NIT es obligatorio.' },
          { type: 'pattern', value: 'nit', message: 'Ingrese un NIT válido. (Mínimo 9 dígitos)' }
        ]
      },
      {
        name: 'nombreProveedor',
        rules: [
          { type: 'required', message: 'El nombre es obligatorio.' },
          { type: 'pattern', value: 'onlyLetters', message: 'Ingrese un nombre válido.' }
        ]
      },
      {
        name: 'direccionProveedor',
        rules: [
          { type: 'required', message: 'La dirección es obligatoria.' }
        ]
      },
      {
        name: 'telefonoProveedor',
        rules: [
          { type: 'required', message: 'El teléfono es obligatorio.' },
          { type: 'pattern', value: 'telefono', message: 'Ingresa un número válido. (Mínimo 7 dígitos.)' }
        ]
      },
    ],

  };
  