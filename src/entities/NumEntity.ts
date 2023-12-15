interface NumEntityParams {
	numerator: number;
	denominator: number;
	isEmpty?: boolean;
}

export class NumEntity {
	private _numerator: number;
	private _denominator: number;
	private _isEmpty: boolean;

	constructor(params: NumEntityParams) {
		this._numerator = params.numerator;
		this._denominator = params.denominator;
		this._isEmpty = params.isEmpty ?? false;
	}

	public get numerator() { return this._numerator; }
	public get denominator() { return this._denominator; }
	public get value() { return {numerator: this._numerator, denominator: this._denominator}; }
	public get moduleValue() {
		return new NumEntity({numerator: Math.abs(this._numerator), denominator: Math.abs(this._denominator)});
	}
	public get isEmpty() { return this._isEmpty; }

	public isBiggerThen = (byNum: NumEntity) => {
		if (byNum._denominator === 1 && this._denominator === 1) return this._numerator > byNum.numerator;
		return (this._numerator / this._denominator) > (byNum.numerator / byNum.denominator);
	};

	public isBiggerOrEqualThen = (byNum: NumEntity) => {
		if (byNum._denominator === 1 && this._denominator === 1) return this._numerator >= byNum.numerator;
		return (this._numerator / this._denominator) >= (byNum.numerator / byNum.denominator);
	};

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

	public division = (byNum: NumEntity, toFixed?: number) => {
		let numerator = +(this._numerator * byNum._denominator).toFixed();
		let denominator = +(this._denominator * byNum._numerator).toFixed();

		if (denominator < 0) {
			numerator = -numerator;
			denominator = -denominator;
		}

		if (numerator === 0) {
			return new NumEntity({numerator, denominator: 1});
		} else if (typeof toFixed === 'number') {
			const currentNumerator = +(numerator / denominator).toFixed(toFixed);
			console.log(numerator, denominator, currentNumerator);
			return new NumEntity({numerator: +(currentNumerator * (Math.pow(10, toFixed))).toFixed(), denominator: Math.pow(10, toFixed)});
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

	public minus = (byNum: NumEntity) => {
		const denominator = +(this._denominator * byNum._denominator).toFixed();
		const numerator = +(this._numerator * +(denominator / this._denominator).toFixed() - byNum.numerator * +(denominator / byNum.denominator).toFixed()).toFixed();

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
}