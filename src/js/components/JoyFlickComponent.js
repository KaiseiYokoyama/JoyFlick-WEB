export class JoyFlickComponent extends HTMLElement {
    selected = null;
    keys = new Map();

    update() {}

    render() {}
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