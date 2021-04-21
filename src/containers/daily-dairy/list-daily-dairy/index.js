import React, { useState, useEffect, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import { Grid, useTheme, SvgIcon } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import Loading from '../../../components/loader/loader';
import unfiltered from '../../../assets/images/unfiltered.svg'
import selectfilter from '../../../assets/images/selectfilter.svg';
import DailyDairyFilter from '../view-daily-dairy';
import DailyDairy from '../dairy-card'
import ViewMoreDailyDairyCard from '../view-more-card'
import {Context} from '../context/context'


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        margin: '-10px auto',
        boxShadow: 'none',
    },
    container: {
        maxHeight: '70vh',
        width: '100%',
    },
}));

const DailyDairyList = () => {
    const classes = useStyles();
    const { setAlert } = useContext(AlertNotificationContext);
    const [page, setPage] = useState(1);
    const [periodData, setPeriodData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [viewMore, setViewMore] = useState(false);
    const [viewMoreData, setViewMoreData] = useState({});
    const [periodDataForView, setPeriodDataForView] = useState({});
    const limit = 9;
    const themeContext = useTheme();
    const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
    const [periodColor, setPeriodColor] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [editData,setEditData] = useState([])
    
    const [state,setState] = useContext(Context)

    const handlePagination = (event, page) => {
        setPage(page);
    };

    const handleDairyList = (branchId, gradeId, sectionIds, startDate, endDate) => {
        setLoading(true);
        setPeriodData([]);
        axiosInstance
            .get(
                `${endpoints.generalDairy.dairyList
                }?branch=${branchId}&grades=${gradeId}&sections=${sectionIds}&page=${page}&start_date=${startDate.format(
                    'YYYY-MM-DD'
                )}&end_date=${endDate.format('YYYY-MM-DD')}&dairy_type=${2}`
            )
            // axiosInstance.get(`${endpoints.generalDairy.dairyList}?start_date=${startDate.format('YYYY-MM-DD')}&end_date=${endDate.format('YYYY-MM-DD')}`)
            // axiosInstance.get(`${endpoints.generalDairy.dairyList}?grades=${gradeId}&sections=${sectionIds}`)
            .then((result) => {
                if (result.data.status_code === 200) {
                    setTotalCount(result.data.result.count);
                    setLoading(false);
                    setPeriodData(result.data.result.results);
                    setViewMore(false);
                    setViewMoreData({});
                } else {
                    setLoading(false);
                    setAlert('error', result.data.description);
                }
            })
            .catch((error) => {
                setLoading(false);
                setAlert('error', error.message);
            });
    };
    const handleDairyType = (type) => {
    }

    return (
        <>
            {loading ? <Loading message='Loading...' /> : null}
            <Layout>
                <div>
                    <div style={{ width: '95%', margin: '20px auto' }}>
                        <CommonBreadcrumbs componentName='Daily Diary' />
                    </div>
                </div>
                <DailyDairyFilter
                 handleDairyList={handleDairyList}
                 setPeriodData={setPeriodData}
                  />
                <Paper className={classes.root}>
                    {periodData?.length > 0 ? (
                        <Grid
                            container
                            style={
                                isMobile
                                    ? { width: '95%', margin: '20px auto' }
                                    : { width: '100%', margin: '20px auto' }
                            }
                            spacing={5}
                        >
                            <Grid item xs={12} sm={viewMore && periodData?.length > 0 ? 7 : 12}>
                                <Grid container spacing={isMobile ? 3 : 5}>
                                    {periodData.map((period, i) => (
                                        <Grid
                                            item
                                            xs={12}
                                            style={isMobile ? { marginLeft: '-8px' } : null}
                                            sm={viewMore && periodData?.length > 0 ? 6 : 4}
                                        >
                                            <DailyDairy
                                                index={i}
                                                lesson={period}
                                                viewMore={viewMore}
                                                setLoading={setLoading}
                                                setViewMore={setViewMore}
                                                setViewMoreData={setViewMoreData}
                                                setPeriodDataForView={setPeriodDataForView}
                                                setSelectedIndex={setSelectedIndex}
                                                // setSelectedIndex={setSelectedIndex}
                                                periodColor={selectedIndex === i ? true : false}
                                                setPeriodColor={setPeriodColor}
                                                // setEditData={setEditData}
                                                handleDairyType={handleDairyType}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>

                            {viewMore && periodData?.length > 0 && (
                                <Grid item xs={12} sm={5} style={{ width: '100%' }}>
                                    <ViewMoreDailyDairyCard
                                        viewMoreData={viewMoreData}
                                        setViewMore={setViewMore}
                                        periodDataForView={periodDataForView}
                                        setSelectedIndex={setSelectedIndex}
                                        setSelectedIndex={setSelectedIndex}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    ) : (
                            <div className='periodDataUnavailable'>
                                <SvgIcon
                                    component={() => (
                                        <img
                                            style={
                                                isMobile
                                                    ? { height: '100px', width: '200px' }
                                                    : { height: '160px', width: '290px' }
                                            }
                                            src={unfiltered}
                                        />
                                    )}
                                />
                                <SvgIcon
                                    component={() => (
                                        <img
                                            style={
                                                isMobile
                                                    ? { height: '20px', width: '250px' }
                                                    : { height: '50px', width: '400px', marginLeft: '5%' }
                                            }
                                            src={selectfilter}
                                        />
                                    )}
                                />
                            </div>
                        )}

                    <div className='paginateData paginateMobileMargin'>
                        <Pagination
                            onChange={handlePagination}
                            style={{ marginTop: 25 }}
                            count={Math.ceil(totalCount / limit)}
                            color='primary'
                            page={page}
                        />
                    </div>
                </Paper>
            </Layout>
        </>
    );
};

export default DailyDairyList;
