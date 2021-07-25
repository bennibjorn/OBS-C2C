import { Select } from '@rebass/forms';
import ObsWebSocket from 'obs-websocket-js';
import { useEffect, useState } from 'react';
import { useClients } from '../clients/clientContext';

const Triggers = () => {
	const { clients, updated } = useClients();
	// const [showForm, setShowForm] = useState<boolean>(false);

	useEffect(() => {
		console.log('Triggers - clients updated:', clients);
	}, [updated, clients]);
	return (
		<div className='Triggers'>
			{/* Button for adding a trigger */}
			{/* Active triggers */}
			<Select>
				{Object.keys(clients).map((clientName) => {
					return clients[clientName].scenes.map((scene) => {
						return (
							<option>
								{clientName}:{scene.name}
							</option>
						);
					});
				})}
			</Select>

			{/* New trigger form */}
			{/* When X, dropdown containing all scenes */}
			{/* Trigger Y/Z, show dropdown for each client containing all their scenes */}
		</div>
	);
};

export default Triggers;
