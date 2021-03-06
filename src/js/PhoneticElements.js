export class PhoneticElement {
    #value;
    #display;
    #index;

    static TABLE = [
        ['あ', 'い', 'う', 'え', 'お'],
        ['か', 'き', 'く', 'け', 'こ'],
        ['さ', 'し', 'す', 'せ', 'そ'],
        ['た', 'ち', 'つ', 'て', 'と'],
        ['な', 'に', 'ぬ', 'ね', 'の'],
        ['は', 'ひ', 'ふ', 'へ', 'ほ'],
        ['ま', 'み', 'む', 'め', 'も'],
        ['や', '、', 'ゆ', '。', 'よ'],
        ['ら', 'り', 'る', 'れ', 'ろ'],
        ['わ', 'ー', 'を', '〜', 'ん']
    ];

    constructor(value, display, index) {
        this.#value = value;
        this.display = display;
        this.#index = index;
    }

    getValue() {
        return this.#value;
    }

    getIndex() {
        return this.#index;
    }

    display() { return this.#display; }

    static character(cons, vow) {
        return PhoneticElement.TABLE[cons.getIndex()][vow.getIndex()];
    }
}

export class Consonant extends PhoneticElement {
    static A = new Consonant('A', 'あ', 0);
    static K = new Consonant('K', 'か', 1);
    static S = new Consonant('S', 'さ', 2);
    static T = new Consonant('T', 'た', 3);
    static N = new Consonant('N', 'な', 4);
    static H = new Consonant('H', 'は', 5);
    static M = new Consonant('M', 'ま', 6);
    static Y = new Consonant('Y', 'や', 7);
    static R = new Consonant('R', 'ら', 8);
    static W = new Consonant('W', 'わ', 9);

    static fromReport(report, reversed = false, deadRange = 0.7) {
        let stick;
        if (this.reversed) {
            stick = report.leftStick;
        } else {
            stick = report.rightStick;
        }

        // -1...1
        let theta = stick.theta() / Math.PI;

        let selected;
        if (stick.pressed) {
            selected = Consonant.W;
        } else if (stick.radian() < deadRange) {
            selected = Consonant.N;
        } else if (-0.875 <= theta && theta < -0.625) {
            selected = Consonant.M;
        } else if (-0.625 <= theta && theta < -0.375) {
            selected = Consonant.Y;
        } else if (-0.375 <= theta && theta < -0.125) {
            selected = Consonant.R;
        } else if (-0.125 <= theta && theta < 0.125) {
            selected = Consonant.H;
        } else if (0.125 <= theta && theta < 0.375) {
            selected = Consonant.S;
        } else if (0.375 <= theta && theta < 0.625) {
            selected = Consonant.K;
        } else if (0.625 <= theta && theta < 0.875) {
            selected = Consonant.A;
        } else {
            selected = Consonant.T;
        }

        return selected;
    }
}

export class Vowel extends PhoneticElement {
    static A = new Vowel('A', 'あ', 0);
    static I = new Vowel('I', 'い', 1);
    static U = new Vowel('U', 'う', 2);
    static E = new Vowel('E', 'え', 3);
    static O = new Vowel('O', 'お', 4);

    static fromReport(report, reversed = false, deadRange = 0.7) {
        let stick;
        if (this.reversed) {
            stick = report.rightStick;
        } else {
            stick = report.leftStick;
        }

        // -1...1
        let theta = stick.theta() / Math.PI;

        let selected;
        if (stick.pressed) {
            selected = Vowel.A;
        } else if (stick.radian() < deadRange) {
            selected = null;
        } else if (-0.75 <= theta && theta < -0.25) {
            selected = Vowel.O;
        } else if (-0.25 <= theta && theta < 0.25) {
            selected = Vowel.E;
        } else if (0.25 <= theta && theta < 0.75) {
            selected = Vowel.U;
        } else {
            selected = Vowel.I;
        }

        return selected;
    }

    display(cons) {
        return PhoneticElement.character(cons,this);
    }
}