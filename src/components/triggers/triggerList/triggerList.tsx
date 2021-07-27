import { FC } from 'react';
import { Button, Flex, Text } from 'rebass';
import { Trigger, useClients } from '../../clients/clientContext';

interface Props {
	deleteTrigger: (trigger: Trigger) => void;
}

const TriggerList: FC<Props> = ({ deleteTrigger }) => {
	const { clients } = useClients();

	return (
		<Flex>
			{Object.keys(clients).map((clientName) => {
				if (clients[clientName].triggers.length > 0) {
					return clients[clientName].triggers.map((trigger) => {
						return (
							<Flex>
								<Text>
									When: {trigger.when.clientName} - {trigger.when.sceneName}
								</Text>
								<Flex ml={4} justifyContent='space-between'>
									<Text>Then:</Text>
									{trigger.then.map((entry) => {
										return (
											<Text>
												{entry.clientName} - {entry.sceneName}
											</Text>
										);
									})}
								</Flex>
								<Button backgroundColor='red' onClick={() => deleteTrigger(trigger)}>
									X
								</Button>
							</Flex>
						);
					});
				}
				return null;
			})}
		</Flex>
	);
};

export default TriggerList;
