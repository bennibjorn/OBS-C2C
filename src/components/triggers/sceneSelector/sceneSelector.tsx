import { Select } from '@rebass/forms';
import { FC, useEffect, useState } from 'react';
import { useClients } from '../../clients/clientContext';

interface Props {
	skipClients: string[];
	select: (clientName: string, sceneName: string) => void;
}

const SceneSelector: FC<Props> = ({ skipClients, select }) => {
	const { clients, updated } = useClients();
	const [selected, setSelected] = useState<string>('');

	useEffect(() => {
		console.log('Triggers - clients updated:', clients);
	}, [updated, clients]);

	const whenSelected = (combined: string) => {
		setSelected(combined);
		const split = combined.split('//');
		select(split[0], split[1]);
	};
	return (
		<Select value={selected} onChange={(ev) => whenSelected(ev.target.value)}>
			{Object.keys(clients).map((clientName) => {
				if (skipClients.includes(clientName)) return;
				return clients[clientName].scenes.map((scene) => {
					return (
						<option value={`${clientName}//${scene.name}`}>
							{clientName} - {scene.name}
						</option>
					);
				});
			})}
		</Select>
	);
};

export default SceneSelector;
