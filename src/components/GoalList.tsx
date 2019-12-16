import React from 'react'
import { List } from 'semantic-ui-react'
import ListActionItem from './ListActionItem';
import { Party } from '../ledger/Types';
import { Goal, GoalProposal } from '../daml/Goal';

type Props = {
  goals: Goal[];
  pendingGoals: GoalProposal[];
  onApproveGoal: (goalRequest: GoalProposal) => Promise<boolean>;
}

/**
 * React component to display a list of `User`s. The `action` can be
 * performed on every party displayed.
 */
const GoalList: React.FC<Props> = ({goals, pendingGoals, onApproveGoal}) => {
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
            icon: 'check',
            onClick: () => {
              const b = onApproveGoal(goal);
              return;
            }
          }}
        >
          <List.Header>{goal.pledge + " [awaiting " + goal.witness + "]"}</List.Header>
        </ListActionItem>
      )}
    </List>
  );
};

export default GoalList;
