import * as PIXI from "pixi.js";
import { SlotMachine } from "../slots/SlotMachine";

// Mock requestAnimationFrame for tests
beforeAll(() => {
    global.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 16) as any;
});

describe("SlotMachine", () => {
    let app: PIXI.Application;
    let slotMachine: SlotMachine;

    beforeEach(() => {
        app = new PIXI.Application({ width: 800, height: 600 });
        slotMachine = new SlotMachine(app);
    });

    it("should spin reels when spin is called", () => {
        slotMachine.spin();
        expect(slotMachine.isSpinning).toBe(true);
    });

    it("should stop spinning eventually", () => {
        jest.useFakeTimers();

        slotMachine.spin();
        // Fast-forward time (adjust to your reel spin duration)
        jest.advanceTimersByTime(2000);

        // simulate a few frames to finish stop animation
        for (let i = 0; i < 10; i++) {
            slotMachine.update(1);
        }

        expect(slotMachine.isSpinning).toBe(false);
    });
});
