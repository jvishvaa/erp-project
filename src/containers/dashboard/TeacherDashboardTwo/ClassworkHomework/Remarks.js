import React, { useEffect, useState, useRef, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ModalSubmitted from './ModalSubmitted';
import endpoints from '../../../../config/endpoints';
import axios from '../../../../config/axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import NoFilterData from 'components/noFilteredData/noFilterData';
import { FilterContext } from './ClassworkThree';

import moment from 'moment';
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Remarks(props) {
  const [tableData, setTableData] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [tableIndex, setIndex] = useState(null);
  const classes = useStyles();
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [open, setOpen] = React.useState(false);
  const [on, setOn] = React.useState(false);
  const [popup, setPopup] = useState([]);
  const [mainData, setMainData] = useState([]);
  const dataincoming = props.dataincoming;

  const {
    selectedSectionIds,
    subjectChangedfilterOn,
    subjectmappingId,
    defaultdate,
  } = useContext(FilterContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOpen = (data) => {
    setOpen(true);
    setPopup(data);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCl = () => {
    setOn(false);
  };

  const UpdatedHwlist = () => {
    axios
      .get(
        subjectChangedfilterOn
          ? `${endpoints.teacherDashboard.submittedHWalldata}?subject_mapping_id=${subjectmappingId}&date=${defaultdate}`
          : `${endpoints.teacherDashboard.submittedHWalldata}?homework=${props?.dataincoming?.detail?.homework_id}&period_id=${props?.dataincoming?.detail?.period_id}`,
        {
          headers: {
            'X-DTS-HOST': window.location.host,
            // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          if (result?.data?.evaluated_list) {
            setTableData(result?.data?.evaluated_list);
          } else {
            setTableData([])
          }
        }
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
  };

  useEffect(() => {
    UpdatedHwlist();
  }, [props?.Date2, defaultdate, subjectmappingId]);

  const handleClickOn = () => {
    setOn(true);
  };

  useEffect(() => {
    console.log('a');
  }, [open]);
  let inputRef = useRef(null);
  const [Ind, setInd] = useState(0);
  let inputImage = (ing) => {
    inputRef.current.src = ing;
  };
  return (
    <>
      <Grid container>
        <Grid
          item
          xs={12}
          md={12}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Grid xs={6} md={6}>
            Student List
          </Grid>
          <Grid xs={6} md={6} style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Grid xs={6} md={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              Score
            </Grid>
            <Grid xs={6} md={6} style={{ display: 'flex', justifyContent: 'center' }}>
              Remarks
            </Grid>
          </Grid>
          {/* <TableCell>Remarks</TableCell> */}
        </Grid>
        {/* </Typography> */}
      </Grid>
      {tableData && tableData?.length === 0 ? (
        <div style={{ height: 400, margin: 'auto', marginTop: '70px' }}>
          <NoFilterData data={'No Data Found'} />
        </div>
      ) : (
        <Grid
          container
          xs={12}
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          style={{
            border: '1px solid #E8E8E8',
            paddingRight: '20px',
            paddingLeft: '20px',
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              {tableData.map((data, index) => {
                return (
                  <TableBody>
                    <TableRow
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    // onClick={assessmentHandler}
                    >
                      <TableCell
                        style={{ display: 'flex', justifyContent: 'flex-start' }}
                      >
                        <Avatar
                          style={{ height: '40px', paddingRight: '' }}
                          aria-label='recipe'
                        >
                          <AccountCircleIcon />
                        </Avatar>
                        <Grid item style={{ marginLeft: '10px' }}>
                          <Typography style={{ fontSize: '12px' }}>
                            {data.first_name} {data.last_name}
                          </Typography>
                          <Typography style={{ fontSize: '12px' }}>
                            {data.erp_id}
                          </Typography>
                        </Grid>
                      </TableCell>
                      <TableCell
                        style={{
                          color: '#061B2E',
                          paddingRight: '50px',
                          height: '22px ',
                        }}
                      >
                        <Grid
                          item
                          style={{
                            border: !dataincoming.hwcwstatus
                              ? '1px solid #FFC4C4'
                              : 'none',
                            borderRadius: '5px',
                            color: '#E33535',
                            padding: '2px 10px',
                            width: 'maxContent',
                          }}
                        >
                          <Typography>''</Typography>
                        </Grid>
                      </TableCell>
                      <TableCell style={{ paddingRight: '15rem' }}></TableCell>
                      <TableCell
                        align='right'
                        style={{ color: '#061B2E', height: '22px' }}
                      >
                        <Grid container direction='row' alignItems='center'>
                          <Typography
                            style={{
                              fontSize: '10px',
                              paddingRight: '40px',
                              paddingLeft: '10px',
                              width: 'maxContent',
                            }}
                          >
                            {data.score}
                          </Typography>
                        </Grid>
                      </TableCell>
                      <TableCell
                        align='right'
                        style={{ color: '#061B2E', height: '22px' }}
                      >
                        <Grid container direction='row' alignItems='center'>
                          <Typography
                            onClick={handleClickOn}
                            style={{
                              fontSize: '12px',
                              paddingRight: '40px',
                              paddingLeft: '10px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            {data.remarks}
                          </Typography>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                );
              })}
            </Table>
          </TableContainer>
        </Grid>
      )}
    </>
  );
}

export default Remarks;
