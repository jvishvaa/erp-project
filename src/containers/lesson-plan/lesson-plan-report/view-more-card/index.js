import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, IconButton, SvgIcon } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import './view-more.css';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
// import Highcharts from 'highcharts';

const ViewMoreCard = ({
  viewMoreData,
  setViewMore,
  periodDataForView,
  setSelectedIndex,
}) => {
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const { setAlert } = useContext(AlertNotificationContext);

  const configObj = {
    chart: {
      type: 'bar',
    },
    title: {
      text: 'Chapter Wise Details',
      style: {
        fontSize: '1.1rem',
        color: '#ff6b6b',
        display: 'flex',
        justifyContent: 'space-between',
        margin: '15px 15px 10px 15px',
      },
    },
    xAxis: {
      categories: viewMoreData.map((p) => p.chapter_name),
      labels: {
        style: {
          fontSize: '1rem',
          fontWeight: '600',
          color: '#014b7e',
          margin: '10px 0px 0px 20px',
          display: 'flex',
          justifyContent: 'space-between',
        },
      },
    },
    yAxis: {
      min: 0,
      title: {},
    },
    legend: {
      reversed: true,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        showInLegend: true,
      },
      series: {
        stacking: 'normal',
      },
    },
    series: [
      {
        name: 'Total No. Of Periods',
        data: viewMoreData.map((p) => p.no_of_periods),
      },
      {
        name: 'Completed Periods',
        data: viewMoreData.map((p) => p.completed_periods),
      },
    ],
  };
  return (
    <Paper className='rootViewMore'>
      <div className='viewMoreHeader'>
        <div className='leftHeader'>
          <div className='headerTitle'>{periodDataForView?.first_name}</div>
          <div className='headerContent'>{periodDataForView?.section_name}</div>
        </div>
        <div className='rightHeader'>
          <div className='headerTitle closeIcon'>
            <IconButton
              onClick={() => {
                setViewMore(false);
                setSelectedIndex(-1);
              }}
            >
              <CloseIcon color='primary' />
            </IconButton>
          </div>
          <div className='headerContent'>
            <div>Last Session Conducted On</div>
            <div className='viewUpdatedDate'>03-01-2021</div>
          </div>
        </div>
      </div>
      <div className='resourceBulkDownload'>
        <div>Chapter Wise Details</div>
      </div>
      {viewMoreData?.map((p) => (
        <div className='viewMoreBody'>
          <div className='bodyTitle'>
            <div>{p?.chapter_name}</div>
            <div className='totalPeriod'>Total Period - {p?.no_of_periods}</div>
          </div>
          <div className='scrollableContent'>
            <div className='bodyContent'>
              <div>Period Completed</div>
              <div>{p.completed_periods}</div>
            </div>
          </div>
        </div>
      ))}

      {/* <HighchartsReact highcharts={Highcharts} options={configObj} /> */}
    </Paper>
  );
};

export default ViewMoreCard;
