/**
 * EJEMPLO REAL: Sistema de Procesamiento de Pedidos E-commerce
 * 
 * El patrón Command encapsula cada operación como un objeto, permitiendo:
 * - Ejecutar operaciones de forma desacoplada
 * - Registrar/loggear todas las operaciones
 * - Validar antes de ejecutar
 * - Encolar operaciones para procesamiento asíncrono
 * - Agrupar operaciones en transacciones
 */

// ============================================
// 1. INTERFAZ BASE DEL COMANDO
// ============================================
interface Command {
    execute(): Promise<void>;
    getDescription(): string;
}

// ============================================
// 2. COMANDOS CONCRETOS
// ============================================

// Comando: Validar Inventario
class ValidateInventoryCommand implements Command {
    constructor(
        private productId: string,
        private quantity: number,
        private inventoryService: InventoryService
    ) { }

    async execute(): Promise<void> {
        const available = await this.inventoryService.checkAvailability(
            this.productId,
            this.quantity
        );
        if (!available) {
            throw new Error(
                `Inventario insuficiente para producto ${this.productId}`
            );
        }
        console.log(`✓ Inventario validado: ${this.quantity} unidades de ${this.productId}`);
    }

    getDescription(): string {
        return `Validar inventario: ${this.quantity}x ${this.productId}`;
    }
}

// Comando: Reservar Inventario
class ReserveInventoryCommand implements Command {
    constructor(
        private productId: string,
        private quantity: number,
        private inventoryService: InventoryService
    ) { }

    async execute(): Promise<void> {
        await this.inventoryService.reserve(this.productId, this.quantity);
        console.log(`✓ Inventario reservado: ${this.quantity}x ${this.productId}`);
    }

    getDescription(): string {
        return `Reservar inventario: ${this.quantity}x ${this.productId}`;
    }
}

// Comando: Procesar Pago
class ProcessPaymentCommand implements Command {
    constructor(
        private orderId: string,
        private amount: number,
        private paymentService: PaymentService
    ) { }

    async execute(): Promise<void> {
        const result = await this.paymentService.charge(this.orderId, this.amount);
        if (!result.success) {
            throw new Error(`Error al procesar pago: ${result.error}`);
        }
        console.log(`✓ Pago procesado: $${this.amount} para orden ${this.orderId}`);
    }

    getDescription(): string {
        return `Procesar pago: $${this.amount} para orden ${this.orderId}`;
    }
}

// Comando: Crear Orden
class CreateOrderCommand implements Command {
    constructor(
        private orderData: OrderData,
        private orderService: OrderService
    ) { }

    async execute(): Promise<void> {
        const orderId = await this.orderService.create(this.orderData);
        console.log(`✓ Orden creada: ${orderId}`);
    }

    getDescription(): string {
        return `Crear orden para cliente ${this.orderData.customerId}`;
    }
}

// Comando: Enviar Email de Confirmación
class SendConfirmationEmailCommand implements Command {
    constructor(
        private orderId: string,
        private customerEmail: string,
        private emailService: EmailService
    ) { }

    async execute(): Promise<void> {
        await this.emailService.send({
            to: this.customerEmail,
            subject: `Confirmación de Orden #${this.orderId}`,
            body: `Tu orden ${this.orderId} ha sido procesada exitosamente.`
        });
        console.log(`✓ Email de confirmación enviado a ${this.customerEmail}`);
    }

    getDescription(): string {
        return `Enviar email de confirmación a ${this.customerEmail}`;
    }
}

// Comando: Actualizar Puntos de Fidelidad
class UpdateLoyaltyPointsCommand implements Command {
    constructor(
        private customerId: string,
        private points: number,
        private loyaltyService: LoyaltyService
    ) { }

    async execute(): Promise<void> {
        await this.loyaltyService.addPoints(this.customerId, this.points);
        console.log(`✓ ${this.points} puntos agregados al cliente ${this.customerId}`);
    }

    getDescription(): string {
        return `Agregar ${this.points} puntos de fidelidad a cliente ${this.customerId}`;
    }
}

// ============================================
// 3. INVOCADOR - Ejecuta los comandos
// ============================================
class CommandInvoker {
    private executionLog: Array<{ command: string; timestamp: Date; success: boolean }> = [];

    async executeCommand(command: Command): Promise<void> {
        const description = command.getDescription();
        const timestamp = new Date();

        try {
            await command.execute();
            this.executionLog.push({
                command: description,
                timestamp,
                success: true
            });
        } catch (error) {
            this.executionLog.push({
                command: description,
                timestamp,
                success: false
            });
            throw error;
        }
    }

    async executeBatch(commands: Command[]): Promise<void> {
        console.log(`\n📦 Ejecutando lote de ${commands.length} comandos...\n`);

        for (const command of commands) {
            try {
                await this.executeCommand(command);
            } catch (error) {
                console.error(`❌ Error en: ${command.getDescription()}`);
                throw error; // Detener ejecución en caso de error
            }
        }

        console.log(`\n✅ Lote completado exitosamente\n`);
    }

    getExecutionLog() {
        return this.executionLog;
    }

    printLog(): void {
        console.log('\n📋 Historial de Ejecución:');
        console.log('─'.repeat(60));
        this.executionLog.forEach((entry, index) => {
            const status = entry.success ? '✓' : '✗';
            const time = entry.timestamp.toLocaleTimeString();
            console.log(`${index + 1}. [${time}] ${status} ${entry.command}`);
        });
        console.log('─'.repeat(60));
    }
}

// ============================================
// 4. COLA DE COMANDOS - Para procesamiento asíncrono
// ============================================
class CommandQueue {
    private queue: Command[] = [];
    private processing = false;

    enqueue(command: Command): void {
        this.queue.push(command);
        console.log(`📥 Comando encolado: ${command.getDescription()}`);
    }

    async processQueue(invoker: CommandInvoker): Promise<void> {
        if (this.processing) {
            console.log('⏳ La cola ya está siendo procesada...');
            return;
        }

        this.processing = true;
        console.log(`\n🔄 Procesando cola con ${this.queue.length} comandos...\n`);

        while (this.queue.length > 0) {
            const command = this.queue.shift()!;
            try {
                await invoker.executeCommand(command);
            } catch (error) {
                console.error(`❌ Error procesando comando: ${error}`);
                // Continuar con el siguiente comando
            }
        }

        this.processing = false;
        console.log('\n✅ Cola procesada completamente\n');
    }

    getQueueSize(): number {
        return this.queue.length;
    }
}

// ============================================
// 5. SERVICIOS (Simulados)
// ============================================
interface OrderData {
    customerId: string;
    items: Array<{ productId: string; quantity: number }>;
    total: number;
}

class InventoryService {
    private inventory = new Map<string, number>([
        ['PROD-001', 10],
        ['PROD-002', 5],
        ['PROD-003', 20]
    ]);

    async checkAvailability(productId: string, quantity: number): Promise<boolean> {
        await this.simulateDelay(100);
        const available = this.inventory.get(productId) || 0;
        return available >= quantity;
    }

    async reserve(productId: string, quantity: number): Promise<void> {
        await this.simulateDelay(150);
        const current = this.inventory.get(productId) || 0;
        this.inventory.set(productId, current - quantity);
    }

    private simulateDelay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class PaymentService {
    async charge(orderId: string, amount: number): Promise<{ success: boolean; error?: string }> {
        await this.simulateDelay(200);
        // Simular rechazo de pago si el monto es muy alto
        if (amount > 1000) {
            return { success: false, error: 'Monto excede el límite permitido' };
        }
        return { success: true };
    }

    private simulateDelay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class OrderService {
    private orderCounter = 1;

    async create(orderData: OrderData): Promise<string> {
        await this.simulateDelay(100);
        const orderId = `ORD-${String(this.orderCounter++).padStart(6, '0')}`;
        return orderId;
    }

    private simulateDelay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class EmailService {
    async send(email: { to: string; subject: string; body: string }): Promise<void> {
        await this.simulateDelay(150);
        // Simulación de envío
    }

    private simulateDelay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class LoyaltyService {
    private points = new Map<string, number>();

    async addPoints(customerId: string, points: number): Promise<void> {
        await this.simulateDelay(100);
        const current = this.points.get(customerId) || 0;
        this.points.set(customerId, current + points);
    }

    private simulateDelay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================
// 6. EJEMPLO DE USO
// ============================================
async function main() {
    // Inicializar servicios
    const inventoryService = new InventoryService();
    const paymentService = new PaymentService();
    const orderService = new OrderService();
    const emailService = new EmailService();
    const loyaltyService = new LoyaltyService();

    const invoker = new CommandInvoker();
    const queue = new CommandQueue();

    console.log('='.repeat(60));
    console.log('🛒 SISTEMA DE PROCESAMIENTO DE PEDIDOS');
    console.log('='.repeat(60));

    // ============================================
    // CASO 1: Procesar un pedido completo (batch)
    // ============================================
    console.log('\n📦 CASO 1: Procesar Pedido Completo\n');

    const orderData: OrderData = {
        customerId: 'CUST-001',
        items: [
            { productId: 'PROD-001', quantity: 2 },
            { productId: 'PROD-002', quantity: 1 }
        ],
        total: 150.00
    };

    const orderId = await orderService.create(orderData);

    const orderCommands: Command[] = [
        new ValidateInventoryCommand('PROD-001', 2, inventoryService),
        new ValidateInventoryCommand('PROD-002', 1, inventoryService),
        new ReserveInventoryCommand('PROD-001', 2, inventoryService),
        new ReserveInventoryCommand('PROD-002', 1, inventoryService),
        new ProcessPaymentCommand(orderId, orderData.total, paymentService),
        new SendConfirmationEmailCommand(orderId, 'cliente@example.com', emailService),
        new UpdateLoyaltyPointsCommand('CUST-001', 15, loyaltyService)
    ];

    await invoker.executeBatch(orderCommands);

    // ============================================
    // CASO 2: Usar cola para procesamiento asíncrono
    // ============================================
    console.log('\n📥 CASO 2: Procesamiento con Cola\n');

    // Simular comandos que llegan en diferentes momentos
    queue.enqueue(new ValidateInventoryCommand('PROD-003', 3, inventoryService));
    queue.enqueue(new ReserveInventoryCommand('PROD-003', 3, inventoryService));
    queue.enqueue(new UpdateLoyaltyPointsCommand('CUST-002', 20, loyaltyService));

    // Procesar la cola
    await queue.processQueue(invoker);

    // ============================================
    // CASO 3: Mostrar historial de ejecución
    // ============================================
    invoker.printLog();

    // ============================================
    // CASO 4: Manejo de errores
    // ============================================
    console.log('\n⚠️  CASO 3: Manejo de Errores\n');

    try {
        const invalidCommand = new ProcessPaymentCommand(
            'ORD-999999',
            1500.00, // Monto que excede el límite
            paymentService
        );
        await invoker.executeCommand(invalidCommand);
    } catch (error) {
        console.error(`Error capturado: ${error}`);
    }

    invoker.printLog();
}

// Ejecutar ejemplo
if (import.meta.main) {
    main().catch(console.error);
}

