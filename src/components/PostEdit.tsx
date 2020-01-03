import React from 'react'
import { Form, Input, Button } from 'semantic-ui-react';
import { Text, Party } from '../ledger/Types';

type Props = {
  writePost: (content: Text, sharingWith: string) => Promise<boolean>;
}

/**
 * React component to edit a post to share with a bunch of friends.
 */
const PostEdit: React.FC<Props> = ({writePost}) => {
  const [content, setContent] = React.useState('');
  const [sharingWith, setSharingWith] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // const stringToPartyList = async (parties: string): [Party] => {

  // }

  const submitPost = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    const success = await writePost(content, sharingWith);
    setIsSubmitting(false);
    if (success) {
      setContent('');
      setSharingWith('');
    }
  }

  return (
    <Form onSubmit={submitPost}>
      <Input
        fluid
        transparent
        readOnly={isSubmitting}
        loading={isSubmitting}
        size='small'
        placeholder='Tell me a secret ;)'
        value={content}
        onChange={(event) => setContent(event.currentTarget.value)}
      />
      <Input
        fluid
        transparent
        readOnly={isSubmitting}
        loading={isSubmitting}
        size='small'
        placeholder='Friends to share this with!'
        value={sharingWith}
        onChange={(event) => setSharingWith(event.currentTarget.value)}
      />
      <Button type="submit">Post</Button>
    </Form>
  );
};

export default PostEdit;
