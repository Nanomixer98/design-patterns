/**
 * Application Layer - Validators
 * 
 * Composite Validator - Implementa el patrón Composite
 * Permite tratar validaciones individuales y grupos de validaciones
 * de manera uniforme
 */

import { Validator, ValidationResult } from '../../domain/interfaces/validator.ts';

export class CompositeValidator implements Validator {
  private validators: Validator[] = [];

  add(validator: Validator | Validator[]): void {
    if (Array.isArray(validator)) {
      this.validators.push(...validator);
    } else {
      this.validators.push(validator);
    }
  }

  validate(data: any): ValidationResult {
    const allErrors: string[] = [];
    let isValid = true;

    for (const validator of this.validators) {
      const result = validator.validate(data);
      if (!result.isValid) {
        isValid = false;
        allErrors.push(...result.errors);
      }
    }

    return {
      isValid,
      errors: allErrors
    };
  }
}

