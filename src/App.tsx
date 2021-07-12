import React, { useEffect, useState } from 'react';
import ObsWebSocket from 'obs-websocket-js';
import { sha256 } from 'js-sha256';
import './App.css';

export interface ClientsType {
	[name: string]: {
		ws: ObsWebSocket;
		address: string;
		scenes: ObsWebSocket.Scene[];
	};
}

const App = () => {
	const [clients, setClients] = useState<ClientsType>({});
	const [lastAction, setLastAction] = useState<string>('');

	const [showForm, setShowForm] = useState<boolean>(false);
	const [newClientName, setNewClientName] = useState<string>('');
	const [newClientAddress, setNewClientAddress] = useState<string>('');
	const [newClientPassword, setNewClientPassword] = useState<string>('');

	const addClient = () => {
		console.log('addClient', newClientName, newClientAddress, newClientPassword);
		const clientsNew = clients;
		const ws = new ObsWebSocket();
		const name = newClientName;

		ws.on('ConnectionOpened', async () => {
			console.log('Connected to ', name);
			clientsNew[name] = {
				ws: ws,
				address: newClientAddress,
				scenes: [],
			};
			setClients(clientsNew);
			setLastAction('Connected to ' + name);

			try {
				// TODO: authentication into its own file
				const authRequired = await ws.send('GetAuthRequired');
				if (authRequired.authRequired) {
					console.log('auth is required', authRequired);
					const secretPass = newClientPassword + authRequired.salt;
					console.log('password + salt', secretPass);
					const secretHash = sha256(secretPass);
					console.log('hashed', secretHash);
					const secret = btoa(secretHash);
					console.log('secret', secret);

					const resPass = secret + authRequired.challenge;
					console.log('resPass', resPass);
					const resHash = sha256(resPass);
					console.log('resHash', resHash);
					const res = btoa(resHash);
					console.log('res secret', res);
					console.log('authenticating');
					await ws.send('Authenticate', { auth: res });
					console.log('authenticated');
					setLastAction('Authenticated with ' + name);
				}
				console.log('get scenes');
				const scenes = await ws.send('GetSceneList');
				console.log(scenes);
				clientsNew[name].scenes = scenes.scenes;
				setClients(clientsNew);
				setLastAction('Got scenes from ' + newClientName);
			} catch (e) {
				console.log('Failed to authenticate');
				console.log(e);
			}
		});

		ws.connect({ address: newClientAddress, password: newClientPassword, secure: false });
		resetForm();
	};

	useEffect(() => {
		console.log('clients changed');
		console.log(clients);
	}, [clients, lastAction]);

	const disconnect = (name: string) => {
		const clientsNew = clients;
		clientsNew[name].ws.disconnect();
		delete clientsNew[name];
		setClients(clientsNew);
		setLastAction('disconnected from ' + name);
	};

	// TODO: move into its own component
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

	const clientForm = () => (
		<div>
			<span>Name</span>
			<input onChange={(event) => onNameChange(event.target.value)} />
			<span>Address</span>
			<input onChange={(event) => onAddressChange(event.target.value)} />
			<span>Password</span>
			<input onChange={(event) => onPasswordChange(event.target.value)} />
			<button onClick={() => addClient()}>Submit</button>
		</div>
	);

	return (
		<div className='App'>
			{/* If no websocket is connected, show name, IP and password input */}
			{/* Plus button to be able to add more forms for connection */}
			{!showForm && <button onClick={() => setShowForm(true)}>Add client</button>}
			{showForm && clientForm()}

			{/* If connected, show connection status, if streaming etc. */}
			{Object.keys(clients).map((name) => {
				return (
					<>
						<p>{name} connected</p>
						<button onClick={() => disconnect(name)}>Disconnect</button>
						<p>Scenes:</p>
						{clients[name].scenes.map((scene) => {
							return <p>{scene.name}</p>;
						})}
					</>
				);
			})}

			{/* Button for adding a trigger */}
			{/* Active triggers */}

			{/* New trigger form */}
			{/* When X, dropdown containing all scenes */}
			{/* Trigger Y/Z, show dropdown for each client containing all their scenes */}
		</div>
	);
};

export default App;
