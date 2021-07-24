import ObsWebSocket from 'obs-websocket-js';
import React, { FC } from 'react';
import { createContext, useState } from 'react';

export interface ClientsType {
	[name: string]: {
		ws: ObsWebSocket;
		address: string;
		scenes: ObsWebSocket.Scene[];
		authenticated: boolean;
	};
}
interface ClientContextType {
	connected: number;
	clients: ClientsType;
	setClients: (clients: ClientsType) => void;
}

const ClientContext = createContext<ClientContextType>({ connected: 0, clients: {}, setClients: () => {} });

export const ClientProvider: FC = ({ children }) => {
	const [clients, setClientsState] = useState<ClientsType>({});
	const [connected, setConnected] = useState<number>(0);

	const setClients = (clients: ClientsType) => {
		setConnected(Object.keys(clients).length);
		setClientsState(clients);
	};

	return <ClientContext.Provider value={{ connected, clients, setClients }}>{children}</ClientContext.Provider>;
};

export const useClients = () => React.useContext(ClientContext);
