# Ejemplos del Patrón Composite con Clean Architecture

Este directorio contiene ejemplos prácticos del patrón de diseño **Composite** implementados siguiendo los principios de **Clean Architecture**.

## 📁 Estructura

```
composite-examples/
├── domain/                    # Capa de Dominio
│   └── interfaces/
│       ├── validator.ts       # Contrato para validadores
│       └── permission.ts      # Contrato para permisos
│
├── application/               # Capa de Aplicación
│   ├── validators/
│   │   ├── composite-validator.ts    # Composite para validaciones
│   │   └── user-validators.ts        # Validadores específicos
│   ├── permissions/
│   │   ├── composite-permission.ts   # Composite para permisos
│   │   └── role-permissions.ts       # Permisos específicos
│   └── use-cases/
│       ├── create-user.ts            # Caso de uso con validaciones
│       └── check-permission.ts       # Caso de uso con permisos
│
├── presentation/              # Capa de Presentación
│   └── controllers/
│       └── user-controller.ts        # Controlador REST
│
├── example-validations.ts     # Ejemplo de uso de validaciones
├── example-permissions.ts     # Ejemplo de uso de permisos
└── README.md                  # Este archivo
```

## 🎯 Ejemplos Incluidos

### 1. Sistema de Validaciones Compuestas

Demuestra cómo usar el patrón Composite para crear validaciones complejas a partir de validaciones simples.

**Componentes:**
- **Leaf (Hoja)**: `EmailValidator`, `PasswordValidator`, `NameValidator`
- **Composite (Compuesto)**: `PersonalDataValidator`, `UserRegistrationValidator`

**Características:**
- ✅ Validaciones individuales reutilizables
- ✅ Composición de validaciones en grupos
- ✅ Validaciones anidadas (composite dentro de composite)
- ✅ Recopilación de todos los errores

**Ejecutar:**
```bash
deno run --allow-read composite-examples/example-validations.ts
```

### 2. Sistema de Permisos Jerárquicos

Demuestra cómo usar el patrón Composite para crear reglas de permisos complejas con operadores lógicos.

**Componentes:**
- **Leaf (Hoja)**: `AdminPermission`, `OwnerPermission`, `ModeratorPermission`, `VerifiedUserPermission`
- **Composite (Compuesto)**: `EditPermission`, `DeletePermission`, `PublishPermission`

**Características:**
- ✅ Permisos individuales reutilizables
- ✅ Operadores lógicos AND/OR
- ✅ Permisos anidados
- ✅ Permisos personalizados dinámicos

**Ejecutar:**
```bash
deno run --allow-read composite-examples/example-permissions.ts
```

## 🏗️ Clean Architecture

### Domain Layer (Capa de Dominio)
- Define las interfaces y contratos
- No depende de ninguna otra capa
- Contiene la lógica de negocio pura

### Application Layer (Capa de Aplicación)
- Implementa los casos de uso
- Contiene la lógica de aplicación
- Depende solo del Domain Layer
- Implementa el patrón Composite

### Presentation Layer (Capa de Presentación)
- Controladores y adaptadores
- Depende del Application Layer
- Maneja la entrada/salida (HTTP, CLI, etc.)

## 🔑 Conceptos del Patrón Composite

### Componente Base
```typescript
interface Component {
  operation(): void;
}
```

### Leaf (Hoja)
- Representa objetos individuales
- No tiene hijos
- Implementa la operación directamente

### Composite (Compuesto)
- Contiene otros componentes (leafs o composites)
- Delega la operación a sus hijos
- Puede agregar/remover componentes

### Ventajas
1. **Uniformidad**: Trata objetos individuales y composiciones de la misma manera
2. **Flexibilidad**: Fácil agregar nuevos tipos de componentes
3. **Recursión**: Permite estructuras de árbol arbitrarias
4. **Reutilización**: Componentes pueden ser reutilizados en diferentes contextos

## 💡 Casos de Uso Reales

### Validaciones
- Validación de formularios complejos
- Validación de datos de entrada en APIs
- Validación de reglas de negocio

### Permisos
- Control de acceso basado en roles
- Permisos jerárquicos
- Políticas de seguridad complejas

### Otros Ejemplos
- Sistemas de archivos (carpetas y archivos)
- Menús jerárquicos
- Estructuras de documentos (secciones, párrafos)
- Árboles de componentes UI

## 🚀 Cómo Usar

### Ejemplo Básico de Validación

```typescript
import { UserRegistrationValidator } from './application/validators/user-validators.ts';

const validator = new UserRegistrationValidator();
const result = validator.validate({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  password: 'password123'
});

if (!result.isValid) {
  console.error('Errores:', result.errors);
}
```

### Ejemplo Básico de Permisos

```typescript
import { EditPermission } from './application/permissions/role-permissions.ts';

const permission = new EditPermission();
const canEdit = permission.check(user, resource);

if (canEdit) {
  // Permitir edición
}
```

## 📚 Referencias

- [Refactoring Guru - Composite Pattern](https://refactoring.guru/es/design-patterns/composite)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

