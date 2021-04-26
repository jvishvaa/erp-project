import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Checkbox from '@material-ui/core/Checkbox';




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
    // maxHeight: 440,
    // },
});

export default function TableStudentAttendence() {
    const classes = useStyles();
    const [getDatastudent, setGetDatastudent] = React.useState();
    const [page, setPage] = React.useState(0);
    const [dayWiseData, setDayWiseData] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [selectedValue, setSelectedValue] = React.useState('a');
    const [state, setState] = React.useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    React.useEffect(() => {
        axiosInstance(endpoints.Calendar_attendance.DayWise_list).then((res) => {
            console.log("response", res.data)
            setDayWiseData(res.data.result.attendance)
        })

    }, [])
    const handleattendence = (event) => {
        console.warn(event.targaet.value)
        // alert("attendence")
        setSelectedValue(event.target.value);
    };
    const handleChange = (event) => {
        // alert("attendence")
        // setSelectedValue(event.target.value);
    };
    const handleChangeCheck = (event) => {
        // setState({ ...state, [event.target.name]: event.target.checked });
    };

    return (
        <>
            <Paper container className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell>Student Name</TableCell>
                                <TableCell>Erp_No</TableCell>
                                <TableCell>Attendence Status</TableCell>
                                <TableCell>Remarks</TableCell>
                            </TableRow>
                        </TableHead>
                        {dayWiseData.map((data) => {
                            return (
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
                                            <FormControl component="fieldset">
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={<Checkbox size="small"onChange={handleChangeCheck} />}
                                                        label="All Day"
                                                    />
                                                    <FormControlLabel
                                                        control={<Checkbox size="small" onChange={handleChangeCheck} />}
                                                        label="First Half"
                                                    />
                                                    <FormControlLabel
                                                        control={<Checkbox size="small" onChange={handleChangeCheck} />}
                                                        label="Second Half"
                                                    />
                                                </FormGroup>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>
                                            <TextareaAutosize
                                                rowsMin={5}
                                                placeholder="Description"
                                                style={{ width: "75%" }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            )
                        })}
                    </Table>
                </TableContainer>
                     <Button style={{ backgroundColor: 'lightgrey', color: 'black', border: "1.5px solid black", marginRight: '90%', padding: '0.5% 5%' }}>Save</Button>
                     
            </Paper>
        </>

    );
}

