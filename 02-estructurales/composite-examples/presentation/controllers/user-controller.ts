/**
 * Presentation Layer - Controllers
 * 
 * Controlador que utiliza el caso de uso con Composite Validator
 */

import { CreateUserUseCase } from '../../application/use-cases/create-user.ts';

export class UserController {
    constructor(private createUserUseCase: CreateUserUseCase) { }

    createUser(req: { body: { name: string; email: string; password: string } }) {
        try {
            const result = this.createUserUseCase.execute({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            if (!result.isValid) {
                return {
                    status: 400,
                    body: {
                        success: false,
                        errors: result.errors
                    }
                };
            }

            return {
                status: 201,
                body: {
                    success: true,
                    message: 'Usuario creado exitosamente'
                }
            };
        } catch (_error) {
            return {
                status: 500,
                body: {
                    success: false,
                    message: 'Error interno del servidor'
                }
            };
        }
    }
}

