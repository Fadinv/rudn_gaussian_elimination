import React from 'react';
import './App.css';
import {GaussPage} from './Components/GaussPage';
import Lab5 from './Components/Lab5';
import {NewtonAndSimpleIterations} from './Components/NewtonAndSimpleIterations';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {SimpleIterationsPage, SimpleIterationsPageProps} from './Components/SimpleIterations';
import {NumEntity} from './entities/NumEntity';
import Lab6 from './Components/Lab6/Lab6';


type AppPageType = 'gauss' | 'newton';

function App() {
	return (
		<div className="App">
			<Tabs defaultIndex={5}>
				<TabList>
					<Tab>Лаба 1</Tab>
					<Tab>Лаба 2</Tab>
					<Tab>Лаба 3</Tab>
					<Tab>Лаба 4</Tab>
					<Tab>Лаба 5</Tab>
					<Tab>Лаба 6</Tab>
				</TabList>

				<TabPanels>
					<TabPanel>
						<GaussPage/>
					</TabPanel>
					<TabPanel>
						<GaussPage
							defaultScheme={[
								[15, 8, 0, 0, 0, 92].map((n) => new NumEntity({numerator: n, denominator: 1})),
								[2, -15, 4, 0, 0, -84].map((n) => new NumEntity({numerator: n, denominator: 1})),
								[0, 4, 11, 5, 0, -77].map((n) => new NumEntity({numerator: n, denominator: 1})),
								[0, 0, -3, 16, -7, 15].map((n) => new NumEntity({numerator: n, denominator: 1})),
								[0, 0, 0, 3, 8, -11].map((n) => new NumEntity({numerator: n, denominator: 1})),
							]}
						/>
					</TabPanel>
					<TabPanel>
						<SimpleIterationsPage/>
					</TabPanel>
					<TabPanel>
						<NewtonAndSimpleIterations/>
					</TabPanel>
					<TabPanel>
						<Lab5/>
					</TabPanel>
					<TabPanel>
						<Lab6/>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</div>
	);
}

export default App;
