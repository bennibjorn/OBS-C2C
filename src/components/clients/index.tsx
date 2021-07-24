import ObsWebSocket from 'obs-websocket-js';
import { useEffect, useState } from 'react';
import { useClients } from './clientContext';

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
			console.log(newClientName, 'connected');
			// const authenticated = await authenticateIfRequired(ws, newClientPassword);
			// clientsNew[newClientName].authenticated = authenticated;
			// setClients(clientsNew);
			resetForm();
		});
	};
	return (
		<div>
			<span>Name</span>
			<input value={newClientName} onChange={(event) => onNameChange(event.target.value)} />
			<span>Address</span>
			<input value={newClientAddress} onChange={(event) => onAddressChange(event.target.value)} />
			<span>Password</span>
			<input value={newClientPassword} onChange={(event) => onPasswordChange(event.target.value)} />
			<button onClick={() => addClient()}>Submit</button>
		</div>
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
		<div className='Clients'>
			<ClientForm />
			{/* If no websocket is connected, show banner across screen */}
			{/* Plus button to be able to add more forms for connection */}

			{/* If connected, show connection status, if streaming etc. */}
			{Object.keys(clients).map((name) => {
				return (
					<div key={name}>
						<p>{name} connected</p>
						<button onClick={() => disconnect(name)}>Disconnect</button>
						<p>Scenes:</p>
						{clients[name].scenes.map((scene) => {
							return <p>{scene.name}</p>;
						})}
					</div>
				);
			})}
		</div>
	);
};

export default Clients;
