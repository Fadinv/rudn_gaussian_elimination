import {Button, Flex, Input, Spinner, Text} from '@chakra-ui/react';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {NumEntity} from '../entities/NumEntity';

interface Result extends Row {

}

type Row = NumEntity[];

export interface SimpleIterationsPageProps {
	defaultScheme?: Row[];
}

interface CheckedRow {
	value: NumEntity;
	sum: NumEntity;
	checked: boolean;
}

interface Approximation {
	value: NumEntity;
	index: number; // index для обозначения X
	k: number; // Номер приближения
}

export const SimpleIterationsPage: React.FC<SimpleIterationsPageProps> = (props) => {
	// Конечный результат пишем сюда
	const [, setVersion] = useState<number>(0);
	const update = () => setVersion(prev => ++prev);
	const [loading, setLoading] = useState(false);

	// Мутируемый объект, для вычисления
	const checkedRows = useRef<CheckedRow[]>([]);
	const setCheckedRows = (cb: (prev: CheckedRow[]) => CheckedRow[]) => {
		const v = cb(checkedRows.current);
		checkedRows.current.length = 0;
		checkedRows.current.push(...v);
	};

	// Мутируемый объект, для вычисления
	const zeroApproximation = useRef<Approximation[]>([]);
	const setZeroApproximation = (cb: (prev: Approximation[]) => Approximation[]) => {
		const v = cb(zeroApproximation.current);
		zeroApproximation.current.length = 0;
		zeroApproximation.current.push(...v);
	};

	// Мутируемый объект, для вычисления
	const approximations = useRef<Approximation[][]>([]);
	const setApproximations = (cb: (prev: Approximation[][]) => Approximation[][]) => {
		const v = cb(approximations.current);
		approximations.current.length = 0;
		approximations.current.push(...v);
	};

	// Тут храним значение для кол-ва переменных
	const [schemeLength, setSchemeLength] = useState<undefined | number>(props?.defaultScheme ? props.defaultScheme.length : 4);
	const [infelicity, setInfelicity] = useState<undefined | number>(0.01);

	const setSchemeLengthFunc = useCallback((value: number | undefined) => {
		let result: number | undefined;
		if (!value) {
		} else if (value < 2) {
			result = 2;
		} else if (value > 6) {
			result = 6;
		} else {
			result = value;
		}
		setSchemeLength(result);
	}, [schemeLength]);

	// Устанавливаем дефолтную схему
	const setDefaultScheme = () => {
		setSchemeLength(props?.defaultScheme ? props.defaultScheme.length : 4);
		window.setTimeout(() => {
			setScheme(
				props?.defaultScheme
					? props.defaultScheme
					: [
						[29, 8, 9, -9, 197].map((n) => new NumEntity({numerator: n, denominator: 1})),
						[-7, -25, 0, 9, -226].map((n) => new NumEntity({numerator: n, denominator: 1})),
						[1, 6, 16, -2, -95].map((n) => new NumEntity({numerator: n, denominator: 1})),
						[-7, 4, -2, 17, -58].map((n) => new NumEntity({numerator: n, denominator: 1})),
					]
			);
		});
	};

	// Схема! Описывает нам числа, которые будем считать
	const [scheme, setScheme] = useState<Row[]>(
		[
			[29, 8, 9, -9, 197].map((n) => new NumEntity({numerator: n, denominator: 1})),
			[-7, -25, 0, 9, -226].map((n) => new NumEntity({numerator: n, denominator: 1})),
			[1, 6, 16, -2, -95].map((n) => new NumEntity({numerator: n, denominator: 1})),
			[-7, 4, -2, 17, -58].map((n) => new NumEntity({numerator: n, denominator: 1})),
		]
	);

	const checkAbleToSolve = () => {
		const checkedRows: CheckedRow[] = [];

		let checked = true;

		scheme.forEach((row, i) => {
			const currentElement = row[i];
			let sum = new NumEntity({numerator: 0, denominator: 1});
			row.forEach((el, innerIndex) => {
				if (innerIndex !== i && row.length - 1 !== innerIndex) sum = sum.plus(el.moduleValue);
			});
			if (!currentElement.moduleValue.isBiggerThen(sum)) {
				checkedRows.push({checked: false, value: currentElement, sum});
			} else {
				checkedRows.push({checked: true, value: currentElement, sum});
			}
		});

		return {checked, checkedRows};
	};

	const calcZeroApproximation = () => {
		const approximation: Approximation[] = [];

		scheme.forEach((row, i) => {
			if (i === row.length - 1) return;
			const currentElement = row[i];
			const lastElement = row[row.length - 1];
			// console.log(lastElement, currentElement, lastElement.division(currentElement));
			approximation.push({value: lastElement.division(currentElement), k: 0, index: i});
		});

		return approximation;
	};

	const checkInfelicity = (appr1: Approximation[], appr2: Approximation[]) => {
		const infelicities: number[] = [];
		appr1.forEach((el, index) => {
			const res = el.value.minus(appr2[index].value).division(el.value, 4);
			infelicities.push(+(res.numerator / res.denominator).toFixed(4));
		});
		return infelicities.every(num => num <= (infelicity ?? 0.01));
	};

	const calculateApproximations = () => {
		const approximations: Approximation[][] = [];

		const calculateFunctions: ((log: boolean, ...params: NumEntity[]) => NumEntity)[] = [];

		const calcF = (log: boolean, row: Row, mainIndex: number): (log: boolean, ...params: NumEntity[]) => NumEntity => {
			return (log: boolean, ...params: NumEntity[]) => {
				if (log) {
					// console.log('mainIndex -> ', mainIndex);
					// console.log('params -> ', params);
					// console.log('row -> ', row);
				}
				if (params.length !== row.length - 1) {
					throw new Error('Кол-во параметров не соответствует значениям');
				}

				const currentElement = row[mainIndex];
				const lastElement = row[row.length - 1];

				let sum = new NumEntity({numerator: 0, denominator: 1});

				sum = sum.plus(lastElement);

				for (let i = 0; i < row.length - 1; i++) {
					if (i === mainIndex) {
						continue;
					} else {
						sum = sum.minus(row[i].multiplication(params[i]));
					}
				}

				return sum.division(currentElement, 4);
			};
		};

		scheme.forEach((row, i) => calculateFunctions.push(calcF(true, row, i)));

		// Начинаем с первого приближения
		let k = 1;

		let processing = true;

		while (processing) {
			if (approximations.length) {
				const nextApproximations: Approximation[] = [];
				for (let mainIndex = 0; mainIndex <= approximations[k - 2].length - 1; mainIndex++) {
					const value = calculateFunctions[mainIndex](true, ...approximations[k - 2].map(el => el.value));
					nextApproximations.push({value, index: mainIndex, k})
				}
				approximations.push(nextApproximations);
			} else {
				const firstApproximations: Approximation[] = [];
				for (let mainIndex = 0; mainIndex <= zeroApproximation.current.length - 1; mainIndex++) {
					const value = calculateFunctions[mainIndex](true, ...zeroApproximation.current.map(el => el.value));
					firstApproximations.push({value, index: mainIndex, k})
				}
				approximations.push(firstApproximations);
			}
			const checked = checkInfelicity(approximations[k - 1], approximations[k - 2] || zeroApproximation.current);
			k++;
			processing = !checked;
		}

		return approximations;
	};

	// Начинаем процесс расчета
	const doProcess = () => {
		if (!schemeLength) return;
		setCheckedRows(() => []);

		const {checked, checkedRows} = checkAbleToSolve();

		setCheckedRows(() => checkedRows);

		update();

		const zeroApproximation = calcZeroApproximation();
		// console.log('zeroApproximationzeroApproximationzeroApproximationzeroApproximation', zeroApproximation)
		setZeroApproximation(() => zeroApproximation);

		setLoading(true);

		window.setTimeout(() => {
			const approximations = calculateApproximations();
			setApproximations(() => approximations);
			setLoading(false);
		});
	};

	useEffect(() => {
		if (!schemeLength) return;
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
		if (!schemeLength) return null;
		const rows: React.ReactNode[] = [];
		scheme.forEach((r, rowIndex) => {
			const rowInnerElements: React.ReactNode[] = [];
			r.map((el, index) => {
				if (index === r.length - 1) {
					rowInnerElements.push(
						<span key={'last_' + index} style={{display: 'flex', gap: 4}}>
							=
						<Input htmlSize={2} size={'sm'} style={{width: 64}} type={'number'} value={el.isEmpty ? '' : el.numerator / el.denominator} onChange={e => {
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
						<Input size={'sm'} htmlSize={2} style={{width: 64}} type={'number'} value={el.isEmpty ? '' : el.numerator / el.denominator} onChange={e => {
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

	const processButtonIsDisabled = !schemeLength || scheme.some(row => row.some(ent => ent.isEmpty));

	//const num1 = new NumEntity({numerator: 10, denominator: 1});
	//const num2 = new NumEntity({numerator: 1, denominator: 10});
	//const coef = new NumEntity({numerator: 2, denominator: 1});
	//console.log(num2.multiplication(coef));

	const renderCheckedRows = () => {
		if (!checkedRows.current.length) return null;
		const allChecked = checkedRows.current.every(el => el.checked);

		return (
			<Flex flexDirection={'column'} mt={4} justifyContent={'center'} alignItems={'center'}>
				<Text fontWeight={'700'}>
					Проверка на возможность решения
				</Text>
				{checkedRows.current.map((el, index) => {
					return (
						<Flex fontWeight={'600'} color={el.checked ? undefined : 'red.500'} gap={2} key={index}>
							{el.value.denominator === 1 ? Math.abs(el.value.numerator) : `${Math.abs(el.value.numerator)}/${el.value.denominator}`}
							<span>{'>'}</span>
							{el.sum.denominator === 1 ? Math.abs(el.sum.numerator) : `${Math.abs(el.sum.numerator)}/${el.sum.denominator}`}
						</Flex>
					);
				})}
				<Text fontWeight={'700'} color={allChecked ? 'green.500' : 'red.500'}>
					{allChecked ? 'Проверка пройдена' : 'Проверка НЕ ПРОЙДЕНА'}
				</Text>
			</Flex>
		);
	}

	const renderZeroApproximation = () => {
		if (!zeroApproximation.current.length) return null;
		return (
			<Flex flexDirection={'column'} mt={4} justifyContent={'center'} alignItems={'center'}>
				<Text fontWeight={'700'}>
					Нулевое приближение
				</Text>
				{zeroApproximation.current.map((el, index) => {
					return (
						<Flex fontWeight={'600'} color={el ? undefined : 'red.500'} gap={2} key={index}>
							X{el.index + 1}
							<span>{'='}</span>
							{el.value.denominator === 1 ? el.value.numerator : `${el.value.numerator}/${el.value.denominator}`}
						</Flex>
					);
				})}
			</Flex>
		);
	}

	const renderAllApproximations = () => {
		if (!approximations.current.length) return null;
		return (
			<Flex flexDirection={'column'} mt={4} justifyContent={'center'} alignItems={'center'}>
				{approximations.current.map((apprx, index) => {
					return (
						<Flex mt={4} key={index} flexDirection={'column'}>
							<Text fontWeight={'700'}>
								{apprx[0].k} приближение
							</Text>
							{apprx.map((el, innerIndex) => {
								return (
									<Flex fontWeight={'600'} color={el ? undefined : 'red.500'} gap={2} key={innerIndex}>
										X{el.index + 1}
										<span>{'='}</span>
										{el.value.denominator === 1 ? el.value.numerator : `${(el.value.numerator / el.value.denominator).toFixed(4)}`}
									</Flex>
								);
							})}
						</Flex>
					);
				})}
			</Flex>
		);
	}

	return (
		<Flex flexDir={'column'}>
			<Flex alignItems={'center'} m={'0 auto'}>
				<Text style={{marginRight: 4}}>Кол-во переменных</Text>
				<Input
					width={'auto'} htmlSize={2}
					size={'sm'}
					type={'number'} min={2} max={6}
					value={schemeLength}
					onChange={(e) => setSchemeLengthFunc(!e.target.value ? undefined : +e.target.value)}
				/>
			</Flex>
			<Flex alignItems={'center'} m={'0 auto'}>
				<Text style={{marginRight: 4}}>Погрешность</Text>
				<Input
					width={'auto'}
					htmlSize={2}
					size={'sm'}
					type={'number'}
					value={infelicity}
					onChange={(e) => setInfelicity(!e.target.value ? undefined : +e.target.value)}
				/>
			</Flex>
			{renderRows()}

			<div style={{display: 'flex', gap: 8, justifyContent: 'center'}}>
				<Button onClick={setDefaultScheme}>Установить дефолтную схему</Button>
				<Button colorScheme={'green'} disabled={processButtonIsDisabled} onClick={doProcess}>Решить</Button>
			</div>

			{renderCheckedRows()}
			{renderZeroApproximation()}
			{loading ? (
				<Flex margin={'24px auto'} alignItems={'center'} justifyContent={'center'}>
					Проводим расчеты...
					<Spinner
						thickness='4px'
						speed='0.65s'
						emptyColor='gray.200'
						color='blue.500'
						size='xl'
						marginInline={'0 auto'}
					/>
				</Flex>
			) : null}
			{renderAllApproximations()}
		</Flex>
	);
};