export class JoyFlickComponent extends HTMLElement {
    gamepad;
    selected = null;
    keys = new Map();

    constructor(gamepad) {
        super();
        this.gamepad = gamepad;
    }

    update() {}

    render() {}

    dualRumble() {
        if (this.gamepad.vibrationActuator !== undefined) {
            const promise = this.gamepad.vibrationActuator.playEffect("dual-rumble", {
                duration: 50,
                strongMagnitude: 1.0,
                weakMagnitude: 0.0,
            });
            Promise.all([promise]);
        } else {
            // chrome以外のブラウザ
        }
    }
}

customElements.define('app-component', JoyFlickComponent);

export class Key extends HTMLElement {
    value;
    static SELECTED_ATTR = 'selected';

    constructor(value) {
        super();

        this.value = value;
        this.setAttribute('value',value.getValue());
    }

    update(selected) {
        if (this.value == selected) {
            this.setAttribute(Key.SELECTED_ATTR,null);
        } else {
            this.removeAttribute(Key.SELECTED_ATTR);
        }
    }
}

customElements.define('app-key', Key);