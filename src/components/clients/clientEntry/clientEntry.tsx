import { FC } from 'react';
import { Flex, Box, Button, Text } from 'rebass';
import { useClients } from '../clientContext';

const ClientEntry: FC<{ name: string }> = ({ name }) => {
	const { clients, setClients } = useClients();

	const disconnect = (clientName: string) => {
		const clientsNew = clients;

		clients[clientName].ws.disconnect();
		delete clientsNew[clientName];
		setClients(clientsNew);
	};

	return (
		<Flex
			backgroundColor='#ccc'
			style={{ border: '1px solid black' }}
			flexDirection='column'
			justifyContent='center'
			alignItems='center'
			height='250px'
			width='20%'
			key={name}
		>
			<Box width='20px' height='20px' backgroundColor='green' style={{ borderRadius: '20px' }} />
			<Text pt={2}>{name}</Text>
			<Button backgroundColor='red' onClick={() => disconnect(name)}>
				X
			</Button>
		</Flex>
	);
};

export default ClientEntry;
