/**
 * ! Ejemplo Real: Chain of Responsibility en Proyecto CRUD
 * 
 * Sistema de procesamiento de requests HTTP para operaciones CRUD
 * que pasa la solicitud por una cadena de middlewares:
 * 1. Validación de datos
 * 2. Verificación de permisos
 * 3. Sanitización de datos
 * 4. Logging/Auditoría
 * 5. Procesamiento final (CRUD)
 */

import { COLORS } from "../helpers/colors.ts";

// Tipos para el request
interface RequestBody {
    id?: string;
    name?: string;
    email?: string;
    [key: string]: string | number | boolean | undefined;
}

interface UserRequest {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    body?: RequestBody;
    user?: {
        id: string;
        role: 'admin' | 'user' | 'guest';
    };
}

interface User {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

interface CRUDResult {
    message: string;
    data?: User | User[];
}

type CRUDResponse = User | User[] | CRUDResult;

interface RequestContext {
    request: UserRequest;
    validated?: boolean;
    authorized?: boolean;
    sanitized?: boolean;
    logged?: boolean;
    result?: CRUDResponse;
    errors: string[];
}

// Interfaz del Handler
interface RequestHandler {
    setNext(handler: RequestHandler): RequestHandler;
    handle(context: RequestContext): void;
}

// Clase base abstracta
abstract class BaseRequestHandler implements RequestHandler {
    private nextHandler?: RequestHandler;

    setNext(handler: RequestHandler): RequestHandler {
        this.nextHandler = handler;
        return handler;
    }

    handle(context: RequestContext): void {
        // Procesar el request en este handler
        this.process(context);

        // Si hay errores, detener la cadena
        if (context.errors.length > 0) {
            console.log('%c ⛔ Cadena detenida por errores', COLORS.red);
            return;
        }

        // Continuar con el siguiente handler
        if (this.nextHandler) {
            this.nextHandler.handle(context);
        }
    }

    protected abstract process(context: RequestContext): void;
}

// 1. Handler de Validación
class ValidationHandler extends BaseRequestHandler {
    protected process(context: RequestContext): void {
        const { request } = context;

        console.log('%c [1] Validando datos del request...', COLORS.cyan);

        // Validar método HTTP
        if (!['GET', 'POST', 'PUT', 'DELETE'].includes(request.method)) {
            context.errors.push('Método HTTP no válido');
            return;
        }

        // Validar path
        if (!request.path || request.path.trim() === '') {
            context.errors.push('Path es requerido');
            return;
        }

        // Validar body para POST y PUT
        if ((request.method === 'POST' || request.method === 'PUT') && !request.body) {
            context.errors.push('Body es requerido para POST y PUT');
            return;
        }

        // Validar campos requeridos en el body
        if (request.body) {
            if (request.method === 'POST' && !request.body.name) {
                context.errors.push('Campo "name" es requerido');
                return;
            }
            if (request.method === 'PUT' && !request.body.id) {
                context.errors.push('Campo "id" es requerido para actualizar');
                return;
            }
        }

        context.validated = true;
        console.log('%c ✓ Validación exitosa', COLORS.green);
    }
}

// 2. Handler de Autorización
class AuthorizationHandler extends BaseRequestHandler {
    protected process(context: RequestContext): void {
        const { request } = context;

        console.log('%c [2] Verificando permisos...', COLORS.cyan);

        // Verificar que el usuario esté autenticado
        if (!request.user) {
            context.errors.push('Usuario no autenticado');
            return;
        }

        // Reglas de autorización
        const { user, method } = request;

        // Los guests solo pueden leer (GET)
        if (user.role === 'guest' && method !== 'GET') {
            context.errors.push('Los usuarios guest solo pueden leer datos');
            return;
        }

        // Los usuarios regulares no pueden eliminar
        if (user.role === 'user' && method === 'DELETE') {
            context.errors.push('Los usuarios regulares no pueden eliminar recursos');
            return;
        }

        // Solo admins pueden acceder a rutas administrativas
        if (request.path.startsWith('/admin') && user.role !== 'admin') {
            context.errors.push('Acceso denegado: se requieren permisos de administrador');
            return;
        }

        context.authorized = true;
        console.log(`%c ✓ Autorizado: ${user.role} puede realizar ${method}`, COLORS.green);
    }
}

// 3. Handler de Sanitización
class SanitizationHandler extends BaseRequestHandler {
    protected process(context: RequestContext): void {
        const { request } = context;

        console.log('%c [3] Sanitizando datos...', COLORS.cyan);

        if (request.body) {
            // Sanitizar strings (eliminar espacios, caracteres especiales peligrosos)
            Object.keys(request.body).forEach(key => {
                if (typeof request.body![key] === 'string') {
                    request.body![key] = request.body![key]
                        .trim()
                        .replace(/[<>]/g, ''); // Prevenir XSS básico
                }
            });

            // Validar tipos de datos
            if (request.body.email && !request.body.email.includes('@')) {
                context.errors.push('Email inválido');
                return;
            }
        }

        context.sanitized = true;
        console.log('%c ✓ Datos sanitizados', COLORS.green);
    }
}

// 4. Handler de Logging/Auditoría
class LoggingHandler extends BaseRequestHandler {
    protected process(context: RequestContext): void {
        const { request } = context;

        console.log('%c [4] Registrando operación en auditoría...', COLORS.cyan);

        const logEntry = {
            timestamp: new Date().toISOString(),
            user: request.user?.id || 'anonymous',
            method: request.method,
            path: request.path,
            action: this.getActionName(request.method),
        };

        // En un caso real, esto se guardaría en una base de datos o archivo
        console.log('%c 📝 Log de auditoría:', COLORS.purple, logEntry);

        context.logged = true;
        console.log('%c ✓ Operación registrada', COLORS.green);
    }

    private getActionName(method: string): string {
        const actions: Record<string, string> = {
            'GET': 'Lectura',
            'POST': 'Creación',
            'PUT': 'Actualización',
            'DELETE': 'Eliminación',
        };
        return actions[method] || 'Desconocida';
    }
}

// 5. Handler de Procesamiento CRUD (Final)
class CRUDHandler extends BaseRequestHandler {
    // Simulación de base de datos en memoria
    private database: Map<string, User> = new Map();

    protected process(context: RequestContext): void {
        const { request } = context;

        console.log('%c [5] Procesando operación CRUD...', COLORS.cyan);

        try {
            switch (request.method) {
                case 'GET':
                    context.result = this.handleGet(request);
                    break;
                case 'POST':
                    context.result = this.handlePost(request);
                    break;
                case 'PUT':
                    context.result = this.handlePut(request);
                    break;
                case 'DELETE':
                    context.result = this.handleDelete(request);
                    break;
            }

            console.log('%c ✓ Operación CRUD completada exitosamente', COLORS.green);
            console.log('%c 📦 Resultado:', COLORS.blue, context.result);
        } catch (error) {
            context.errors.push(`Error en operación CRUD: ${(error as Error).message}`);
        }
    }

    private handleGet(request: UserRequest): User | User[] {
        if (request.path === '/users') {
            return Array.from(this.database.values());
        }
        const id = request.path.split('/').pop();
        const item = this.database.get(id!);
        if (!item) {
            throw new Error('Recurso no encontrado');
        }
        return item;
    }

    private handlePost(request: UserRequest): CRUDResult {
        const id = `user-${Date.now()}`;
        const body = request.body!;
        const newItem: User = {
            id,
            name: body.name || '',
            email: body.email || '',
            createdAt: new Date().toISOString(),
        };
        this.database.set(id, newItem);
        return { message: 'Recurso creado exitosamente', data: newItem };
    }

    private handlePut(request: UserRequest): CRUDResult {
        const id = request.body!.id!;
        const existing = this.database.get(id);
        if (!existing) {
            throw new Error('Recurso no encontrado para actualizar');
        }
        const body = request.body!;
        const updated: User = {
            ...existing,
            name: body.name || existing.name,
            email: body.email || existing.email,
            updatedAt: new Date().toISOString(),
        };
        this.database.set(id, updated);
        return { message: 'Recurso actualizado exitosamente', data: updated };
    }

    private handleDelete(request: UserRequest): CRUDResult {
        const id = request.path.split('/').pop();
        if (!this.database.has(id!)) {
            throw new Error('Recurso no encontrado para eliminar');
        }
        this.database.delete(id!);
        return { message: 'Recurso eliminado exitosamente' };
    }
}

// Función principal para demostrar el uso
function main() {
    console.log('%c\n=== EJEMPLO: Chain of Responsibility en CRUD ===\n', COLORS.blue);

    // Configurar la cadena de responsabilidad
    const validationHandler = new ValidationHandler();
    const authorizationHandler = new AuthorizationHandler();
    const sanitizationHandler = new SanitizationHandler();
    const loggingHandler = new LoggingHandler();
    const crudHandler = new CRUDHandler();

    // Construir la cadena
    validationHandler
        .setNext(authorizationHandler)
        .setNext(sanitizationHandler)
        .setNext(loggingHandler)
        .setNext(crudHandler);

    // Ejemplo 1: Crear usuario (admin)
    console.log('\n--- Ejemplo 1: POST /users (Admin) ---');
    const context1: RequestContext = {
        request: {
            method: 'POST',
            path: '/users',
            body: { name: 'Juan Pérez', email: 'juan@example.com' },
            user: { id: 'admin-1', role: 'admin' },
        },
        errors: [],
    };
    validationHandler.handle(context1);
    console.log('\n');

    // Ejemplo 2: Intentar eliminar como usuario regular (debe fallar)
    console.log('\n--- Ejemplo 2: DELETE /users/user-123 (User) ---');
    const context2: RequestContext = {
        request: {
            method: 'DELETE',
            path: '/users/user-123',
            user: { id: 'user-1', role: 'user' },
        },
        errors: [],
    };
    validationHandler.handle(context2);
    console.log('\n');

    // Ejemplo 3: Leer usuarios (guest)
    console.log('\n--- Ejemplo 3: GET /users (Guest) ---');
    const context3: RequestContext = {
        request: {
            method: 'GET',
            path: '/users',
            user: { id: 'guest-1', role: 'guest' },
        },
        errors: [],
    };
    validationHandler.handle(context3);
    console.log('\n');

    // Ejemplo 4: Request inválido (sin body en POST)
    console.log('\n--- Ejemplo 4: POST /users sin body ---');
    const context4: RequestContext = {
        request: {
            method: 'POST',
            path: '/users',
            user: { id: 'admin-1', role: 'admin' },
        },
        errors: [],
    };
    validationHandler.handle(context4);
    console.log('\n');
}

main();

