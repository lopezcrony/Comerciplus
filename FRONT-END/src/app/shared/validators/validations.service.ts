// src/app/validations/validation.service.ts

import { Injectable } from '@angular/core';
import { ValidatorFn, Validators, AbstractControl } from '@angular/forms';
import { validationsConfig } from './validations.config';
import { validationPatterns } from './validation.patterns';
import {
  ModuleValidationConfig,
  ValidationPatterns,
  ValidationRule,
  FieldValidation,
} from './validations.interface';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private validationConfig: ModuleValidationConfig = validationsConfig;
  private patterns: ValidationPatterns = validationPatterns;

  constructor() { }


  // funcion para validar fechas
    dateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const isValidDate = !isNaN(Date.parse(value));
      return isValidDate ? null : { invalidDate: { value: control.value } };
    };
  }
  // fin funcion para validar fechas

  getValidatorsForField(module: string, fieldName: string): ValidatorFn[] {
    const fieldConfig = this.getFieldConfig(module, fieldName);
    if (!fieldConfig) return [];

    return fieldConfig.rules.map((rule) => this.createValidator(rule));
  }

  getErrorMessage(module: string, fieldName: string, errorKey: string): string {
    const fieldConfig = this.getFieldConfig(module, fieldName);
    if (!fieldConfig) return '';

    const rule = fieldConfig.rules.find(
      (r) => r.type === errorKey || (r.type === 'pattern' && errorKey === 'pattern')
    );

    return rule ? rule.message : '';
  }

  private getFieldConfig(module: string, fieldName: string): FieldValidation | undefined {
    return this.validationConfig[module]?.find((field) => field.name === fieldName);
  }

  private createValidator(rule: ValidationRule): ValidatorFn {
    switch (rule.type) {
      case 'required':
        return Validators.required;
      case 'minLength':
        return Validators.minLength(rule.value);
      case 'maxLength':
        return Validators.maxLength(rule.value);
      case 'pattern':
        const pattern = this.patterns[rule.value] || rule.value;
        return Validators.pattern(pattern);
      case 'min':
        return Validators.min(rule.value);
      case 'custom':
        return rule.validator || (() => null);
      default:
        return () => null;
    }
  }
}
