import './App.css';
import Clients from './components/clients';
import { ClientProvider } from './components/clients/clientContext';
import Triggers from './components/triggers';

const App = () => {
	return (
		<ClientProvider>
			<div className='App'>
				{/* If no websocket is connected, show name, IP and password input */}
				{/* Plus button to be able to add more forms for connection */}
				{/* {!showForm && <button onClick={() => setShowForm(true)}>Add client</button>}
				{showForm && clientForm()} */}
				<Clients />
				{/* If connected, show connection status, if streaming etc. */}

				{/* Button for adding a trigger */}
				{/* Active triggers */}
				<Triggers />
				{/* New trigger form */}
				{/* When X, dropdown containing all scenes */}
				{/* Trigger Y/Z, show dropdown for each client containing all their scenes */}
			</div>
		</ClientProvider>
	);
};

export default App;
