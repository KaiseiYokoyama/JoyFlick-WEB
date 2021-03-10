// ゲームパッドが接続された時の挙動
import {Console} from "./Console.js";
import {BackspaceOutput, CharOutput, CursorMoveOutput, TransformOutput} from "./JoyFlick.js";

export class Application {
    static instance = new Application();
    console = document.querySelector('app-console');
    static #notificationsQuerySelector = 'blaze-alerts > div[role]';

    static scanGamepads() {
        const joyflick = Application.instance.console.joyflick;
        if (joyflick == null) return;

        const gamepads = navigator.getGamepads();
        if (gamepads == null) return;

        for (let i = 0; i < gamepads.length; i++) {
            const gamepad = gamepads[i];
            if (gamepad == null) continue;

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
        const title = "ゲームパッドが接続されました";
        const gamepadID = gamepad.id;

        const rumbleAvailable = gamepad.vibrationActuator != null;
        const rumbleElem = document.createElement('div');
        rumbleElem.classList.add('rumble');
        if (rumbleAvailable === true) {
            rumbleElem.toggleAttribute('rumble');
        }
        rumbleElem.innerText = "振動機能："

        Application.newNotification(title, gamepadID, rumbleElem);

        // 一定時間後に消える
        // setTimeout( () => {
        //     notification.close();
        // }, 5000)
    }

    static newNotification(title, subTitle, content, type = 'info') {
        const titleElem = document.createElement('div');
        titleElem.classList.add('title');
        titleElem.innerText = title;

        const subTitleElem = document.createElement('div');
        subTitleElem.classList.add('gamepad-id');
        subTitleElem.innerText = subTitle;

        const notification = document.createElement('blaze-alert');
        notification.toggleAttribute('open');
        notification.toggleAttribute('dismissible');
        notification.setAttribute('type', type);

        // 子要素を追加
        notification.appendChild(titleElem);
        notification.appendChild(subTitleElem);
        if (content) notification.appendChild(content);

        document.querySelector(Application.#notificationsQuerySelector)
            .appendChild(notification);
    }
}

window.addEventListener('gamepadconnected', (e) => {
    console.log(e);
    // JoyFlickを初期化
    Application.instance.console.initialize(e.gamepad);
    // 通知を出す
    Application.newGamepad(e.gamepad);
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
