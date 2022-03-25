import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles, makeStyles } from '@material-ui/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import moment from 'moment';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Layout from '../../../../containers/Layout';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import { ArrowForwardIos as ArrowForwardIosIcon } from '@material-ui/icons';
import axios from 'axios';
import endpoints from 'config/endpoints';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import axiosInstance from 'config/axios';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    //   padding: theme.spacing(2),
    padding: '20px',
    textAlign: 'center',
    color: 'blue',
    //   color: theme.palette.text.secondary
  },
});

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(1)': {
      // backgroundColor: theme.palette.action.hover,
      backgroundColor: '#f5f5f5',
    },
  },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
  root: {
    '&:nth-of-type(1)': {
      // backgroundColor: theme.palette.action.hover,
      backgroundColor: '#EBF2FE',
    },
  },
}))(TableCell);

function createData(
  name,
  subject,
  date,
  totalSubmitted,
  totalPending,
  totalEvaluated,
  Title
) {
  return { name, subject, date, totalSubmitted, totalPending, totalEvaluated, Title };
}

var tableData1 = [
  createData(
    'Grade 1 - Section B',
    'English',
    '01/01/2020 Mon',
    '65(58%)',
    '25%(12)',
    '90%(48)',
    'Neque pornore'
  ),
  createData(
    'Grade 1 - Section C',
    'Science',
    '01/01/2020 Tue',
    '65(58%)',
    '25%(12)',
    '90%(48)',
    'Neque pornore'
  ),
  createData(
    'Grade 2 - Section A',
    'Maths',
    '01/01/2020 Wed',
    '65(58%)',
    '25%(12)',
    '90%(48)',
    'Neque pornore'
  ),
  createData(
    'Grade 2 - Section B',
    'English',
    '01/01/2020 Thu',
    '65(58%)',
    '25%(12)',
    '90%(48)',
    'Neque pornore'
  ),
  createData(
    'Grade 3 - Section A',
    'Science',
    '01/01/2020 Fri',
    '65(58%)',
    '25%(12)',
    '90%(48)',
    'Neque pornore'
  ),
  createData(
    'Grade 3 - Section B',
    'Science',
    '01/01/2020 Sat',
    '65(58%)',
    '25%(12)',
    '90%(48)',
    'Neque pornore'
  ),
  createData('Grade 4 - Section A', 'English'),
  createData('Grade 4 - Section B', 'Science'),
  createData('Grade 5 - Section A', 'English'),
];

function tableData(
  grade_name,
  section_name,
  subject_name,
  upload_date,
  total_submitted,
  total_pending,
  total_evaluated,
  subjectID
) {
  return {
    grade_name,
    section_name,
    subject_name,
    upload_date,
    total_submitted,
    total_pending,
    total_evaluated,
    subjectID,
  };
}

const tableData3 = [
  createData(
    'Grade 1 - Section B',
    'English',
    '01/01/2020 Mon',
    '23(58%)',
    '43%(12)',
    '40%(48)',
    'Monte Christo'
  ),
  createData(
    'Grade 1 - Section C',
    'Science',
    '01/01/2020 Tue',
    '24(58%)',
    '43%(12)',
    '40%(48)',
    'Monte Christo'
  ),
  createData(
    'Grade 2 - Section A',
    'Maths',
    '01/01/2020 Wed',
    '22(58%)',
    '43%(12)',
    '40%(48)',
    'Monte Christo'
  ),
  createData(
    'Grade 2 - Section B',
    'English',
    '01/01/2020 Thu',
    '23(58%)',
    '43%(12)',
    '40%(48)',
    'Monte Christo'
  ),
  createData(
    'Grade 3 - Section A',
    'Science',
    '01/01/2020 Fri',
    '34(58%)',
    '43%(12)',
    '40%(48)',
    'Monte Christo'
  ),
  createData(
    'Grade 3 - Section B',
    'Science',
    '01/01/2020 Sat',
    '21(58%)',
    '43%(12)',
    '40%(48)',
    'Monte Christo'
  ),
  createData('Grade 4 - Section A', 'English'),
  createData('Grade 4 - Section B', 'Science'),
  createData('Grade 5 - Section A', 'English'),
];

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

class HomeworkClasswork extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grade: [{ title: 'All' }, { title: 'BLR' }, { title: 'OLV' }],
      gradeListData: [],
      subject: [{ title: 'All' }, { title: 'Hindi' }, { title: 'English' }],
      branchListData: [],
      sectionListData: [],
      subjectListData: [],
      tableVal: 0,
      rowsTable: tableData3,
      checkedB: true,
      tableAllData: [],
      rightSideTableData: [],
      leftSideTableData: [],
      dateRangeTechPer: [moment().subtract(6, 'days'), moment()],
    };
    this.handleTableData = this.handleTableData.bind(this);
    this.tableData = this.tableData.bind(this);
  }

  // const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

  tableData(date, totalSubmitted, totalPending, totalEvaluated, Title, sdfewfew, sdfew) {
    return { date, totalSubmitted, totalPending, totalEvaluated, Title, sdfewfew, sdfew };
  }

  handleTableData() {
    var tableDatafinal = [];
    var size = this.state?.leftSideTableData?.length;
    if (this.state?.leftSideTableData?.length < this.state?.rightSideTableData?.length) {
      size = this.state?.rightSideTableData?.length;
    }
    for (let i = 0; i < size; i++) {
      tableDatafinal.push(
        tableData(
          this.state?.leftSideTableData[i]?.section_mapping__grade__grade_name,
          this.state?.leftSideTableData[i]?.section_mapping__section__section_name,
          this.state?.leftSideTableData[i]?.subjects__subject_name,
          this.state?.rightSideTableData[i]?.uploaded_at__date,
          this.state?.rightSideTableData[i]?.total_submitted,
          this.state?.rightSideTableData[i]?.total_pending,
          this.state?.rightSideTableData[i]?.total_evaluated,
          this.state?.leftSideTableData[i]?.subjects__id
        )
      );
    }
    this.setState({ tableAllData: tableDatafinal });
  }

  rightSideTableData(subjectID) {
    // setLoading(true);
    const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

    axios
      .get(
        `${endpoints.teacherDashboard.cwHWTeacherDashboard}?acad_session=122&page_size=20&grade_id=59&end_date=2022-03-25&start_date=2022-02-28&branch_id=111&subject_id=${subjectID}&section_id=68`,
        {
          headers: {
            // 'X-DTS-HOST': 'dev.olvorchidnaigaon.letseduvate.com',
            'X-DTS-HOST': window.location.host,
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          this.setState({
            rightSideTableData: result?.data?.result,
          });
          // setAlert('success', result?.data?.message)
        } else {
          // setAlert('error', result?.data?.message);
        }
        this.handleTableData();
        // setLoading(false);
      })
      .catch((error) => {
        // setAlert('error', error?.message);
        // setLoading(false);
      });
  }

  leftSideTableData() {
    const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

    axios
      .get(`${endpoints.teacherDashboard.gradeSectionSubject}?branch_id=111`, {
        headers: {
          'X-DTS-HOST': 'dev.olvorchidnaigaon.letseduvate.com',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log('sideleft', result, result?.data?.result);
        this.setState({
          leftSideTableData: result?.data?.result,
        });
        this.handleTableData();
      });
  }

  // Call on first render
  // sessin year from session storage
  // module_id hardcore

  // branchList() {
  //   axiosInstance.get(`erp_user/branch/?session_year=1&module_id=61`).then((result) => {
  //     console.log('listBranch', result, result?.data?.data?.results);
  //     this.setState({
  //       branchListData: result?.data?.data?.results,
  //     });
  //   });
  // }

  //branch id from local storage, can be multiple
  //module id hardcore
  //session year from session storage
  gradeList() {
    axiosInstance
      .get(
        `erp_user/sectionmapping/?session_year=1&branch_id=111&grade_id=59&module_id=61`
      )
      .then((result) => {
        this.setState({
          gradeListData: result?.data?.data,
        });
        console.log('listgrade', result, result?.data?.data);
      });
  }

  //sectionlist and subjectlist
  sectionList() {
    axiosInstance
      .get(
        `erp_user/sub-sec-list/?role=203&module_id=2&erp_id=2628&is_super=0&grade_id=59&branch_id=88,111&session_year=1`
      )
      .then((result) => {
        this.setState({
          sectionListData: result?.data?.data?.section,
          subjectListData: result?.data?.data?.subject,
        });
        console.log('listsection', result, result?.data?.data?.section);
        console.log('listsubject', result, result?.data?.data?.subject);
      });
  }

  componentDidMount() {
    // this.branchList();
    this.gradeList();
    this.sectionList();
    this.leftSideTableData();
    this.rightSideTableData(101);
  }

  handleClick(i, subjectID) {
    console.log('kapil is', subjectID);
    this.setState({ tableVal: i });
    // if (i % 2 === 0) {
    //   this.setState({ rowsTable: tableData3 });
    // } else {
    //   this.setState({ rowsTable: tableData1 });
    // }
    this.rightSideTableData(subjectID);
    // this.handleTableData();
  }

  render() {
    const { classes } = this.props;
    const {
      grade,
      gradeValue,
      subject,
      subjectValue,
      checkedB,
      rowsTable,
      tableVal,
      dateRangeTechPer,
      gradeSubjectList,
    } = this.state;
    return (
      <Layout>
        <div className={classes.root}>
          <CommonBreadcrumbs
            componentName='Dashboard'
            childComponentName='Homework And Classwork'
          />
          <Grid container>
            <Grid xs={12} container direction='row' style={{ padding: '0 30px' }}>
              <Grid container xs={12} md={8} spacing={2}>
                <Grid item xs={12} md={2}>
                  <Autocomplete
                    id='combo-box-demo'
                    options={this.state.branchListData}
                    size='small'
                    multiple={true}
                    value={gradeValue}
                    //   onChange={(event, newValue) => {
                    //     this.setState({ gradeValue: newValue})
                    //   }}
                    getOptionLabel={(option) => option.branch.branch_name}
                    renderInput={(params) => (
                      <TextField {...params} label='Branch' variant='outlined' />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Autocomplete
                    id='combo-box-demo'
                    options={this.state.gradeListData}
                    size='small'
                    value={gradeValue}
                    //   onChange={(event, newValue) => {
                    //     this.setState({ gradeValue: newValue})
                    //   }}
                    getOptionLabel={(option) => option.grade__grade_name}
                    renderInput={(params) => (
                      <TextField {...params} label='Grade' variant='outlined' />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Autocomplete
                    id='combo-box-demo'
                    options={this.state.subjectListData}
                    value={subjectValue}
                    size='small'
                    style={{ height: '40%' }}
                    onChange={(event, newValue) => {
                      this.setState({ subjectValue: newValue });
                    }}
                    getOptionLabel={(option) => option.subject__subject_name}
                    renderInput={(params) => (
                      <TextField {...params} label='Subject' variant='outlined' />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid item container justifyContent='flex-end' xs={12} md={4}>
                <LocalizationProvider dateAdapter={MomentUtils} className='dropdownIcon'>
                  <Grid item container justifyContent='flex-end' xs={12} md={8}>
                    <DateRangePicker
                      startText='Select-Date-Range'
                      size='small'
                      value={dateRangeTechPer}
                      onChange={(newValue) => {
                        this.setState({ dateRangeTechPer: newValue });
                        //   this.setState.DateRangeTechPer(() => newValue);
                        //   if (selectedSubject) {
                        //     handleSubject(selectedSubject);
                        //   }
                      }}
                      renderInput={({ inputProps, ...startProps }, endProps) => {
                        return (
                          <>
                            <TextField
                              {...startProps}
                              format={(date) => moment(date).format('DD-MM-YYYY')}
                              inputProps={{
                                ...inputProps,
                                value: `${moment(inputProps.value).format(
                                  'DD-MM-YYYY'
                                )} - ${moment(endProps.inputProps.value).format(
                                  'DD-MM-YYYY'
                                )}`,
                                readOnly: true,
                              }}
                              size='small'
                              // style={{ minWidth: '100%' }}
                            />
                          </>
                        );
                      }}
                    />
                  </Grid>
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Grid
              container
              alignItems='center'
              xs={12}
              direction='row'
              style={{ padding: '20px 30px' }}
            >
              <Grid container xs={12} md={6}>
                <Typography style={{ marginTop: '6px', marginRight: '5px' }}>
                  Classwork
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={checkedB}
                      // onChange={handleChange}
                      name='checkedB'
                      color='primary'
                    />
                  }
                  label='Homework'
                />
              </Grid>
              <Grid container justifyContent='flex-end' xs={12} md={6}>
                <span style={{ color: '#074597' }}>
                  <b>Date Range selected</b>
                </span>{' '}
                : 1/02/2021 To 6/02/2021
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ margin: '0 30px' }}>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='customized table'>
                  <TableHead style={{ backgroundColor: '#EBF2FE' }}>
                    <TableRow>
                      <StyledTableCell>Grade and Subject</StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell align='left'>Date</StyledTableCell>
                      <StyledTableCell align='left' style={{ color: '#4DC41B' }}>
                        Total Submitted
                      </StyledTableCell>
                      <StyledTableCell align='left' style={{ color: '#F2A127' }}>
                        Total Pending
                      </StyledTableCell>
                      <StyledTableCell align='left' style={{ color: '#3A90E6' }}>
                        Total Evaluated
                      </StyledTableCell>
                      <StyledTableCell align='left'>Title</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state?.tableAllData.map((row, rowIndex) => (
                      <StyledTableRow
                        key={row.name}
                        onClick={() => this.handleClick(rowIndex, row?.subjectID)}
                      >
                        <StyledTableCell
                          component='th'
                          scope='row'
                          style={{
                            backgroundColor:
                              tableVal === rowIndex ? '#FFFFFF' : '#EBF2FE',
                            borderLeft: tableVal === rowIndex ? '15px solid #4093D4' : '',
                          }}
                        >
                          {row?.grade_name} {row?.section_name} {row?.subject_name}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            color:
                              row.subject_mapping__section_mapping__section__section_name ===
                              'English'
                                ? '#67945B'
                                : row.subject_mapping__section_mapping__section__section_name ===
                                  'Science'
                                ? '#4B6487'
                                : row.subject_mapping__section_mapping__section__section_name ===
                                  'Maths'
                                ? '#BE5A5A'
                                : '#403939',
                            backgroundColor:
                              tableVal === rowIndex ? '#FFFFFF' : '#EBF2FE',
                          }}
                        >
                          {/* {row?.subject_name} */}
                        </StyledTableCell>
                        <StyledTableCell
                          align='right'
                          style={{ backgroundColor: '#fff' }}
                        >
                          {row?.upload_date}
                        </StyledTableCell>
                        <StyledTableCell
                          align='right'
                          style={{ backgroundColor: '#fff' }}
                        >
                          {row?.total_submitted}
                        </StyledTableCell>
                        <StyledTableCell
                          align='right'
                          style={{ backgroundColor: '#fff' }}
                        >
                          {row?.total_pending}
                        </StyledTableCell>
                        <StyledTableCell
                          align='right'
                          style={{ backgroundColor: '#fff' }}
                        >
                          {row?.total_evaluated}
                        </StyledTableCell>
                        <StyledTableCell
                          align='right'
                          style={{ backgroundColor: '#fff' }}
                        >
                          {row?.Title}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </div>
      </Layout>
    );
  }
}

HomeworkClasswork.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomeworkClasswork);
