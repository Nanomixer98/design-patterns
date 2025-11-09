/**
 * Domain Layer - Interfaces
 * Define el contrato para los validadores
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface Validator {
  validate(data: any): ValidationResult;
}

