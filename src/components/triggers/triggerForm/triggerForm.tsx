import { useEffect, useState } from 'react';
import { Button, Flex, Text } from 'rebass';
import { TriggerEntry, useClients } from '../../clients/clientContext';
import SceneSelector from '../sceneSelector/sceneSelector';

const TriggerForm = () => {
	const { clients, updated } = useClients();
	const [showForm, setShowForm] = useState<boolean>(false);
	const [whenValue, setWhenValue] = useState<TriggerEntry>();
	const [thenValues, setThenValues] = useState<TriggerEntry[]>([]);

	useEffect(() => {
		console.log('Triggers - clients updated:', clients);
	}, [updated, clients]);

	const addThenValue = (clientName: string, sceneName: string) => {
		const newThenValues = thenValues;
		thenValues.concat({ clientName, sceneName });
		setThenValues(newThenValues);
	};

	const changeWhenValue = (clientName: string, sceneName: string) => {
		// check all then values and reset if they contain the same clientName
		// replace when value
		setWhenValue({ clientName, sceneName });
	};

	// if (Object.keys(clients).length > 1) {
	// 	// not enough clients for triggers to work
	// 	// TODO: enable this before release
	// 	return null;
	// }
	if (showForm) {
		return (
			<Flex flexDirection='row' width='100%'>
				<Flex mr={4} backgroundColor='#dadada' width='20%' alignItems='center' justifyContent='space-between'>
					<Text fontWeight='bold'>When</Text>
					<SceneSelector skipClients={[]} select={changeWhenValue} />
				</Flex>
				<Flex width='20%' alignItems='center' justifyContent='space-between'>
					<Text>Then</Text>
					{thenValues.map((entry) => {
						return (
							<Flex>
								{entry.clientName} - {entry.sceneName}
							</Flex>
						);
					})}
					<SceneSelector
						skipClients={thenValues
							.map((x) => x.clientName)
							.concat(whenValue?.clientName ? [whenValue.clientName] : [])}
						select={addThenValue}
					/>
				</Flex>
				{/* New trigger form */}
				{/* When X, dropdown containing all scenes */}
				{/* Trigger Y/Z, show dropdown for each client containing all their scenes */}
			</Flex>
		);
	} else {
		return <Button onClick={() => setShowForm(true)}>New trigger</Button>;
	}
};

export default TriggerForm;
