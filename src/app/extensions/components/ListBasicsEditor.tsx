import React, { useState, useCallback } from 'react';
import {
  Alert,
  Button,
  ButtonRow,
  Flex,
  Form,
  Input,
  TextArea,
} from '@hubspot/ui-extensions';
import type { List } from '../types';
import { updateList, createList, deleteList } from '../actions/lists';

interface ListBasicsEditorProps {
  list: List | null;
  hubId: number;
  objectTypeId: string;
  objectId: string;
  onListUpdate: (list: List | null) => void;
}

const ListBasicsEditor = (props: ListBasicsEditorProps) => {
  const { list, hubId, objectTypeId, objectId, onListUpdate } = props;

  const initialName = list?.name || '';
  const initialDescription = list?.description || '';
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = useCallback(
    (event) => {
      const { name, description } = event.targetValue;
      setProcessing(true);
      (list
        ? updateList({ ...list, name, description })
        : createList({ name, description, hubId, objectTypeId, objectId })
      )
        .then((list) => onListUpdate(list))
        .catch((error) => {
          setErrorMessage(error.message);
        })
        .finally(() => {
          setProcessing(false);
        });
    },
    [list, hubId, objectTypeId, objectId, onListUpdate]
  );

  const onCancel = useCallback(() => {
    setName(initialName);
    setDescription(initialDescription);
  }, [list, initialName, initialDescription]);

  const onDelete = useCallback(() => {
    if (!list) {
      return;
    }
    setProcessing(true);
    deleteList(list)
      .then(() => {
        setName('');
        setDescription('');
        onListUpdate(null);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setProcessing(false);
      });
  }, [list, onListUpdate]);

  if (errorMessage) {
    // If there's an error, show an alert
    return (
      <Alert title="Request failed" variant="error">
        {errorMessage}
      </Alert>
    );
  }

  const hasChanged = initialName !== name || initialDescription !== description;

  return (
    <Form onSubmit={onSubmit} preventDefault={true}>
      <Flex align="stretch" direction="column" gap="md">
        <Input
          label="Name"
          name="name"
          required
          onInput={setName}
          value={name}
        />
        <TextArea
          label="Description"
          name="description"
          onInput={setDescription}
          value={description}
        />
        <ButtonRow>
          {list && (
            <Button
              disabled={processing}
              variant="destructive"
              onClick={onDelete}
            >
              {processing ? 'Deleting...' : 'Delete'}
            </Button>
          )}
          <Button
            disabled={processing || !hasChanged || !name}
            variant="primary"
            type="submit"
          >
            {processing ? 'Saving...' : 'Save'}
          </Button>
          <Button
            disabled={processing || !hasChanged}
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </ButtonRow>
      </Flex>
    </Form>
  );
};

export default ListBasicsEditor;
