import React from 'react'
import { Form, Input, List } from 'semantic-ui-react';
import ListActionItem from './ListActionItem';
import { Text, Party } from '../ledger/Types';

type Props = {
  goals: Text[];
  onAddGoal: (goal: Text, witness: Party | null) => Promise<boolean>;
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
    const success = await onAddGoal(newGoal, null);
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
          icon='pencil'
          action={{
            icon: 'remove',
            onClick: () => { return; } //onRemoveGoal(goal)
          }}
        >
          <List.Header>{goal}</List.Header>
        </ListActionItem>
      )}
      <ListActionItem
        key='add goal'
        icon='pencil'
        action={{
          icon: 'add',
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
