import { Select } from '@rebass/forms';
import ObsWebSocket from 'obs-websocket-js';
import { useEffect, useState } from 'react';
import { Heading } from 'rebass';
import { Trigger, useClients } from '../clients/clientContext';
import TriggerForm from './triggerForm/triggerForm';

const Triggers = () => {
	const { clients, setClients, updated } = useClients();
	// const [showForm, setShowForm] = useState<boolean>(false);

	const saveTrigger = (trigger: Trigger) => {
		const clientsNew = clients;
		clientsNew[trigger.when.clientName].triggers.push(trigger);
		setClients(clientsNew);
	};

	useEffect(() => {
		console.log('Triggers - clients updated:', clients);
	}, [updated, clients]);
	return (
		<div className='Triggers'>
			<Heading type='h3'>Triggers</Heading>
			{/* Button for adding a trigger */}
			{/* Active triggers */}
			<TriggerForm saveTrigger={saveTrigger} />
		</div>
	);
};

export default Triggers;
