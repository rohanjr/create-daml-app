import React from 'react'
import { Form, Input, List } from 'semantic-ui-react';
import ListActionItem from './ListActionItem';
import { Text } from '../ledger/Types';
import { Goal } from '../daml/Goal'

type Props = {
  goals: Text[];
  onAddGoal: (goal: Text) => Promise<boolean>;
}

/**
 * React component to edit a list of `Party`s.
 */
const GoalListEdit: React.FC<Props> = ({goals, onAddGoal}) => {
  const [newGoal, setNewGoal] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const addGoal = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    const success = await onAddGoal(newGoal);
    setIsSubmitting(false);
    if (success) {
      setNewGoal('');
    }
  }

  return (
    <List relaxed>
      {goals.map((goal) =>
        <ListActionItem
          key={goal}
          icon='user outline'
          action={{
            icon: 'remove user',
            onClick: () => { return; } //onRemoveGoal(goal)
          }}
        >
          <List.Header>{goal}</List.Header>
        </ListActionItem>
      )}
      <ListActionItem
        key='add goal'
        icon='user outline'
        action={{
          icon: 'add user',
          onClick: () => addGoal(),
        }}
      >
        <Form onSubmit={addGoal}>
          <Input
            fluid
            transparent
            readOnly={isSubmitting}
            loading={isSubmitting}
            size='small'
            placeholder='Add goal'
            value={newGoal}
            onChange={(event) => setNewGoal(event.currentTarget.value)}
          />
        </Form>
      </ListActionItem>
    </List>
  );
};

export default GoalListEdit;
