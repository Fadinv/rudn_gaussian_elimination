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

	const setDefaultScheme = () => {
		setSchemeLength(4);
		window.setTimeout(() => {
			setScheme(
				[
					[1, -5, -7, 1, -75].map((n) => new NumEntity({numerator: n, denominator: 1})),
					[1, -3, -9, -4, -41].map((n) => new NumEntity({numerator: n, denominator: 1})),
					[-2, 4, 2, 1, 18].map((n) => new NumEntity({numerator: n, denominator: 1})),
					[-9, 9, 5, 3, 29].map((n) => new NumEntity({numerator: n, denominator: 1})),
				]
			);
		});
	};

	const [scheme, setScheme] = useState<Row[]>(
		[
			[1, -5, -7, 1, -75].map((n) => new NumEntity({numerator: n, denominator: 1})),
			[1, -3, -9, -4, -41].map((n) => new NumEntity({numerator: n, denominator: 1})),
			[-2, 4, 2, 1, 18].map((n) => new NumEntity({numerator: n, denominator: 1})),
			[-9, 9, 5, 3, 29].map((n) => new NumEntity({numerator: n, denominator: 1})),
		]
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
		setScheme(prev => {
			const newScheme = [];
			for (let i = 0; i <= schemeLength - 1; i++) {
				const row: Row = [];
				for (let j = 0; j <= schemeLength; j++) {
					row.push(new NumEntity({numerator: 0, denominator: 1, isEmpty: true}));
				}
				newScheme.push(row);
			}

			return newScheme;
		});
	}, [schemeLength]);

	useEffect(() => {
		// !processes && doProcess();
		setDefaultScheme();
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

		const filteredArr = resultsArr.filter((el, index) => !result?.[index] && el.numerator);

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
			setResult((prev) => {
				const newResult = prev ? [...prev] : [];
				newResult[index] = rowResult!.minus(resultEntity)!.division(resultsArr[index]);
				return newResult;
			});
		}
	};

	const doProcess = () => {
		processes = true;
		const simplifiedRows: Row[] = [...scheme];

		let i = 0;
		while (i <= schemeLength - 1) {
			for (let j = i; j <= schemeLength - 2; j++) {
				const [newRow1, newRow2] = simplifyRowsNew(simplifiedRows[i], simplifiedRows[j + 1]);
				simplifiedRows[i] = newRow1;
				simplifiedRows[j + 1] = newRow2;
			}
			i++;
		}

		simplifiedRows.reverse().forEach(checkXFromRow);

		setFinallyResult(result);
	};

	const renderRows = () => {
		const rows: React.ReactNode[] = [];
		scheme.forEach((r, rowIndex) => {
			const rowInnerElements: React.ReactNode[] = [];
			r.map((el, index) => {
				if (index === r.length - 1) {
					rowInnerElements.push(
						<span key={'last_' + index} style={{display: 'flex', gap: 4}}>
							=
						<input style={{width: 48}} type={'number'} value={el.isEmpty ? '' : el.numerator / el.denominator} onChange={e => {
							if (!e.target.value) {
								setScheme((prev) => {
									const newScheme = [...prev];
									newScheme[rowIndex][index] = new NumEntity({isEmpty: true, numerator: 0, denominator: 1});
									return newScheme;
								});
							}
							if ((+e.target.value).toFixed() === e.target.value) {
								setScheme((prev) => {
									const newScheme = [...prev];
									newScheme[rowIndex][index] = new NumEntity({numerator: e.target.value ? +e.target.value : 0, denominator: 1});
									return newScheme;
								});
							}
						}}/>
					</span>
					);
				} else {
					rowInnerElements.push(
						<span key={'x_' + index} style={{display: 'flex', gap: 4}}>
						<input style={{width: 48}} type={'number'} value={el.isEmpty ? '' : el.numerator / el.denominator} onChange={e => {
							if (!e.target.value) {
								setScheme((prev) => {
									const newScheme = [...prev];
									newScheme[rowIndex][index] = new NumEntity({isEmpty: true, numerator: 0, denominator: 1});
									return newScheme;
								});
							}
							if ((+e.target.value).toFixed() === e.target.value) {
								setScheme((prev) => {
									const newScheme = [...prev];
									newScheme[rowIndex][index] = new NumEntity({numerator: e.target.value ? +e.target.value : 0, denominator: 1});
									return newScheme;
								});
							}
						}}/>
						<span>x<sub>{index + 1}</sub></span>
					</span>
					);
				}
			});
			rows.push(<div key={'row_' + rowIndex} style={{display: 'flex', gap: 8, margin: '0 auto'}}>{rowInnerElements}</div>);
		});

		return <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 32}}>{rows}</div>;
	};

	const processButtonIsDisabled = scheme.some(row => row.some(ent => ent.isEmpty));

	return (
		<div>
			<input style={{marginTop: 12}} type={'number'} min={2} max={6} value={schemeLength} onChange={(e) => setSchemeLength(+e.target.value)}/>
			{renderRows()}

			<div style={{display: 'flex', gap: 8, justifyContent: 'center'}}>
				<button onClick={setDefaultScheme}>Установить дефолтную схему</button>
				<button disabled={processButtonIsDisabled} onClick={doProcess}>Решить</button>
			</div>

			{(!finallyResult || finallyResult.some(el => !el)) ? null : (
				<div style={{marginTop: 40}}>
					{finallyResult.map((el, index) => {
						if (el.value.denominator === 1) return <div key={index}>X<sub>{index + 1}</sub> = {el.value.numerator}</div>
						else return <div key={index}>X<sub>{index + 1}</sub> = {el.value.numerator} / {el.value.denominator}</div>
					})}
				</div>
			)}
		</div>
	);
};