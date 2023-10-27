import React from 'react';
import './App.css';
import {GaussPage} from './Components/GaussPage';
import {NewtonAndSimpleIterations} from './Components/NewtonAndSimpleIterations';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'


type AppPageType = 'gauss' | 'newton';

function App() {
	return (
		<div className="App">
			<Tabs >
				<TabList>
					<Tab>Лаба 1</Tab>
					<Tab>Лаба 2</Tab>
					<Tab>Лаба 3</Tab>
					<Tab>Лаба 4</Tab>
				</TabList>

				<TabPanels>
					<TabPanel>
						<GaussPage/>
					</TabPanel>
					<TabPanel>
						<p>two!</p>
					</TabPanel>
					<TabPanel>
						<p>three!</p>
					</TabPanel>
					<TabPanel>
						<NewtonAndSimpleIterations/>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</div>
	);
}

export default App;
