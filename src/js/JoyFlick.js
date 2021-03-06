import {VowelComponent} from "./components/VowelComponent.js";
import {ConsonantComponent} from "./components/ConsonantComponent.js";
import {Consonant, Vowel} from "./PhoneticElements.js";

export class JoyFlick extends HTMLElement {
    #consonantComponent;
    #vowelComponent;
    #gamepad;
    #gamepadIndex;
    /**
     * 普段は左スティックが母音，右スティックが子音に対応しているが，
     * それを逆転させるか否か
     */
    reversed = false;

    constructor(gamepad) {
        super();

        this.#consonantComponent = new ConsonantComponent();
        this.appendChild(this.#consonantComponent);

        let separator = document.createElement('div');
        separator.classList.add('separator');
        this.appendChild(separator);

        this.#vowelComponent = new VowelComponent();
        this.appendChild(this.#vowelComponent);

        this.#gamepad = gamepad;
        this.#gamepadIndex = gamepad.index;
    }

    update(gamepad) {
        if (gamepad.index != this.#gamepad.index) return;

        const report = new Report(gamepad);
        const cons = Consonant.fromReport(report, this.reversed);
        const vow = Vowel.fromReport(report, this.reversed);
        // console.log([cons,vow]);

        let output = null;
        this.#vowelComponent.update(cons, vow);
        if (!this.isConsonantLocked()) {
            output = this.#consonantComponent.update(cons, vow);
        }

        if (output != null) {
            // 文字を出力
            console.log(output);
        }
    }

    getGamepadIndex() {
        return this.#gamepadIndex;
    }

    isConsonantLocked() {
        return this.#vowelComponent.selected != null;
    }
}

customElements.define('app-joyflick', JoyFlick);

class Report {
    leftStick;
    rightStick;
    convert = false;
    backspace = false;

    constructor(gamepad) {
        this.leftStick = new Stick(gamepad.axes[0], -gamepad.axes[1], gamepad.buttons[10].pressed);
        this.rightStick = new Stick(gamepad.axes[2], -gamepad.axes[3], gamepad.buttons[11].pressed);
        this.convert = gamepad.buttons[6].pressed || gamepad.buttons[7].pressed;
        this.backspace = gamepad.buttons[0].pressed;
    }
}

class Stick {
    x = 0;
    y = 0;
    pressed = false;

    constructor(x, y, pressed) {
        this.x = x;
        this.y = y;
        this.pressed = pressed;
    }

    /**
     * -PI to PI
     * @returns {number} theta
     */
    theta() {
        return Math.atan2(this.y, this.x);
    }

    radian() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
