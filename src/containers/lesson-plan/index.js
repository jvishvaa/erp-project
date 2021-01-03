/* eslint-disable react/jsx-no-duplicate-props */
import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { Grid, useTheme, SvgIcon } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import axios from 'axios';
import './lesson.css';
import Loading from '../../components/loader/loader';
import PeriodCard from './period-card';
import LessonViewFilters from './lesson-view-filters';
import ViewMoreCard from './view-more-card';
import unfiltered from '../../assets/images/unfiltered.svg';
import selectfilter from '../../assets/images/selectfilter.svg';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        margin: '-10px auto',
        boxShadow: 'none'
    },
    container: {
        maxHeight: '70vh',
        width: '100%'
    },
}));


const LessonPlan = () => {
    const classes = useStyles();
    const { setAlert } = useContext(AlertNotificationContext);
    const [page, setPage] = useState(1);
    const [periodData, setPeriodData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [viewMore, setViewMore] = useState(false);
    const [viewMoreData, setViewMoreData] = useState({});
    const [periodDataForView, setPeriodDataForView] = useState({});
    const [bulkDownloadPath, setBulkDownloadPath] = useState('');
    const [filterDataDown, setFilterDataDown] = useState({});
    // const limit = 9;
    // const { role_details } = JSON.parse(localStorage.getItem('userDetails'));
    const themeContext = useTheme();
    const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

    const handlePagination = (event, page) => {
        setPage(page);
    };

    const handlePeriodList = (searchChapter) => {
        setLoading(true);
        setPeriodData([]);
        axios.get(`${endpoints.lessonPlan.periodData}?chapter=${searchChapter}`)
            .then(result => {
                if (result.data.status_code === 200) {
                    // setTotalCount(result.data.result.count)
                    setLoading(false);
                    setPeriodData(result.data.result);
                } else {
                    setLoading(false);
                    setAlert('error', result.data.description);
                }
            })
            .catch((error) => {
                setLoading(false);
                setAlert('error', error.message);
            })
    }

    useEffect(() => {
        const formData = new FormData();
        formData.append('academic_year', 13);
        formData.append('volume', 2);
        formData.append('grade', 3);
        formData.append('subject', 4);
        formData.append('chapter', 5);
        formData.append('period', 6);
        axios.post(`${endpoints.lessonPlan.bulkDownload}`, formData)
            .then(result => {
                if (result.data.status_code === 200) {
                    setBulkDownloadPath(result.data.result);
                } else {
                    setAlert('error', result.data.message);
                }
            })
            .catch(error => {
                setAlert('error', error.message);
            })
    }, []);

    return (
        <>
            {loading ? <Loading message='Loading...' /> : null}
            <Layout>
                <div>
                    <div style={{ width: '95%', margin: '20px auto' }}>
                        <CommonBreadcrumbs
                            componentName='Lesson Plan'
                        />
                    </div>
                </div>
                <LessonViewFilters
                    handlePeriodList={handlePeriodList}
                    setPeriodData={setPeriodData}
                    setViewMore={setViewMore}
                    setViewMoreData={setViewMoreData}
                    setFilterDataDown={setFilterDataDown}
                />

                <Paper className={classes.root}>
                    {periodData?.length > 0 ?
                        (<div className="cardsContainer">
                            <Grid container style={{ width: '95%', margin: '10px 0' }} spacing={5}>
                                {periodData.map((period, i) => (
                                    <Grid item xs={12} sm={viewMore ? 6 : 4}>
                                        <PeriodCard
                                            index={i}
                                            filterDataDown={filterDataDown}
                                            period={period}
                                            viewMore={viewMore}
                                            setLoading={setLoading}
                                            setViewMore={setViewMore}
                                            setViewMoreData={setViewMoreData}
                                            setPeriodDataForView={setPeriodDataForView}
                                        />
                                    </Grid>
                                ))}
                            </Grid>

                            {viewMore && viewMoreData?.length > 0 &&
                                <div style={isMobile ? { width: '95%', margin: '10px auto' } : { width: '60%', margin: '10px 0' }}>
                                    <ViewMoreCard
                                        viewMoreData={viewMoreData}
                                        setViewMore={setViewMore}
                                        filterDataDown={filterDataDown}
                                        periodDataForView={periodDataForView}
                                        bulkDownloadPath={bulkDownloadPath}
                                    />
                                </div>
                            }
                        </div>) : (
                            <div className="periodDataUnavailable">
                                <SvgIcon
                                    component={() => (
                                        <img
                                            style={isMobile ? { height: '100px', width: '200px' } : { height: '160px', width: '290px' }}
                                            src={unfiltered}
                                        />
                                    )}
                                />
                                <SvgIcon
                                    component={() => (
                                        <img
                                            style={isMobile ? { height: '20px', width: '250px' } : { height: '50px', width: '400px', marginLeft: '5%' }}
                                            src={selectfilter}
                                        />
                                    )}
                                />
                            </div>
                        )}

                    {/* <div className="paginateData paginateMobileMargin">
                        <Pagination
                            onChange={handlePagination}
                            style={{ marginTop: 25 }}
                            count={totalCount}
                            color='primary'
                            page={page}
                        />
                    </div> */}
                </Paper>

            </Layout >
        </>
    );
};

export default LessonPlan;