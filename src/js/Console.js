import {BackspaceOutput, CharOutput, CursorMoveOutput, JoyFlick, TransformOutput} from "./JoyFlick.js";
import {PhoneticElement} from "./PhoneticElements.js";

class Console extends HTMLElement {
    static instance;
    joyflick = null;
    textBox = null;

    constructor() {
        super();

        Console.instance = this;
    }

    initialize(gamepad) {
        this.innerHTML = '';

        this.joyflick = new JoyFlick(gamepad);
        this.appendChild(this.joyflick);

        this.textBox = new TextBox();
        this.appendChild(this.textBox);
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
                switch (output.constructor) {
                    case CharOutput: {
                        Console.instance.textBox.input(output.getChar());
                        break;
                    }
                    case BackspaceOutput: {
                        Console.instance.textBox.backspace();
                        break;
                    }
                    case TransformOutput: {
                        Console.instance.textBox.transform();
                        break;
                    }
                    case CursorMoveOutput: {
                        Console.instance.textBox.cursorMove(output.getMove());
                        break;
                    }
                    default: {
                        console.log(output);
                    }
                }
            });
        }
    }
}

customElements.define('app-console', Console);

// ゲームパッドが接続された時の挙動
window.addEventListener('gamepadconnected', (e) => {
    console.log(e);
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

class TextBox extends HTMLTextAreaElement {
    constructor() {
        super();
    }

    setText(text) {
        const [cursorStart, cursorEnd] = [this.selectionStart, this.selectionEnd];
        this.value = text;
        this.setSelectionRange(cursorStart, cursorEnd);
    }

    connectedCallback() {
        this.focus();
    }

    input(char) {
        this.setText(this.value + char);
        this.cursorMove(1);
    }

    backspace() {
        const text = this.value;
        this.setText(text.slice(0, this.selectionEnd - 1) + text.slice(this.selectionEnd));
        this.cursorMove(-1);
    }

    transform() {
        const text = this.value;
        const char = text.charAt(this.selectionEnd - 1);
        const newChar = PhoneticElement.transform(char);
        if (newChar != null) {
            this.setText(text.slice(0, this.selectionEnd - 1) + newChar + text.slice(this.selectionEnd));
        } else {
            // そのまま
        }
    }

    cursorMove(diff) {
        let to = this.selectionEnd + diff;
        if (to >= 0) {
            this.setSelectionRange(to, to);
        }
    }
}

customElements.define('app-textbox', TextBox, {extends: 'textarea'})