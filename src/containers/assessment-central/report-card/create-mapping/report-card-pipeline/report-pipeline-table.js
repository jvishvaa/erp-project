/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useEffect, useContext } from 'react';
import {
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Paper,
  Button,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import moment from 'moment';
import TimerIcon from '@material-ui/icons/Timer';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import clsx from 'clsx';
import PipelineFilters from './report-pipeline-filters';
import { useHistory } from 'react-router-dom';
import '../../../../master-management/master-management.css';
import useStyles from '../../useStyles';
import { reportCardStyles } from './reportCardStyles';
import { getReportCardPipeline, deleteReportPipeline } from '../../apis';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import { reportPipelineTableColumns as columns } from './report-card-constants';
import { isSuccess, getPipelineConfig } from '../../report-card-utils';
import Pagination from '../../../../../components/PaginationComponent';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

const pageSize = 10;
const ReportPipelineTable = ({ setLoading, moduleId }) => {
  const classes = useStyles();
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const { setAlert } = useContext(AlertNotificationContext);
  const reportCardClasses = reportCardStyles();
  const history = useHistory();
  const [currPipeId, setCurrPipeId] = useState();
  const [mappingList, setMappingList] = useState();
  const [statusIndex, setStatusIndex] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [filterData, setFilterData] = useState({
    branch: '',
    grade: '',
    section: '',
    subject: '',
    status: '',
  });
  const handleDeleteCancel = () => {
    setDeleteId(null);
    setDeleteIndex(null);
    setDeleteAlert(false);
  };
  const handleDeleteOpen = (pipelineId) => {
    setCurrPipeId(pipelineId)
    setDeleteAlert(true);
  };
  const deleteReportCardPipeline = async (pipelineId) => {
    setLoading(true);
    try {
      const { status_code: status = 400, message = 'Error' } = await deleteReportPipeline(
        pipelineId
      );
      const isSuccesful = isSuccess(status);
      setAlert(isSuccesful ? 'success' : 'error', message);
      if (isSuccesful) {
        setUpdateFlag((prev) => !prev);
        setDeleteAlert(false)
      }
    } catch (err) { }
    setLoading(false);
  };

  const renderButtons = (status, pipelineId) => {
    return (
      <Grid container spacing={2}>
        {status === '2' && (
          <Grid item xs={4}>
            <IconButton onClick={() => handleDeleteOpen(pipelineId)}>
              <DeleteOutlineIcon />
            </IconButton>
          </Grid>
        )}
        <Grid item xs={status === '2' ? 4 : 8}>
          <IconButton
            disabled={status !== '2'}
            title={status === '2' ? 'View' : 'Can`t be viewed'}
            onClick={() => history.push('/assessment-reports/?report-card=true')}
          >
            {status !== '2' ? (
              <VisibilityOffIcon className={classes.disabledIcon} />
            ) : (
              <VisibilityIcon />
            )}
          </IconButton>
        </Grid>
        <Paper>
          <Dialog open={deleteAlert} onClose={handleDeleteCancel}>
            <DialogTitle
              id='draggable-dialog-title'
            >
              Delete Pipeline
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel} className='labelColor cancelButton'>
                Cancel
              </Button>
              <Button
                color='primary'
                variant='contained'
                style={{ color: 'white' }}
                onClick={() => deleteReportCardPipeline(currPipeId)}>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Grid>
    );
  };

  const getStatusCard = (pipelineStatusId, index) => {
    const { status, color, Icon } = getPipelineConfig(pipelineStatusId);
    return (
      <Box
        title={status}
        style={{
          border: `1px solid ${color}`,
          color,
        }}
        onMouseOver={() => setStatusIndex(index)}
        onMouseLeave={() => setStatusIndex(null)}
        className={clsx(
          reportCardClasses['status-card'],
          index === statusIndex ? reportCardClasses[`status-card--${status}`] : ''
        )}
      >
        <Box style={{ width: '25%' }}>
          <Icon style={{ color, fontSize: '1.3rem' }} />
        </Box>
        <Box
          style={{
            alignSelf: 'center',
            width: '75%',
            padding: '1px',
            whiteSpace: 'nowrap',
            fontSize: '14px',
            textTransform: 'capitalize'
          }}
        >
          {status}
        </Box>
      </Box>
    );
  };

  const getDuration = (createdAt, updatedAt) => {
    const durationData = [
      {
        duration: moment(new Date(createdAt)).format('hh:mm:ss'),
        Icon: TimerIcon,
        title: `Created on  ${moment(createdAt).format('DD-MM-YYYY')} at ${moment(
          createdAt
        ).format('hh:mm A')}`,
        placement: 'top',
      },
      {
        duration: moment(updatedAt).fromNow(),
        Icon: CalendarTodayIcon,
        title: `Last Updated on ${moment(updatedAt).format('DD-MM-YYYY')} at ${moment(
          updatedAt
        ).format('hh:mm A')}`,
        placement: 'bottom',
      },
    ];
    if (isMobile) {
      durationData.pop();
    }
    return (
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          height: '3rem',
          cursor: 'pointer',
        }}
      >
        {durationData.map(({ duration, Icon, title, placement }) => (
          <Tooltip title={title} placement={placement}>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box style={{ alignSelf: 'center' }}>
                <Icon style={{ fontSize: '0.875rem', color: '#666' }} />
              </Box>
              <Box
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#666',
                  marginLeft: '0.5rem',
                  marginBottom: '0.1rem',
                }}
              >
                {duration}
              </Box>
            </Box>
          </Tooltip>
        ))}
      </Box>
    );
  };

  const fetchReportCardPipeline = async () => {
    setLoading(true);
    try {
      const searchParams = generateSearchParamObject() || {};
      const {
        status = 400,
        message = 'Error',
        data = [],
        total_pages: totalPages = 0,
      } = await getReportCardPipeline(currentPage, pageSize, searchParams);
      setMappingList(data);
      setTotalPages(totalPages);
      const isSuccesful = isSuccess(status);
      setAlert(isSuccesful ? 'success' : 'error', message);
    } catch (err) { }
    setLoading(false);
  };

  const generateSearchParamObject = () => {
    const {
      branch = {},
      grade = {},
      section = {},
      subject = {},
      status = {},
    } = filterData || {};

    const { branch: branchObject = {} } = branch || {};
    const { id: branchId = '' } = branchObject || {};
    const { grade_id: gradeId = '' } = grade || {};
    const { section_id: sectionId = '' } = section || {};
    const { subject_id: subjectId = '' } = subject || {};
    const { id: statusId = '' } = status || {};

    const filterEntries = {
      branch: branchId,
      grade: gradeId,
      section: sectionId,
      subject: subjectId,
      status: statusId,
    };
    const searchParams = Object.entries(filterEntries).filter(
      ([key, value]) => !!value && { key: value }
    );
    const searchObject = Object.fromEntries(searchParams);
    return searchObject;
  };

  useEffect(() => {
    if (currentPage) {
      fetchReportCardPipeline();
    }
  }, [currentPage, filterData, updateFlag]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <PipelineFilters {...{ moduleId, filterData, setFilterData, setCurrentPage }} />
      </Grid>
      <Grid item xs={12}>
        <Paper className={`${classes.root} common-table`}>
          <TableContainer className={classes.containerGenerated}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead className='table-header-row'>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column?.minWidth }}
                      className={classes.columnHeader}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {mappingList?.map(
                  (
                    {
                      status,
                      id: pipelineId,
                      transaction_id: transactionId,
                      branch,
                      grade,
                      subject,
                      section,
                      updated_at: updatedAt,
                      created_at: createdAt,
                    },
                    index
                  ) => {
                    const [branchDetails] = branch || [];
                    const [gradeDetails] = grade || [];
                    const [subjectDetails] = subject || [];
                    const [sectionDetails] = section || [];
                    const { branch_name: branchName } = branchDetails || {};
                    const { grade_name: gradeName } = gradeDetails || {};
                    const { subject_name: subjectName } = subjectDetails || {};
                    const { section_name: sectionName } = sectionDetails || {};
                    return (
                      <TableRow hover academicyear='checkbox' tabIndex={-1} key={index}>
                        <TableCell className={classes.tableCell}>
                          {getStatusCard(status, index)}
                        </TableCell>
                        <TableCell
                          className={classes.tableCell}
                        >{`#${pipelineId}`}</TableCell>
                        <TableCell
                          className={classes.tableCell}
                        >{`#${transactionId}`}</TableCell>
                        <TableCell className={classes.tableCell}>{branchName}</TableCell>
                        <TableCell className={classes.tableCell}>{gradeName}</TableCell>
                        <TableCell className={classes.tableCell}>{sectionName}</TableCell>
                        <TableCell className={classes.tableCell}>{subjectName}</TableCell>
                        <TableCell className={classes.tableCell}>
                          {getDuration(createdAt, updatedAt)}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {renderButtons(status, pipelineId)}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Grid>
    </Grid>
  );
};

export default ReportPipelineTable;
