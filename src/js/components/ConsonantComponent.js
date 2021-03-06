import {JoyFlickComponent, Key} from "./JoyFlickComponent.js";
import {Consonant} from "../PhoneticElements.js";

export class ConsonantComponent extends JoyFlickComponent {
    set selectedConsonant(cons) {
        if (this.selected != cons) {
            this.dualRumble();
        }
        this.selected = cons;

        if (cons != null) {
            this.setAttribute('value',cons.getValue());
        }
    }

    constructor(gamepad) {
        super(gamepad);

        // construct and set keys
        let keys = [
            new ConsonantKey(Consonant.A),
            new ConsonantKey(Consonant.K),
            new ConsonantKey(Consonant.S),
            new ConsonantKey(Consonant.T),
            new ConsonantKey(Consonant.N),
            new ConsonantKey(Consonant.H),
            new ConsonantKey(Consonant.M),
            new ConsonantKey(Consonant.Y),
            new ConsonantKey(Consonant.R),
            new ConsonantKey(Consonant.W),
        ];

        keys.forEach((key) => {
            this.appendChild(key);
            this.keys.set(key.value,key);
        });
    }

    update(cons, vow) {
        super.update();

        this.selectedConsonant = cons;
        this.keys.forEach((key) => {
            key.update(cons);
        });
    }
}

window.customElements.define('app-consonant-component', ConsonantComponent);

class ConsonantKey extends Key {
    constructor(value) {
        super(value);
        this.innerText = value.display;
    }
}

window.customElements.define('app-consonant-key', ConsonantKey);