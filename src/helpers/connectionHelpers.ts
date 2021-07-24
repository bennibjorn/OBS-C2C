import Sha256Hash from 'sha.js';
import ObsWebSocket from 'obs-websocket-js';
import { Hash } from 'crypto';

const connect = async (name: string, address: string, password: string) => {
	console.log('connectionHelper - connect', name, address);
	const ws = new ObsWebSocket();
	const asdf = await ws.connect({ address, password, secure: false });
	console.log(asdf);
	return ws;
};

const authenticateIfRequired = async (ws: ObsWebSocket, password: string) => {
	try {
		const authRequired = await ws.send('GetAuthRequired');
		console.log('authrequired?', authRequired);
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
