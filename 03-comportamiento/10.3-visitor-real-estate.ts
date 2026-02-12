/**
 * !Patrón Visitor - Ejemplo Real: Sistema de Bienes Raíces
 *
 * El patrón Visitor es un patrón de diseño de comportamiento
 * que te permite separar algoritmos de los objetos sobre
 * los que operan.
 *
 * * Es útil cuando necesitas añadir nuevas operaciones a
 * * clases estables sin cambiar su código.
 *
 * https://refactoring.guru/es/design-patterns/visitor
 */

/**
 * !Contexto del Ejemplo:
 * Sistema de gestión inmobiliaria donde diferentes profesionales
 * (tasadores, inspectores, agentes de ventas, aseguradores)
 * necesitan realizar operaciones específicas sobre diferentes
 * tipos de propiedades (casas, apartamentos, oficinas, terrenos)
 * sin modificar las clases de las propiedades.
 *
 * Cada visitante implementa operaciones especializadas:
 * - Tasador: Calcula el valor de mercado
 * - Inspector: Verifica el estado y seguridad
 * - Agente de Ventas: Calcula comisiones y estrategias de venta
 * - Asegurador: Evalúa riesgos y calcula primas
 */

import { COLORS } from '../helpers/colors.ts';

// ============================================
// Interfaz Visitor
// ============================================
interface PropertyVisitor {
    visitHouse(house: House): void;
    visitApartment(apartment: Apartment): void;
    visitOffice(office: Office): void;
    visitLand(land: Land): void;
}

// ============================================
// Interfaz Property (Element)
// ============================================
interface Property {
    accept(visitor: PropertyVisitor): void;
    getAddress(): string;
    getArea(): number; // en metros cuadrados
}

// ============================================
// Clases Concretas de Propiedades
// ============================================

class House implements Property {
    private address: string;
    private area: number;
    private bedrooms: number;
    private bathrooms: number;
    private hasGarden: boolean;
    private yearBuilt: number;

    constructor(
        address: string,
        area: number,
        bedrooms: number,
        bathrooms: number,
        hasGarden: boolean,
        yearBuilt: number
    ) {
        this.address = address;
        this.area = area;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.hasGarden = hasGarden;
        this.yearBuilt = yearBuilt;
    }

    getAddress(): string {
        return this.address;
    }

    getArea(): number {
        return this.area;
    }

    getBedrooms(): number {
        return this.bedrooms;
    }

    getBathrooms(): number {
        return this.bathrooms;
    }

    getHasGarden(): boolean {
        return this.hasGarden;
    }

    getYearBuilt(): number {
        return this.yearBuilt;
    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitHouse(this);
    }
}

class Apartment implements Property {
    private address: string;
    private area: number;
    private floor: number;
    private bedrooms: number;
    private hasElevator: boolean;
    private yearBuilt: number;

    constructor(
        address: string,
        area: number,
        floor: number,
        bedrooms: number,
        hasElevator: boolean,
        yearBuilt: number
    ) {
        this.address = address;
        this.area = area;
        this.floor = floor;
        this.bedrooms = bedrooms;
        this.hasElevator = hasElevator;
        this.yearBuilt = yearBuilt;
    }

    getAddress(): string {
        return this.address;
    }

    getArea(): number {
        return this.area;
    }

    getFloor(): number {
        return this.floor;
    }

    getBedrooms(): number {
        return this.bedrooms;
    }

    getHasElevator(): boolean {
        return this.hasElevator;
    }

    getYearBuilt(): number {
        return this.yearBuilt;
    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitApartment(this);
    }
}

class Office implements Property {
    private address: string;
    private area: number;
    private capacity: number; // número de empleados
    private hasParking: boolean;
    private yearBuilt: number;

    constructor(
        address: string,
        area: number,
        capacity: number,
        hasParking: boolean,
        yearBuilt: number
    ) {
        this.address = address;
        this.area = area;
        this.capacity = capacity;
        this.hasParking = hasParking;
        this.yearBuilt = yearBuilt;
    }

    getAddress(): string {
        return this.address;
    }

    getArea(): number {
        return this.area;
    }

    getCapacity(): number {
        return this.capacity;
    }

    getHasParking(): boolean {
        return this.hasParking;
    }

    getYearBuilt(): number {
        return this.yearBuilt;
    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitOffice(this);
    }
}

class Land implements Property {
    private address: string;
    private area: number;
    private zoning: string; // "residencial", "comercial", "industrial"
    private hasUtilities: boolean;

    constructor(
        address: string,
        area: number,
        zoning: string,
        hasUtilities: boolean
    ) {
        this.address = address;
        this.area = area;
        this.zoning = zoning;
        this.hasUtilities = hasUtilities;
    }

    getAddress(): string {
        return this.address;
    }

    getArea(): number {
        return this.area;
    }

    getZoning(): string {
        return this.zoning;
    }

    getHasUtilities(): boolean {
        return this.hasUtilities;
    }

    accept(visitor: PropertyVisitor): void {
        visitor.visitLand(this);
    }
}

// ============================================
// Visitantes Concretos
// ============================================

/**
 * Tasador: Calcula el valor de mercado de las propiedades
 */
class AppraiserVisitor implements PropertyVisitor {
    private currentYear = 2024;
    private pricePerSquareMeter = {
        house: 2000,
        apartment: 1800,
        office: 2500,
        land: 500,
    };

    visitHouse(house: House): void {
        const baseValue = house.getArea() * this.pricePerSquareMeter.house;
        const ageFactor = Math.max(0.5, 1 - (this.currentYear - house.getYearBuilt()) * 0.01);
        const gardenBonus = house.getHasGarden() ? 50000 : 0;
        const bedroomsBonus = house.getBedrooms() * 20000;
        const bathroomsBonus = house.getBathrooms() * 15000;

        const marketValue = (baseValue * ageFactor) + gardenBonus + bedroomsBonus + bathroomsBonus;

        console.log(
            `%c🏠 Casa en ${house.getAddress()}`,
            COLORS.cyan
        );
        console.log(`   Valor de mercado estimado: $${marketValue.toLocaleString('es-MX')}`);
        console.log(`   Área: ${house.getArea()} m² | Habitaciones: ${house.getBedrooms()} | Baños: ${house.getBathrooms()}`);
        console.log();
    }

    visitApartment(apartment: Apartment): void {
        const baseValue = apartment.getArea() * this.pricePerSquareMeter.apartment;
        const ageFactor = Math.max(0.5, 1 - (this.currentYear - apartment.getYearBuilt()) * 0.01);
        const floorBonus = apartment.getFloor() * 5000; // pisos más altos valen más
        const elevatorBonus = apartment.getHasElevator() ? 30000 : 0;
        const bedroomsBonus = apartment.getBedrooms() * 18000;

        const marketValue = (baseValue * ageFactor) + floorBonus + elevatorBonus + bedroomsBonus;

        console.log(
            `%c🏢 Apartamento en ${apartment.getAddress()}`,
            COLORS.cyan
        );
        console.log(`   Valor de mercado estimado: $${marketValue.toLocaleString('es-MX')}`);
        console.log(`   Área: ${apartment.getArea()} m² | Piso: ${apartment.getFloor()} | Habitaciones: ${apartment.getBedrooms()}`);
        console.log();
    }

    visitOffice(office: Office): void {
        const baseValue = office.getArea() * this.pricePerSquareMeter.office;
        const ageFactor = Math.max(0.5, 1 - (this.currentYear - office.getYearBuilt()) * 0.01);
        const capacityBonus = office.getCapacity() * 1000;
        const parkingBonus = office.getHasParking() ? 50000 : 0;

        const marketValue = (baseValue * ageFactor) + capacityBonus + parkingBonus;

        console.log(
            `%c🏢 Oficina en ${office.getAddress()}`,
            COLORS.cyan
        );
        console.log(`   Valor de mercado estimado: $${marketValue.toLocaleString('es-MX')}`);
        console.log(`   Área: ${office.getArea()} m² | Capacidad: ${office.getCapacity()} empleados`);
        console.log();
    }

    visitLand(land: Land): void {
        const baseValue = land.getArea() * this.pricePerSquareMeter.land;
        const zoningMultiplier = {
            'residencial': 1.2,
            'comercial': 1.5,
            'industrial': 1.0,
        }[land.getZoning()] || 1.0;
        const utilitiesBonus = land.getHasUtilities() ? land.getArea() * 50 : 0;

        const marketValue = (baseValue * zoningMultiplier) + utilitiesBonus;

        console.log(
            `%c🌳 Terreno en ${land.getAddress()}`,
            COLORS.cyan
        );
        console.log(`   Valor de mercado estimado: $${marketValue.toLocaleString('es-MX')}`);
        console.log(`   Área: ${land.getArea()} m² | Zonificación: ${land.getZoning()}`);
        console.log();
    }
}

/**
 * Inspector: Verifica el estado y seguridad de las propiedades
 */
class InspectorVisitor implements PropertyVisitor {
    visitHouse(house: House): void {
        const age = 2024 - house.getYearBuilt();
        const isOld = age > 30;
        const needsRenovation = age > 20;
        const hasGoodLayout = house.getBedrooms() >= 2 && house.getBathrooms() >= 1.5;

        console.log(
            `%c🔍 Inspección de Casa: ${house.getAddress()}`,
            COLORS.yellow
        );
        console.log(`   Estado: ${isOld ? '⚠️ Requiere renovación urgente' : needsRenovation ? '⚠️ Considerar renovación' : '✅ En buen estado'}`);
        console.log(`   Seguridad estructural: ${age < 15 ? '✅ Excelente' : age < 30 ? '⚠️ Revisar' : '❌ Requiere evaluación'}`);
        console.log(`   Distribución: ${hasGoodLayout ? '✅ Adecuada' : '⚠️ Mejorable'}`);
        console.log(`   Años de construcción: ${age}`);
        console.log();
    }

    visitApartment(apartment: Apartment): void {
        const age = 2024 - apartment.getYearBuilt();
        const isOld = age > 25;
        const hasElevator = apartment.getHasElevator();
        const isHighFloor = apartment.getFloor() > 10;

        console.log(
            `%c🔍 Inspección de Apartamento: ${apartment.getAddress()}`,
            COLORS.yellow
        );
        console.log(`   Estado: ${isOld ? '⚠️ Requiere mantenimiento' : '✅ En buen estado'}`);
        console.log(`   Accesibilidad: ${hasElevator ? '✅ Con ascensor' : '❌ Sin ascensor'}`);
        console.log(`   Seguridad: ${isHighFloor && !hasElevator ? '⚠️ Piso alto sin ascensor' : '✅ Aceptable'}`);
        console.log(`   Años de construcción: ${age}`);
        console.log();
    }

    visitOffice(office: Office): void {
        const age = 2024 - office.getYearBuilt();
        const hasParking = office.getHasParking();
        const capacityRatio = office.getCapacity() / (office.getArea() / 10); // 10 m² por empleado ideal

        console.log(
            `%c🔍 Inspección de Oficina: ${office.getAddress()}`,
            COLORS.yellow
        );
        console.log(`   Estado: ${age < 10 ? '✅ Moderna' : age < 20 ? '⚠️ Requiere actualización' : '❌ Obsoleta'}`);
        console.log(`   Estacionamiento: ${hasParking ? '✅ Disponible' : '❌ No disponible'}`);
        console.log(`   Capacidad: ${capacityRatio <= 1 ? '✅ Adecuada' : '⚠️ Sobrecargada'}`);
        console.log(`   Años de construcción: ${age}`);
        console.log();
    }

    visitLand(land: Land): void {
        const hasUtilities = land.getHasUtilities();
        const zoning = land.getZoning();

        console.log(
            `%c🔍 Inspección de Terreno: ${land.getAddress()}`,
            COLORS.yellow
        );
        console.log(`   Estado: ✅ Terreno disponible`);
        console.log(`   Servicios: ${hasUtilities ? '✅ Con servicios públicos' : '❌ Sin servicios públicos'}`);
        console.log(`   Zonificación: ${zoning}`);
        console.log(`   Listo para construcción: ${hasUtilities ? '✅ Sí' : '⚠️ Requiere instalación de servicios'}`);
        console.log();
    }
}

/**
 * Agente de Ventas: Calcula comisiones y estrategias de venta
 */
class SalesAgentVisitor implements PropertyVisitor {
    private commissionRate = 0.03; // 3% de comisión

    visitHouse(house: House): void {
        const estimatedPrice = house.getArea() * 2000;
        const commission = estimatedPrice * this.commissionRate;
        const marketDays = house.getHasGarden() ? 45 : 60; // días en el mercado estimados

        console.log(
            `%c💼 Estrategia de Venta - Casa: ${house.getAddress()}`,
            COLORS.green
        );
        console.log(`   Precio sugerido: $${estimatedPrice.toLocaleString('es-MX')}`);
        console.log(`   Comisión estimada: $${commission.toLocaleString('es-MX')}`);
        console.log(`   Tiempo estimado en mercado: ${marketDays} días`);
        console.log(`   Puntos de venta: ${house.getHasGarden() ? '✅ Jardín, ' : ''}${house.getBedrooms()} habitaciones, ${house.getBathrooms()} baños`);
        console.log();
    }

    visitApartment(apartment: Apartment): void {
        const estimatedPrice = apartment.getArea() * 1800;
        const commission = estimatedPrice * this.commissionRate;
        const marketDays = apartment.getHasElevator() && apartment.getFloor() > 5 ? 30 : 50;

        console.log(
            `%c💼 Estrategia de Venta - Apartamento: ${apartment.getAddress()}`,
            COLORS.green
        );
        console.log(`   Precio sugerido: $${estimatedPrice.toLocaleString('es-MX')}`);
        console.log(`   Comisión estimada: $${commission.toLocaleString('es-MX')}`);
        console.log(`   Tiempo estimado en mercado: ${marketDays} días`);
        console.log(`   Puntos de venta: Piso ${apartment.getFloor()}, ${apartment.getBedrooms()} habitaciones${apartment.getHasElevator() ? ', con ascensor' : ''}`);
        console.log();
    }

    visitOffice(office: Office): void {
        const estimatedPrice = office.getArea() * 2500;
        const commission = estimatedPrice * this.commissionRate;
        const marketDays = office.getHasParking() ? 40 : 70;

        console.log(
            `%c💼 Estrategia de Venta - Oficina: ${office.getAddress()}`,
            COLORS.green
        );
        console.log(`   Precio sugerido: $${estimatedPrice.toLocaleString('es-MX')}`);
        console.log(`   Comisión estimada: $${commission.toLocaleString('es-MX')}`);
        console.log(`   Tiempo estimado en mercado: ${marketDays} días`);
        console.log(`   Puntos de venta: Capacidad para ${office.getCapacity()} empleados${office.getHasParking() ? ', con estacionamiento' : ''}`);
        console.log();
    }

    visitLand(land: Land): void {
        const estimatedPrice = land.getArea() * 500;
        const commission = estimatedPrice * this.commissionRate;
        const marketDays = land.getHasUtilities() ? 60 : 90;

        console.log(
            `%c💼 Estrategia de Venta - Terreno: ${land.getAddress()}`,
            COLORS.green
        );
        console.log(`   Precio sugerido: $${estimatedPrice.toLocaleString('es-MX')}`);
        console.log(`   Comisión estimada: $${commission.toLocaleString('es-MX')}`);
        console.log(`   Tiempo estimado en mercado: ${marketDays} días`);
        console.log(`   Puntos de venta: Zonificación ${land.getZoning()}${land.getHasUtilities() ? ', con servicios' : ', requiere servicios'}`);
        console.log();
    }
}

/**
 * Asegurador: Evalúa riesgos y calcula primas de seguro
 */
class InsuranceVisitor implements PropertyVisitor {
    private basePremium = {
        house: 1200,
        apartment: 800,
        office: 2000,
        land: 300,
    };

    visitHouse(house: House): void {
        const age = 2024 - house.getYearBuilt();
        const ageRisk = age > 30 ? 1.5 : age > 15 ? 1.2 : 1.0;
        const gardenRisk = house.getHasGarden() ? 1.1 : 1.0; // jardín puede tener más riesgos
        const premium = this.basePremium.house * ageRisk * gardenRisk;

        console.log(
            `%c🛡️ Evaluación de Seguro - Casa: ${house.getAddress()}`,
            COLORS.purple
        );
        console.log(`   Prima anual estimada: $${premium.toLocaleString('es-MX')}`);
        console.log(`   Nivel de riesgo: ${age > 30 ? 'Alto' : age > 15 ? 'Medio' : 'Bajo'}`);
        console.log(`   Cobertura recomendada: Incendio, Robo, Responsabilidad Civil`);
        console.log();
    }

    visitApartment(apartment: Apartment): void {
        const age = 2024 - apartment.getYearBuilt();
        const ageRisk = age > 25 ? 1.3 : age > 10 ? 1.1 : 1.0;
        const floorRisk = apartment.getFloor() > 10 ? 0.9 : 1.0; // pisos altos tienen menos riesgo de robo
        const premium = this.basePremium.apartment * ageRisk * floorRisk;

        console.log(
            `%c🛡️ Evaluación de Seguro - Apartamento: ${apartment.getAddress()}`,
            COLORS.purple
        );
        console.log(`   Prima anual estimada: $${premium.toLocaleString('es-MX')}`);
        console.log(`   Nivel de riesgo: ${age > 25 ? 'Medio-Alto' : 'Bajo-Medio'}`);
        console.log(`   Cobertura recomendada: Incendio, Robo, Daños a terceros`);
        console.log();
    }

    visitOffice(office: Office): void {
        const age = 2024 - office.getYearBuilt();
        const ageRisk = age > 20 ? 1.4 : age > 10 ? 1.1 : 1.0;
        const capacityRisk = office.getCapacity() > 50 ? 1.2 : 1.0;
        const premium = this.basePremium.office * ageRisk * capacityRisk;

        console.log(
            `%c🛡️ Evaluación de Seguro - Oficina: ${office.getAddress()}`,
            COLORS.purple
        );
        console.log(`   Prima anual estimada: $${premium.toLocaleString('es-MX')}`);
        console.log(`   Nivel de riesgo: ${office.getCapacity() > 50 ? 'Medio-Alto' : 'Medio'}`);
        console.log(`   Cobertura recomendada: Incendio, Robo, Responsabilidad Civil, Equipos`);
        console.log();
    }

    visitLand(land: Land): void {
        const zoningRisk = {
            'residencial': 1.0,
            'comercial': 1.2,
            'industrial': 1.5,
        }[land.getZoning()] || 1.0;
        const premium = this.basePremium.land * zoningRisk;

        console.log(
            `%c🛡️ Evaluación de Seguro - Terreno: ${land.getAddress()}`,
            COLORS.purple
        );
        console.log(`   Prima anual estimada: $${premium.toLocaleString('es-MX')}`);
        console.log(`   Nivel de riesgo: ${land.getZoning() === 'industrial' ? 'Alto' : land.getZoning() === 'comercial' ? 'Medio' : 'Bajo'}`);
        console.log(`   Cobertura recomendada: Responsabilidad Civil, Protección de límites`);
        console.log();
    }
}

// ============================================
// Código Cliente
// ============================================
function main(): void {
    // Crear diferentes tipos de propiedades
    const properties: Property[] = [
        new House('Av. Reforma 123, CDMX', 150, 3, 2.5, true, 2010),
        new Apartment('Calle Insurgentes 456, CDMX', 80, 8, 2, true, 2015),
        new Office('Paseo de la Reforma 789, CDMX', 200, 30, true, 2018),
        new Land('Carretera México-Toluca Km 15', 500, 'residencial', true),
        new House('Calle Roma 321, CDMX', 120, 2, 2, false, 1995),
        new Apartment('Av. Polanco 654, CDMX', 100, 15, 3, true, 2020),
    ];

    console.log('%c═══════════════════════════════════════════════════════════', COLORS.blue);
    console.log('%c   SISTEMA DE GESTIÓN INMOBILIARIA - PATRÓN VISITOR', COLORS.blue);
    console.log('%c═══════════════════════════════════════════════════════════\n', COLORS.blue);

    // 1. Tasación de propiedades
    console.log('%c═══════════════════════════════════════════════════════════', COLORS.cyan);
    console.log('%c   TASACIÓN DE PROPIEDADES', COLORS.cyan);
    console.log('%c═══════════════════════════════════════════════════════════\n', COLORS.cyan);
    const appraiser = new AppraiserVisitor();
    properties.forEach((property) => property.accept(appraiser));

    // 2. Inspección de propiedades
    console.log('%c═══════════════════════════════════════════════════════════', COLORS.yellow);
    console.log('%c   INSPECCIÓN DE PROPIEDADES', COLORS.yellow);
    console.log('%c═══════════════════════════════════════════════════════════\n', COLORS.yellow);
    const inspector = new InspectorVisitor();
    properties.forEach((property) => property.accept(inspector));

    // 3. Estrategia de ventas
    console.log('%c═══════════════════════════════════════════════════════════', COLORS.green);
    console.log('%c   ESTRATEGIA DE VENTAS', COLORS.green);
    console.log('%c═══════════════════════════════════════════════════════════\n', COLORS.green);
    const salesAgent = new SalesAgentVisitor();
    properties.forEach((property) => property.accept(salesAgent));

    // 4. Evaluación de seguros
    console.log('%c═══════════════════════════════════════════════════════════', COLORS.purple);
    console.log('%c   EVALUACIÓN DE SEGUROS', COLORS.purple);
    console.log('%c═══════════════════════════════════════════════════════════\n', COLORS.purple);
    const insurer = new InsuranceVisitor();
    properties.forEach((property) => property.accept(insurer));

    console.log('%c═══════════════════════════════════════════════════════════', COLORS.blue);
    console.log('%c   Proceso completado exitosamente', COLORS.blue);
    console.log('%c═══════════════════════════════════════════════════════════\n', COLORS.blue);
}

main();

