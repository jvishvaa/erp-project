import React, { useEffect, useContext, useState } from 'react';
import { Grid, TextField, Divider, Button } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { connect, useSelector } from 'react-redux';
import { setReportType } from '../../../../redux/actions';
import { useHistory } from 'react-router-dom';
import endpoints from 'config/endpoints';
import axios from 'axios';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import Loading from './../../../../components/loader/loader';

const reportTypes = [
  {
    id: 6,
    type: 'Individual Test Report',
  },

  {
    id: 9,
    type: 'Gradewise Assessment Summary',
  },
  {
    id: 10,
    type: 'Gradewise Assessment Completion',
  },
  {
    id: 13,
    type: 'Consolidated Assessment Report',
  },
];
const orchidsReportTypes = [
  { id: 3, type: 'Student Comparison' },
  {
    id: 5,
    type: 'Report Card',
  },
  {
    id: 6,
    type: 'Individual Test Report',
  },

  {
    id: 9,
    type: 'Gradewise Assessment Summary',
  },
  {
    id: 10,
    type: 'Gradewise Assessment Completion',
  },
  {
    id: 13,
    type: 'Consolidated Assessment Report',
  },
  {
    id: 14,
    type: 'Report Card',
  },
];

const ReportTypeFilter = ({
  widerWidth,
  isMobile,
  setReportType,
  selectedReportType,
  setIsFilter,
  reportcardpipelineview,
}) => {
  const handleReportType = (event, value) => {
    setIsFilter(false);
    if (value) {
      setReportType(value);
    } else setReportType({});
  };

  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();

  const { session_year } =
    useSelector((state) => state.commonFilterReducer?.selectedYear) || {};
  const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { is_superuser } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const [isReportButtonUnable, setIsReportButtonUnable] = useState(false);
  const [loading, setLoading] = useState(false);

  const query = new URLSearchParams(window.location.search);
  const isReportView = Boolean(query.get('report-card'));
  useEffect(() => {
    if (isReportView) {
      handleReportType({}, { ...reportTypes[4] });
    }
  }, [isReportView]);

  useEffect(() => {
    if (reportcardpipelineview) {
      handleReportType({}, { ...orchidsReportTypes[6] });
    }
  }, [reportcardpipelineview]);

  useEffect(() => fetchReportPipelineConfig(), [user_level]);

  let domain = window.location.href.split('/');
  let isAolOrchids =
    domain[2].includes('aolschool') ||
    domain[2].includes('orchids') ||
    domain[2].includes('localhost') ||
    domain[2].includes('dev') ||
    domain[2].includes('qa');

  const handleQuizReport = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const schoolName = ['dev', 'qa', 'test', 'localhost:3000']?.includes(
      window?.location?.host?.split('.')[0]
    )
      ? 'olvorchidnaigaon'
      : window?.location?.host?.split('.')[0];

    const obj = {
      school_name: schoolName,
      report_name: 'quiz_report',
      requested_by: `${userDetails?.first_name} ${userDetails?.last_name}`,
    };
    setLoading(true);
    axios
      .post(`${endpoints?.reportPipeline?.viewReportPipeline}`, obj, {
        headers: {
          'X-Api-Key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAlert('success', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      })
      .finally(() => {
        history.push('/report-pipeline');
        setLoading(false);
      });
  };

  const fetchReportPipelineConfig = () => {
    axios
      .get(
        `${endpoints?.reportPipeline?.reportPipelineConfig}?user_level=${
          is_superuser ? 1 : user_level
        }`,
        {
          headers: {
            'x-api-key': 'vikash@12345#1231',
          },
        }
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setIsReportButtonUnable(result?.data?.result?.access);
        }
      })
      .catch((error) => {
        console.log(error?.message);
      });
  };
  return (
    <Grid
      container
      spacing={isMobile ? 3 : 5}
      style={{
        width: widerWidth,
        margin: isMobile ? '0px 0px -10px 0px' : '-10px 0px 20px 8px',
      }}
    >
      {loading ? <Loading message='Loading...' /> : null}
      <Grid item xs={12} sm={6} className={isMobile ? '' : 'filterPadding'}>
        <Autocomplete
          style={{ width: '100%' }}
          size='small'
          onChange={handleReportType}
          id='report-types'
          className='dropdownIcon'
          value={selectedReportType || {}}
          options={
            isAolOrchids
              ? session_year !== '2021-22'
                ? orchidsReportTypes?.filter((eachType) => {
                    return eachType.id !== 5;
                  })
                : orchidsReportTypes?.filter((eachType) => {
                    return eachType.id !== 14;
                  })
              : reportTypes || []
          }
          getOptionLabel={(option) => option?.type || ''}
          getOptionSelected={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Report Types'
              placeholder='Report Types'
            />
          )}
        />
      </Grid>
      {isReportButtonUnable && (
        <Grid item xs={12} sm={6} className={isMobile ? '' : 'filterPadding'}>
          <Button variant='contained' color='primary' onClick={handleQuizReport}>
            Download Quiz Report
          </Button>
        </Grid>
      )}
      {selectedReportType?.id && (
        <Grid item xs={12}>
          <Divider />
        </Grid>
      )}
    </Grid>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setReportType: (selectedReport) => dispatch(setReportType(selectedReport)),
});

export default connect(null, mapDispatchToProps)(ReportTypeFilter);
