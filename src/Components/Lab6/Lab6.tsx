import {
	Tab,
	Table,
	TableCaption,
	TableContainer,
	TabList, TabPanel,
	TabPanels,
	Tabs,
	Tbody,
	Td,
	Tfoot,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import React from 'react';
import Lab6One from './Lab6One';
import Lab6Two from './Lab6Two';

const Lab6 = () => {
	return (
		<Tabs variant='enclosed'>
			<TabList>
				<Tab>Task 3.1</Tab>
				<Tab>Task 3.2</Tab>
			</TabList>
			<TabPanels>
				<TabPanel>
					<Lab6One/>
				</TabPanel>
				<TabPanel>
					<Lab6Two/>
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
};

export default Lab6;