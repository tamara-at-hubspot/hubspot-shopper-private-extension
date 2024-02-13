import React, { useState, useEffect } from 'react';
import { Alert, LoadingSpinner } from '@hubspot/ui-extensions';
import { hubspot } from '@hubspot/ui-extensions';
import type { List } from './types';
import ListBasicsEditor from './components/ListBasicsEditor';
import { getList } from './actions/lists';

// Define the extension to be run within the Hubspot CRM
hubspot.extend(({ context }) => <MaterialList context={context} />);

// Define the Extension component, taking in runServerless prop
const MaterialList = (props) => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [list, setList] = useState<List | null>(null);
  const hubId = props.context.portal.id;
  const objectTypeId = props.context.crm.objectTypeId;
  const objectId = props.context.crm.objectId;

  useEffect(() => {
    getList(hubId, objectTypeId, objectId)
      .then(setList)
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    // If loading, show a spinner
    return <LoadingSpinner label="loading" />;
  }
  if (errorMessage) {
    // If there's an error, show an alert
    return (
      <Alert title="Request failed" variant="error">
        {errorMessage}
      </Alert>
    );
  }

  return (
    <ListBasicsEditor
      list={list}
      hubId={hubId}
      objectTypeId={objectTypeId}
      objectId={objectId}
      onListUpdate={setList}
    />
  );
};
