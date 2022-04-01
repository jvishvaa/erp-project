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
import { IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

function Overview({ recentSubmissionDetail, overviewDetails, acadId }) {
  const history = useHistory();
  const homeworkClassWork = (data) => {
    history.push({
      pathname: './teacherdashboards/homework_Classwork_two',
      state: { data: data },
    });
  };

  return (
    <div>
      <Card
        style={{ minWidth: '100%', border: '2px solid whitesmoke', marginBottom: '10px' }}
      >
        <CardContent>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', margin: 'auto 0' }}
          >
            <Typography
              style={{
                marginBottom: '10px',
                fontWeight: '1000',
                fontSize: '12px',
                margin: 'auto 0',
              }}
            >
              Today's Overview of Home Work & Class Work
            </Typography>
            <IconButton
              style={{ width: '12%', borderRadius: '10px' }}
              onClick={() => overviewDetails(acadId)}
            >
              <RefreshIcon />
            </IconButton>
          </div>
          {recentSubmissionDetail?.length != 0 ? (
            <>
              <Grid style={{ display: 'flex' }}>
                <Typography
                  style={{ marginRight: '40px', fontSize: '12px', fontWeight: 800 }}
                >
                  Branch Details
                </Typography>
                <Typography
                  style={{
                    marginLeft: '38px',
                    marginRight: '31px',
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
                        <Grid
                          style={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                          <div style={{ width: '110px' }}>
                            <Typography
                              style={{
                                fontSize: '12px',
                                position: 'relative',
                                color: 'black',
                                top: '25%',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                              }}
                            >
                              {item.branch_name}
                            </Typography>
                          </div>
                          <div
                            style={{ display: 'flex', justifyContent: 'space-between' }}
                          >
                            <Grid style={{ marginRight: '40px', marginLeft: '30px' }}>
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
                          </div>
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
                              width: '350px',
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
                                marginLeft: '37px',
                                // marginRight: '70px',
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
                                marginLeft: '-5px',
                                // marginRight: '20px',
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
                      <div
                        onClick={() => homeworkClassWork(item)}
                        style={{ textAlign: 'end', padding: '5px' }}
                      >
                        <b style={{ cursor: 'pointer' }}>View all</b>
                        <ArrowForwardIosIcon
                          size='small'
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            position: 'relative',
                            top: '2px',
                          }}
                        />
                      </div>
                    </Accordion>
                  </div>
                );
              })}
            </>
          ) : (
            <Grid
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography style={{ fontSize: '1.2rem' }}>☹️</Typography>
              <Typography style={{ fontWeight: '600' }}>No Records</Typography>
            </Grid>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Overview;
