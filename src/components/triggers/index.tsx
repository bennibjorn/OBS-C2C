import React, { useState } from 'react';
import ObsWebSocket, { SceneItem } from 'obs-websocket-js';

interface Clients {
	[name: string]: {
		ws: ObsWebSocket;
		scenes: ObsWebSocket.Scene[];
	};
}

const Triggers = () => {
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
