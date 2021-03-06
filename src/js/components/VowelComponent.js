import {JoyFlickComponent, Key} from "./JoyFlickComponent.js";
import {Consonant, PhoneticElement, Vowel} from "../PhoneticElements.js";

export class VowelComponent extends JoyFlickComponent {
    set selectedVowel(vow) {
        this.selected = vow;

        if (vow != null) {
            this.setAttribute('value',vow.getValue());
        }
    }

    constructor() {
        super();

        // construct and set keys
        let keys = [
            new VowelKey(Vowel.U),
            new VowelKey(Vowel.I), new VowelKey(Vowel.A), new VowelKey(Vowel.E),
            new VowelKey(Vowel.O)
        ];

        keys.forEach((key) => {
            this.appendChild(key);
            this.keys.set(key.value, key);
        });
    }

    update(cons, vow) {
        super.update();

        let output = null;

        if (vow == null && this.selected != null) {
            output = PhoneticElement.character(cons, this.selected);
        }

        this.selectedVowel = vow;
        this.keys.forEach((key) => {
            key.update(vow, cons);
        });

        return output;
    }
}

customElements.define('app-vowel-component', VowelComponent);

class VowelKey extends Key {
    constructor(value) {
        super(value);

        this.innerText = PhoneticElement.character(Consonant.N, value);
    }

    update(selected, cons) {
        super.update(selected);

        this.innerText = PhoneticElement.character(cons, this.value);
    }
}

customElements.define('app-vowel-key', VowelKey);
