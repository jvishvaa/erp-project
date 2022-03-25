import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ModalPending from './ModalPending';
import endpoints from '../../../../config/endpoints';
import axios from '../../../../config/axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const DummyArr = [
  {
    name: 'Ankit',
    Reg: '34565675',
    pending: '3',
    ago: '2',
  },
  {
    name: 'Bonnie',
    Reg: '34565675',
    pending: '3',
    ago: '2',
  },
];

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

function Submitted({ section, subject, date }) {
  const [open, setOpen] = React.useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableIndex, setIndex] = useState(null);
  const [popup, setPopup] = useState([]);
  const classes = useStyles();
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const pendingList = () => {
    axios
      .get(
        `${endpoints.teacherDashboard.pendingHWdata}?section_mapping=${section}&subject=${subject}`,
        {
          headers: {
            // 'X-DTS-HOST': 'dev.olvorchidnaigaon.letseduvate.com',
            'X-DTS-HOST': window.location.host,
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        setTableData(result?.data?.result?.result);
        setIndex(result?.data?.result?.total_students);
        // setPopup(result?.data?.result?.result);
        // console.log('TreePop', result?.data?.result?.result);
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
  };
  useEffect(() => {
    pendingList();
  }, [section, subject]);
  const handleOpen = (data) => {
    console.log('tree4', data);
    setOpen(true);
    setPopup(data);

    // return (
    //   <>
    //     {tableData.map((data) => (
    //       <ModalPending
    //         index1={tableIndex}
    //         row={data}
    //         open={open}
    //         handleClose={handleClose}
    //       />
    //     ))}
    //   </>
    // );
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
          {tableIndex} studens (pending)
        </Typography>
      </Grid>
      <Grid
        container
        xs={12}
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        style={{ border: '1px solid #E8E8E8', paddingRight: '20px', paddingLeft: '20px' }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            {tableData?.map((data, index) => {
              console.log('Tree2', data);
              console.log('Tree3', index);
              return (
                <TableBody>
                  <TableRow
                    // key=bonnie
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    // onClick={assessmentHandler}
                  >
                    <TableCell style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <Avatar
                        style={{ height: '40px', paddingRight: '' }}
                        aria-label='recipe'
                      >
                        3
                      </Avatar>
                      <Grid item style={{ marginLeft: '10px' }}>
                        <Typography style={{ fontSize: '12px' }}>{data.name}</Typography>
                        <Typography style={{ fontSize: '12px' }}>{data.erp}</Typography>
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ color: '#061B2E', paddingRight: '50px', height: '22px ' }}
                    >
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
                            {data.not_submitted_count}
                          </span>
                          <span style={{ fontSize: '12px' }}>
                            Pending {data.not_submitted_count} more Tests
                          </span>
                        </Typography>
                      </Grid>
                    </TableCell>
                    <TableCell style={{ paddingRight: '25rem' }}></TableCell>
                    <TableCell align='right' style={{ color: '#061B2E', height: '22px' }}>
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
      <ModalPending
        index1={tableIndex}
        // key1={index}
        row={tableData?.[popup]}
        open={open}
        handleClose={handleClose}
      />
    </>
  );
}

export default Submitted;
