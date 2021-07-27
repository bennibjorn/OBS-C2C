import { Box, Heading } from 'rebass';
import { Trigger, useClients } from '../clients/clientContext';
import TriggerForm from './triggerForm/triggerForm';
import TriggerList from './triggerList/triggerList';

const Triggers = () => {
	const { clients, setClients, updated } = useClients();

	const saveTrigger = (trigger: Trigger) => {
		const clientsNew = clients;
		clientsNew[trigger.when.clientName].triggers.push(trigger);
		console.log('save new trigger', trigger, clientsNew[trigger.when.clientName]);
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

	return (
		<div className='Triggers'>
			<Heading mb={4} type='h3'>
				Triggers
			</Heading>
			<Box p={2} mb={4}>
				<TriggerForm saveTrigger={saveTrigger} />
			</Box>
			<Box p={2}>
				<TriggerList deleteTrigger={deleteTrigger} />
			</Box>
		</div>
	);
};

export default Triggers;
