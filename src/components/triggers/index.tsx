import { useEffect } from 'react';
import { Heading } from 'rebass';
import { Trigger, useClients } from '../clients/clientContext';
import TriggerForm from './triggerForm/triggerForm';
import TriggerList from './triggerList/triggerList';

const Triggers = () => {
	const { clients, setClients, updated } = useClients();

	const saveTrigger = (trigger: Trigger) => {
		const clientsNew = clients;
		clientsNew[trigger.when.clientName].triggers.push(trigger);
		setClients(clientsNew);
	};

	const mappedThens = (entry: Trigger) => {
		return entry.then.map((x) => x.clientName + '//' + x.sceneName).join(';');
	};

	const deleteTrigger = (trigger: Trigger) => {
		const clientsNew = clients;
		const index = clientsNew[trigger.when.clientName].triggers.findIndex(
			(x) => mappedThens(x) === mappedThens(trigger)
		);
		clientsNew[trigger.when.clientName].triggers.splice(index, 1);
		setClients(clientsNew);
	};

	useEffect(() => {
		console.log('Triggers - clients updated:', clients);
	}, [updated, clients]);
	return (
		<div className='Triggers'>
			<Heading type='h3'>Triggers</Heading>
			<TriggerForm saveTrigger={saveTrigger} />
			<TriggerList deleteTrigger={deleteTrigger} />
		</div>
	);
};

export default Triggers;
