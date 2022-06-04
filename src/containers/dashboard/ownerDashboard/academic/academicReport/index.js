import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Layout from 'containers/Layout';
import Grid from '@material-ui/core/Grid';
import { DashboardContextProvider } from '../../../dashboard-context';
import HomeworkReport from '../studentReport/homeworkSubmissionReport';
import ClassworkReport from '../studentReport/classworkSubmissionReport';
import AssessmentReport from '../assessmentReport';

export default function AcademicReports(props) {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role='tabpanel'
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        style={{ width: '100%', marginTop: '10px' }}
      >
        {value === index && <div>{children}</div>}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  return (
    <Layout>
      <DashboardContextProvider>
        <Grid
          container
          direction='row'
          style={{
            padding: '10px 15px',
            margin: '0px auto',
          }}
        >
          <Grid container direction='row' justifyContent='flex-end'>
            <Grid
              md={6}
              style={{ marginBottom: 15 }}
              // align='right'
              indicatorColor='Primary'
              textColor='Primary'
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant='fullWidth'
                aria-label='simple tabs example'
              >
                <Tab label='Assessment' style={{ fontWeight: 'bold' }} />
                <Tab label='Homework' style={{ fontWeight: 'bold' }} />
                <Tab label='Classwork' style={{ fontWeight: 'bold' }} />
              </Tabs>
            </Grid>
          </Grid>
          <TabPanel value={tabValue} index={0}>
            <AssessmentReport />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <HomeworkReport />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <ClassworkReport />
          </TabPanel>
        </Grid>
      </DashboardContextProvider>
    </Layout>
  );
}
