import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { useSocket } from '../../mp-quiz-providers';
import { InternalPageStatus } from '../../mp-quiz-utils';

function MpQuizSocketStatus(props) {
  const { params: { role: roleId } = {} } = props || {}
  const ws = useSocket() || {};
  const { readyState, connect } = ws || {};
  const statusObj = {
    [window.WebSocket.CLOSED]: 'closed',
    [window.WebSocket.OPEN]: 'open',
    [window.WebSocket.CONNECTING]: 'connecting',
  };
  const [isWebview, setisWebview] = useState(false)
  const { erp_config } = JSON.parse(localStorage.getItem('userDetails'));
 

useEffect(() => {
  const searchParams = new URLSearchParams(window.location.search);
  const redirectionView = +searchParams.get('wb_view');
  if(redirectionView === 1 || redirectionView === 2){
    setisWebview(true)
  }
})
  const handleGoHomeRedirection=()=>{
    if (erp_config === true || erp_config?.length > 0) {
      props.history.push('/acad-calendar')
    }else{
      {roleId==0?
        props.history.push('/erp-online-class-teacher-view') :
        props.history.push('/erp-online-class-student-view') 
      }
    }

   
  }

  return (
    statusObj[readyState] === 'open' ? null :
      statusObj[readyState] === 'closed' ? <InternalPageStatus
        loader={false}
        label={
          <div style={{ minWidth: '40vw', display: 'flex', justifyContent: "space-evenly" }}>
            {!isWebview && <Button variant='outlined'
              onClick={handleGoHomeRedirection}>
              Go Home
            </Button>}
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
