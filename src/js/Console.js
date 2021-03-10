import {BackspaceOutput, CharOutput, CursorMoveOutput, JoyFlick, TransformOutput} from "./JoyFlick.js";
import {PhoneticElement} from "./PhoneticElements.js";

export class Console extends HTMLElement {
    joyflick = null;
    textBox = null;

    constructor() {
        super();
    }

    initialize(gamepad) {
        this.innerHTML = '';

        this.textBox = new TextBox();
        this.appendChild(this.textBox);

        this.joyflick = new JoyFlick(gamepad);
        this.appendChild(this.joyflick);
    }
}

customElements.define('app-console', Console);

class TextBox extends HTMLInputElement {
    constructor() {
        super();

        // style
        this.classList.add("c-field");
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
        const text = this.value;
        const newText = text.slice(0, this.selectionEnd) + char + text.slice(this.selectionEnd);
        this.setText(newText);

        this.cursorMove(1);
    }

    backspace() {
        const text = this.value;
        const lastCharBackspaced = text.length === this.selectionEnd;
        this.setText(text.slice(0, this.selectionEnd - 1) + text.slice(this.selectionEnd));

        // 最後の文字を消した場合，勝手にカーソルが必要な分だけ下がるので
        // 手動でカーソルを下げる必要はない
        if (!lastCharBackspaced) {
            this.cursorMove(-1);
        }
    }

    transform() {
        const text = this.value;
        const char = text.charAt(this.selectionEnd - 1);
        const newChar = PhoneticElement.transform(char);
        if (newChar != null) {
            this.setText(text.slice(0, this.selectionEnd - 1) + newChar + text.slice(this.selectionEnd));
        } else {
            // 変換しない（変換先がないので）
        }
    }

    cursorMove(diff) {
        let to = this.selectionEnd + diff;
        if (to >= 0) {
            this.setSelectionRange(to, to);
        }
    }
}

customElements.define('app-input', TextBox, {extends: 'input'})