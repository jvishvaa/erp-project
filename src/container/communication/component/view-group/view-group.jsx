import React from 'react';
import { withRouter } from 'react-router-dom';
import './view-group.css';

// eslint-disable-next-line no-unused-vars
const ViewGroup = withRouter(({ history, ...props }) => {
  return (
    <div className='creategroup__page'>
      <div>this is view group page</div>
    </div>
  );
});

export default ViewGroup;
