import {JoyFlick} from "./JoyFlick.js";

class Console extends HTMLElement {
    static instance;
    joyflick = null;

    constructor() {
        super();

        Console.instance = this;
    }

    initialize(gamepad) {
        this.innerHTML = '';

        this.joyflick = new JoyFlick(gamepad);
        this.appendChild(this.joyflick);
    }

    static scanGamepads() {
        const joyflick = Console.instance.joyflick;
        if (joyflick == null) return;

        const gamepads = navigator.getGamepads();
        if (gamepads == null) return;

        for (let i = 0; i < gamepads.length; i++) {
            const gamepad = gamepads[i];
            if (gamepad == null) continue;

            let outputs = joyflick.update(gamepad);
            if (outputs == null) continue;
            outputs.forEach((output) => {
                console.log(output);
            });
        }
    }
}

customElements.define('app-console', Console);

// ゲームパッドが接続された時の挙動
window.addEventListener('gamepadconnected', (e) => {
    // console.log(e);
    // JoyFlickを初期化
    Console.instance.initialize(e.gamepad);
    // if (Console.instance.joyflick == null) {
    // } else {
        // 無視
    // }
});

// ゲームパッドが接続解除された時の挙動
window.addEventListener('gamepaddisconnected', (e) => {
    if (Console.instance != null) {
        if (e.gamepad.index == Console.instance.getGamepadIndex()) {
            // todo JoyFlickを無効化
        }
    } else {
        // 無視
    }
});

setInterval(Console.scanGamepads, 60);