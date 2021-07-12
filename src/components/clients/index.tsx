import React, { useState } from 'react';
import ObsWebSocket, { SceneItem } from 'obs-websocket-js';
import { ClientsType } from '../../App';

const ClientForm = () => {
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
			{/* If no websocket is connected, show banner across screen */}
			{/* Plus button to be able to add more forms for connection */}

			{/* If connected, show connection status, if streaming etc. */}
		</div>
	);
};

export default Clients;
