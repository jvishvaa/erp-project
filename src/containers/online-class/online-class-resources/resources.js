import React, { useContext } from 'react';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Loader from '../../../components/loader/loader';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ResourceCard from './resourceCard';
import ResourceDetailsCard from './resourceDetailsCard';
import {
  Divider,
  Grid,
  makeStyles,
  useTheme,
  withStyles,
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import Layout from '../../Layout/index';
import ResourceFilter from './components/resourceFilter';
import { OnlineclassViewContext } from '../online-class-context/online-class-state';
import TabPanel from '../tab-panel/TabPanel';
import { Pagination } from '@material-ui/lab';
import unfiltered from '../../../assets/images/unfiltered.svg';
import selectFilter from '../../../assets/images/selectfilter.svg';
import Filter from './components/filters';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '35px auto 20px auto',
    width: '90%',
    [theme.breakpoints.down('xs')]: {
      margin: '50px 20px 20px 20px',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '55px 40px 20px 40px',
    },
  },
  topFilter: {
    width: '90%',
    margin: '15px auto 0px auto',
    [theme.breakpoints.down('xs')]: {
      margin: '55px 20px 20px 20px',
    },
  },
  classDetailsBox: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #F9D474',
    borderRadius: '10px',
  },
  classHeader: {
    padding: '8px 21px',
    backgroundColor: '#F9D474',
    borderRadius: '10px 10px 0px 0px',
  },
  classHeaderText: {
    display: 'inline-block',
    color: '#014B7E',
    fontSize: '16px',
    fontWeight: 300,
    fontFamily: 'Poppins',
    lineHeight: '25px',
  },
  classHeaderTime: {
    display: 'inline-block',
    color: '#014B7E',
    fontSize: '16px',
    fontFamily: 'Poppins',
    lineHeight: '25px',
    float: 'right',
  },
  classHeaderSub: {
    display: 'inline-block',
    color: '#014B7E',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    lineHeight: '25px',
  },
  subPeriods: {
    display: 'inline-block',
    color: '#014B7E',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    lineHeight: '25px',
    float: 'right',
  },
  classDetails: {
    padding: '8px 21px',
    backgroundColor: '#FFFFFF',
    borderRadius: '0px 0px 10px 10px',
  },
  classDetailsTitle: {
    color: '#014B7E',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    lineHeight: '25px',
  },
  classDetailsDivider: {
    color: '#014B7E',
  },
  classDetailsDescription: {
    height: '50px',
    color: '#014B7E',
    fontSize: '16px',
    fontFamily: 'Poppins',
    lineHeight: '25px',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  cardHover: {
    border: '1px solid #004087',
    borderRadius: '5px',
  },
  selectFilterGrid: {
    height: '400px',
    justifyContent: 'center',
    textAlign: 'center',
  },
  unfilteredImg: {
    display: 'block',
    height: '50%',
    margin: 'auto',
    marginTop: '20px',
  },
  unfilteredTextImg: {
    display: 'block',
    marginTop: '10px',
    margin: 'auto',
  },
}));

const StyledButton = withStyles({
  root: {
    marginTop: '16px',
    height: '31px',
    fontSize: '18px',
    fontFamily: 'Poppins',
    fontWeight: '',
    lineHeight: '27px',
    textTransform: 'capitalize',
    backgroundColor: '#FFAF71',
    borderRadius: '10px',
    marginRight: '40px',
  },
})(Button);

const Resources = () => {
  const classes = useStyles({});
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [selected, setSelected] = React.useState(0);
  const [itemSize, setItemSize] = React.useState(3);
  const [size, setSize] = React.useState(12);
  const [loading, setLoading] = React.useState(false);
  const [resourceData, setResourceData] = React.useState();
  const [filter, setFilter] = React.useState(false);
  const [resourceOnlineClasses, setResourceOnlineClasses] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [tabValue, setTabValue] = React.useState(
    JSON.parse(localStorage.getItem('filterData'))?.tabValue || null
  );
  const limit = 12;

  const handleSelctedClass = (data) => {
    setItemSize(4);
    setSize(8);
    setResourceData(data);
    setSelected(data.id);
    setTabValue(tabValue);
    setTotalData(data);
  };

  const hendleCloseDetails = () => {
    setItemSize(3);
    setSize(12);
    setResourceData('');
    setSelected(0);
    setFilter(false);
  };

  const [showPerPage, setShowPerPage] = React.useState(12);
  const [pagination, setPagination] = React.useState({
    start: 0,
    end: showPerPage,
  });
  const [totalData, setTotalData] = React.useState('');
  const onPaginationChange = (start, end) => {
    setPagination({
      start: start,
      end: end,
    });
  };

  const getResourceData = (data) => {
    setResourceOnlineClasses(data);

    setFilter(true);
    hendleCloseDetails();
    setTabValue(tabValue);
    setTotalData(data);
    if (data && data.length === 0) {
    }
  };

  const handlePagination = (event, page) => {
    setPage(page);
  };

  const handleTotalCount = (count) => {
    setTotalCount(count);
  };

  return (
    <>
      {loading && <Loader />}
      <div className='breadcrumb-container-create' style={{ marginLeft: '15px' }}>
        <CommonBreadcrumbs componentName='Online Class' childComponentName='Resources' />
      </div>
      <Grid container spacing={4} className='teacherBatchViewMainDiv'>
        <Grid item xs={12}>
          <Filter
            getResourceData={getResourceData}
            hendleDetails={hendleCloseDetails}
            pages={page}
            tabValue={tabValue}
            setTabValue={setTabValue}
            totalCount={handleTotalCount}
          />
        </Grid>
      </Grid>
      <Divider />

      <Grid container spacing={2} className='teacherBatchViewLCardList'>
        <Grid item md={12} xs={12} className='teacherBatchViewLCardList'>
          <TabPanel tabValue={tabValue} setTabValue={setTabValue} />
        </Grid>
      </Grid>

      <Grid container spacing={3} className='teacherBatchViewMainDiv'>
        <Grid item sm={size} xs={12}>
          <Grid container spacing={3}>
            {resourceOnlineClasses.length > 0 &&
              resourceOnlineClasses.map((data, id) => (
                <Grid item sm={itemSize} xs={12} key={id}>
                  <ResourceCard
                    resourceData={data}
                    selectedId={selected}
                    handleSelctedClass={handleSelctedClass}
                  />
                </Grid>
              ))}
            {!filter && resourceOnlineClasses.length === 0 && (
              <Grid item xs={12} className={classes.selectFilterGrid}>
                <img src={unfiltered} alt='unFilter' className={classes.unfilteredImg} />
                <img
                  src={selectFilter}
                  alt='unFilter'
                  className={classes.unfilteredTextImg}
                />
              </Grid>
            )}
            {filter && resourceOnlineClasses.length === 0 && (
              <Grid item xs={12} className={classes.selectFilterGrid}>
                <img src={unfiltered} alt='unFilter' className={classes.unfilteredImg} />
                <Typography>Class NOT found</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>

        {resourceData && resourceOnlineClasses.length !== 0 && (
          <Grid item sm={4} xs={12}>
            <ResourceDetailsCard
              resourceData={resourceData}
              loading={loading}
              setLoading={setLoading}
              hendleCloseDetails={hendleCloseDetails}
            />
          </Grid>
        )}
      </Grid>

      <Grid container spacing={3} className='paginateData paginateMobileMargin'>
        <Grid item md={12}>
          <Pagination
            onChange={handlePagination}
            style={{ marginTop: 25, marginLeft: 550 }}
            justifyContent='center'
            count={Math.ceil(totalCount / limit)}
            color='primary'
            page={page}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Resources;
