import Sha256Hash from 'sha.js';
import ObsWebSocket from 'obs-websocket-js';
import { useClients } from '../components/clients/clientContext';
import { Hash } from 'crypto';

const connect = async (name: string, address: string) => {
	console.log('addClient', name, address);
	const ws = new ObsWebSocket();

	ws.on('ConnectionOpened', async () => {
		console.log('connectionhelper connectionopened');
		console.log('Connected to ', name);

		// clients[name] = {
		// 	ws: ws,
		// 	address: address,
		// 	scenes: [],
		// };
		// setClients(clients);
	});

	ws.connect({ address, secure: false });
	return ws;
};

const authenticateIfRequired = async (ws: ObsWebSocket, password: string) => {
	try {
		const authRequired = await ws.send('GetAuthRequired');
		if (authRequired.authRequired && authRequired.salt && authRequired.challenge) {
			const authHash = Sha256Hash('sha256');
			authHash.update(password);
			authHash.update(authRequired.salt);
			const authResponse: Hash = Sha256Hash('sha256');
			authResponse.update(authHash.digest('base64'));
			authResponse.update(authRequired.challenge);
			const auth = authResponse.digest('base64');
			console.log('auth key', auth);

			await ws.send('Authenticate', { auth });
			console.log('Authenticated!');
		}
		return true;
	} catch (e) {
		console.log('Failed to authenticate');
		console.log(e);
		return false;
	}
};

export const clientConnectionHelper = {
	connect,
	authenticateIfRequired,
};
