/**
 * Domain Layer - Interfaces
 * Define el contrato para el sistema de permisos
 */

export interface Permission {
  check(user: any, resource?: any): boolean;
}

