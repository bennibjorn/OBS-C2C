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
				<Flex flexDirection='column'>
					<Box height='250px' mb={2}>
						<Clients />
					</Box>
					<Box p={2}>
						<Triggers />
					</Box>
				</Flex>
				<ToastContainer />
			</ClientProvider>
		</ThemeProvider>
	);
};

export default App;
