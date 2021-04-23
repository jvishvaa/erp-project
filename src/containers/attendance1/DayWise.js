import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { Grid } from 'react-virtualized';

import { TextField } from '@material-ui/core';

const columns = [
  { id: 'S_No', label: 'S.No', minWidth: 170 },
  { id: 'Name', label: 'Name', minWidth: 100 },
  {
    id: 'Enroll_No',
    label: 'Enroll.No',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'First_Shift',
    label: 'First Shift',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'Second_Shift',
    label: 'Second Shift',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'Remarks',
    label: 'Remarks',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(),
  },
];


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  // container: {
  //   maxHeight: 440,
  // },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [dayWiseData, setDayWiseData] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedValue, setSelectedValue] = React.useState('a');


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(()=>{
    
    
    axiosInstance(endpoints.Calendar_attendance.DayWise_list).then((res)=>{
      console.log("response",res.data)
      setDayWiseData(res.data.result.attendance)
    })

  },[])
  const handleattendence = (event) => {
    console.warn(event.targaet.value)
    // alert("attendence")
    setSelectedValue(event.target.value);
  };
  const handleChange = (event) => {
    // alert("attendence")
    // setSelectedValue(event.target.value);
  };

  return (
    
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Enroll.No</TableCell>
              <TableCell>FirstShift</TableCell>
              <TableCell>SecondShift</TableCell>
              <TableCell>Remarks</TableCell>
            </TableRow>
          </TableHead>
         
            {dayWiseData.map((data)=>{
              return(
                <TableBody>
                <TableRow>
                <TableCell>
                  {data.id}
                </TableCell>
                <TableCell>
                  {data.student}
                </TableCell>
                <TableCell>
                  {data.erp_id}
                </TableCell>
              
                <TableCell >
                  {/* {data.is_first_shift_present} */}
                 
                
           
                  {/* <FormControl component="fieldset">
      <RadioGroup row aria-label="position" name="position" defaultValue="top">
       <FormControlLabel value="end" control={<Radio color="primary" />} label="P" />
       <FormControlLabel value="end" control={<Radio color="primary" />} label="L" />
      </RadioGroup>
    </FormControl> */}
            <Radio
        checked={selectedValue === 'a'}
        onChange={handleattendence}
        value="a"
        label="p"
        labelPlacement="end"
        name="radio-button-demo"
        inputProps={{ 'aria-label': 'A' }}
      />
      <Radio
        checked={selectedValue === 'b'}
        onChange={handleattendence}
        value="b"
        label="p"
        labelPlacement="end"
        name="radio-button-demo"
        inputProps={{ 'aria-label': 'B' }}
      />
                
                  
    
                </TableCell>
            
                
                <TableCell>
                  {/* {data.is_second_shift_present} */}
                  
                  <Radio
        checked={selectedValue === 'a'}
        onChange={handleattendence}
        value="a"
        label="p"
        labelPlacement="end"
        name="radio-button-demo"
        inputProps={{ 'aria-label': 'A' }}
      />
      <Radio
      value="data.is_second_shift_present"
      color="primary"
      checked={selectedValue === 'data.is_second_shift_present'}  
      onChange={handleattendence}

      />
 
                </TableCell>
                <TableCell>
                  {data.remarks}
                </TableCell>
              </TableRow>
              </TableBody>
              )
           
            })}
         
        </Table>
      </TableContainer>
     
    </Paper>
  );
}
