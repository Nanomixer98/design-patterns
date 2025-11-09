/**
 * Application Layer - Permissions
 * 
 * Composite Permission - Implementa el patrón Composite
 * Permite combinar permisos individuales con operadores AND/OR
 */

import { Permission } from '../../domain/interfaces/permission.ts';

export class CompositePermission implements Permission {
  private permissions: Permission[] = [];
  private mode: 'AND' | 'OR' = 'AND';

  constructor(mode: 'AND' | 'OR' = 'AND') {
    this.mode = mode;
  }

  add(permission: Permission | Permission[]): void {
    if (Array.isArray(permission)) {
      this.permissions.push(...permission);
    } else {
      this.permissions.push(permission);
    }
  }

  check(user: any, resource?: any): boolean {
    if (this.permissions.length === 0) {
      return false;
    }

    if (this.mode === 'AND') {
      return this.permissions.every(p => p.check(user, resource));
    } else {
      return this.permissions.some(p => p.check(user, resource));
    }
  }
}

