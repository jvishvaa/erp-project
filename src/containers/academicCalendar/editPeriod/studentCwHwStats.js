import React, { useState, useContext } from 'react';
import {
  Grid,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
  Button,
  Card,
  CardContent,
} from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withRouter } from 'react-router-dom';
import axiosInstance from 'config/axios';
import { DataUsageSharp } from '@material-ui/icons';
import { AlertNotificationContext } from '../../.././context-api/alert-context/alert-state';
import apiRequest from '../../../config/apiRequest';
import Loader from '../../../components/loader/loader';

const studentCwHwStats = withRouter(({ history, data, hwData }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const handleSudentSubmitHW = (id) => {
    if (id === undefined) return;
    history.push({
      pathname: `/academic-calendar/submit-home-work/${id}`,
      state: {
        homeworkId: id,
        homeworkdata: data?.homework_details?.homework_list[0]
      }

    });
  };

  const handleStudentClassWork = (id) => {
    history.push({
      pathname: `/academic-calendar/submit-class-work/${id}`,
      state: {
        classWorkId: id,
        online_class_id: data?.online_class_id,
      },
    });
  };

  const handleStudentWork = (quiz) => {
    history.push({
      pathname: `/erp-online-class/${data?.online_class_id}/${quiz?.test_id}/pre-quiz`,
    });
  };

  const handleViewSubmittedWork = (id) => {
    if (id === undefined) return;
    history.push({
      pathname: `/academic-calendar/submit-home-work/${id}`,
      state: {
        homeworkId: data?.homework_details?.homework_list[0].id,
        homeworkdata: data?.homework_details?.homework_list[0]
      }

    });
  };

  const showAsPerStatus = (data) => {
    const firstData = data[0];
    switch (firstData?.status) {
      case 'submitted':
        return (
          <div onClick={() => handleViewSubmittedWork(firstData?.id)}>
            View Submitted Home Work
          </div>
        );
      case 'evaluated':
        return <div onClick={() => handleViewSubmittedWork(firstData?.id)}>
          Evaluated HomeWork
        </div>
      default:
        return (
          <div onClick={() => handleSudentSubmitHW(firstData?.id)}>Submit Home Work</div>
        );
    }
  };
  const handleViewSubmittedClassWork = (id) => {
    history.push({
      pathname: `/academic-calendar/submit-class-work/${id}`,
      state: {
        classWorkId: id,
        online_class_id: data?.online_class_id,
        class_date: data?.date
      }
    });
  };
  return (
    <>
      <div className='classParticipationWrapper'>
        {loading && <Loader />}
        {data?.classwork_details?.assigned ? (
          <Accordion style={{ width: '100%', cursor: 'pointer' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <FiberManualRecordIcon
                style={{ color: 'red', float: 'left', width: '14px' }}
              />
              <Typography
                style={{ color: 'black', fontSize: '1rem', marginLeft: '30px' }}
              >
                Submit Class Work (
                {data?.classwork_details?.classwork_details?.length +
                  data?.classwork_details?.quiz_details?.length}
                )
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {data?.classwork_details?.quiz_details?.map((item, index) => (
                  <>
                    <Grid item xs={6} style={{ height: '20px' }}>
                      {item?.submitted ? (
                        <Typography
                          style={{ color: 'red', fontSize: '0.70rem', padding: '0px' }}
                        >
                          Submitted
                        </Typography>
                      ) : (
                        <Typography
                          style={{ color: 'red', fontSize: '0.70rem', padding: '0px' }}
                        >
                          Assigned
                        </Typography>
                      )}
                      <Typography style={{ fontSize: '0.97rem', fontWeight: 'bold' }}>
                        Quiz
                      </Typography>
                    </Grid>
                    {index === 0 ? (
                      <Grid item xs={6} align='center'>
                        <Button
                          variant='contained'
                          color='secondary'
                          size='small'
                          onClick={() => handleStudentWork(item)}
                        >
                          Join Quiz{' '}
                          <ArrowForwardIosIcon
                            style={{ width: '15px', marginLeft: '5px' }}
                          />
                        </Button>
                      </Grid>
                    ) : (
                      ''
                    )}
                  </>
                ))}
                <Divider />
                {data?.classwork_details?.classwork_details?.map((item) => (
                  <>
                    <Grid item xs={9}>
                      <Typography style={{ fontSize: '0.97rem', fontWeight: 'bold' }}>
                        Class Work - Addition Worksheet
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      {item?.submitted ? (
                        <Typography
                          style={{
                            color: 'red',
                            fontSize: '0.70rem',
                            padding: '0px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                          onClick={() => handleViewSubmittedClassWork(item?.period_classwork_id)}
                        >
                          View Submitted Class work
                        </Typography>
                      ) : item?.evaluated ? (
                        ''
                      ) : (
                        <Typography
                          style={{
                            color: 'red',
                            fontSize: '0.70rem',
                            padding: '0px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                          onClick={(e) =>
                            handleStudentClassWork(item?.period_classwork_id)
                          }
                        >
                          Submit
                        </Typography>
                      )}
                    </Grid>
                  </>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ) : (
          ''
        )}
      </div>
      {hwData?.assigned && (
        <Accordion
          style={{
            color: 'black',
            marginLeft: '11px',
            fontSize: '1rem',
            padding: '0px',
            width: '340px',
            cursor: 'pointer',
          }}
        >
          {/* <div> */}
          <Card>
            <CardContent>
              <grid content xs={12} style={{ display: 'flex', flexDirection: 'row' }}>
                <FiberManualRecordIcon
                  style={{ color: 'red', float: 'left', width: '14px', marginRight: 30 }}
                />

                <Typography>
                  {showAsPerStatus(hwData?.homework_list)}

                  {/* {hwData?.homework_list[0]?.status === 'submitted' ? (
                    <div>Submitted</div>
                  ) : (
                    <div
                      onClick={() => handleSudentSubmitHW(hwData?.homework_list[0]?.id)}
                    >
                      Submit Home Work
                    </div>
                  )} */}
                </Typography>
              </grid>
            </CardContent>
          </Card>
          {/* </div> */}
        </Accordion>
      )}
    </>
  );
});

export default studentCwHwStats;
