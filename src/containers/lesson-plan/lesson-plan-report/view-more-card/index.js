import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { IconButton, Button, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import './view-more-report.css';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';

const useStyles = makeStyles((theme) => ({
  rootViewMore: theme.rootViewMore,
}));

const ViewMoreCard = ({
  viewMoreData,
  setViewMore,
  periodDataForView,
  setSelectedIndex,
}) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);

  const handleDownloadExcel = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.lessonReport.lessonViewMoreData}?central_gs_mapping_id=${
          periodDataForView?.central_gs_mapping_id
        }&volume_id=${periodDataForView.volume_id}&academic_year_id=${
          periodDataForView?.academic_year_id
        }&completed_by=${periodDataForView?.completed_by}&export=${'excel'}`,
        {
          responseType: 'arraybuffer',
        }
      );

      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Lesson_Plan_Report_${new Date()}`;
      link.click();
      link.remove();
    } catch (error) {
      setAlert('error', 'Failed to download attendee list');
    }
  };

  return (
    <>
      <Paper className={classes.rootViewMore}>
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
              <Button onClick={handleDownloadExcel}>Download Excel</Button>
            </div>
          </div>
        </div>
        <div className='resourceBulkDownload-'>
          <TableContainer component={Paper}>
            <Table size='small' aria-label='a dense table'>
              <TableHead>
                <TableRow>
                  <TableCell style={{ textAlign: 'left !important' }}>Chapter</TableCell>
                  <TableCell align='right'>Completed periods</TableCell>
                  <TableCell align='right'>Total periods</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {viewMoreData?.map((chapterInfo) => {
                  return (
                    <TableRow>
                      <TableCell style={{ textAlign: 'left !important' }} align='left'>
                        {chapterInfo.chapter_name}
                      </TableCell>
                      <TableCell align='right'>{chapterInfo.completed_periods}</TableCell>
                      <TableCell align='right'>{chapterInfo.no_of_periods}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Paper>
    </>
  );
};

export default ViewMoreCard;
