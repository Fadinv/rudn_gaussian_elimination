import React, {useState} from 'react';

interface Range {
	a: number;
	b: number;
}

export const Calculate = () => {
	const [range, setRangeToState] = useState<Range>({a: 0, b: 10});
	const [step, setStep] = useState(0.001);
	const [result, setResult] = useState<number | null>(null);
	const [mathResult, setMathResult] = useState<number | null>(null);

	const setRange = <K extends keyof Range>(key: K, v: Range[K]) => {
		setRangeToState((prev) => {
			const newState = {...prev};
			newState[key] = v;
			return newState;
		});
	};

	const func1 = (x: number) => +(x * x).toFixed(3);
	const func2 = (x: number) => (-1) * x * x;

	const onClick = () => {
		if ([step, range.a, range.b].some(el => typeof el !== 'number')) {
			console.error('Ошибка чисел в onClick', step, range.a, range.b)
			return;
		}

		let result: number = 0;

		for (let i = range.b; i >= range.a; i -= step) {
			result += func1(i);
			console.log('i = ', i, func1(i), result);
		}

		setResult(result);
		setMathResult(mathResult);
	};

	return (
		<div>
			<div>
				a: {range.a}
			</div>
			<div>
				<input type={'number'} value={range.a} onChange={(e) => setRange('a', e.target.value ? +e.target.value : 0)}/>
			</div>
			<div>
				b: {range.b}
			</div>
			<div>
				<input type={'number'} value={range.b} onChange={(e) => setRange('a', e.target.value ? +e.target.value : 0)}/>
			</div>
			<div>
				step: {step}
			</div>
			<div>
				<input type={'number'} value={step} onChange={(e) => setStep(() => e.target.value ? +e.target.value : 0)}/>
			</div>

			<button style={{marginTop: 12}} onClick={onClick}>рассчитать</button>

			{typeof result === 'number' && (
				<div>
					Результат: {result}
				</div>
			)}
			{typeof result === 'number' && (
				<div>
					Математический результат: 333
				</div>
			)}
		</div>
	);
};