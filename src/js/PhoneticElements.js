export class PhoneticElement {
    #value;
    #display;
    #index;

    static TABLE = [
        ['あ', 'い', 'う', 'え', 'お'],
        ['ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ'],
        ['か', 'き', 'く', 'け', 'こ'],
        ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
        ['さ', 'し', 'す', 'せ', 'そ'],
        ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
        ['た', 'ち', 'つ', 'て', 'と'],
        ['だ', 'ぢ', 'づ', 'で', 'ど'],
        ['な', 'に', 'ぬ', 'ね', 'の'],
        ['は', 'ひ', 'ふ', 'へ', 'ほ'],
        ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
        ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
        ['ま', 'み', 'む', 'め', 'も'],
        ['や', '、', 'ゆ', '。', 'よ'],
        ['ゃ', '、', 'ゅ', '。', 'ょ'],
        ['ら', 'り', 'る', 'れ', 'ろ'],
        ['わ', 'を', 'ん', 'ー', ' '],
        ['ゎ', 'を', 'ん', 'ー', ' ']
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

    display() {
        return this.#display;
    }

    static character(cons, vow) {
        return PhoneticElement.TABLE[cons.getIndex()][vow.getIndex()];
    }

    static transform(char) {
        if (char == "づ") return "っ";
        else if (char == "っ") return "つ";

        let cons = null, vow = null;
        outer: for (let i = 0; i < PhoneticElement.TABLE.length; i++) {
            for (let j = 0; j < PhoneticElement.TABLE[0].length; j++) {
                if (PhoneticElement.TABLE[i][j] == char) {
                    // ついでに変換も行う
                    cons = Consonant.fromIndex(i).transform();
                    vow = Vowel.fromIndex(j);
                    break outer;
                }
            }
        }

        // ひらがな以外の文字
        if (cons == null || vow == null) {
            return null
        } else {
            return PhoneticElement.character(cons, vow);
        }
    }
}

export class Consonant extends PhoneticElement {
    static consonants = new Map();

    static A = new Consonant('A', 'あ', 0);
    static XA = new Consonant('XA', 'ぁ', 1);
    static K = new Consonant('K', 'か', 2);
    static G = new Consonant('G', 'が', 3);
    static S = new Consonant('S', 'さ', 4);
    static Z = new Consonant('Z', 'ざ', 5);
    static T = new Consonant('T', 'た', 6);
    static D = new Consonant('D', 'だ', 7);
    static N = new Consonant('N', 'な', 8);
    static H = new Consonant('H', 'は', 9);
    static B = new Consonant('B', 'ば', 10);
    static P = new Consonant('P', 'ぱ', 11);
    static M = new Consonant('M', 'ま', 12);
    static Y = new Consonant('Y', 'や', 13);
    static XY = new Consonant('XY', 'ゃ', 14);
    static R = new Consonant('R', 'ら', 15);
    static W = new Consonant('W', 'わ', 16);
    static XW = new Consonant('XW', 'ゎ', 17);

    constructor(value, display, index) {
        super(value, display, index);
        // 登録
        Consonant.consonants.set(index, this);
    }

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

    static fromIndex(index) {
        return Consonant.consonants.get(index);
    }

    transform() {
        switch (this) {
            case Consonant.A:
                return Consonant.XA;
            case Consonant.XA:
                return Consonant.A;
            case Consonant.K:
                return Consonant.G;
            case Consonant.G:
                return Consonant.K;
            case Consonant.S:
                return Consonant.Z;
            case Consonant.Z:
                return Consonant.S;
            case Consonant.T:
                return Consonant.D;
            case Consonant.D:
                return Consonant.T;
            case Consonant.N:
                return Consonant.N;
            case Consonant.H:
                return Consonant.B;
            case Consonant.B:
                return Consonant.P;
            case Consonant.P:
                return Consonant.H;
            case Consonant.M:
                return Consonant.M;
            case Consonant.Y:
                return Consonant.XY;
            case Consonant.XY:
                return Consonant.Y;
            case Consonant.R:
                return Consonant.R;
            case Consonant.W:
                return Consonant.XW;
            case Consonant.XW:
                return Consonant.W;
        }
    }
}

export class Vowel extends PhoneticElement {
    static vowels = new Map();

    static A = new Vowel('A', 'あ', 0);
    static I = new Vowel('I', 'い', 1);
    static U = new Vowel('U', 'う', 2);
    static E = new Vowel('E', 'え', 3);
    static O = new Vowel('O', 'お', 4);

    constructor(value, display, index) {
        super(value, display, index);
        // 登録
        Vowel.vowels.set(index, this);
    }

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

    static fromIndex(index) {
        return Vowel.vowels.get(index);
    }

    display(cons) {
        return PhoneticElement.character(cons, this);
    }
}