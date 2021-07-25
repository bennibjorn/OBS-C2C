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
	updated: Date;
	clients: ClientsType;
	setClients: (clients: ClientsType) => void;
}

const ClientContext = createContext<ClientContextType>({ updated: new Date(), clients: {}, setClients: () => {} });

export const ClientProvider: FC = ({ children }) => {
	const [clients, setClientsState] = useState<ClientsType>({});
	const [lastUpdated, updateLastUpdated] = useState<Date>(new Date());

	const setClients = (clients: ClientsType) => {
		updateLastUpdated(new Date());
		setClientsState(clients);
	};

	return (
		<ClientContext.Provider value={{ updated: lastUpdated, clients, setClients }}>
			{children}
		</ClientContext.Provider>
	);
};

export const useClients = () => React.useContext(ClientContext);
