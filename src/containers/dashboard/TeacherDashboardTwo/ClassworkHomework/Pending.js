import React, { useEffect, useState, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import ModalPending from './ModalPending';
import endpoints from '../../../../config/endpoints';
import axios from '../../../../config/axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import NoFilterData from 'components/noFilteredData/noFilterData';
import { FilterContext } from './ClassworkThree'

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

function Pending(props) {
  console.log('debugPending', props);
  const [open, setOpen] = React.useState(false);
  const [tableData, setTableData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [tableIndex, setIndex] = useState(null);
  const [pendingid, setPendingId] = useState(null);
  const [popup, setPopup] = useState([]);
  const [idMain, setIdMain] = useState([]);
  const [dataLast, setDataLast] = useState([]);
  const [output, setOutput] = useState({});
  const classes = useStyles();
  const dataincoming = props.dataincoming;

  const { sectionId, subjectChangedfilterOn, subjectmappingId, defaultdate } = useContext(FilterContext)
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const pendingList = () => {
    if (dataincoming?.hwcwstatus) {
      axios
        .get(
          (subjectChangedfilterOn)
            ?
            `${endpoints.teacherDashboard.submittedHWalldata}?subject_mapping_id=${subjectmappingId}&date=${props?.Date2}`
            :
            `${endpoints.teacherDashboard.submittedHWalldata}?homework=${props?.dataincoming?.detail?.homework_id}&period_id=${props?.dataincoming?.detail?.period_id}`,
          {
            headers: {
              'X-DTS-HOST': window.location.host,
              // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((result) => {
          if (result?.data?.un_submitted_list)
            setTableData(result?.data?.un_submitted_list);
          popUpList();

          // setId(result?.data?.result?.id);
          // setIndex(result?.data?.result?.total_students);
        })
        .catch((error) => {
          // setAlert('error', error?.message);
          // setLoading(false);
        });
    } else {
      axios
        .get(
          (subjectChangedfilterOn)
            ?
            `${endpoints.teacherDashboard.pendingCWdata}?section_mapping=${sectionId}&subject_id=${subjectmappingId}&date=${props?.Date2}`
            :
            `${endpoints.teacherDashboard.pendingCWdata}?section_mapping=${Number(
              props?.dataincoming?.detail?.section_mapping
            )}&subject=${props?.subjectId2}&date=${props?.dataincoming?.detail?.date
            }&online_class_id=${props?.dataincoming?.detail?.online_class_id}`,
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
            setTableData(result?.data?.result?.result);
            setIndex(result?.data?.result?.total_students);
          } else {
            setTableData([]);
          }
        })
        .catch((error) => {
          // setAlert('error', error?.message);
          // setLoading(false);
        });
    }
  };
  const popUpList = () => {
    axios
      .get(
        (subjectChangedfilterOn)
          ?
          `${endpoints.teacherDashboard.HWPendingStudentList}?section_mapping=${sectionId}&subject_id=${subjectmappingId}&date=${props?.Date2}`
          :
          `${endpoints.teacherDashboard.HWPendingStudentList}?section_mapping=${Number(
            props?.dataincoming?.detail?.section_mapping_id
          )}&subject_id=${props?.subjectId2}&date=${props?.Date2}`,
        {
          headers: {
            'X-DTS-HOST': window.location.host,
            // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        setModalData(result?.data?.result);
        parsedData(result?.data?.result);
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
  };

  const parsedData = (data) => {
    const obj = {};
    data.forEach((item) => {
      obj[item.id] = item;
    });
    setOutput(obj);
  };

  const popUpListData = (id) => {
    axios
      .get(
        (subjectChangedfilterOn)
          ?
          `${endpoints.teacherDashboard.HWPendingData}?section_mapping=${sectionId}&subject_id=${subjectmappingId}&erp_id=${id}&date=${props?.Date2}`
          :
          `${endpoints.teacherDashboard.HWPendingData}?section_mapping=${Number(
            props?.dataincoming?.detail?.section_mapping_id
          )}&subject_id=${props?.subjectId2}&erp_id=${id}&date=${props?.Date2}`,
        {
          headers: {
            'X-DTS-HOST': window.location.host,
            // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        setDataLast(result?.data?.result);
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
  };

  useEffect(() => {
    pendingList();
  }, [props?.Date2, defaultdate, subjectmappingId]);

  const handleOpen = (data) => {
    if (dataincoming?.hwcwstatus) {
      popUpListData(data);
      setOpen(true);
    } else {
      setOpen(true);
      setPopup(data);
    }
  };

  useEffect(() => {
    console.log('a');
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      <Grid container>
        <Typography style={{ fontSize: '10px', fontWeight: '700' }}>
          Students (pending)
        </Typography>
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
              {tableData?.map((data, index) => {
                return (
                  <TableBody>
                    <TableRow
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
                            {dataincoming?.hwcwstatus
                              ? `${data.first_name} ${data.last_name}`
                              : data.name}
                          </Typography>
                          <Typography style={{ fontSize: '12px' }}>
                            {dataincoming?.hwcwstatus ? data.erp_id : data.erp}
                          </Typography>
                        </Grid>
                      </TableCell>
                      <TableCell
                        style={{
                          color: '#061B2E',
                          paddingRight: '50px',
                          height: '22px ',
                          cursor: 'pointer',
                        }}
                      >
                        {!dataincoming?.hwcwstatus ? (
                          <>
                            <Grid
                              item
                              style={{
                                border: '1px solid #FFC4C4',
                                borderRadius: '5px',
                                color: '#E33535',
                                padding: '2px 10px',
                              }}
                            >
                              <Typography onClick={() => handleOpen(index)}>
                                <span
                                  style={{
                                    fontSize: '12px',
                                    paddingRight: '8px',
                                    fontWeight: '800',
                                    borderRadius: '57%',
                                    backgroundColor: '#FFC4C4',
                                    padding: '5px 8px',
                                    marginRight: '15px',
                                  }}
                                >
                                  {dataincoming?.hwcwstatus
                                    ? data.hw_pending_count
                                    : data.not_submitted_count}
                                </span>
                                <span style={{ fontSize: '12px' }}>
                                  Pending {data.not_submitted_count} more Tests
                                </span>
                              </Typography>
                            </Grid>
                          </>
                        ) : (
                          <>
                            {output[data.id] && output[data.id].hw_pending_count > 0 && (
                              <Grid
                                item
                                style={{
                                  border: '1px solid #FFC4C4',
                                  borderRadius: '5px',
                                  color: '#E33535',
                                  padding: '2px 10px',
                                }}
                              >
                                <Typography onClick={() => handleOpen(data.id)}>
                                  <span
                                    style={{
                                      fontSize: '12px',
                                      paddingRight: '8px',
                                      fontWeight: '800',
                                      borderRadius: '57%',
                                      backgroundColor: '#FFC4C4',
                                      padding: '5px 8px',
                                      marginRight: '15px',
                                    }}
                                  >
                                    {dataincoming?.hwcwstatus
                                      ? output[data.id].hw_pending_count
                                      : data.not_submitted_count}
                                  </span>
                                  <span style={{ fontSize: '12px' }}>
                                    Pending {output[data.id].hw_pending_count} more Tests
                                  </span>
                                </Typography>
                              </Grid>
                            )}
                          </>
                        )}
                      </TableCell>
                      <TableCell style={{ paddingRight: '25rem' }}></TableCell>
                      <TableCell
                        align='right'
                        style={{ color: '#061B2E', height: '22px' }}
                      >
                        <Grid container direction='row' alignItems='center'>
                          <Typography
                            // onClick={handleOpen}
                            style={{
                              fontSize: '12px',
                              paddingRight: '40px',
                              paddingLeft: '10px',
                            }}
                          >
                            Pending
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
      {tableData && tableData?.length === 0 ? (
        <div style={{ height: 400, margin: 'auto', marginTop: '70px' }}>
          <NoFilterData data={'No Data Found'} />
        </div>
      ) : (
        <ModalPending
          index1={dataincoming?.hwcwstatus}
          row={tableData[popup]}
          col={dataLast}
          open={open}
          handleClose={handleClose}
        />
      )}
    </>
  );
}

export default Pending;
