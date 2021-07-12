import { sha256 } from 'js-sha256';
import ObsWebSocket from 'obs-websocket-js';

const addClient = (name: string, address: string, password: string) => {
	console.log('addClient', name, address);
	const clientsNew = clients;
	const ws = new ObsWebSocket();

	ws.on('ConnectionOpened', async () => {
		console.log('Connected to ', name);
		clientsNew[name] = {
			ws: ws,
			address: address,
			scenes: [],
		};
		setClients(clientsNew);
		setLastAction('Connected to ' + name);

		try {
			// TODO: authentication into its own file
			const authRequired = await ws.send('GetAuthRequired');
			if (authRequired.authRequired) {
				console.log('auth is required', authRequired);
				const secretPass = password + authRequired.salt;
				console.log('password + salt', secretPass);
				const secretHash = sha256(secretPass);
				console.log('hashed', secretHash);
				const secret = btoa(secretHash);
				console.log('secret', secret);

				const resPass = secret + authRequired.challenge;
				console.log('resPass', resPass);
				const resHash = sha256(resPass);
				console.log('resHash', resHash);
				const res = btoa(resHash);
				console.log('res secret', res);
				console.log('authenticating');
				await ws.send('Authenticate', { auth: res });
				console.log('authenticated');
				setLastAction('Authenticated with ' + name);
			}
			console.log('get scenes');
			const scenes = await ws.send('GetSceneList');
			console.log(scenes);
			clientsNew[name].scenes = scenes.scenes;
			setClients(clientsNew);
			setLastAction('Got scenes from ' + name);
		} catch (e) {
			console.log('Failed to authenticate');
			console.log(e);
		}
	});

	ws.connect({ address, password, secure: false });
};

export const useObsWs = {
	addClient,
};
