import React, { useContext, useEffect, useState } from 'react';
import { Grid, useTheme, Paper, Divider } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CoursePriceFilters from '../course-price/course-price-filters';
import DaysFilterContainer from '../course-price/days-filter-container';
import DurationContainer from '../course-price/duration-container';
import JoinLimitContainer from '../course-price/join-limit-container';
import Layout from '../../../Layout';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import { makeStyles } from '@material-ui/core/styles';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '0 auto',
    boxShadow: 'none',
    marginTop: '1.5%',
  },
  container: {
    maxHeight: '70vh',
    width: '100%',
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
}));

const CoursePrice = () => {
  const { setAlert } = useContext(AlertNotificationContext);
  const classes = useStyles();
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const [courseId, setCourseId] = useState();
  const [timeSlot, setTimeSlot] = useState([]);
  const [selectedLimit, setSelectedLimit] = useState('1:1');
  const [timeSlotDisplay, setTimeSlotDisplay] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [firstHit, setFirstHit] = useState(false);
  const [clearFlag, setClearFlag] = useState(false);
  const [collectData, setCollectData] = useState([
    {
      days: [],
      limit: '1:1',
      comboDays: [],
      otherDays: [],
      weeks: '',
      id: '',
      toggle: false,
      data: [{ weeks: '', price: '', id: '' }],
    },
    {
      days: [],
      limit: '1:5',
      comboDays: [],
      otherDays: [],
      weeks: '',
      id: '',
      toggle: false,
      data: [{ weeks: '', price: '', id: '' }],
    },
    {
      days: [],
      limit: '1:10',
      comboDays: [],
      otherDays: [],
      weeks: '',
      id: '',
      toggle: false,
      data: [{ weeks: '', price: '', id: '' }],
    },
    {
      days: [],
      limit: '1:20',
      comboDays: [],
      otherDays: [],
      weeks: '',
      id: '',
      toggle: false,
      data: [{ weeks: '', price: '', id: '' }],
    },
    {
      days: [],
      limit: '1:30',
      comboDays: [],
      otherDays: [],
      weeks: '',
      id: '',
      toggle: false,
      data: [{ weeks: '', price: '', id: '' }],
    },
  ]);

  const funBatchSize = (batchSize) => {
    switch (batchSize) {
      case 1:
        return 0;
        break;
      case 5:
        return 1;
        break;
      case 10:
        return 2;
        break;
      case 20:
        return 3;
        break;
      case 30:
        return 4;
        break;
    }
  };

  const resetContent = () => {
    const resetList = [...collectData];
    for (let i = 0; i < resetList.length; i++) {
      resetList[i]['days'] = [];
      resetList[i]['comboDays'] = [];
      resetList[i]['otherDays'] = [];
      resetList[i]['weeks'] = '';
      resetList[i]['toggle'] = false;
      resetList[i]['data'] = [{ weeks: '', price: '', id: '' }];
    }
    setCollectData(resetList);
    setTimeSlotDisplay([]);
    setTimeSlot([]);
    setClearFlag(!clearFlag);
    setIsEdit(false);
  };

  useEffect(() => {
    if (courseId) {
      resetContent();
      axiosInstance
        .get(`${endpoints.aol.createCoursePrice}?course=${courseId}`)
        .then((res) => {
          const { message, status_code } = res.data;
          setFirstHit(false);
          if (status_code === 200) {
            if (res.data.result.length > 0) {
              setIsEdit(true);
              const list = [...res.data.result];
              const collectionList = [...collectData];
              setTimeSlotDisplay(list[0]['time_slot']);
              for (let i = 0; i < list.length; i++) {
                const { batch_size, course_price, is_recurring, week_days, id } = list[i];
                const index = funBatchSize(batch_size);
                collectionList[index]['data'] = [];
                collectionList[index]['id'] = id;
                collectionList[index]['toggle'] = Boolean(is_recurring);
                if (week_days?.length > 0) {
                  collectionList[index]['days'] = [...week_days];
                }
                collectionList[index]['weeks'] = course_price[0]['no_of_week'];
                for (let k = 0; k < course_price?.length; k++) {
                  collectionList[index]['data'].push({
                    weeks: course_price[k]['no_of_week'],
                    price: course_price[k]['price'],
                    id: course_price[k]['id'],
                  });
                }
              }
              setCollectData(collectionList);
              setFirstHit(true);
            }
          } else {
            resetContent();
            setIsEdit(false);
            setTimeSlotDisplay([]);
            setAlert('error', message);
          }
        })
        .catch((error) => {
          resetContent();
          setIsEdit(false);
        //   setAlert('error', error.message);
        });
    } else {
      resetContent();
    }
  }, [courseId]);

  return (
    <Layout>
      <div style={{ width: '95%', margin: '20px auto' }}>
        <CommonBreadcrumbs
          componentName='Master Management'
          childComponentName='Course'
          childComponentNameNext='Course Price'
        />
      </div>
      <CoursePriceFilters
        setTimeSlotDisplay={setTimeSlotDisplay}
        timeSlotDisplay={timeSlotDisplay}
        timeSlot={timeSlot}
        setTimeSlot={setTimeSlot}
        setCourseId={setCourseId}
        setCollectData={setCollectData}
        resetContent={resetContent}
      />
      <div>
        {' '}
        <Divider />{' '}
      </div>
      <Paper className={classes.root}>
        <Grid
          container
          spacing={isMobile ? 3 : 5}
          style={{ width: widerWidth, margin: wider }}
        >
          <Grid item xs={12} sm={3}>
            <JoinLimitContainer setSelectedLimit={setSelectedLimit} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DaysFilterContainer
              clearFlag={clearFlag}
              selectedLimit={selectedLimit}
              collectData={collectData}
              setCollectData={setCollectData}
              funBatchSize={funBatchSize}
              firstHit={firstHit}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <DurationContainer
              clearFlag={clearFlag}
              isEdit={isEdit}
              timeSlot={timeSlot}
              timeSlotDisplay={timeSlotDisplay}
              courseId={courseId}
              selectedLimit={selectedLimit}
              collectData={collectData}
              setCollectData={setCollectData}
              funBatchSize={funBatchSize}
              firstHit={firstHit}
              resetContent={resetContent}
            />
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  );
};

export default CoursePrice;
