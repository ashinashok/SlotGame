import { Howl } from "howler";


type SoundMap = { [alias: string]: Howl };

const sounds: SoundMap = {};

export const sound = {
    add: (alias: string, url: string): void => {
        if (!sounds[alias]) {
            sounds[alias] = new Howl({ src: [url] });
        }
    },
    play: (alias: string): void => {
        const s = sounds[alias];
        if (s) {
            s.play();
        } else {
            console.warn(`Sound not found: ${alias}`);
        }
    },
    stop: (alias: string): void => {
        const s = sounds[alias];
        if (s) {
            s.stop();
        } else {
            console.warn(`Sound not found: ${alias}`);
        }
    }
};
