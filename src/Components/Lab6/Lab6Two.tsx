import {Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr} from '@chakra-ui/react';
import React, {useEffect} from 'react';

const Lab6Two = () => {
	const exes = [0.0, 1.7, 3.4, 5.1, 6.8];
	const funcValues = [0.0, 1.3038, 1.8439, 2.2583, 2.6077];
	const cValues = [0, 0, 0.20631, -0.03248, 0.18947]; // Посчитаны вручную

	let mounted = false;

	const calcValues = () => {
	};

	useEffect(() => {
		if (mounted) return;
		mounted = true;
		calcValues();
	}, []);

	const calcHByIndex = (index: number) => {
		if (index === 0) return 0;
		return exes[index] - exes[index - 1];
	};

	const renderSystem = () => {
		const systemElements: React.ReactNode[] = [];

		for (let i = 0; i <= 3; i++) {
			if (i) {
				if (i === 1) {
					const h1 = calcHByIndex(1);
					const h2 = calcHByIndex(2);
					const f1 = funcValues[1];
					const f2 = funcValues[2];
					const f0 = funcValues[0];
					systemElements.push(
						<div key={i}>
							{2 * (h1 + h2)}c<sub>2</sub> + {h2}c<sub>3</sub> = {(3 * ((f2 - f1) / h2 - (f1 - f0) / h1)).toFixed(5)}
						</div>
					)
				}
				if (i === 2) {
					const h2 = calcHByIndex(2);
					const h3 = calcHByIndex(3);
					const f1 = funcValues[1];
					const f2 = funcValues[2];
					const f3 = funcValues[3];
					systemElements.push(
						<div key={i}>
							{h2}c<sub>2</sub> + {2 * +(h2 + h3).toFixed(3)}c<sub>3</sub> + {+h3.toFixed(3)}c<sub>4</sub> = {(3 * ((f3 - f2) / h3 - (f2 - f1) / h2)).toFixed(5)}
						</div>
					)
				}

				if (i === 3) {
					const h3 = calcHByIndex(3);
					const h4 = calcHByIndex(4);
					const f2 = funcValues[i + 1];
					const f3 = funcValues[3];
					const f4 = funcValues[4];
					systemElements.push(
						<div key={i}>
							{(+h3.toFixed(3))}c<sub>3</sub> + {2 * +(h3 + h4).toFixed(3)}c<sub>4</sub> = {(3 * ((f4 - f3) / h4 - (f3 - f2) / h3)).toFixed(5)}
						</div>
					)
				}
			}
		}

		return systemElements;
	};

	const tresA: React.ReactNode[] = [];

	for (let i = 1; i <= 4; i++) {
		const fI = funcValues[i];
		const fIMinus1 = funcValues[i - 1];
		const hI = calcHByIndex(i);
		const bI = +(hI !== 0 ? (fI - fIMinus1) / hI - (2 / 3) * hI * (cValues[i]) : 0).toFixed(5);
		const dI = +(- 3 * cValues[i] / (3 * hI)).toFixed(5);
		tresA.push(
			<Tr key={i}>
				<Td>{i}</Td>
				<Td>[{exes[i - 1]}, {exes[i]}]</Td>
				<Td>{funcValues[i]}</Td>
				<Td>{bI}</Td>
				<Td>{cValues[i]}</Td>
				<Td>{dI}</Td>
			</Tr>
		);
	}

	const renderTbody = () => {
		return (
			<Tbody>
				{tresA}
			</Tbody>
		);
	};

	const renderTable = () => {
		return (
			<TableContainer>
				<Table variant="simple">
					<TableCaption>Таблица с расчетами</TableCaption>
					<Thead>
						<Tr>
							<Th>i</Th>
							<Th>[x<sub>i - 1</sub>, x<sub>i</sub>]</Th>
							<Th>a<sub>i</sub></Th>
							<Th>b<sub>i</sub></Th>
							<Th>c<sub>i</sub></Th>
							<Th>d<sub>i</sub></Th>
						</Tr>
					</Thead>
					{renderTbody()}
				</Table>
			</TableContainer>
		);
	};

	return (
		<div>
			<div>
				i: 0, 1, 2, 3
			</div>
			<div>
				x<sub>i</sub>: {JSON.stringify(exes)}
			</div>
			<div>
				f<sub>i</sub>: {JSON.stringify(funcValues)}
			</div>
			<div>
				X<sup>*</sup> = 3.0
			</div>

			<div>Запишем систему уравнений</div>
			<div>
				{renderSystem()}
			</div>

			<div>
				{renderTable()}
			</div>

			<div>
				Найдем значения в точке X = 3, принадлежащая отрезку [1.7, 3.4]
			</div>
			<div>
				f(x) = 1.8439 + 0.08389(x - 1) + 0.20631(x - 1)<sup>2</sup> - 0.12136(x - 1)<sup>3</sup>
			</div>
			<div>
				f(3) = 1.86604
			</div>
		</div>
	);
};

export default Lab6Two;