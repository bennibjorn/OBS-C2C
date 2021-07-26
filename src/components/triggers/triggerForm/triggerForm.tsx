import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Flex, Text } from 'rebass';
import { Trigger, TriggerEntry } from '../../clients/clientContext';
import SceneSelector from '../sceneSelector/sceneSelector';

interface Props {
	saveTrigger: (trigger: Trigger) => void;
}

const TriggerForm: FC<Props> = ({ saveTrigger }) => {
	const [showForm, setShowForm] = useState<boolean>(false);
	const [whenValue, setWhenValue] = useState<TriggerEntry>();
	const [thenValues, setThenValues] = useState<TriggerEntry[]>([]);

	const addThenValue = (clientName: string, sceneName: string) => {
		const newThenValues = thenValues;
		thenValues.concat({ clientName, sceneName });
		setThenValues(newThenValues);
	};
	const removeThenValue = (entry: TriggerEntry) => {
		const newThenValues = thenValues;
		const index = newThenValues.findIndex(
			(x) => x.clientName === entry.clientName && x.sceneName === entry.sceneName
		);
		if (index !== -1) {
			newThenValues.splice(index, 1);
			setThenValues(newThenValues);
		}
	};

	const changeWhenValue = (clientName: string, sceneName: string) => {
		// check all then values and reset if they contain the same clientName

		// replace when value
		setWhenValue({ clientName, sceneName });
	};
	const submit = () => {
		if (!whenValue) {
			toast('When must have a value', { type: 'error' });
			return;
		}
		const trigger: Trigger = {
			when: whenValue,
			then: thenValues,
		};
		saveTrigger(trigger);
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
								<Text>
									{entry.clientName} - {entry.sceneName}
								</Text>
								<Button onClick={() => removeThenValue(entry)}>X</Button>
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
				<Button backgroundColor='blue' onClick={() => submit()}>
					Save
				</Button>
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
