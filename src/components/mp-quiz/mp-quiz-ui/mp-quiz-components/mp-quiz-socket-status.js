import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { useSocket } from '../../mp-quiz-providers';
import { InternalPageStatus } from '../../mp-quiz-utils';

function MpQuizSocketStatus(props) {
  const ws = useSocket() || {};
  const { readyState, connect } = ws || {};
  console.log(ws, 'ws')
  const statusObj = {
    [window.WebSocket.CLOSED]: 'closed',
    [window.WebSocket.OPEN]: 'open',
    [window.WebSocket.CONNECTING]: 'connecting',
  };

  return (
    statusObj[readyState] === 'open' ? null :
      statusObj[readyState] === 'closed' ? <InternalPageStatus
        loader={false}
        label={
          <div style={{ minWidth: '40vw', display: 'flex', justifyContent: "space-evenly" }}>
            <Button variant='outlined'
              onClick={() => { props.history.push('/erp-online-class-teacher-view') }}>
              Go Home
            </Button>
            <Button variant='outlined'
              onClick={() => { connect() }}
            >Resume
              </Button>
          </div>

        }
      /> :
        <InternalPageStatus
          label={`Connecting to server.   (stat:${readyState}-${statusObj[readyState || 0]})`}
        />
  );
}
export default withRouter(MpQuizSocketStatus);
