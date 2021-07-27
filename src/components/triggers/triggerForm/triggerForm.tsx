import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Flex, Text } from 'rebass';
import { Trigger, TriggerEntry, useClients } from '../../clients/clientContext';
import SceneSelector from '../sceneSelector/sceneSelector';

interface Props {
	saveTrigger: (trigger: Trigger) => void;
}

const TriggerForm: FC<Props> = ({ saveTrigger }) => {
	const { clients, updated } = useClients();
	const [showForm, setShowForm] = useState<boolean>(false);
	const [whenValue, setWhenValue] = useState<TriggerEntry>({ clientName: '', sceneName: '' });
	const [thenValues, setThenValues] = useState<TriggerEntry[]>([]);

	useEffect(() => {
		// check all whens/thens for disconnected clients and remove
		const clientNames = Object.keys(clients);
		const thenIndex = thenValues.findIndex((x) => !clientNames.includes(x.clientName));
		if (thenIndex !== -1) {
			const newThens = thenValues;
			newThens.splice(thenIndex);
			setThenValues(newThens);
		}
		if (whenValue?.clientName && !clientNames.includes(whenValue.clientName)) {
			setWhenValue({ clientName: '', sceneName: '' });
		}
	}, [clients, updated, whenValue, thenValues]);

	const addThenValue = (clientName: string, sceneName: string) => {
		const newThenValues = thenValues;
		newThenValues.push({ clientName, sceneName });
		setThenValues(newThenValues);
	};

	const changeWhenValue = (clientName: string, sceneName: string) => {
		// check all then values and reset if they contain the same clientName
		const thenIndex = thenValues.findIndex((x) => x.clientName === clientName);
		if (thenIndex !== -1) {
			const newThens = thenValues;
			newThens.splice(thenIndex);
			setThenValues(newThens);
		}
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
	const getSkippedClients = (currentIndex: number) => {
		const skippedClientNames: string[] = whenValue?.clientName ? [whenValue.clientName] : [];
		thenValues.forEach((entry, index) => {
			if (index !== currentIndex) {
				skippedClientNames.push(entry.clientName);
			}
		});
		return skippedClientNames;
	};
	const addEmptyThen = () => {
		const newThens = thenValues;
		newThens.push({ clientName: '', sceneName: '' });
		setThenValues(newThens);
	};

	if (Object.keys(clients).length <= 1) {
		// not enough clients for triggers to work
		// TODO: enable this before release
		return null;
	}
	if (showForm) {
		return (
			<Flex flexDirection='row' width='100%'>
				<Flex mr={4} backgroundColor='#dadada' width='20%' alignItems='center' justifyContent='space-between'>
					<Text fontWeight='bold'>When:</Text>
					<SceneSelector initialValue={whenValue} skipClients={[]} select={changeWhenValue} />
				</Flex>
				<Flex width='20%' alignItems='center' flexWrap='wrap' justifyContent='space-between'>
					<Text>Then:</Text>
					{thenValues.map((then, index) => {
						console.log('mapped then values', then, index);
						return (
							<SceneSelector
								key={'then' + index}
								initialValue={then}
								skipClients={getSkippedClients(index)}
								select={addThenValue}
							/>
						);
					})}
				</Flex>
				{thenValues.length + 1 < Object.keys(clients).length && (
					<Button backgroundColor='green' onClick={() => addEmptyThen()}>
						+
					</Button>
				)}
				<Button backgroundColor='blue' onClick={() => submit()}>
					Save
				</Button>
			</Flex>
		);
	} else {
		return <Button onClick={() => setShowForm(true)}>New trigger</Button>;
	}
};

export default TriggerForm;
