import {Box, Button, Code, Flex, Text} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';

export const NewtonAndSimpleIterations = () => {
	const [mode, setMode] = useState<'newton' | 'simpleIterations'>('newton');
	const [results, setResults] = useState<number[]>([]);
	const [defaultX, setDefaultX] = useState<number>(1);

	const calcNewtonResults = () => {
		const newDefaultX = 1;
		const newResults: number[] = [];
		const calcNewtonX = (x: number) => {
			const result = x - (Math.pow(2, x) + Math.pow(x, 2) - 2) / (Math.log2(2) * Math.pow(2, x) + 2 * x);
			return +result.toFixed(5);
		};

		let i = 0;

		while (i <= 10000) {
			const currentX = newResults[i - 1] || newDefaultX;
			if (!currentX) break;
			const newCurrentX = calcNewtonX(currentX);
			newResults.push(newCurrentX);
			i++;
			if (newCurrentX === currentX) break;
		}

		setResults(newResults);
		setDefaultX(newDefaultX);
	};

	const calcSimpleIterations = () => {
		const newDefaultX = .5;
		const newResults: number[] = [];
		const calcNewtonX = (x: number) => {
			const result = Math.sqrt(2 - Math.pow(2, x));
			return +result.toFixed(5);
		};

		let i = 0;

		while (i <= 10000) {
			const currentX = newResults[i - 1] || newDefaultX;
			if (!currentX) break;
			const newCurrentX = calcNewtonX(currentX);
			newResults.push(newCurrentX);
			i++;
			if (newCurrentX === currentX) break;
		}

		setResults(newResults);
		setDefaultX(newDefaultX);
	};

	useEffect(() => {
		if (mode === 'simpleIterations') calcSimpleIterations();
		if (mode === 'newton') calcNewtonResults();
	}, [mode]);

	return (
		<div>
			Функция: 2<sup>x</sup> + x<sup>2</sup> - 2 = 0

			<Flex textAlign={'justify'} flexDirection={'column'} justifyContent={'start'} mt={4} mb={4}>
				<Text fontWeight={'bold'} mb={2}>Функция расчета</Text>
				{mode === 'newton' ?
					<>
						<Code>
							{'const calcX = (x: number) => {\n'}
						</Code>
						<Code pl={8}>
							{'\t\tconst result = x - (Math.pow(2, x) + Math.pow(x, 2) - 2) / (Math.log2(2) * Math.pow(2, x) + 2 * x)\n'}
						</Code>
						<Code pl={8}>
							{'\t\treturn +result.toFixed(5);\n'}
						</Code>
						<Code>
							{'\t};'}
						</Code>
					</>
					: <>
						<Code>
							{'const calcX = (x: number) => {\n'}
						</Code>
						<Code pl={8}>
							{'\t\tconst result = Math.sqrt(2 - Math.pow(2, x));\n'}
						</Code>
						<Code pl={8}>
							{'\t\treturn +result.toFixed(5);\n'}
						</Code>
						<Code>
							{'\t};'}
						</Code>
					</>
				}
			</Flex>
			<Flex gap={4} mb={4}>
				<Button onClick={() => setMode('newton')}>
					Расчет по методу Ньютона
				</Button>
				<Button onClick={() => setMode('simpleIterations')}>
					Расчет методом простых итераций
				</Button>
			</Flex>

			<div>
				X<sub>{1}</sub> = {defaultX}
			</div>
			{results.map((value, i) => {
				return (
					<div key={i}>
						X<sub>{i + 2}</sub> = {value}
					</div>
				);
			})}
		</div>
	);
};