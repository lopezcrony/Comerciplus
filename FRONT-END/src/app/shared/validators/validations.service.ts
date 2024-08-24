import { Injectable } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { ModuleValidationConfig, ValidationPatterns, ValidationRule } from './validations.interface';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private validationConfig: ModuleValidationConfig = {};
  private patterns: ValidationPatterns = {};

  setConfig(config: ModuleValidationConfig) {
    this.validationConfig = config;
  }

  setPatterns(patterns: ValidationPatterns) {
    this.patterns = patterns;
  }

  getValidatorsForField(module: string, fieldName: string): ValidatorFn[] {
    const fieldConfig = this.validationConfig[module]?.find(field => field.name === fieldName);
    if (!fieldConfig) return [];

    return fieldConfig.rules.map(rule => this.createValidator(rule));
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
        return Validators.pattern(this.patterns[rule.value] || rule.value);
      case 'custom':
        return rule.validator || (() => null);
      default:
        return () => null;
    }
  }

  getErrorMessage(module: string, fieldName: string, errorKey: string): string {
    const fieldConfig = this.validationConfig[module]?.find(field => field.name === fieldName);
    if (!fieldConfig) return '';

    const rule = fieldConfig.rules.find(r => r.type === errorKey || (r.type === 'pattern' && errorKey === 'pattern'));
    return rule ? rule.message : '';
  }
}