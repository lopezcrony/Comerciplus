import { AbstractControl } from "@angular/forms";

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (control: AbstractControl) => { [key: string]: any } | null;
}

export interface FieldValidation {
  name: string;
  rules: ValidationRule[];
}

export interface ModuleValidationConfig {
  [key: string]: FieldValidation[];
}

export interface ValidationPatterns {
  [key: string]: RegExp;
}