import React, {useEffect, useState} from 'react';
import {NumEntity} from '../entities/NumEntity';

interface Result extends Row {

}

type Row = NumEntity[];

export const GaussPage = () => {
	const [finallyResult, setFinallyResult] = useState<undefined | Result>();

	const result: Result = [];
	const setResult = (cb: (prev: Result) => Result) => {
		const v = cb(result);
		result.length = 0;
		result.push(...v);
	};

	const [schemeLength, setSchemeLength] = useState(4);

	const [scheme, setScheme] = useState(
		{
			row1: [1, -5, -7, 1, -75].map((n) => new NumEntity({numerator: n, denominator: 1})),
			row2: [1, -3, -9, -4, -41].map((n) => new NumEntity({numerator: n, denominator: 1})),
			row3: [-2, 4, 2, 1, 18].map((n) => new NumEntity({numerator: n, denominator: 1})),
			row4: [-9, 9, 5, 3, 29].map((n) => new NumEntity({numerator: n, denominator: 1})),
		},
	);
	let processes = false;

	const simplifyRowsNew = (row1: Row, row2: Row, log = false) => {
		let i = 0;
		let rowResult1: Row;
		let rowResult2: Row;
		let firstEntity = row1[i];

		while (firstEntity !== undefined && firstEntity.numerator === 0) {
			firstEntity = row1[++i];
		}

		if (firstEntity.numerator === 0 || firstEntity === undefined) {
			return [row1, row2];
		} else {
			rowResult1 = row1.map(el => el.division(firstEntity));
		}

		const ent1 = row2[i];
		const ent2 = rowResult1[i];

		const coef = ent1.division(ent2);
		rowResult2 = row2.map((el, index) => el.minus(rowResult1[index].multiplication(coef)));
		return [rowResult1, rowResult2];
	};

	useEffect(() => {
		!processes && doProcess();
	}, []);

	const checkXFromRow = (row: Row) => {
		let rowResult: NumEntity | null = null;
		const rowsLength = row.length - 1;
		const resultsArr: NumEntity[] = [];

		for (let i = 0; i <= rowsLength; i++) {
			if (i === rowsLength) {
				rowResult = row[i];
			} else {
				resultsArr.push(row[i]);
			}
		}

		const filteredArr = resultsArr.filter((el, index) => {
			return !result?.[index] && el.numerator;
		});

		// console.log('filteredArr -> ', filteredArr);

		if (!rowResult) return;
		if (resultsArr.filter((el, index) => el.numerator).length === 1) {
			const index = resultsArr.findIndex(el => el.numerator);
			setResult((prev) => {
				const newResult = prev ? [...prev] : [];
				newResult[index] = rowResult!.division(resultsArr[index]);
				return newResult;
			});
		} else if (filteredArr.length === 1) {
			const index = resultsArr.findIndex(el => el.numerator);
			const resultEntity = resultsArr.reduce((prev, current, currentIndex) => {
				if (current.numerator && result?.[currentIndex]) return prev.plus(current.multiplication(result?.[currentIndex]));
				else return prev;
			});
			// console.log('resultEntity', resultEntity);
			setResult((prev) => {
				const newResult = prev ? [...prev] : [];
				// console.log('1231231', newResult[index], index);
				newResult[index] = rowResult!.minus(resultEntity)!.division(resultsArr[index]);
				return newResult;
			});
		}
	};

	const doProcess = () => {
		processes = true;
		const [row1, row2] = simplifyRowsNew(scheme.row1, scheme.row2);
		const [, row3] = simplifyRowsNew(row1, scheme.row3);
		const [, row4] = simplifyRowsNew(row1, scheme.row4);
		const [row22, row33] = simplifyRowsNew(row2, row3);
		const [, row44] = simplifyRowsNew(row2, row4);
		const [row333, row444] = simplifyRowsNew(row33, row44, true);

		checkXFromRow(row444);
		checkXFromRow(row333);
		checkXFromRow(row22);
		checkXFromRow(row1);
		// console.log('RESULT', result);
		setFinallyResult(result);
		console.log(row1, row2, row3, row4);
		console.log(row22, row33, row44);
		console.log(row333, row444);
	};

	const renderRows = () => {
		const rows: JSX.Element[] = [];

		return <div></div>;
	};
	return (
		<div>
			{renderRows()}
			<div>
				x₁ - 5x₂ - 7x₃ + x₄ = -75
			</div>
			<div>
				x₁ - 3x₂ - 9x₃ - 4x₄ = -41
			</div>
			<div>
				-2x₁ + 4x₂ + 2x₃ + 1x₄ = 18
			</div>
			<div>
				-9x₁ + 9x₂ + 5x₃ + 3x₄ = 29
			</div>

			<button onClick={doProcess}>Решить</button>

			{!finallyResult ? null : (
				<div style={{marginTop: 40}}>
					<div>x1: {finallyResult[0]?.value.numerator} / {finallyResult[0]?.value.denominator}</div>
					<div>x2: {finallyResult[1]?.value.numerator} / {finallyResult[1]?.value.denominator}</div>
					<div>x3: {finallyResult[2]?.value.numerator} / {finallyResult[2]?.value.denominator}</div>
					<div>x4: {finallyResult[3]?.value.numerator} / {finallyResult[3]?.value.denominator}</div>
				</div>
			)}
		</div>
	);
};