import React, { FC } from 'react';
import { createContext, useState } from 'react';
import { ClientsType } from '../../App';

interface ClientContextType {
	clients: ClientsType;
	setClients: React.Dispatch<React.SetStateAction<ClientsType>>;
}

const ClientContext = createContext<ClientContextType>({ clients: {}, setClients: () => {} });

export const ClientProvider: FC = ({ children }) => {
	const [clients, setClients] = useState<ClientsType>({});

	return <ClientContext.Provider value={{ clients, setClients }}>{children}</ClientContext.Provider>;
};

export const useClients = () => React.useContext(ClientContext);
