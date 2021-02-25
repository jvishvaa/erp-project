import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  a: {
    fill: '#04a6a6',
  },
  b: {
    fill: '#fff',
  },
});

const AttachmentIcon = () => {
  const classes = useStyles({});
  return (
    <SvgIcon width='27' height='27' viewBox='0 0 27 27'>
      <g transform='translate(-989 -888)'>
        <circle
          className={classes.a}
          cx='13.5'
          cy='13.5'
          r='13.5'
          transform='translate(989 888)'
        />
        <g transform='translate(994 893.854)'>
          <g transform='translate(0 0.146)'>
            <path
              className={classes.b}
              d='M10.428,7.142a1.013,1.013,0,0,0,.044-1.506,1.082,1.082,0,0,0-1.55,0l-1.34,1.34A3.271,3.271,0,0,0,7.415,11.7a3.324,3.324,0,0,0,4.775-.119l2.26-2.259a5.331,5.331,0,0,0,0-7.53L14.36,1.7a5.33,5.33,0,0,0-7.531,0L1.557,6.975a5.331,5.331,0,0,0,0,7.531l.091.091a5.29,5.29,0,0,0,6.1,1c.551-.27,1.149-.78.754-1.5a1.106,1.106,0,0,0-1.541-.416,3.719,3.719,0,0,1-3.806-.591L3.063,13a3.2,3.2,0,0,1,0-4.518L8.335,3.21a3.2,3.2,0,0,1,4.518,0l.092.091a3.2,3.2,0,0,1,0,4.518l-2.26,2.259a1.2,1.2,0,0,1-1.763.119,1.151,1.151,0,0,1,.167-1.716Z'
              transform='translate(0 -0.146)'
            />
            />
          </g>
        </g>
      </g>
    </SvgIcon>
  );
};

export default AttachmentIcon;
