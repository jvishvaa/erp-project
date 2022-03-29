import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

// function createData(name, a, b, c, d, e) {
//   return { name, a, b, c, d, e };
// }
// const rows = [
//   createData('Branch1', 'a', ' b', 'c', 'd', 'e'),
//   createData('Branch2', 'a', 'b', 'c', 'd', 'e'),
// ];

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//   },
//   table: {
//     padding: '0px',
//   },
// }));

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
function Submitted() {
  return (
    <>
      <Grid container>
        <Typography style={{ fontSize: '10px', fontWeight: '700' }}>
          60 studens(remarks)
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
        <Grid item>
          <Grid container direction='row' alignItems='center'>
            <Grid item style={{ paddingRight: '10px' }}>
              <Avatar size='small' alt='aks' src='' />
            </Grid>
            <Grid item style={{ paddingRight: '60px' }}>
              <Typography style={{ fontSize: '12px' }}>Student Name</Typography>
              <Typography style={{ fontSize: '12px' }}>Reg No</Typography>
            </Grid>
            <Grid
              item
              style={{
                border: '1px solid #FFC4C4',
                borderRadius: '5px',
                color: '#E33535',
                padding: '2px 10px',
              }}
            >
              <Typography>
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
                  3
                </span>
                <span style={{ fontSize: '12px' }}>Pending 3 for more test</span>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container justifyContent='space-between'>
            <Grid item>
              <Typography style={{ fontSize: '12px', paddingRight: '30px' }}>
                9.0
              </Typography>
            </Grid>
            <Grid item>
              <Grid container direction='row' alignItems='center'>
                <Typography
                  style={{
                    fontSize: '12px',
                    paddingRight: '251px',
                    paddingLeft: '10px',
                    backgroundColor: '#F1F2F5',
                    border: '0.5 px solid #F1F2F5',
                    fontWeight: 'bold',
                  }}
                >
                  Need to imrove
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Submitted;
