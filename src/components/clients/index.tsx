import ObsWebSocket from 'obs-websocket-js';
import { useEffect, useState } from 'react';
import { useClients } from './clientContext';
import { Label, Input } from '@rebass/forms';
import { Box, Button, Flex, Text } from 'rebass';
import { toast } from 'react-toastify';

const ClientForm = () => {
	const { clients, setClients } = useClients();
	const [newClientName, setNewClientName] = useState<string>('');
	const [newClientAddress, setNewClientAddress] = useState<string>('');
	const [newClientPassword, setNewClientPassword] = useState<string>('');
	const [showForm, setShowForm] = useState<boolean>(false);
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
		setShowForm(false);
	};
	const showFormButton = () => {
		setShowForm(true);
	};
	const addClient = async () => {
		const clientsNew = clients;
		const ws = new ObsWebSocket();
		ws.on('ConnectionClosed', (data) => {
			console.log(newClientName, 'disconnected', data);
			toast(`${newClientName} disconnected`, { type: 'info' });
		});
		ws.on('ConnectionOpened', async () => {
			toast(`${newClientName} connected!`, { type: 'success' });
			clientsNew[newClientName] = {
				ws: ws,
				address: newClientAddress,
				scenes: [],
				authenticated: true,
			};
			setClients(clientsNew);
			resetForm();
		});
		try {
			await ws.connect({ address: newClientAddress, password: newClientPassword, secure: false });
		} catch (err) {
			toast(err.error, { type: 'error' });
		}
	};
	if (showForm) {
		return (
			<Box as='form' onSubmit={(e) => e.preventDefault()} py={3}>
				<Flex flexDirection='column' mx={2} mb={3}>
					<Box px={2}>
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
	} else {
		return (
			<Box
				width='150px'
				p={2}
				backgroundColor='#222'
				color='white'
				style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
				onClick={() => showFormButton()}
			>
				+
			</Box>
		);
	}
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
		<Flex flexDirection='row' width='100%'>
			<ClientForm />
			{/* If no websocket is connected, show banner across screen */}
			{/* Plus button to be able to add more forms for connection */}

			{/* If connected, show connection status, if streaming etc. */}
			{Object.keys(clients).map((name) => {
				return (
					<Flex
						flexDirection='column'
						justifyContent='center'
						alignItems='center'
						height='150px'
						width='150px'
						key={name}
					>
						<Text>
							{name}{' '}
							<Box width='10px' height='10px' backgroundColor='green' style={{ borderRadius: '8px' }} />
						</Text>
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
