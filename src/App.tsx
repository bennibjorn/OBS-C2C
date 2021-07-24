import './App.css';
import Clients from './components/clients';
import { ClientProvider } from './components/clients/clientContext';
import Triggers from './components/triggers';
import theme from '@rebass/preset';
import { ThemeProvider } from '@emotion/react';
import { Box, Flex } from 'rebass';

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<ClientProvider>
				<Flex>
					<Box width={2 / 10}>
						<Clients />
					</Box>
					<Box width={8 / 10}>
						<Triggers />
					</Box>
				</Flex>
			</ClientProvider>
		</ThemeProvider>
	);
};

export default App;
