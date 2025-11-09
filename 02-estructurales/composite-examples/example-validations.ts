/**
 * Ejemplo de uso del Composite Pattern con Validaciones
 * 
 * Este archivo demuestra cómo usar el sistema de validaciones compuestas
 */

import { CreateUserUseCase } from './application/use-cases/create-user.ts';
import {
    EmailValidator,
    PersonalDataValidator,
    UserRegistrationValidator
} from './application/validators/user-validators.ts';
import { UserController } from './presentation/controllers/user-controller.ts';

function main() {
    console.log('=== Ejemplo 1: Validación exitosa ===\n');

    const useCase = new CreateUserUseCase();
    const controller = new UserController(useCase);

    // Caso exitoso
    const validRequest = {
        body: {
            name: 'Juan Pérez',
            email: 'juan@example.com',
            password: 'password123'
        }
    };

    const result1 = controller.createUser(validRequest);
    console.log('Resultado:', result1);
    console.log('\n');

    console.log('=== Ejemplo 2: Validación con errores ===\n');

    // Caso con errores
    const invalidRequest = {
        body: {
            name: 'Jo', // Muy corto
            email: 'email-invalido', // Email inválido
            password: '123' // Muy corta
        }
    };

    const result2 = controller.createUser(invalidRequest);
    console.log('Resultado:', result2);
    console.log('\n');

    console.log('=== Ejemplo 3: Uso directo de validadores ===\n');

    // Uso directo de los validadores
    const emailValidator = new EmailValidator();

    console.log('Validación individual de email:');
    console.log(emailValidator.validate({ email: 'test@example.com' }));
    console.log(emailValidator.validate({ email: 'email-invalido' }));
    console.log('\n');

    console.log('Validación compuesta de datos personales:');
    const personalDataValidator = new PersonalDataValidator();
    console.log(personalDataValidator.validate({
        name: 'Juan',
        email: 'juan@example.com'
    }));
    console.log(personalDataValidator.validate({
        name: 'Jo',
        email: 'email-invalido'
    }));
    console.log('\n');

    console.log('Validación completa de registro:');
    const registrationValidator = new UserRegistrationValidator();
    console.log(registrationValidator.validate({
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123'
    }));
}

main();

