import React, { useEffect, useState, useRef, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import endpoints from '../../../../config/endpoints';
import axios from '../../../../config/axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import NoFilterData from 'components/noFilteredData/noFilterData';
import moment from 'moment';
import { FilterContext } from './ClassworkThree';
import ModalPending from './ModalPending';
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

function Submitted(props) {
  console.log('debugSub', props);
  const [tableData, setTableData] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [tableIndex, setIndex] = useState(null);
  const [output, setOutput] = useState({});
  const classes = useStyles();
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [open, setOpen] = React.useState(false);
  const [on, setOn] = React.useState(false);
  const [popup, setPopup] = useState([]);
  const [mainData, setMainData] = useState([]);
  const dataincoming = props.dataincoming;
  const [indexphotos, setindexphotos] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [dataLast, setDataLast] = useState([]);
  const [Subid, setSubid] = useState(props?.subjectId2);

  const {
    selectedSectionIds,
    subjectChangedfilterOn,
    subjectmappingId,
    defaultdate,
    sectionId
  } = useContext(FilterContext);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOpen = (data) => {
    console.log('tree4', data);
    if (dataincoming?.hwcwstatus) {
      popUpListData(data);
      setOpen(true);
    } else {
      setOpen(true);
      setPopup(data);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCl = () => {
    setOn(false);
  };

  const pendingList = () => {
    // if (subjectmappingId || props?.subjectId2) {
    let url, url1;
    if (subjectmappingId) {
      url = `${endpoints.teacherDashboard.submittedCWdata}?section_mapping=${Number(
        sectionId
      )}&subject=${subjectmappingId}&date=${props?.Date2}`
    }

    if (Subid) {
      url1 = `${endpoints.teacherDashboard.submittedCWdata}?section_mapping=${Number(
        props?.dataincoming?.detail?.section_mapping
      )}&subject=${Subid}&date=${props?.dataincoming?.detail?.date
        }&online_class_id=${props?.dataincoming?.detail?.online_class_id}`
    }


    axios
      .get(
        // `${endpoints.teacherDashboard.submittedCWdata}?section_mapping=2&subject=9&date=2022-02-01`,
        subjectChangedfilterOn
          ?
          url
          : url1,
        {
          headers: {
            'X-DTS-HOST': window.location.host,
            // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        setTableData(result?.data?.result?.result);
        console.log('treenewspending', result?.data?.result?.result);
        // setIndex(result?.data?.result?.un_submitted_list);
        // if (result?.data?.status_code === 200) {
        //   setStudentData(result);
        // } else {
        //   setAlert('error', result?.data?.message);
        // }
        // setLoading(false);
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
    // }
  };

  const UpdatedHwlist = () => {
    axios
      .get(
        subjectChangedfilterOn
          ? `${endpoints.teacherDashboard.submittedHWalldata}?subject_mapping_id=${subjectmappingId}&date=${props?.Date2}`
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
          setPendingData(result?.data?.un_submitted_list);
          if (result?.data?.submitted_list) setTableData(result?.data?.submitted_list);
          setIndex(result?.data?.un_submitted_list?.length);
        } else {
          setTableData([])
        }
        popUpList();
      })
      .catch((error) => {
        // setLoading(false);
      });
  };



  const fileList = (erpid) => {
    axios
      .get(
        subjectChangedfilterOn
          ? `${endpoints.teacherDashboard.fileHwData}?section_mapping=${sectionId}&subject=${subjectmappingId}&date=${props?.Date2}&erp=${erpid}`
          : `${endpoints.teacherDashboard.fileHwData}?section_mapping=${props?.sectionId2}&subject=${props?.subjectId2}&date=${props?.dataincoming?.detail?.date}&erp=${erpid}`,
        {
          headers: {
            'X-DTS-HOST': window.location.host,
            // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        setFileData(result?.data?.result);
        // setLoading(false);
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
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
        console.log('PendingHWList1', result?.data?.result);
        setModalData(result?.data?.result);

        parsedData(result?.data?.result);
        // setPopup(modalData);
        // setIndex(result?.data?.result?.total_students);
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
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
        console.log('PendingHWList2', result?.data?.result);
        setDataLast(result?.data?.result);
        // setPopup(modalData);
        // setIndex(result?.data?.result?.total_students);
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
  };

  const parsedData = (data) => {
    console.log('ParsedData', data);
    const obj = {};
    data.forEach((item) => {
      obj[item.id] = item;
    });
    setOutput(obj);
    console.log('Filtered', obj);
  };

  useEffect(() => {
    if (dataincoming.hwcwstatus) {
      UpdatedHwlist();
    } else {

      pendingList();

    }
  }, [props?.Date2, defaultdate, subjectmappingId]);

  const handleClickOn = (erpid, index) => {
    console.log('ERP', erpid);
    setOn(true);
    setindexphotos(index);
    if (!dataincoming?.hwcwstatus) {
      fileList(erpid);
    }
  };

  useEffect(() => {
    console.log('a');
  }, [open]);
  let inputRef = useRef();
  const [Ind, setInd] = useState(0);
  let inputImage = (img) => {
    inputRef.current.src = img;
  };
  console.log('Submitted1', tableData);
  return (
    <>
      <Grid container>
        <Typography style={{ fontSize: '10px', fontWeight: '700' }}>
          Student List
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
                console.log('Submitted', data);
                let interval = Math.trunc(
                  moment.duration(moment() - moment(data.submitted_at)).asDays()
                );
                return (
                  <TableBody>
                    <TableRow
                      // key=bonnie
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
                          {dataincoming?.hwcwstatus ? (
                            <>
                              <Typography style={{ fontSize: '12px' }}>
                                {data.first_name} {data.last_name}
                              </Typography>
                              <Typography style={{ fontSize: '12px' }}>
                                {data.erp_id}
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Typography style={{ fontSize: '12px' }}>
                                {data.name}
                              </Typography>
                              <Typography style={{ fontSize: '12px' }}>
                                {data.erp}
                              </Typography>
                            </>
                          )}
                        </Grid>
                      </TableCell>
                      <TableCell
                        style={{
                          color: '#061B2E',
                          paddingRight: '50px',
                          height: '22px ',
                        }}
                      >
                        {dataincoming?.hwcwstatus ? (
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
                        ) : (
                          <Grid
                            item
                            style={{
                              border: '1px solid #FFC4C4',
                              borderRadius: '5px',
                              color: '#E33535',
                              padding: '2px 10px',
                              width: 'maxContent',
                              cursor: 'pointer',
                            }}
                          >
                            <Typography onClick={() => handleOpen(index)}>
                              <>
                                <span
                                  style={{
                                    fontSize: '12px',
                                    paddingRight: '8px',
                                    fontWeight: '800',
                                    borderRadius: '57%',
                                    backgroundColor: '#FFC4C4',
                                    padding: '5px 8px',
                                    marginRight: '15px',
                                    width: 'maxContent',
                                  }}
                                >
                                  {data.not_submitted_count}
                                </span>
                                <span style={{ fontSize: '12px' }}>
                                  Pending {data.not_submitted_count} more Tests
                                </span>
                              </>
                            </Typography>
                          </Grid>
                        )}
                      </TableCell>
                      <TableCell style={{ paddingRight: '15rem' }}></TableCell>
                      <TableCell
                        align='right'
                        style={{ color: '#061B2E', height: '22px' }}
                      >
                        <Grid container direction='row' alignItems='center'>
                          {dataincoming?.hwcwstatus ? (
                            <Typography
                              style={{
                                fontSize: '10px',
                                paddingRight: '40px',
                                paddingLeft: '10px',
                                width: 'maxContent',
                              }}
                            >
                              {interval > 30
                                ? `${Math.trunc(interval / 30)} Month Ago`
                                : interval > 0
                                  ? `${interval} Days ago`
                                  : 'Today'}
                            </Typography>
                          ) : (
                            <Typography
                              style={{
                                fontSize: '10px',
                                paddingRight: '40px',
                                paddingLeft: '10px',
                                width: 'maxContent',
                              }}
                            >
                              {data.not_submitted_list.length > 0
                                ? data.not_submitted_list[0].date
                                : ''}
                            </Typography>
                          )}
                        </Grid>
                      </TableCell>
                      <TableCell
                        align='right'
                        style={{ color: '#061B2E', height: '22px' }}
                      >
                        <Grid container direction='row' alignItems='center'>
                          <Typography
                            onClick={() => {
                              const erp = dataincoming?.hwcwstatus
                                ? data.erp_id
                                : data.erp;
                              return handleClickOn(erp, index);
                            }}
                            style={{
                              fontSize: '12px',
                              paddingRight: '40px',
                              paddingLeft: '10px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <PictureAsPdfIcon style={{ marginRight: 10 }} />
                            Files
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
      <Dialog
        open={on}
        onClose={handleCl}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='fitContent'
      >
        <div
          style={{
            height: '100%',
            width: '70rem',
            margin: 'auto',
            display: 'flex',
          }}
        >
          <div
            style={{
              backgroundColor: 'grey',
              height: '400px',
              width: '20%',
              cursor: 'pointer',
            }}
          >
            <div>
              <p style={{ color: 'white' }}>Click to View</p>
            </div>
            {dataincoming && dataincoming?.hwcwstatus
              ? tableData &&
              tableData[indexphotos]?.uploaded_file?.map((file, index) => {
                const filename = file.split('/')[3];
                console.log('HWfile', file);
                return (
                  <div>
                    <Card
                      style={{ display: 'flex' }}
                      onClick={() =>
                        inputImage(`${endpoints.lessonPlan.s3erp}homework/${file}`)
                      }
                    >
                      <FileCopyIcon />
                      <p>{filename}</p>
                    </Card>
                  </div>
                );

              })
              : fileData.length &&
              fileData.map((file, index) => {
                const filename = file.split('/')[6];
                return (
                  <div>
                    <Card
                      style={{ display: 'flex' }}
                      onClick={() =>
                        inputImage(`${endpoints.discussionForum.s3}${file}`)
                      }
                    >
                      <FileCopyIcon />
                      <p>{filename}</p>
                    </Card>
                  </div>
                );

              })}
          </div>
          <div
            style={{
              backgroundColor: 'grey',
              height: '400px',
              width: '80%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img ref={inputRef}></img>
          </div>
        </div>
      </Dialog>
      {tableData && tableData?.length === 0 ? (
        <div style={{ height: 400, margin: 'auto', marginTop: '70px' }}>
          {/* <NoFilterData data={'No Data Found'} /> */}
        </div>
      ) : (
        <ModalPending
          index1={dataincoming?.hwcwstatus}
          // key1={index}
          row={tableData[popup]}
          col={dataLast}
          // row={dataincoming.hwcwstatus ? dataLast : tableData[popup]}
          open={open}
          handleClose={handleClose}
        />
      )}
    </>
  );
}

export default Submitted;
