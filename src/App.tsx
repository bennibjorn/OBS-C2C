import './App.css';
import Clients from './components/clients';
import { ClientProvider } from './components/clients/clientContext';
import Triggers from './components/triggers';
import theme from '@rebass/preset';
import { ThemeProvider } from '@emotion/react';
import { Box, Flex } from 'rebass';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
				<ToastContainer />
			</ClientProvider>
		</ThemeProvider>
	);
};

export default App;
