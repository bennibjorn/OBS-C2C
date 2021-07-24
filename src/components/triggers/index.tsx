import { useEffect } from 'react';
import { useClients } from '../clients/clientContext';

const Triggers = () => {
	const { clients, connected } = useClients();

	useEffect(() => {
		console.log('Triggers - clients updated:', clients);
	}, [connected, clients]);
	return (
		<div className='Triggers'>
			{/* Button for adding a trigger */}
			{/* Active triggers */}

			{/* New trigger form */}
			{/* When X, dropdown containing all scenes */}
			{/* Trigger Y/Z, show dropdown for each client containing all their scenes */}
		</div>
	);
};

export default Triggers;
