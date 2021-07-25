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
			flexDirection='column'
			justifyContent='center'
			alignItems='center'
			height='150px'
			width='150px'
			key={name}
		>
			<Box width='10px' height='10px' backgroundColor='green' style={{ borderRadius: '8px' }} />
			<Text>{name}</Text>
			<Button backgroundColor='red' onClick={() => disconnect(name)}>
				Disconnect
			</Button>
		</Flex>
	);
};

export default ClientEntry;
