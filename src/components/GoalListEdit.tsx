import React from 'react'
import { Form, Input, List } from 'semantic-ui-react';
import ListActionItem from './ListActionItem';
import { Text, Party } from '../ledger/Types';
import { Goal, GoalProposal } from '../daml/Goal';

type Props = {
  goals: Goal[];
  pendingGoals: GoalProposal[];
  onAddGoal: (pledge: Text, witness: Party | null) => Promise<boolean>;
}

/**
 * React component to edit a list of `Party`s.
 */
const GoalListEdit: React.FC<Props> = ({goals, pendingGoals, onAddGoal}) => {
  const [newGoal, setNewGoal] = React.useState({pledge: '', witness: ''});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const addGoal = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    let newWitness = null;
    if (newGoal.witness !== '') {
      newWitness = newGoal.witness;
    }
    const success = await onAddGoal(newGoal.pledge, newWitness);
    setIsSubmitting(false);
    if (success) {
      setNewGoal({pledge: '', witness: ''});
    }
  }

  const setNewGoalPledge = (pledge: Text) => {
    const witness = newGoal.witness;
    setNewGoal({pledge, witness});
  }

  const setNewGoalWitness = (witness: Text) => {
    const pledge = newGoal.pledge;
    setNewGoal({pledge, witness});
  }

  return (
    <List relaxed>
      Active: {goals.map((goal) =>
        <ListActionItem
          key={goal.pledge}
          icon='pencil'
          action={{
            icon: 'remove',
            onClick: () => { return; } //onRemoveGoal(goal)
          }}
        >
          <List.Header>{goal.pledge}</List.Header>
        </ListActionItem>
      )}
      Pending: {pendingGoals.map((goal) =>
        <ListActionItem
          key={goal.pledge}
          icon='pencil'
          action={{
            icon: 'remove',
            onClick: () => { return; } //onRemoveGoal(goal)
          }}
        >
          <List.Header>{goal.pledge + " [awaiting " + goal.witness + "]"}</List.Header>
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
          Pledge: <Input
            fluid
            transparent
            readOnly={isSubmitting}
            loading={isSubmitting}
            size='small'
            placeholder='Add pledge'
            value={newGoal.pledge}
            onChange={(event) => setNewGoalPledge(event.currentTarget.value)}
          />
          Witness: <Input
            fluid
            transparent
            readOnly={isSubmitting}
            loading={isSubmitting}
            size='small'
            placeholder='Add witness'
            value={newGoal.witness}
            onChange={(event) => setNewGoalWitness(event.currentTarget.value)}
          />
        </Form>
      </ListActionItem>
    </List>
  );
};

export default GoalListEdit;
