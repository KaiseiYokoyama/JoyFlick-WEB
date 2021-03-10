// ゲームパッドが接続された時の挙動
import {Console} from "./Console.js";
import {BackspaceOutput, CharOutput, CursorMoveOutput, TransformOutput} from "./JoyFlick.js";

export class Application {
    static instance = new Application();
    console = document.querySelector('app-console');
    notifications = document.querySelector('blaze-alerts');

    static scanGamepads() {
        const joyflick = Application.instance.console.joyflick;
        if (joyflick == null) return;

        const gamepads = navigator.getGamepads();
        if (gamepads == null) return;

        for (let i = 0; i < gamepads.length; i++) {
            const gamepad = gamepads[i];
            if (gamepad == null) continue;

            console.log(gamepad);
            let outputs = joyflick.update(gamepad);
            if (outputs == null) continue;
            outputs.forEach((output) => {
                switch (output.constructor) {
                    case CharOutput: {
                        Application.instance.console.textBox.input(output.getChar());
                        break;
                    }
                    case BackspaceOutput: {
                        Application.instance.console.textBox.backspace();
                        break;
                    }
                    case TransformOutput: {
                        Application.instance.console.textBox.transform();
                        break;
                    }
                    case CursorMoveOutput: {
                        Application.instance.console.textBox.cursorMove(output.getMove());
                        break;
                    }
                    default: {
                        console.log(output);
                    }
                }
            });
        }
    }

    /**
     * 新しいゲームパッドが見つかった時
     * @param gamepad
     */
    static newGamepad(gamepad) {
        const title = "Gamepad Connected";
        const subTitle = gamepad.id;
        const rumbleAvailable = gamepad.vibrationActuator != null;
    }
}

window.addEventListener('gamepadconnected', (e) => {
    console.log(e);
    // JoyFlickを初期化
    Application.instance.console.initialize(e.gamepad);
    // if (Console.instance.joyflick == null) {
    // } else {
    // 無視
    // }
});

// ゲームパッドが接続解除された時の挙動
window.addEventListener('gamepaddisconnected', (e) => {
    if (Console.instance != null) {
        if (e.gamepad.index == Application.instance.console.getGamepadIndex()) {
            // todo JoyFlickを無効化
        }
    } else {
        // 無視
    }
});

setInterval(Application.scanGamepads, 60);
