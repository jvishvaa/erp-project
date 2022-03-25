import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import CirclePercentage from './CirclePercentage';
import apiRequest from '../../../../config/apiRequest';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useHistory } from 'react-router-dom';

function Overview({ recentSubmissionDetail }) {
  const history = useHistory();
  const homeworkClassWork = () => {
    history.push('./teacherdashboards/homework_Classwork');
  };
  return (
    <div>
      <Card
        style={{ minWidth: '100%', border: '2px solid whitesmoke', marginBottom: '10px' }}
      >
        <CardContent>
          <Typography
            style={{ marginBottom: '10px', fontWeight: '1000', fontSize: '12px' }}
          >
            Overview of Home Work and Class Work
          </Typography>
          <Grid style={{ display: 'flex' }}>
            <Typography
              style={{ marginRight: '40px', fontSize: '12px', fontWeight: 800 }}
            >
              Branch Details
            </Typography>
            <Typography
              style={{
                marginLeft: '38px',
                marginRight: '40px',
                fontSize: '12px',
                fontWeight: 800,
              }}
            >
              Home Work
            </Typography>
            <Typography
              style={{ marginRight: '40px', fontSize: '12px', fontWeight: 800 }}
            >
              Class Work
            </Typography>
          </Grid>

          {recentSubmissionDetail.map((item) => {
            return (
              <div>
                <Accordion style={{ backgroundColor: '#F3F3F3' }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                  >
                    <Grid style={{ display: 'flex' }}>
                      <Typography
                        style={{
                          fontSize: '12px',
                          position: 'relative',
                          color: 'black',
                          top: '25%', 
                        }}
                      >
                        {item.branch_name}
                      </Typography>
                      <Grid style={{ marginRight: '48px', marginLeft: '111px' }}>
                        <CirclePercentage
                          height='50px'
                          width='50px'
                          percent={item?.total_hw_percent}
                        />
                      </Grid>
                      <Grid>
                        <CirclePercentage
                          height='50px'
                          width='50px'
                          percent={item?.total_cw_percent}
                        />
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    >
                      <Grid
                        item
                        container
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginLeft: '54px',
                        }}
                      >
                        <Typography style={{ color: '#4DC41B', fontSize: '12px' }}>
                          Submitted
                        </Typography>
                        <Typography style={{ color: '#F2A127', fontSize: '12px' }}>
                          Pending
                        </Typography>
                        <Typography style={{ color: '#3A90E6', fontSize: '12px' }}>
                          Evaluated
                        </Typography>
                      </Grid>
                      <Grid item container>
                        <Grid
                          item
                          container
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: '40px',
                            marginRight: '70px',
                          }}
                        >
                          <Typography style={{ fontSize: '12px' }}>
                            {item?.total_hw_submitted}
                          </Typography>
                          <Typography style={{ fontSize: '12px' }}>
                            {item?.total_hw_pending}
                          </Typography>
                          <Typography style={{ fontSize: '12px' }}>
                            {item?.total_hw_evaluated}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item container>
                        <Grid
                          item
                          container
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: '20px',
                            marginRight: '20px',
                          }}
                        >
                          <Typography style={{ fontSize: '12px' }}>
                            {item.total_cw_submitted}
                          </Typography>
                          <Typography style={{ fontSize: '12px' }}>
                            {item.total_cw_pending}
                          </Typography>
                          <Typography style={{ fontSize: '12px' }}></Typography>
                        </Grid>
                      </Grid>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            );
          })}
          {/* <Typography
            onClick={homeworkClassWork}
            style={{
              position: 'relative',
              left: '361px',
              fontSize: '12px',
              fontWeight: '800',
              top: '14px',
              cursor: 'pointer',
            }}
          >
            View all
            <ArrowForwardIosIcon
              size='small'
              style={{
                height: '12px',
                width: '12 px',
                color: 'black',
                marginLeft: '-5px',
                marginTop: '5px',
              }}
            />
          </Typography> */}
        </CardContent>
      </Card>
    </div>
  );
}

export default Overview;
