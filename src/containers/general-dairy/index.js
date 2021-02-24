import React, { useState, useEffect, useContext } from 'react';
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
import Loading from '../../components/loader/loader';
import unfiltered from '../../assets/images/unfiltered.svg'
import selectfilter from '../../assets/images/selectfilter.svg';
import GeneralDairyFilter from './filterdata';
import PeriodCard from './dairy-card';
import ViewMoreCard from './view-more-card';
import {Context} from './context/context';
import {useLocation} from 'react-router-dom';

// component import from DailyDairy
import DailyDairy from '../daily-dairy/dairy-card/index';
import ViewMoreDailyDairyCard from '../daily-dairy/view-more-card/index';



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

const GeneralDairyList = () => {
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
    const [state,setState] = useContext(Context);
    const [ activeTab, setActiveTab ] = useState(0);
    const [ dairyType, setDairyType ] = useState(1);
    const [studentModuleId, setStudentModuleId] = useState();
    const [teacherModuleId, setTeacherModuleId] = useState();
    const location = useLocation();

    const handlePagination = (event, page) => {
        setPage(page);
    };

    const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    useEffect(() => {
        if (NavData && NavData.length) {
          NavData.forEach((item) => {
            if (
              item.parent_modules === 'Dairy' &&
              item.child_module &&
              item.child_module.length > 0
            ) {
              item.child_module.forEach((item) => {
                if(location.pathname === "/dairy/student" && item.child_name === "Student Dairy") {
                    setStudentModuleId(item?.child_id);
                } else if(location.pathname === "/dairy/teacher" && item.child_name === "Teacher") {
                    setTeacherModuleId(item?.child_id);
                } 
              });
            }
          });
        }
      }, [location.pathname]);

    const handleDairyList = (branchId, gradeId, sectionIds, startDate, endDate, activeTab) => {
        //console.log(branchId, gradeId, sectionIds, startDate, endDate, '===');
        setLoading(true);
        setPeriodData([]);
        const roleDetails = JSON.parse(localStorage.getItem('userDetails'));
        console.log(roleDetails);
        const diaryUrl =  isTeacher ? `${endpoints.generalDairy.dairyList}?branch=${branchId}&grades=${gradeId}&sections=${sectionIds}&page=${page}&start_date=${startDate.format('YYYY-MM-DD')}&end_date=${endDate.format('YYYY-MM-DD')}${activeTab !== 0? ('&dairy_type='+activeTab) : ''}`
            : `${endpoints.generalDairy.dairyList}?module_id=${studentModuleId}&start_date=${startDate.format('YYYY-MM-DD')}&end_date=${endDate.format('YYYY-MM-DD')}${activeTab !== 0? ('&dairy_type='+activeTab) : ''}`;
        axiosInstance.get(diaryUrl)
            // axiosInstance.get(`${endpoints.generalDairy.dairyList}?start_date=${startDate.format('YYYY-MM-DD')}&end_date=${endDate.format('YYYY-MM-DD')}`)
            // axiosInstance.get(`${endpoints.generalDairy.dairyList}?grades=${gradeId}&sections=${sectionIds}`)
            .then((result) => {
                //console.log(result);
                if (result.data.status_code === 200) {
                    setTotalCount(result.data.result.count);
                    setLoading(false);
                    setPeriodData(result.data.result.results);
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
        setDairyType(type);
    }
    const isTeacher = location.pathname === '/dairy/teacher' ? true : false;
    const path = isTeacher ? 'Teacher Diary' : 'Student Diary';

    return (
        <>
            {loading ? <Loading message='Loading...' /> : null}
            <Layout>
                <div>
                    <div style={{ width: '95%', margin: '20px auto' }}>
                        <CommonBreadcrumbs
                            componentName='Dairy'
                            childComponentName={path}
                        />
                    </div>
                </div>
                <GeneralDairyFilter
                    handleDairyList={handleDairyList}
                    setPeriodData={setPeriodData}
                    isTeacher={isTeacher}
                    //  setCurrentTab={setCurrentTab}
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
                                            {period.dairy_type === "1" && (
                                                <PeriodCard
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
                                                    handleDairyType={handleDairyType}
                                                />
                                            )}
                                            {period.dairy_type === "2" && (
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
                                                    handleDairyType={handleDairyType}
                                                />
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>

                            {viewMore && periodData?.length > 0 && (dairyType === 1) &&(
                                <Grid item xs={12} sm={5} style={{ width: '100%' }}>
                                    <ViewMoreCard
                                        viewMoreData={viewMoreData}
                                        setViewMore={setViewMore}
                                        periodDataForView={periodDataForView}
                                        setSelectedIndex={setSelectedIndex}
                                        setSelectedIndex={setSelectedIndex}
                                    />
                                </Grid>
                            )}
                            {viewMore && periodData?.length > 0 && (dairyType === 2) && (
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

export default GeneralDairyList;
