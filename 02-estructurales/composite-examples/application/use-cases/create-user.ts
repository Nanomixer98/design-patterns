/**
 * Application Layer - Use Cases
 * 
 * Caso de uso que utiliza el Composite Validator
 */

import { ValidationResult } from '../../domain/interfaces/validator.ts';
import { UserRegistrationValidator } from '../validators/user-validators.ts';

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}

export class CreateUserUseCase {
    private validator: UserRegistrationValidator;

    constructor() {
        this.validator = new UserRegistrationValidator();
    }

    execute(request: CreateUserRequest): ValidationResult {
        // Validar usando el composite
        const validationResult = this.validator.validate(request);

        if (!validationResult.isValid) {
            return validationResult;
        }

        // Si pasa la validación, crear el usuario
        // En un caso real, aquí iría la lógica de persistencia
        console.log('✅ Usuario válido, procediendo a crear...');
        console.log('Usuario:', { name: request.name, email: request.email });

        return { isValid: true, errors: [] };
    }
}

