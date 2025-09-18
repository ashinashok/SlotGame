import * as PIXI from 'pixi.js';
import { AssetLoader } from '../utils/AssetLoader';

const SYMBOL_TEXTURES = [
    'symbol1.png',
    'symbol2.png',
    'symbol3.png',
    'symbol4.png',
    'symbol5.png',
];

const SPIN_SPEED = 50; // Pixels per frame
const SLOWDOWN_RATE = 0.95; // Rate at which the reel slows down

export class Reel {
    public container: PIXI.Container;
    public symbols: PIXI.Sprite[];
    private symbolSize: number;
    private symbolCount: number;
    private speed: number = 0;
    public isSpinning: boolean = false;

    constructor(symbolCount: number, symbolSize: number) {
        this.container = new PIXI.Container();
        this.symbols = [];
        this.symbolSize = symbolSize;
        this.symbolCount = symbolCount;

        this.createSymbols();
        this.createMask();
    }

    private createMask(): void {
        // Creates a mask so only the visible part of the reel is shown
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, this.symbolCount * this.symbolSize, this.symbolSize);
        mask.endFill();

        mask.width = this.symbolSize * this.symbolCount;

        this.container.addChild(mask);
        this.container.mask = mask;
    }

    private createSymbols(): void {
        // Create symbols for the reel, arranged horizontally
        for (let i = 0; i < this.symbolCount; i++) {
            const symbol = this.createRandomSymbol();
            symbol.x = i * this.symbolSize;
            symbol.y = 0;
            this.container.addChild(symbol);
            this.symbols.push(symbol);
        }
    }

    // Creates a single random symbol sprite
    private createRandomSymbol(): PIXI.Sprite {
        const randomIndex = Math.floor(Math.random() * SYMBOL_TEXTURES.length);
        const textureName = SYMBOL_TEXTURES[randomIndex];
        const texture = AssetLoader.getTexture(textureName);

        const sprite = new PIXI.Sprite(texture);
        sprite.width = this.symbolSize;
        sprite.height = this.symbolSize;
        return sprite;
    }

    public update(delta: number): void {
        if (!this.isSpinning && this.speed === 0) return;
        // Moves the symbols and handles the spinning and stopping logic

        for (const symbol of this.symbols) {
            symbol.x -= this.speed * delta;

            // If a symbol moves out of view, wrap it to the right and randomize its texture
            if (symbol.x + this.symbolSize <= 0) {
                const rightmost = Math.max(...this.symbols.map(s => s.x));
                symbol.x = rightmost + this.symbolSize;

                const newTextureName = SYMBOL_TEXTURES[Math.floor(Math.random() * SYMBOL_TEXTURES.length)];
                symbol.texture = AssetLoader.getTexture(newTextureName);
            }
        }

        // If the reel is stopping, gradually slow down and snap symbols to grid when nearly stopped
        if (!this.isSpinning && this.speed > 0) {
            this.speed *= SLOWDOWN_RATE;

            // If speed is very low, stop completely and snap to grid
            if (this.speed < 1) {
                this.snapToGrid();
            }
        }
    }

    private snapToGrid(): void {
        // Aligns all symbols perfectly into their slots after spinning stops
        for (const symbol of this.symbols) {
            const slotIndex = Math.round(symbol.x / this.symbolSize);
            symbol.x = slotIndex * this.symbolSize;
        }

        this.symbols.sort((a, b) => a.x - b.x);

        for (let i = 0; i < this.symbolCount; i++) {
            this.symbols[i].x = i * this.symbolSize;
        }

        this.speed = 0;
    }

    public startSpin(): void {
        this.isSpinning = true;
        this.speed = SPIN_SPEED;
    }

    public stopSpin(): void {
        this.isSpinning = false;
        // The reel will gradually slow down in the update method
    }
}