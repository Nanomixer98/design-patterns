/**
 * Application Layer - Validators
 * 
 * Validadores individuales (Leaf) y compuestos (Composite)
 * para validación de usuarios
 */

import { Validator, ValidationResult } from '../../domain/interfaces/validator.ts';
import { CompositeValidator } from './composite-validator.ts';

// Leaf: Validación individual de email
export class EmailValidator implements Validator {
  validate(data: { email?: string }): ValidationResult {
    if (!data.email) {
      return { isValid: false, errors: ['Email es requerido'] };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { isValid: false, errors: ['Email inválido'] };
    }
    return { isValid: true, errors: [] };
  }
}

// Leaf: Validación individual de contraseña
export class PasswordValidator implements Validator {
  validate(data: { password?: string }): ValidationResult {
    if (!data.password) {
      return { isValid: false, errors: ['Contraseña es requerida'] };
    }
    if (data.password.length < 8) {
      return { isValid: false, errors: ['Contraseña debe tener al menos 8 caracteres'] };
    }
    return { isValid: true, errors: [] };
  }
}

// Leaf: Validación individual de nombre
export class NameValidator implements Validator {
  validate(data: { name?: string }): ValidationResult {
    if (!data.name || data.name.trim().length === 0) {
      return { isValid: false, errors: ['Nombre es requerido'] };
    }
    if (data.name.length < 3) {
      return { isValid: false, errors: ['Nombre debe tener al menos 3 caracteres'] };
    }
    return { isValid: true, errors: [] };
  }
}

// Composite: Validación de datos personales (nombre + email)
export class PersonalDataValidator extends CompositeValidator {
  constructor() {
    super();
    this.add([
      new NameValidator(),
      new EmailValidator()
    ]);
  }
}

// Composite: Validación completa de usuario (datos personales + contraseña)
export class UserRegistrationValidator extends CompositeValidator {
  constructor() {
    super();
    this.add([
      new PersonalDataValidator(), // Composite anidado
      new PasswordValidator()
    ]);
  }
}

