import ObsWebSocket from 'obs-websocket-js';
import { useEffect, useState } from 'react';
import { useClients } from './clientContext';
import { Label, Input } from '@rebass/forms';
import { Box, Button, Flex } from 'rebass';
import { toast } from 'react-toastify';
import ClientEntry from './clientEntry/clientEntry';

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

	const getScenes = async (clientName: string) => {
		const scenes = await clients[clientName].ws.send('GetSceneList');
		const clientsNew = clients;
		clientsNew[clientName].scenes = scenes.scenes;
		setClients(clientsNew);
	};

	const addClient = async () => {
		const clientsNew = clients;
		const ws = new ObsWebSocket();
		ws.on('ConnectionClosed', () => {
			toast(`${newClientName} disconnected`, { type: 'info' });
		});
		ws.on('ConnectionOpened', async () => {
			toast(`${newClientName} connected!`, { type: 'success' });
			clientsNew[newClientName] = {
				ws: ws,
				address: newClientAddress,
				scenes: [],
				authenticated: false,
				triggers: [],
			};
			setClients(clientsNew);
			resetForm();
		});
		ws.on('AuthenticationSuccess', () => {
			clientsNew[newClientName].authenticated = true;
			setClients(clientsNew);
			getScenes(newClientName);
		});
		ws.on('SwitchScenes', (data) => {
			clients[newClientName].triggers.forEach((trigger) => {
				if (trigger.when.clientName === data['scene-name']) {
					console.log('trigger triggered:', trigger);
					// trigger thens
					trigger.then.forEach((then) => {
						clients[then.clientName].ws.send('SetCurrentScene', { 'scene-name': then.sceneName });
					});
				}
			});
		});
		try {
			await ws.connect({ address: newClientAddress, password: newClientPassword, secure: false });
		} catch (err) {
			toast(err.error, { type: 'error' });
		}
	};
	if (showForm) {
		return (
			<Box height='100%' as='form' onSubmit={(e) => e.preventDefault()} py={3}>
				<Flex flexDirection='column' mx={2} mb={3}>
					<Box px={2}>
						<Label htmlFor='name'>Name</Label>
						<Input
							value={newClientName}
							onChange={(event) => onNameChange(event.target.value)}
							id='name'
							name='name'
						/>
					</Box>
					<Box width={1} px={2}>
						<Label htmlFor='name'>Address</Label>
						<Input
							value={newClientAddress}
							onChange={(event) => onAddressChange(event.target.value)}
							id='address'
							name='address'
						/>
					</Box>
					<Box width={1} px={2}>
						<Label htmlFor='name'>Password</Label>
						<Input
							value={newClientPassword}
							onChange={(event) => onPasswordChange(event.target.value)}
							id='password'
							name='password'
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
				height='250px'
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
	const { clients, updated: connected } = useClients();

	useEffect(() => {
		console.log(clients, connected);
	}, [clients, connected]);

	return (
		<Flex flexDirection='row' width='100%'>
			<ClientForm />
			{/* If no websocket is connected, show banner across screen */}
			{/* Plus button to be able to add more forms for connection */}

			{/* If connected, show connection status, if streaming etc. */}
			{Object.keys(clients).map((name) => (
				<ClientEntry name={name} />
			))}
		</Flex>
	);
};

export default Clients;
