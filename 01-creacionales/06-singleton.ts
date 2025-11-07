/**
 * ! Singleton:
 * Es un patrón de diseño creacional que garantiza que una clase
 * tenga una única instancia y proporciona un punto de acceso global a ella.
 *
 * * Es útil cuando necesitas controlar el acceso a una única instancia
 * * de una clase, como por ejemplo, en un objeto de base de datos o en un
 * * objeto de configuración.
 *
 * https://refactoring.guru/es/design-patterns/singleton
 */

import { COLORS } from "../helpers/colors.ts";

class DragonBalls {
    private static instance: DragonBalls;
    private ballsCollected: number;

    private constructor() {
        this.ballsCollected = 0;
    }

    public static getInstance(): DragonBalls {
        if (!DragonBalls.instance) {
            DragonBalls.instance = new DragonBalls();
            console.log('%cDragon Balls created', COLORS.yellow);
        }
        return DragonBalls.instance;
    }

    public collectBall(): void {
        if(this.ballsCollected < 7) {
            this.ballsCollected++;
            console.log(`%cDragon Ball collected: ${this.ballsCollected}`, COLORS.orange);
        } else {
            console.log('%cAll Dragon Balls collected', COLORS.red);
        }
    }

    summonShenlong(): void {
        if(this.ballsCollected === 7) {
            console.log('%cShenlong summoned', COLORS.green);
            this.ballsCollected = 0;
        } else {
            console.log(`%cNot enough Dragon Balls to summon Shenlong, you need to collect ${7 - this.ballsCollected} more`, COLORS.red);
        }
    }
}

function main() {
    const gokuDragonBalls = DragonBalls.getInstance();
    console.log({gokuDragonBalls});
    gokuDragonBalls.collectBall();
    gokuDragonBalls.collectBall();
    gokuDragonBalls.collectBall();
    gokuDragonBalls.summonShenlong();
    gokuDragonBalls.collectBall();
    
    const vegetaDragonBalls = DragonBalls.getInstance();
    gokuDragonBalls.collectBall();
    console.log({gokuDragonBalls});
    gokuDragonBalls.collectBall();
    vegetaDragonBalls.collectBall();
    vegetaDragonBalls.summonShenlong();
    console.log({vegetaDragonBalls});
    vegetaDragonBalls.collectBall();
    console.log({vegetaDragonBalls});
}

main();