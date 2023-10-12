import React, {createRef, useEffect, useRef, useState} from 'react';
import {NumEntity} from '../entities/NumEntity';

interface Result extends Row {

}

type Row = NumEntity[];

export const GaussPage = () => {
	// Конечный результат пишем сюда
	const [finallyResult, setFinallyResult] = useState<undefined | Result>();
	//
	// Мутируемый объект, для вычисления
	const result = useRef<Result>([]);
	const setResult = (cb: (prev: Result) => Result) => {
		const v = cb(result.current);
		result.current.length = 0;
		result.current.push(...v);
	};

	// Тут храним значение для кол-ва переменных
	const [schemeLength, setSchemeLength] = useState(4);

	// Устанавливаем дефолтную схему
	const setDefaultScheme = () => {
		setSchemeLength(4);
		result.current = [];
		setFinallyResult(undefined);
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

	// Схема! Описывает нам числа, которые будем считать
	const [scheme, setScheme] = useState<Row[]>(
		[
			[1, -5, -7, 1, -75].map((n) => new NumEntity({numerator: n, denominator: 1})),
			[1, -3, -9, -4, -41].map((n) => new NumEntity({numerator: n, denominator: 1})),
			[-2, 4, 2, 1, 18].map((n) => new NumEntity({numerator: n, denominator: 1})),
			[-9, 9, 5, 3, 29].map((n) => new NumEntity({numerator: n, denominator: 1})),
		]
	);

	// Упрощает две строки
	const simplifyRowsNew = (row1: Row, row2: Row, log = false) => {
		// Индекс с которого начинаем упрощать
		let i = 0;
		// Результат, который мы получим, пишем сюда
		let rowResult1: Row;
		let rowResult2: Row;
		// Первый элемент
		let firstEntity = row1[i];

		// Если у нас первый элемент 0 тогда инкрементим i-шку и меняем первый элемент
		while (firstEntity !== undefined && firstEntity.numerator === 0) {
			firstEntity = row1[++i];
		}

		// TODO: Может возникнуть проблема, если первый элемент 0 в первом массиве.
		// TODO: Нужно отсортировать входящий массив таким образом, чтобы решалось сразу
		// Если у нас первый элемент оказался нулем, то возвращаем массивы как есть
		if (firstEntity.numerator === 0 || firstEntity === undefined) {
			return [row1, row2];
		} else {
			// Иначе делим на значение первого элемента
			rowResult1 = row1.map(el => el.division(firstEntity));
		}

		// Значения, чтобы расчитать коэффициент на который будем умножать
		const ent1 = row2[i];
		const ent2 = rowResult1[i];
		const coef = ent1.division(ent2);

		// Значения для второго массива высчитываются (для каждого элемента) как старое значение минус соответствующий
		// по индексу элемент из нового упрощенного массива, которое умноженное на полученный коэффициент
		rowResult2 = row2.map((el, index) => el.minus(rowResult1[index].multiplication(coef)));
		// Возвращаем два новых массива, которые упростились. Далее мы должны упрощать по новым данным
		return [rowResult1, rowResult2];
	};

	// Функция отыскивает значения для X и пишет в схему
	// Так не очень делать, т.к. функция не чистая, но что поделать
	const checkXFromRow = (row: Row) => {
		// Это значение уравнения без учетов всех иксов
		let rowResult: NumEntity | null = null;
		// Длина элементов
		const rowsLength = row.length - 1;
		// Массив значений иксов (без результата)
		const resultsArr: NumEntity[] = [];

		// Формируем данные
		for (let i = 0; i <= rowsLength; i++) {
			if (i === rowsLength) {
				rowResult = row[i];
			} else {
				resultsArr.push(row[i]);
			}
		}

		// Если что-то пошло не так. Когда нету результата
		if (!rowResult) return;

		// Отфильтровываем массив, получаем массив из ненулевых иксов
		// Если ненулевой икс один, то просто высчитываем значение
		if (resultsArr.filter((el, index) => el.numerator).length === 1) {
			const index = resultsArr.findIndex(el => el.numerator);
			setResult((prev) => {
				const newResult = prev ? [...prev] : [];
				newResult[index] = rowResult!.division(resultsArr[index]);
				return newResult;
			});
			// Если ненулевой икс не один, но при этом все остальные известны, то высчитываем значение неизвестного
		} else if (resultsArr.filter((el, index) => !result.current?.[index] && el.numerator).length === 1) {
			const index = resultsArr.findIndex(el => el.numerator);
			const resultEntity = resultsArr.reduce((prev, current, currentIndex) => {
				if (current.numerator && result.current?.[currentIndex]) {
					return prev.plus(current.multiplication(result.current?.[currentIndex]));
				} else {
					return prev;
				}
			}, new NumEntity({numerator: 0, denominator: 1}));
			setResult((prev) => {
				const newResult = prev ? [...prev] : [];
				newResult[index] = rowResult!.minus(resultEntity)!.division(resultsArr[index]);
				return newResult;
			});
		}
	};

	// Начинаем процесс расчета
	const doProcess = () => {
		result.current = [];
		setFinallyResult(undefined)
		// Упрощенные значения храним тут. Берем изначально данные из схемы
		const simplifiedRows: Row[] = [...scheme];

		// Индекс, который будем инкрементить в цикле
		let i = 0;
		// Продолжаем пока индекс меньше или равен длине массива (минус один)
		while (i <= schemeLength - 1) {
			// Для каждого цикла, создаем цикл, начиная от текущего элемента
			for (let j = i; j <= schemeLength - 2; j++) {
				// Упрощаем!
				const [newRow1, newRow2] = simplifyRowsNew(simplifiedRows[i], simplifiedRows[j + 1]);
				// Перезаписываем новое значение упрощенного текущего массива (можно не делать на каждой итерации, но ладно)
				simplifiedRows[i] = newRow1;
				// Перезаписываем каждый последующий упрощенный пассив
				simplifiedRows[j + 1] = newRow2;
			}
			// Не забываем
			i++;
		}

		// Находим X для каждой строки и колонки (если все значения нулевые)
		simplifiedRows.reverse().forEach(checkXFromRow);
		//for (let j = 0; j <= schemeLength - 1; j++) {
		//	let isZero = false;
		//	for (let k = 0; k++ <= schemeLength - 2; k++) {
		//		if (simplifiedRows[k][j].numerator === 0) {
		//			isZero = true;
		//		} else {
		//			isZero = false;
		//			break;
		//		}
		//	}
		//	if (isZero) {
		//		setResult((prev) => {
		//			const newResult = prev ? [...prev] : [];
		//			newResult[j] = new NumEntity({numerator: 0, denominator: 1});
		//			return newResult;
		//		});
		//	}
		//}
		// Устанавливаем наш результат
		setFinallyResult(result.current);
	};

	useEffect(() => {
		result.current = [];
		setFinallyResult(undefined);
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
		setDefaultScheme();
	}, []);

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

	//const num1 = new NumEntity({numerator: 10, denominator: 1});
	//const num2 = new NumEntity({numerator: 1, denominator: 10});
	//const coef = new NumEntity({numerator: 2, denominator: 1});
	//console.log(num2.multiplication(coef));

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