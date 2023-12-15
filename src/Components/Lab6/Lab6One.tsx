import {Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr} from '@chakra-ui/react';
import React from 'react';

const Lab6One = () => {
	const calcLab31 = (x: number) => Math.sqrt(x);
	const highEx = 3;
	const exesA: [number, number, number, number] = [0, 1.7, 3.4, 5.1];
	const exesB: [number, number, number, number] = [0, 1.7, 4.0, 5.1];
	const calcWByIndex = (exes: [number, number, number, number], index: number) => {
		let result: number | null = null;

		for (let i = 0; i <= 3; i++) {
			if (i !== index) {
				if (result === null) result = exes[index] - exes[i];
				else result *= exes[index] - exes[i];
			}
		}

		return result ?? 0;
	};
	const calcW0 = () => (exesA[0] - exesA[1]) * (exesA[0] - exesA[2]) * (exesA[0] - exesA[3]);
	const calcW1 = () => (exesA[1] - exesA[0]) * (exesA[1] - exesA[2]) * (exesA[1] - exesA[3]);
	const calcW2 = () => (exesA[2] - exesA[0]) * (exesA[2] - exesA[1]) * (exesA[2] - exesA[3]);
	const calcW3 = () => (exesA[3] - exesA[0]) * (exesA[3] - exesA[1]) * (exesA[3] - exesA[2]);
	const calcFunctionsByIndex = [calcW0, calcW1, calcW2, calcW3];

	const renderNewtonTab = () => {

		const tresA: React.ReactNode[] = [];
		const tresB: React.ReactNode[] = [];

		const lagr3A: ((exValue: number, index: number) => number)[] = [];
		const lagr3B: ((exValue: number, index: number) => number)[] = [];

		for (let i = 0; i <= 3; i++) {
			const ex = exesA[i];
			const fi = calcLab31(ex);
			const wi = +(calcWByIndex(exesA, i)).toFixed(3);
			const fiDevisionToWi = (fi/wi).toFixed(5);

			lagr3A.push((exValue: number, index: number) => {
				let result: null | number = null;
				for (let i = 0; i <= 3; i++) {
					if (i !== index) {
						if (result === null) result = exValue - exesA[i];
						else result *= exValue - exesA[i];
					}
				}
				if (result === null) return 0;
				return +fiDevisionToWi * result;
			});
			tresA.push(
				<Tr key={i}>
					<Td>{i}</Td>
					<Td>{ex}</Td>
					<Td>{fi.toFixed(5)}</Td>
					<Td>{wi}</Td>
					<Td>{fiDevisionToWi}</Td>
					<Td>{(highEx - ex).toFixed(1)}</Td>
				</Tr>
			);
		}

		for (let i = 0; i <= 3; i++) {
			const ex = exesB[i];
			const fi = calcLab31(ex);
			const wi = +(calcWByIndex(exesB, i)).toFixed(3);
			const fiDevisionToWi = (fi/wi).toFixed(5);
			lagr3B.push((exValue: number, index: number) => {
				let result: null | number = null;
				for (let i = 0; i <= 3; i++) {
					if (i !== index) {
						if (result === null) result = exValue - exesA[i];
						else result *= exValue - exesA[i];
					}
				}
				if (result === null) return 0;
				return +fiDevisionToWi * result;
			});
			tresB.push(
				<Tr key={i}>
					<Td>{i}</Td>
					<Td>{ex}</Td>
					<Td>{fi.toFixed(5)}</Td>
					<Td>{wi}</Td>
					<Td>{fiDevisionToWi}</Td>
					<Td>{(highEx - ex).toFixed(1)}</Td>
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

		const renderTbody2 = () => {
			return (
				<Tbody>
					{tresB}
				</Tbody>
			);
		};

		const renderTfoot2 = () => {
			const l3Value = lagr3B.length
				? lagr3B.reduce((previousValue, currentValue, index) => currentValue(3, index) + previousValue, 0)
					.toFixed(5)
				: null;
			const fHigh = calcLab31(3);

			return (
				<Tfoot>
					<Tr>
						<Th>L3(x)</Th>
						<Th>{l3Value}</Th>
					</Tr>
					<Tr>
						<Th>ΔL3(x)</Th>
						<Th>{l3Value !== null ? Math.abs((+l3Value - fHigh)).toFixed(5) : null}</Th>
					</Tr>
				</Tfoot>
			);
		};

		const renderTfoot1 = () => {
			const l3Value = lagr3A.length
				? lagr3A.reduce((previousValue, currentValue, index) => currentValue(3, index) + previousValue, 0)
					.toFixed(5)
				: null;
			const fHigh = calcLab31(3);

			return (
				<Tfoot>
					<Tr>
						<Th>L3(x)</Th>
						<Th>{l3Value}</Th>
					</Tr>
					<Tr>
						<Th>ΔL3(x)</Th>
						<Th>{l3Value !== null ? Math.abs((+l3Value - fHigh)).toFixed(5) : null}</Th>
					</Tr>
				</Tfoot>
			);
		};

		const renderTables = () => (
			<div>
				<TableContainer>
					<Table variant="simple">
						<TableCaption>Таблица с расчетами варианта A</TableCaption>
						<Thead>
							<Tr>
								<Th>i</Th>
								<Th>x<sub>i</sub></Th>
								<Th>f<sub>i</sub></Th>
								<Th>W<sup>'</sup><sub>4</sub>(x<sub>i</sub>)</Th>
								<Th>f<sub>i</sub> / W<sup>'</sup><sub>4</sub>(x<sub>i</sub>)</Th>
								<Th>X<sup>*</sup> - x<sub>i</sub></Th>
							</Tr>
						</Thead>
						{renderTbody()}
						{renderTfoot1()}
					</Table>
				</TableContainer>

				<TableContainer>
					<Table variant="simple">
						<TableCaption>Таблица с расчетами варианта B</TableCaption>
						<Thead>
							<Tr>
								<Th>i</Th>
								<Th>x<sub>i</sub></Th>
								<Th>f<sub>i</sub></Th>
								<Th>W<sup>'</sup><sub>4</sub>(x<sub>i</sub>)</Th>
								<Th>f<sub>i</sub> / W<sup>'</sup><sub>4</sub>(x<sub>i</sub>)</Th>
								<Th>X<sup>*</sup> - x<sub>i</sub></Th>
							</Tr>
						</Thead>
						{renderTbody2()}
						{renderTfoot2()}
					</Table>
				</TableContainer>
			</div>
		);

		return (
			<div>
				<div>
					Функция: y = &#x221A;x
				</div>
				<div>
					a: 0, 1.7, 3.4, 5.1
				</div>
				<div>
					b: 0, 1.7, 4.0, 5.1
				</div>
				<div>
					X<sup>*</sup>: 3.0
				</div>

				{renderTables()}
			</div>
		);
	}
	return renderNewtonTab();
};

export default Lab6One;