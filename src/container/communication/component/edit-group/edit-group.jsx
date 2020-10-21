import React from 'react';
import { withRouter } from 'react-router-dom';
import './edit-group.css';

// eslint-disable-next-line no-unused-vars
const EditGroup = withRouter(({ history, ...props }) => {
  return (
    <div className='creategroup__page'>
      <div>this is edit group page</div>
    </div>
  );
});

export default EditGroup;
