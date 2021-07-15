import React, { useState } from 'react';
import ObsWebSocket, { SceneItem } from 'obs-websocket-js';
import { ClientsType } from '../../App';
import { clientConnectionHelper } from '../../helpers/connectionHelpers';
import { useClients } from './clientContext';

const ClientForm = () => {
	const { clients, setClients } = useClients();
	const { connect, authenticateIfRequired } = clientConnectionHelper;
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
		const ws = await connect(newClientName, newClientAddress);
		ws.on('ConnectionOpened', (data) => {
			console.log('Clientform connection opened', data);
			authenticateIfRequired(ws, newClientPassword);
		});
	};
	return (
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
};

const Clients = (clients: ClientsType, setClients: React.Dispatch<React.SetStateAction<ClientsType>>) => {
	const [showForm, setShowForm] = useState<boolean>(false);

	return (
		<div className='Clients'>
			<ClientForm></ClientForm>
			{/* If no websocket is connected, show banner across screen */}
			{/* Plus button to be able to add more forms for connection */}

			{/* If connected, show connection status, if streaming etc. */}
		</div>
	);
};

export default Clients;
