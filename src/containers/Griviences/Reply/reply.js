import { Avatar, Grid, makeStyles, Typography } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ENVCONFIG from 'config/config';
import './reply.scss';
const useStyles = makeStyles((theme) => ({
  // root: {
  //   display: 'flex',
  //   '& > *': {
  //     margin: theme.spacing(1),
  //   },
  // },
  small: {
    width: '40px',
    height: '40px',
    backgroundColor: '#78B5F3',
  },
}));
const Reply = (props) => {
  console.log(props, 'checking replyssss');
  const {
    s3: { ERP_BUCKET = '' },
  } = ENVCONFIG;
  const send_time = moment(props.Replys.createdAt).fromNow(true);
  const classes = useStyles();

  const openImage = (url) => {
    window.open(url)
  }
  const env = ENVCONFIG?.apiGateway?.baseURL ==  "https://dev.olvorchidnaigaon.letseduvate.com/qbox" ||  "https://dev.olvorchidnaigaon.letseduvate.com/qbox" ? 'dev' : 'prod';
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={ props?.Replys[0]?.length ? <ExpandMoreIcon /> : '' }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Replies({props?.Replys[0]?.length ? props?.Replys[0]?.length : 0 })</Typography>
        </AccordionSummary>
        <AccordionDetails style={{flexDirection: 'column' , height: props?.Replys[0]?.length > 3 ? '450px' : '200px' , minHeight: '100px' , overflow: 'auto' , overflowX: 'hidden'}} >
          {props?.Replys[0]?.length > 0 ? props?.Replys[0].map((reply) => (
            <>
              <div style={{ backgroundColor: '#F9F9F9', borderRadius: '10px', padding: '15px' }}>
                <Grid container direction='row' justify='space-between' alignItems='center'>
                  <Grid>
                    <Grid container direction='row' alignItems='center'>
                      <Grid style={{ marginRight: '2px' }}>
                        <Avatar className={classes.small}>
                          {reply?.replied_by.slice(0,1)}
                        </Avatar>
                      </Grid>
                      <Grid style={{ marginRight: '2px' }}>
                        <strong style={{ color: '#014B7E' }}>{reply?.replied_by}</strong>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid style={{ color: '#014b7e' }}>{moment(reply?.createdAt).fromNow(true)} ago</Grid>
                </Grid>
                <Grid item sm={10} style={{display : 'flex' , justifyContent: 'space-between'}}  >
                  <Typography style={{ fontSize: '17px', padding: '10px' , lineBreak: 'anywhere' }}>
                    {reply?.body}
                  </Typography>
                  <div>
                    {reply?.grievance_reply_attachment != "" ?  
                    <a href={`${ERP_BUCKET}${env}/media/${reply?.grievance_reply_attachment}`} target="_blank" >
                    <img src={`${ERP_BUCKET}${env}/media/${reply?.grievance_reply_attachment}`} style={{minWidth: '10%' , height : '100px'}}   />
                    </a>
                    : '' }
                  </div>
                </Grid>
              </div>
            </>
          )) : <></>          }
        </AccordionDetails>
      </Accordion>
    </div >
  );
};

export default Reply;
