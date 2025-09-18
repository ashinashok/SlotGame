import { Reel } from "../slots/Reel";

describe("Reel", () => {
    let reel: Reel;

    beforeEach(() => {
        // Initialize a reel with 6 symbols and each symbol height 150
        reel = new Reel(6, 150);
    });

    it("should start spinning", () => {
        reel.startSpin();
        expect(reel.isSpinning).toBe(true);
    });

    it("should stop spinning smoothly", () => {
        reel.startSpin();
        reel.stopSpin();
        // simulate a few frames to allow snapping
        for (let i = 0; i < 10; i++) {
            reel.update(1);
        }
        expect(reel.isSpinning).toBe(false);
    });

    it("should snap symbols to grid after stopping", () => {
        reel.startSpin();
        reel.stopSpin();
        for (let i = 0; i < 10; i++) {
            reel.update(1);
        }
        for (const symbol of reel.symbols) {
            // Check each symbol's y position is a multiple of symbolHeight
            expect(symbol.y % 150).toBe(0);
        }
    });
});
