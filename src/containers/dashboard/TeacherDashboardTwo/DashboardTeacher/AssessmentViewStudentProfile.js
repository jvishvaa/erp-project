import React from 'react';
import Layout from '../../../../containers/Layout';
import { Grid, Typography } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import { useHistory } from 'react-router-dom';

const AssessmentViewStudentProfile = () => {
  const history = useHistory();
  return (
    <>
      <Layout>
        <Grid container spacing={2} style={{ margin: '10px' }}>
          <Grid item xs={12}>
            <Breadcrumbs aria-label='breadcrumb'>
              <Typography>Dashboard</Typography>
              <Typography>Assessments</Typography>
              <Typography>Tests</Typography>
              <Typography>Students</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12}>
            <Card style={{ width: '92%' }}>
              <CardContent>
                <Grid
                  container
                  spacing={2}
                  justifyContent='flex-start'
                  alignItems='center'
                  style={{
                    backgroundColor: '#EBEEF3',
                    marginBottom: '20px',
                    padding: '10px',
                  }}
                >
                  <Card style={{ height: '96px' }}>
                    <CardContent>
                      <PermIdentityIcon style={{ fontSize: '75px' }} />
                    </CardContent>
                  </Card>
                  <Grid style={{ marginLeft: '20px' }}>
                    <Typography
                      style={{ color: '#061B2E', opcaity: '100%', fontSize: '24px' }}
                    >
                      Student Name 1
                    </Typography>
                    <Typography style={{ color: '#061B2E', fontSize: '18px' }}>
                      ERP No. 11025497
                    </Typography>
                  </Grid>
                  <Grid style={{ marginLeft: '100px', fontSize: '18px' }}>
                    <Typography>Father Name-</Typography>
                    <Typography>Mother Name-</Typography>
                    <Typography>Mothers Name-</Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} container spacing={2}>
                  <Grid item xs={3} spacing={2}>
                    <Card style={{ width: '250px', height: '74px' }}>
                      <CardContent>
                        120
                        <br />
                        <div style={{ color: '#757575' }}>Total Working Days</div>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={3} spacing={2}>
                    <Card style={{ width: '250px', height: '74px' }}>
                      <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                          style={{
                            backgroundColor: '#2DC8A8',
                            display: 'flex',
                            alignItems: 'center',
                            width: '20px',
                            height: '25px',
                            color: 'white',
                            justifyContent: 'center',
                          }}
                        >
                          P
                        </div>
                        <Typography style={{ color: '#2DC8A8', marginLeft: '10px' }}>
                          24/25 <br />
                          <span style={{ color: '#757575' }}>Total Present</span>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={3} spacing={2}>
                    <Card style={{ width: '250px', height: '74px' }}>
                      <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                          style={{
                            backgroundColor: '#FE8083',
                            display: 'flex',
                            alignItems: 'center',
                            width: '20px',
                            height: '25px',
                            color: 'white',
                            justifyContent: 'center',
                          }}
                        >
                          A
                        </div>
                        <Typography style={{ color: '#FE8083', marginLeft: '10px' }}>
                          1/25 <br />{' '}
                          <span style={{ color: '#757575' }}>Total Absent</span>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={3} spacing={2}>
                    <Card style={{ width: '250px', height: '74px' }}>
                      <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                          style={{
                            backgroundColor: '#1C85EB',
                            display: 'flex',
                            alignItems: 'center',
                            width: '20px',
                            height: '25px',
                            color: 'white',
                            justifyContent: 'center',
                          }}
                        >
                          %
                        </div>
                        <Typography style={{ color: '#1C85EB', marginLeft: '10px' }}>
                          1 <br />{' '}
                          <span style={{ color: '#757575', fontSize: '16px' }}>
                            More than 4 Days leave
                          </span>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card style={{ width: '92%' }}>
              <CardContent style={{ height: '200px' }}>
                <Grid item xs={12}>
                  <Typography style={{ color: '#061B2E', fontWeight: 'bold' }}>
                    Observations
                  </Typography>
                  <Grid item xs={12} style={{ marginLeft: '400px' }}>
                    Nothing to show!
                    <Card
                      style={{
                        backgroundColor: 'blue',
                        color: 'white',
                        width: '275px',
                        height: '48px',
                        marginLeft: '-40px',
                        fontWeight: 'bold',
                      }}
                    >
                      <CardContent>Write an Observation</CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Layout>
    </>
  );
};
export default AssessmentViewStudentProfile;
