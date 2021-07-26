import { Select } from '@rebass/forms';
import ObsWebSocket from 'obs-websocket-js';
import { useEffect, useState } from 'react';
import { Heading } from 'rebass';
import { useClients } from '../clients/clientContext';
import TriggerForm from './triggerForm/triggerForm';

const Triggers = () => {
	const { clients, updated } = useClients();
	// const [showForm, setShowForm] = useState<boolean>(false);

	useEffect(() => {
		console.log('Triggers - clients updated:', clients);
	}, [updated, clients]);
	return (
		<div className='Triggers'>
			<Heading type='h3'>Triggers</Heading>
			{/* Button for adding a trigger */}
			{/* Active triggers */}
			<TriggerForm />
		</div>
	);
};

export default Triggers;
