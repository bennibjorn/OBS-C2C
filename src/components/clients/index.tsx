import ObsWebSocket from 'obs-websocket-js';
import { useEffect, useState } from 'react';
import { useClients } from './clientContext';
import { Label, Input, Select, Textarea, Radio, Checkbox } from '@rebass/forms';
import { Box, Button, Flex, Text } from 'rebass';

const ClientForm = () => {
	const { clients, setClients } = useClients();
	const [newClientName, setNewClientName] = useState<string>('');
	const [newClientAddress, setNewClientAddress] = useState<string>('');
	const [newClientPassword, setNewClientPassword] = useState<string>('');
	const onNameChange = (name: string) => {
		setNewClientName(name);
	};
	const onAddressChange = (address: string) => {
		setNewClientAddress(address);
	};
	const onPasswordChange = (password: string) => {
		setNewClientPassword(password);
	};
	const resetForm = () => {
		setNewClientName('');
		setNewClientAddress('');
		setNewClientPassword('');
		// setShowForm(false);
	};
	const addClient = async () => {
		const clientsNew = clients;
		const ws = new ObsWebSocket();
		ws.connect({ address: newClientAddress, password: newClientPassword, secure: false });
		ws.on('ConnectionClosed', (data) => {
			console.log(newClientName, 'disconnected', data);
		});
		ws.on('ConnectionOpened', async () => {
			clientsNew[newClientName] = {
				ws: ws,
				address: newClientAddress,
				scenes: [],
				authenticated: true,
			};
			setClients(clientsNew);
			resetForm();
		});
	};
	return (
		<Box as='form' onSubmit={(e) => e.preventDefault()} py={3}>
			<Flex flexDirection='column' mx={2} mb={3}>
				<Box width={1} px={2}>
					<Label htmlFor='name'>Name</Label>
					<Input
						value={newClientName}
						onChange={(event) => onNameChange(event.target.value)}
						id='name'
						name='name'
						defaultValue=''
					/>
				</Box>
				<Box width={1} px={2}>
					<Label htmlFor='name'>Address</Label>
					<Input
						value={newClientAddress}
						onChange={(event) => onAddressChange(event.target.value)}
						id='name'
						name='name'
						defaultValue=''
					/>
				</Box>
				<Box width={1} px={2}>
					<Label htmlFor='name'>Password</Label>
					<Input
						value={newClientPassword}
						onChange={(event) => onPasswordChange(event.target.value)}
						id='name'
						name='name'
						defaultValue=''
					/>
				</Box>
				<Box width={1} px={2} mt={2}>
					<Button
						color='black'
						backgroundColor='#fab'
						width={1}
						variant='primary'
						onClick={() => addClient()}
					>
						Connect
					</Button>
				</Box>
			</Flex>
		</Box>
	);
};

const Clients = () => {
	const { clients, setClients, connected } = useClients();
	// const [showForm, setShowForm] = useState<boolean>(false);

	const disconnect = (clientName: string) => {
		const clientsNew = clients;

		clients[clientName].ws.disconnect();
		delete clientsNew[clientName];
		setClients(clientsNew);
	};

	useEffect(() => {
		console.log(clients, connected);
	}, [clients, connected]);

	return (
		<Flex>
			<ClientForm />
			{/* If no websocket is connected, show banner across screen */}
			{/* Plus button to be able to add more forms for connection */}

			{/* If connected, show connection status, if streaming etc. */}
			{Object.keys(clients).map((name) => {
				return (
					<Flex flexDirection='column' key={name}>
						<Text>{name} connected</Text>
						<Button backgroundColor='red' onClick={() => disconnect(name)}>
							Disconnect
						</Button>
					</Flex>
				);
			})}
		</Flex>
	);
};

export default Clients;
