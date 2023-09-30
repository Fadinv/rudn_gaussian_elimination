interface NumEntityParams {
	numerator: number;
	denominator: number;
}

export class NumEntity {
	private _numerator: number;
	private _denominator: number;

	constructor(params: NumEntityParams) {
		this._numerator = params.numerator;
		this._denominator = params.denominator;
	}

	public get numerator() { return this._numerator; }
	public get denominator() { return this._denominator; }
	public get isMinusSign() { return this._numerator / this._denominator < 0; }
	public get value() { return {numerator: this._numerator, denominator: this._denominator}; }
	public get isOne() { return this._numerator === 1 && this._denominator === 1; }

	public multiplication = (byNum: NumEntity) => {
		let numerator = +(this._numerator * byNum._numerator).toFixed();
		let denominator = +(this._denominator * byNum._denominator).toFixed();

		if (denominator < 0) {
			numerator = -numerator;
			denominator = -denominator;
		}

		if (numerator === 0) {
			return new NumEntity({numerator, denominator: 1});
		} else if (numerator % denominator) {
			let cof = Math.abs(denominator);
			while (cof) {
				if (numerator % cof && denominator % cof) {
					return new NumEntity({numerator: +(numerator / cof).toFixed(), denominator: +(denominator / cof).toFixed()});
				} else {
					cof--;
				}
			}
			return new NumEntity({numerator, denominator});
		} else {
			return new NumEntity({numerator: +(numerator / denominator).toFixed(), denominator: denominator > 0 ? 1 : -1});
		}
	};

	public division = (byNum: NumEntity) => {
		let numerator = +(this._numerator * byNum._denominator).toFixed();
		let denominator = +(this._denominator * byNum._numerator).toFixed();

		if (denominator < 0) {
			numerator = -numerator;
			denominator = -denominator;
		}

		if (numerator === 0) {
			return new NumEntity({numerator, denominator: 1});
		} else if (numerator % denominator) {
			let cof = Math.abs(denominator);
			while (cof) {
				if (!(numerator % cof) && !(denominator % cof)) {
					return new NumEntity({numerator: +(numerator / cof).toFixed(), denominator: +(denominator / cof).toFixed()});
				} else {
					cof--;
				}
			}
			return new NumEntity({numerator, denominator});
		} else {
			return new NumEntity({numerator: +(numerator / denominator).toFixed(), denominator: denominator > 0 ? 1 : -1});
		}
	};

	public plus = (byNum: NumEntity) => {
		const denominator = +(this._denominator * byNum._denominator).toFixed();
		const numerator = +(this._numerator * +(denominator / this._denominator).toFixed() + byNum.numerator * +(denominator / byNum.denominator).toFixed()).toFixed();

		if (numerator === 0) {
			return new NumEntity({numerator, denominator: 1});
		} else if (numerator % denominator) {
			let cof = Math.abs(denominator);
			while (cof) {
				if (numerator % cof && denominator % cof) {
					return new NumEntity({numerator: +(numerator / cof).toFixed(), denominator: +(denominator / cof).toFixed()});
				} else {
					cof--;
				}
			}
			return new NumEntity({numerator, denominator});
		} else {
			return new NumEntity({numerator: +(numerator / denominator).toFixed(), denominator: denominator > 0 ? 1 : -1});
		}
	};

	public minus = (byNum: NumEntity) => {
		const denominator = +(this._denominator * byNum._denominator).toFixed();
		const numerator = +(this._numerator * +(denominator / this._denominator).toFixed() - byNum.numerator * +(denominator / byNum.denominator).toFixed()).toFixed();

		if (numerator === 0) {
			return new NumEntity({numerator, denominator: 1});
		} else if (numerator % denominator) {
			let cof = Math.abs(denominator);
			while (cof) {
				if (numerator % cof && denominator % cof) {
					return new NumEntity({numerator: +(numerator / cof).toFixed(), denominator: +(denominator / cof).toFixed()});
				} else {
					cof--;
				}
			}
			return new NumEntity({numerator, denominator});
		} else {
			return new NumEntity({numerator: +(numerator / denominator).toFixed(), denominator: denominator > 0 ? 1 : -1});
		}
	};
}