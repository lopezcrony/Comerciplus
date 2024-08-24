import { ModuleValidationConfig, ValidationPatterns } from './validations.interface';

export const validationPatterns: ValidationPatterns = {
    // Validaciones generales
    onlyNumbers: /^[0-9]+$/, 
    onlyLetters: /^[A-Za-zÀ-ÿñÑ\s]+$/,

    // validaciones especificas
    cedula: /^[0-9]{5,10}$/,  
    telefono: /^[0-9]{7,10}$/,
  };
  
  export const validationConfig: ModuleValidationConfig = {

    clients: [
      {
        name: 'cedulaCliente',
        rules: [
          { type: 'required', message: 'La cédula es obligatoria.' },
          { type: 'pattern', value: 'cedula', message: 'Ingresa una cédula válida.' }
        ]
      },
      {
        name: 'nombreCliente',
        rules: [
          { type: 'required', message: 'El nombre es obligatorio.' },
          { type: 'pattern', value: 'onlyLetters', message: 'Ingresa un nombre válido.' }
        ]
      },
      {
        name: 'apellidoCliente',
        rules: [
          { type: 'required', message: 'El apellido es obligatorio.' },
          { type: 'pattern', value: 'onlyLetters', message: 'Ingresa un apellido válido.' }
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
          { type: 'pattern', value: 'telefono', message: 'Ingresa un número de teléfono válido.' }
        ]
      }
    ],
    
    providers: [
      {
        name: 'nitProveedor',
        rules: [
          { type: 'required', message: 'El NIT es obligatorio.' },
          { type: 'pattern', value: 'onlyNumbers', message: 'Por favor ingresa un NIT válido.' }
        ]
      },
      {
        name: 'nombreProveedor',
        rules: [
          { type: 'required', message: 'El nombre es obligatorio.' },
          { type: 'pattern', value: 'onlyLetters', message: 'Por favor ingresa un nombre válido.' }
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
          { type: 'pattern', value: 'telefono', message: 'Ingresa un número de teléfono válido.' }
        ]
      },
    ],

  };
  