import { Select } from '@rebass/forms';
import { FC, useState } from 'react';
import { TriggerEntry, useClients } from '../../clients/clientContext';

const SEPARATOR = '//';
interface Props {
	initialValue?: TriggerEntry;
	skipClients: string[];
	select: (clientName: string, sceneName: string) => void;
}

const SceneSelector: FC<Props> = ({ initialValue, skipClients, select }) => {
	const { clients } = useClients();
	const [selected, setSelected] = useState<string>(
		initialValue && initialValue.clientName !== '' && initialValue.sceneName !== ''
			? initialValue.clientName + SEPARATOR + initialValue.sceneName
			: ''
	);

	const whenSelected = (combined: string) => {
		setSelected(combined);
		const split = combined.split(SEPARATOR);
		select(split[0], split[1]);
	};
	return (
		<Select value={selected} onChange={(ev) => whenSelected(ev.target.value)}>
			{Object.keys(clients).map((clientName) => {
				if (skipClients.includes(clientName)) return null;
				return clients[clientName].scenes.map((scene) => {
					return (
						<option key={clientName + scene.name} value={`${clientName}${SEPARATOR}${scene.name}`}>
							{clientName} - {scene.name}
						</option>
					);
				});
			})}
		</Select>
	);
};

export default SceneSelector;
