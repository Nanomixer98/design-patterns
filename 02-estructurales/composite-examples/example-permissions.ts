/**
 * Ejemplo de uso del Composite Pattern con Permisos
 * 
 * Este archivo demuestra cómo usar el sistema de permisos compuestos
 */

import { CompositePermission } from './application/permissions/composite-permission.ts';
import {
    AdminPermission,
    DeletePermission,
    EditPermission,
    OwnerPermission,
    PublishPermission,
    VerifiedUserPermission
} from './application/permissions/role-permissions.ts';
import { CheckPermissionUseCase } from './application/use-cases/check-permission.ts';

function main() {
    console.log('=== Ejemplo 1: Permisos Individuales (Leaf) ===\n');

    const admin = { id: '1', role: 'admin' };
    const user = { id: '2', role: 'user' };
    const moderator = { id: '3', role: 'moderator', verified: true };

    const adminPermission = new AdminPermission();
    console.log('¿Es admin?', adminPermission.check(admin)); // true
    console.log('¿Es admin?', adminPermission.check(user)); // false
    console.log('\n');

    console.log('=== Ejemplo 2: Permiso Compuesto - Editar (OR) ===\n');

    const editPermission = new EditPermission();
    const resource = { ownerId: '2', name: 'Mi Recurso' };

    console.log('Admin puede editar:', editPermission.check(admin, resource)); // true (es admin)
    console.log('Dueño puede editar:', editPermission.check(user, resource)); // true (es dueño)
    console.log('Otro usuario puede editar:', editPermission.check({ id: '3', role: 'user' }, resource)); // false
    console.log('\n');

    console.log('=== Ejemplo 3: Permiso Compuesto - Eliminar (AND) ===\n');

    const deletePermission = new DeletePermission();
    const protectedResource = { ownerId: '1', name: 'Recurso Protegido', protected: true };
    const normalResource = { ownerId: '1', name: 'Recurso Normal', protected: false };

    console.log('Admin puede eliminar recurso normal:', deletePermission.check(admin, normalResource)); // true
    console.log('Admin puede eliminar recurso protegido:', deletePermission.check(admin, protectedResource)); // false
    console.log('Usuario puede eliminar:', deletePermission.check(user, normalResource)); // false
    console.log('\n');

    console.log('=== Ejemplo 4: Permiso Compuesto Anidado - Publicar ===\n');

    const publishPermission = new PublishPermission();

    console.log('Admin puede publicar:', publishPermission.check(admin)); // true
    console.log('Moderador verificado puede publicar:', publishPermission.check(moderator)); // true
    console.log('Moderador no verificado puede publicar:', publishPermission.check({ id: '4', role: 'moderator', verified: false })); // false
    console.log('Usuario normal puede publicar:', publishPermission.check(user)); // false
    console.log('\n');

    console.log('=== Ejemplo 5: Crear Permiso Personalizado ===\n');

    // Crear un permiso personalizado: Admin O (Dueño Y Verificado)
    const customPermission = new CompositePermission('OR');
    const ownerAndVerified = new CompositePermission('AND');
    ownerAndVerified.add([
        new OwnerPermission(),
        new VerifiedUserPermission()
    ]);

    customPermission.add([
        new AdminPermission(),
        ownerAndVerified
    ]);

    const verifiedOwner = { id: '2', role: 'user', verified: true };
    const unverifiedOwner = { id: '2', role: 'user', verified: false };

    console.log('Admin puede acceder:', customPermission.check(admin, resource)); // true
    console.log('Dueño verificado puede acceder:', customPermission.check(verifiedOwner, resource)); // true
    console.log('Dueño no verificado puede acceder:', customPermission.check(unverifiedOwner, resource)); // false
    console.log('\n');

    console.log('=== Ejemplo 6: Uso con Caso de Uso ===\n');

    const checkPermissionUseCase = new CheckPermissionUseCase();

    const result = checkPermissionUseCase.execute({
        user: admin,
        resource: resource,
        permission: editPermission
    });

    console.log('Resultado del caso de uso:', result); // true
}

main();

