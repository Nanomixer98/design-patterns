/**
 * Application Layer - Permissions
 * 
 * Permisos individuales (Leaf) y compuestos (Composite)
 * para control de acceso
 */

import { Permission } from '../../domain/interfaces/permission.ts';
import { CompositePermission } from './composite-permission.ts';

// Leaf: Permiso de administrador
export class AdminPermission implements Permission {
  check(user: any): boolean {
    return user.role === 'admin';
  }
}

// Leaf: Permiso de dueño del recurso
export class OwnerPermission implements Permission {
  check(user: any, resource: any): boolean {
    return user.id === resource.ownerId;
  }
}

// Leaf: Permiso de moderador
export class ModeratorPermission implements Permission {
  check(user: any): boolean {
    return user.role === 'moderator';
  }
}

// Leaf: Permiso de usuario verificado
export class VerifiedUserPermission implements Permission {
  check(user: any): boolean {
    return user.verified === true;
  }
}

// Composite: Usuario puede editar si es admin O es el dueño
export class EditPermission extends CompositePermission {
  constructor() {
    super('OR');
    this.add([
      new AdminPermission(),
      new OwnerPermission()
    ]);
  }
}

// Composite: Usuario puede eliminar si es admin Y el recurso no está protegido
export class DeletePermission extends CompositePermission {
  constructor() {
    super('AND');
    this.add([
      new AdminPermission()
    ]);
  }

  check(user: any, resource?: any): boolean {
    // Verificar que sea admin
    const isAdmin = super.check(user, resource);
    
    // Verificar que el recurso no esté protegido
    if (resource && resource.protected) {
      return false;
    }
    
    return isAdmin;
  }
}

// Composite: Usuario puede publicar si es admin O (moderador Y verificado)
export class PublishPermission extends CompositePermission {
  constructor() {
    super('OR');
    
    const adminPermission = new AdminPermission();
    const moderatorAndVerified = new CompositePermission('AND');
    moderatorAndVerified.add([
      new ModeratorPermission(),
      new VerifiedUserPermission()
    ]);
    
    this.add([
      adminPermission,
      moderatorAndVerified
    ]);
  }
}

