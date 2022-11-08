/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import {
  Grid,
  TextField,

} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  ChevronRight as ArrowCircleRightIcon,
} from '@material-ui/icons';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { withRouter } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Pagination } from '@material-ui/lab';
import MediaQuery from 'react-responsive';
import { Button, Select, Menu, message, Tooltip } from 'antd';
import { DatePicker, Space } from 'antd';
import { makeStyles , FormControl } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
// import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../Layout';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import axiosInstance from 'config/axios';
import moment from 'moment';
import endpoints from 'config/endpoints';
import Loader from 'components/loader/loader';
import { connect, useSelector } from 'react-redux';
import '../academic/style.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { Table, Breadcrumb } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import calendarIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/calendarIcon.svg';
import { tableWidthCalculator } from 'v2/tableWidthCalculator';
import { Progress } from 'antd';


// import { TableCell, TableRow } from 'semantic-ui-react';

const useStyles = makeStyles((theme) => ({
  gradeBoxContainer: {
    // marginTop: '15px',
  },
  gradeDiv: {
    width: '100%',
    height: '100%',
    border: '1px solid black',
    borderRadius: '8px',
    padding: '10px 15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // '&::before': {
    //   backgroundColor: 'black',
    // },
  },
  gradeBox: {
    border: '1px solid black',
    padding: '3px',
  },
  gradeOverviewContainer: {
    border: '1px solid black',
    borderRadius: '10px',
    padding: '15px 8px',
    maxHeight: '55vh',
    overflowY: 'scroll',
    backgroundColor: 'white',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.3) ',
      borderRadius: '10px',
    },

    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      '-webkit-box-shadow': ' inset 0 0 6px rgba(0,0,0,0.5)',
    },
    //   ::-webkit-scrollbar {
    //     width: 12px;
    // }
  },
  eachGradeOverviewContainer: {
    border: '1px solid black',
    borderRadius: '10px',
    padding: '10px 8px',
    margin: '8px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eachGradeName: {
    backgroundColor: 'gray',
    color: 'white',
    padding: '4px',
    borderRadius: '5px',
  },
  textAlignEnd: {
    textAlign: 'end',
  },
  textBold: {
    fontWeight: '800',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
  },
  TableTextLeft: {
    textAlign: 'center !important',
    fontSize: '13px',
  },
  TableTextRight: {
    textAlign: 'right !important',
    fontSize: '14px'
  },
  TableTextRightContainer: {
    textAlign: 'right !important',
    paddingRight: '48px',
  },
  TableHeaderColor: {
    backgroundColor: `${theme.palette.v2Color1.primaryV2} !important`,
    color: 'black',
  },
  tableStateMent: {
    color: `${theme.palette.v2Color1.primaryV2} !important`,
    fontWeight: 'bolder'
  },
  viewButton: {
    backgroundColor: `${theme.palette.v2Color1.primaryV2} !important`,
  },
}));



const CurriculumCompletionChapter = (props) => {
  const classes = useStyles();
  const [volume, setVolume] = React.useState('');
  const history = useHistory();
  const [tableData, setTableData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [moduleId, setModuleId] = React.useState('');
  const [acadeId, setAcadeId] = React.useState('');
  const [gradeApiData, setGradeApiData] = React.useState([]);
  const [branchName, setBranchName] = React.useState([]);
  const [teacherView, setTeacherView] = useState();
  const [teacherId, setTeacherId] = useState()
  const [dateToday, setDateToday] = useState();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [ colIndex , setColIndex ] = useState(6)
const { Option } = Select;

  const [collapseData, setCollapseData] = useState([]);
  const [teacherData, setTeacherData] = React.useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [columns, setColumns] = useState([
    {
      title: <span className='th-white pl-4 th-fw-700 '>Chapters</span>,
      width: '20%',
      align: 'left',
      render: (data) => <span className='pl-md-4 th-black-1 th-16'>{data?.chapter_name}</span>,
      key: 'chapter',
      fixed: 'left',
    },

  ]);

  const [innerColumn, setInnerColumn] = useState([
    {
      title: <span className='th-white pl-4 th-fw-700 '>Topic</span>,
      width: '20%',
      align: 'left',
      render: (data) => {
        console.log(data, 'dataa')
        return <span className='pl-md-4 th-black-1 th-16'>{data?.topic_name}</span>
      },
      fixed: 'left',
    }
  ]);




  const onTableRowExpand = (expanded, record) => {
    if (teacherView) {
      teacherSubjectTable({
        grade_id: history?.location?.state?.grade,
        session_year: selectedAcademicYear?.id,
        date: moment(dateToday).format('YYYY-MM-DD'),
        subject_id: history?.location?.state?.subject_id,
        chapter_id: record?.section_data[0]?.id,
        teacher_erp: teacherId
      })
    } else {
      teacherSubjectTable({
        grade_id: history?.location?.state?.grade,
        session_year: selectedAcademicYear?.id,
        date: moment(dateToday).format('YYYY-MM-DD'),
        subject_id: history?.location?.state?.subject_id,
        chapter_id: record?.section_data[0]?.id
      })
    }
    console.log(record);
    const keys = [];
    if (expanded) {
      keys.push(record?.chapter_name);
    }

    setExpandedRowKeys(keys);
    setInnerColumn([
      {
        title: <span className='th-white pl-4 th-fw-700 '>Topic</span>,
        width: '20%',
        align: 'left',
        render: (data) => {
          console.log(data, 'dataa')
          return <span className='pl-md-4 th-black-1 th-16'>{data?.topic_name}</span>
        },
        fixed: 'left',
      }
    ])
    console.log([...innerColumn]);
    innerCol = [{
      title: <span className='th-white pl-4 th-fw-700 '>Topic</span>,
      width: '20%',
      align: 'left',
      render: (data) => {
        console.log(data, 'dataa')
        return <span className='pl-md-4 th-black-1 th-16'>{data?.topic_name}</span>
      },
      fixed: 'left',
    }];
  };
  const teacherSubjectTable = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.ownerDashboard.topicWise}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((res) => {
        console.log(res);
        setCollapseData(res?.data?.result);
        transformDataInner(res?.data?.result)
        setLoading(false);

        // setStudentData(res.data.result);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  // const subjectList = (params = {}) => {
  //   setLoading(true);
  //   axiosInstance
  //     .get(`${endpoints.ownerDashboard.topicWise}`, {
  //       params: { ...params },
  //       headers: {
  //         'X-DTS-Host': X_DTS_HOST,
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       setCollapseData(res?.data?.result);
  //       transformDataInner(res?.data?.result)
  //       setLoading(false);

  //       // setStudentData(res.data.result);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setLoading(false);
  //     });
  // };



  useEffect(() => {
    console.log(history?.location?.state, 'Mobile99999999')
    setModuleId(history?.location?.state?.module_id);
    setAcadeId(history?.location?.state?.acad_session_id);
    setBranchName(history?.location?.state?.branchName)
    setDateToday(history?.location?.state?.selectedDate)
    setTeacherView(history?.location?.state?.teacherView)
    setTeacherId(history?.location?.state?.teacher_id)
  }, [history]);


  const { acad_session_id, module_id, acad_sess_id } = history.location.state;
  const dateFormat = 'YYYY/MM/DD';




  useEffect(() => {
    if (dateToday) {
      if (teacherView) {
        gradeListTable({
          grade_id: history?.location?.state?.grade,
          session_year: selectedAcademicYear?.id,
          date: moment(dateToday).format('YYYY-MM-DD'),
          subject_id: history?.location?.state?.subject_id,
          teacher_erp: teacherId
        });
      } else {
        gradeListTable({
          grade_id: history?.location?.state?.grade,
          session_year: selectedAcademicYear?.id,
          date: moment(dateToday).format('YYYY-MM-DD'),
          subject_id: history?.location?.state?.subject_id
        });
      }

    }
  }, [dateToday]);

  const gradeListTable = (params = {}) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.ownerDashboard.chapterWise}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((res) => {
        console.log(res);
        setTableData(res?.data?.result);
        setLoading(false);
        transformData(res?.data?.result)
        // setStudentData(res.data.result);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  let col = [...columns]
  const transformData = (res) => {
    setColIndex(res?.data[0]?.section_data?.length + 1)
    let transform = res?.data[0]?.section_data.map((i, index) => {
      let newCol = {
        title: <span className='th-white pl-4 th-fw-700 '>{i?.section_name}</span>,
        align: 'center',
        children: [
          {
            title: 'Completed',
            width: '20%',
            align: 'center',
            key: `${i?.id}`,
            render: (row) => {
              // return <span className='pl-md-4 th-black-1 th-16'>{row?.section_data[index].total_periods}</span>},
              return <Progress type='circle' percent={row?.section_data[index].total_periods} className='pl-md-4 th-black-1 th-16' width={40} />
            },
          },
          {
            title: 'Pending',
            width: '20%',
            align: 'center',
            key: `${i?.id}`,
            render: (row) => {
              // return <span className='pl-md-4 th-black-1 th-16'>{row?.section_data[index].pending_periods}</span>},
              return <Progress type='circle' percent={row?.section_data[index].pending_periods} className='pl-md-4 th-black-1 th-16' width={40} />
            },
          }
        ],
      }
      col.push(newCol)
    })
    setColumns(col)


  }
  let innerCol = [...innerColumn]
  const transformDataInner = (res) => {
    let transform = res?.data[0]?.section_data.map((i, index) => {
      let newCol = {
        title: <span className='th-white pl-4 th-fw-700 '>{i?.section_name}</span>,
        align: 'center',
        key: `${i?.id}`,
        children: [
          {
            title: 'Completed',
            align: 'center',
            margin: '-100px',
            key: `${i?.section_name}`,
            render: (row) => {
              // return <span className='pl-md-4 th-black-1 th-16'>{row?.section_data[index].total_periods}</span>},
              return <Progress type='circle' percent={row?.section_data[index].total_periods} className='pl-md-4 th-black-1 th-16' width={40} style={{marginLeft: '-35%'}} />
            },
          },
          {
            title: 'Pending',
            align: 'center',
            key: `${i?.section_name}`,
            render: (row) => {
              // return <span className='pl-md-4 th-black-1 th-16'>{row?.section_data[index].pending_periods}</span>},
              return <Progress type='circle' percent={row?.section_data[index].pending_periods} className='pl-md-4 th-black-1 th-16' width={40} style={{marginLeft: '-35%'}} />
            },
          }
        ],
      }
      innerCol.push(newCol)
      console.log(innerCol);
    })
    setInnerColumn(innerCol)
  }

  const onChangeDate = (value) => {
    if (value) {
      setDateToday(moment(value).format('YYYY-MM-DD'));
    }
  }
  const handleBack = () => {
    history.goBack();
  }
  const expandedRowRender = (record, index) => {
    console.log(record, index);

    return (
      <Table
        columns={innerColumn}
        dataSource={collapseData?.data}
        rowKey={(record) => record?.id}
        pagination={false}
        className='th-inner-head'
        showHeader={false}
        bordered={false}
        style={{ width: '100%' }}
      />
    );
  };

 


  return (
    <Layout>
      <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* < CommonBreadcrumbs
              componentName='Dashboard'
              // childComponentName='Academic Performance' 
              childComponentNameNext='Curriculum Completion'
            /> */}
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-pointer'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                onClick={() => history.goBack()}
                className='th-grey th-pointer'
              >
                Curriculum Completion
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1' onClick={() => history.goBack()} >Subject Wise</Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1'>Chapter Wise</Breadcrumb.Item>
            </Breadcrumb>
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }} >
            <Button onClick={handleBack} icon={<LeftOutlined />} className={clsx(classes.backButton)} >Back</Button>
            {/* <Space direction="vertical">
              <DatePicker onChange={onChangeDate} />
            </Space> */}
            <div className='col-md-4 text-right mt-2 mt-sm-0 justify-content-end'>
              <span className='th-br-4 p-1 th-bg-white'>
              <FormControl
                    variant='standard'
                    sx={{ m: 1, minWidth: 100 }}
                    className='flex-row'
                  >
                    <Select
                      // onChange={handleBranchChange}
                      value={ ''}
                      className='th-primary th-bg-white th-br-4 th-12 text-left mr-1'
                      placement='bottomRight'
                      bordered={false}
                      showSearch={true}
                      suffixIcon={<DownOutlined className='th-primary' />}
                      dropdownMatchSelectWidth={false}
                      optionFilterProp='children'
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {/* {branchList?.map((item) => {
                        return (
                          <Option value={item?.branch?.branch_name}>
                            {item?.branch?.branch_name}
                          </Option>
                        );
                      })} */}
                    </Select>
                  </FormControl>
              </span>
              <span className='th-br-4 p-1 th-bg-white'>
                <img src={calendarIcon} className='pl-2' />
                <DatePicker
                  disabledDate={(current) => current.isAfter(moment())}
                  allowClear={false}
                  bordered={false}
                  placement='bottomRight'
                  // defaultValue={dateToday}
                  value={moment(dateToday)}
                  onChange={(value) => onChangeDate(value)}
                  showToday={false}
                  suffixIcon={<DownOutlined className='th-black-1' />}
                  className='th-black-2 pl-0 th-date-picker'
                  format={'YYYY/MM/DD'}
                />
              </span>
            </div>
          </Grid>
          <div className='row mt-3'>
            <div className='col-12'>
              {console.log(columns , 'mixed col')}
              <Table
                className='th-table'
                rowClassName={(record, index) =>
                  index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                }
                loading={loading}
                columns={columns}
                rowKey={(record) => record?.chapter_name}
                expandable={{ expandedRowRender }}
                dataSource={tableData?.data}
                pagination={false}
                expandIconColumnIndex={colIndex}
                expandedRowKeys={expandedRowKeys}
                onExpand={onTableRowExpand}
                expandIcon={({ expanded, onExpand, record }) =>
                  expanded ? (
                    <UpOutlined
                      className='th-black-1 th-pointer'
                      onClick={(e) => onExpand(record, e)}
                    />
                  ) : (
                    <DownOutlined
                      className='th-black-1 th-pointer'
                      onClick={(e) => onExpand(record, e)}
                    />
                  )
                }
                size="middle"
                scroll={{
                  x: 100,
                  y: 340,
                }}
              />
            </div>
            {/* <div className='row mt-3'>
              <div className='col-12'>
                <div className='row pt-2 align-items-center th-bg-white th-br-4 th-13 th-grey th-fw-500'>
                  <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding w-100'>
                    Total Periods:{' '}
                    <span className='th-primary'>{tableData?.total_periods ? tableData?.total_periods : ''}</span>
                  </div>
                  <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
                    Total Periods Conducted:{' '}
                    <span className='th-green'>{tableData?.completed_periods ? tableData?.completed_periods : ''}</span>
                  </div>
                  <div className='col-md-2 col-6 pb-0 pb-sm-2 th-custom-col-padding'>
                    Total Periods Pending:{' '}
                    <span className='th-fw-500 th-red'>
                      {tableData?.pending_periods ? tableData?.pending_periods : ''}
                    </span>
                  </div>

                </div>
              </div>
            </div> */}
          </div>
        </Grid>

        {loading && <Loader />}
      </div>
    </Layout>
  );
};

export default withRouter(CurriculumCompletionChapter);
