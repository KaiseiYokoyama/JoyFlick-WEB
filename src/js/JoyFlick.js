import {VowelComponent} from "./components/VowelComponent.js";
import {ConsonantComponent} from "./components/ConsonantComponent.js";
import {Consonant, PhoneticElement, Vowel} from "./PhoneticElements.js";

export class JoyFlick extends HTMLElement {
    #consonantComponent;
    #vowelComponent;
    #gamepad;
    #gamepadIndex;
    #prevReport;
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
        let outputs = [];

        let cons = Consonant.fromReport(report, this.reversed);
        const vow = Vowel.fromReport(report, this.reversed);

        if (!this.isConsonantLocked()) {
            this.#consonantComponent.update(cons, vow);
        } else {
            cons = this.#consonantComponent.selected;
        }
        let oldVowel = this.#vowelComponent.update(cons, vow);

        if (oldVowel != null) {
            // 文字を出力
            outputs.push(new CharOutput(PhoneticElement.character(cons, oldVowel)));
        }

        if (this.#prevReport != null) {
            if (!this.#prevReport.transform && report.transform) {
                // 変換を出力
                outputs.push(new TransformOutput());
            }

            if (!this.#prevReport.backspace && report.backspace) {
                // 削除を出力
                outputs.push(new BackspaceOutput());
            }
        }

        // 最終処理
        this.#prevReport = report;
        return outputs;
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
    transform = false;
    backspace = false;

    constructor(gamepad) {
        this.leftStick = new Stick(gamepad.axes[0], -gamepad.axes[1], gamepad.buttons[10].pressed);
        this.rightStick = new Stick(gamepad.axes[2], -gamepad.axes[3], gamepad.buttons[11].pressed);
        this.transform = gamepad.buttons[6].pressed || gamepad.buttons[7].pressed;
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

class JoyFlickOutput {
}

export class CharOutput extends JoyFlickOutput {
    #char;

    constructor(char) {
        super();
        this.#char = char;
    }

    getChar() {
        return this.#char;
    }
}

export class TransformOutput extends JoyFlickOutput {
}

export class BackspaceOutput extends JoyFlickOutput {
}