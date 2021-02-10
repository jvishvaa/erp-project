import React, { useContext, useEffect, useState } from 'react';
import { Grid, useTheme, Paper, Divider } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CoursePriceFilters from '../course-price/course-price-filters';
import DaysFilterContainer from '../course-price/days-filter-container';
import DurationContainer from '../course-price/duration-container';
import JoinLimitContainer from '../course-price/join-limit-container';
import Layout from '../../../Layout';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs'
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
    const [courseId, setCourseId] = useState('');
    const [timeSlot, setTimeSlot] = useState([]);
    const [selectedLimit, setSelectedLimit] = useState('1:1');
    const [collectData, setCollectData] = useState([
        {"isEdit":false, "limit": '1:1', "comboDays": [], "otherDays": [], "weeks": '', "toggle": false, "data": [{ "weeks": '', "price": '' }] },
        {"isEdit":false, "limit": '1:5', "comboDays": [], "otherDays": [], "weeks": '', "toggle": false, "data": [{ "weeks": '', "price": '' }] },
        {"isEdit":false, "limit": '1:10', "comboDays": [], "otherDays": [], "weeks": '', "toggle": false, "data": [{ "weeks": '', "price": '' }] },
        {"isEdit":false, "limit": '1:20', "comboDays": [], "otherDays": [], "weeks": '', "toggle": false, "data": [{ "weeks": '', "price": '' }] },
        {"isEdit":false, "limit": '1:30', "comboDays": [], "otherDays": [], "weeks": '', "toggle": false, "data": [{ "weeks": '', "price": '' }] },
    ]);

    const funBatchSize = (batchSize) => {
        switch (batchSize) {
            case 1: return 0;
                break;
            case 5: return 1;
                break;
            case 10: return 2;
                break;
            case 20: return 3;
                break;
            case 30: return 4;
                break;
        }
    }

    useEffect(() => {
        if (courseId) {
            axiosInstance.get(`${endpoints.aol.createCoursePrice}?course=${courseId}`)
                .then(res => {
                    const { message, status_code } = res.data;
                    if (status_code === 200) {
                        if (res.data.result.length > 0) {
                            const list = [...res.data.result];
                            const collectionList = [...collectData];
                            for (let i = 0; i < list.length; i++) {
                                const { batch_size, course_price, is_recurring } = list[i];
                                const index = funBatchSize(batch_size);
                                collectionList[index]['data'] = [];
                                collectionList[index]['toggle'] = Boolean(is_recurring);
                                collectionList[index]['weeks'] = course_price[0]['no_of_week']
                                for (let k = 0; k < course_price?.length; k++) {
                                    collectionList[index]['data'].push({
                                        'weeks':course_price[k]['no_of_week'],
                                        'price':course_price[k]['price']
                                    });
                                }
                            }
                            setCollectData(collectionList);
                        }
                    } else {
                        setAlert('error', message);
                    }
                })
                .catch(error => {
                    setAlert('error', error.message);
                })
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
                timeSlot={timeSlot}
                setTimeSlot={setTimeSlot}
                setCourseId={setCourseId}
            />
            <div> <Divider /> </div>
            <Paper className={classes.root}>
                <Grid
                    container
                    spacing={isMobile ? 3 : 5}
                    style={{ width: widerWidth, margin: wider }}
                >
                    <Grid item xs={12} sm={3}>
                        <JoinLimitContainer
                            setSelectedLimit={setSelectedLimit}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <DaysFilterContainer
                            selectedLimit={selectedLimit}
                            collectData={collectData}
                            setCollectData={setCollectData}
                        />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <DurationContainer
                            timeSlot={timeSlot}
                            courseId={courseId}
                            selectedLimit={selectedLimit}
                            collectData={collectData}
                            setCollectData={setCollectData}
                            funBatchSize={funBatchSize}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Layout>
    );
};

export default CoursePrice;

