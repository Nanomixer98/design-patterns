/**
 * Application Layer - Use Cases
 * 
 * Caso de uso que utiliza el Composite Permission
 */

import { Permission } from '../../domain/interfaces/permission.ts';

export interface CheckPermissionRequest {
    user: {
        id: string;
        role: string;
        verified?: boolean;
    };
    resource?: {
        ownerId: string;
        protected?: boolean;
    };
    permission: Permission;
}

export class CheckPermissionUseCase {
    execute(request: CheckPermissionRequest): boolean {
        return request.permission.check(request.user, request.resource);
    }
}

