import React, { useEffect, useState } from 'react';
import { Grid, useTheme, Paper, Divider } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CoursePriceFilters from '../course-price/course-price-filters';
import DaysFilterContainer from '../course-price/days-filter-container';
import DurationContainer from '../course-price/duration-container';
import JoinLimitContainer from '../course-price/join-limit-container';
import Layout from '../../../Layout';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs'
import { makeStyles } from '@material-ui/core/styles';

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

    const classes = useStyles();
    const themeContext = useTheme();
    const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
    const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
    const widerWidth = isMobile ? '98%' : '95%';

    const [selectedLimit, setSelectedLimit] = useState('1:1');
    const [collectData, setCollectData] = useState([
        { limit: '1:1', comboDays: [], otherDays: [], weeks: '', toggle: false, data: [{ weeks: '', price: '' }] },
        { limit: '1:5', comboDays: [], otherDays: [], weeks: '', toggle: false, data: [{ weeks: '', price: '' }] },
        { limit: '1:10', comboDays: [], otherDays: [], weeks: '', toggle: false, data: [{ weeks: '', price: '' }] },
        { limit: '1:20', comboDays: [], otherDays: [], weeks: '', toggle: false, data: [{ weeks: '', price: '' }] },
        { limit: '1:30', comboDays: [], otherDays: [], weeks: '', toggle: false, data: [{ weeks: '', price: '' }] },
    ]);

    return (
        <Layout>
            <div style={{ width: '95%', margin: '20px auto' }}>
                <CommonBreadcrumbs
                    componentName='Master Management'
                    childComponentName='Course'
                    childComponentNameNext='Course Price'
                />
            </div>
            <CoursePriceFilters />
            <div> <Divider /> </div>
            <Paper className={classes.root}>
                <Grid
                    container
                    spacing={isMobile ? 3 : 5}
                    style={{ width: widerWidth, margin: wider }}
                >
                    <Grid item xs={12} sm={2}>
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
                    <Grid item xs={12} sm={6}>
                        <DurationContainer
                            selectedLimit={selectedLimit}
                            collectData={collectData}
                            setCollectData={setCollectData}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Layout>
    );
};

export default CoursePrice;

