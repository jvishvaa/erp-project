/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect , createRef} from 'react';
import {
  Grid,
} from '@material-ui/core';

import { withRouter } from 'react-router-dom';
import { Button, Select, Menu, message, Tooltip, Form } from 'antd';
import { makeStyles, FormControl } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Layout from '../../../Layout';
import clsx from 'clsx';
import axiosInstance from 'config/axios';
import axios from 'axios';
import endpoints from 'config/endpoints';
import { connect, useSelector } from 'react-redux';
import '../academic/style.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { Table, Breadcrumb } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { DownOutlined, UpOutlined, RightOutlined } from '@ant-design/icons';
import FileSaver from 'file-saver';
import { Progress } from 'antd';


const useStyles = makeStyles((theme) => ({
  gradeBoxContainer: {
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
  const [branchName, setBranchName] = React.useState([]);
  const [teacherView, setTeacherView] = useState();
  const [teacherId, setTeacherId] = useState()
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const branchId = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch?.branch?.id
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
  const user_level = userDetails?.user_level
  const [colIndex, setColIndex] = useState("")
  const { Option } = Select;
  const [volumeListData, setVolumeListData] = useState([]);
  const [volumeId, setVolumeId] = useState();
  const [volumeName, setVolumeName] = useState('');
  const [collapseData, setCollapseData] = useState([]);
  const [gradeId, setGradeId] = useState();
  const [gradeName, setGradeName] = useState('');
  const [subjectId, setSubjectId] = useState();
  const [subjectName, setSubjectName] = useState('');
  const [teacherData, setTeacherData] = React.useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [gradeApiData, setGradeApiData] = useState([])
  const [subjectApiData, setSubjectApiData] = useState([])
  const [columns, setColumns] = useState([
    {
      title: <span className='th-white pl-4 th-fw-700 '>CHAPTERS</span>,
      width: 300,
      align: 'left',
      render: (data) => <span className='pl-md-4 th-black-1 th-16' style={{fontWeight: '600'}} >{data?.chapter_name}</span>,
      key: 'chapter',
      fixed: 'left',
    },

  ]);
  const formRef = createRef();
console.log(history?.location?.state , 'history');


  const [innerColumn, setInnerColumn] = useState([
    {
      title: <span className='th-white pl-4 th-fw-700 '>TOPICS</span>,
      width: 300,
      align: 'left',
      render: (data) => {
        return <span className='pl-md-4 th-black-1 th-16' style={{fontWeight: '600'}} >{data?.topic_name}</span>
      },
      fixed: 'left',
    }
  ]);

  const fetchVolumeListData = () => {
    axios
      .get(`${endpoints.lessonPlan.volumeList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setVolumeListData(result?.data?.result?.results);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  const volumeOptions = volumeListData?.map((each) => {
    return (
      <Option  value={each.id}>
        {each?.volume_name}
      </Option>
    );
  });

  const handlevolume = (e) => {
    console.log(e);
    if (e?.value) {
      setVolumeId(e.value);
      setVolumeName(e.children);
      formRef.current.setFieldsValue({
        volume: e?.children,
      });
    } else {
      setVolumeId('');
      setVolumeName('');
    }
  };
  const handleClearVolume = () => {
    setVolumeId('');
    setVolumeName('');
  };

  // grade list

  const gradeData = () => {
    if (history?.location?.state?.module_id && branchId) {
      axiosInstance
        .get(
          `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${branchId}&module_id=${history?.location?.state?.module_id}`
        )
        .then((res) => {
          setGradeApiData(res?.data?.data);
        })
        .catch(() => { });
    }
  };

  useEffect(() => {
    setFilters()
  },[gradeApiData])

  useEffect(() => {
    setSubjectFilters()
  },[subjectApiData])

  useEffect(() => {
    if(history?.location?.state?.volumeId){
      setVolumeFilters()
    }
  },[volumeListData])

  const setFilters = () => {
    let gradefind = gradeApiData.filter(e => e?.grade_id == history?.location?.state?.grade) || []
    console.log(gradefind);
    const temp = []
    const transform = gradefind?.length > 0 && gradefind.map((e) => {
      const data = {
        key : e?.id,
        value: e?.grade_id,
        children: e?.grade_name
      }
      temp.push(data)
    })
    console.log(temp , transform);
    if(temp?.length > 0 ){
      handleGrade(temp[0])
      // setSelectedGrade(temp[0])
    }
  }

  const setSubjectFilters = () => {
    let subfind = subjectApiData?.length > 0 && subjectApiData.filter(e => e?.subject_id == history?.location?.state?.subject_id) || []
    console.log(subfind);
    const temp = []
    const transform = subfind?.length > 0 && subfind.map((e) => {
      const data = {
        key : e?.id,
        value: e?.subject_id,
        children: e?.subject_name
      }
      temp.push(data)
    })
    console.log(temp , transform);
    if(temp?.length > 0 ){
      handleSubject(temp[0])
      // setSelectedGrade(temp[0])
    }
  }

  const setVolumeFilters = () => {
    let volfind = volumeListData.filter(e => e?.id == history?.location?.state?.volumeId) || []
    console.log(volfind);
    const temp = []
    const transform = volfind?.length > 0 && volfind.map((e) => {
      const data = {
        key : null,
        value: e?.id,
        children: e?.volume_name
      }
      temp.push(data)
    })
    console.log(temp , transform);
    if(temp?.length > 0 ){
      handlevolume(temp[0])
      // setSelectedGrade(temp[0])
    }
  }


 

  const gradeOptions = gradeApiData?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });

  const handleGrade = (e) => {
    console.log(e);
    if (e?.value) {
      setGradeId(e.value);
      setGradeName(e.children);
      formRef.current.setFieldsValue({
        grade: e?.children,
      });
    } else {
      setGradeId('');
      setGradeName('');
    }
  };
  const handleClearGrade = () => {
    setGradeId('');
    setGradeName('');
  };

  useEffect(() => {
    subjectData()
  }, [gradeId])

  // subject lsit
  const subjectData = () => {
    if (gradeId != null) {
      axiosInstance
        .get(
          `${endpoints.assessmentErp.subjectList}?session_year=${selectedBranch?.id}&grade=${gradeId}`
        )
        .then((res) => {
          setSubjectApiData(res?.data?.result);
        })
        .catch(() => { });
    }
  };

  const subjectOptions = subjectApiData?.length > 0 && subjectApiData?.map((each) => {
    return (
      <Option key={each?.id} value={each.subject_id}>
        {each?.subject_name}
      </Option>
    );
  });

  const handleSubject = (e) => {
    console.log(e);
    if (e?.value) {
      setSubjectId(e.value);
      setSubjectName(e.children);
      formRef.current.setFieldsValue({
        Subject: e?.children,
      });
    } else {
      setSubjectId('');
      setSubjectName('');
    }
  };
  const handleClearSubject = () => {
    setSubjectId('');
    setSubjectName('');
  };



  const onTableRowExpand = (expanded, record) => {
    if (teacherView) {
      teacherSubjectTable({
        grade_id: gradeId,
        session_year: selectedAcademicYear?.id,
        central_gs: history?.location?.state?.central_gs,
        chapter_id: record?.chapter_id,
        teacher_erp: teacherId,
        acad_session: history?.location?.state?.acad_sess_id,
        subject_id: subjectId
      })
    } else {
      teacherSubjectTable({
        grade_id: gradeId,
        session_year: selectedAcademicYear?.id,
        central_gs: history?.location?.state?.central_gs,
        chapter_id: record?.chapter_id,
        acad_session: history?.location?.state?.acad_sess_id,
        subject_id: subjectId
      })
    }
    const keys = [];
    if (expanded) {
      keys.push(record?.chapter_id);
    }

    setExpandedRowKeys(keys);
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
        setCollapseData(res?.data?.result);
        transformDataInner(res?.data?.result)
        setLoading(false);

        // setStudentData(res.data.result);
      })
      .catch((err) => {
        setLoading(false);
      });
  };




  useEffect(() => {
    fetchVolumeListData()
    gradeData()
    setModuleId(history?.location?.state?.module_id);
    setAcadeId(history?.location?.state?.acad_session_id);
    setBranchName(history?.location?.state?.branchName)
    setTeacherView(history?.location?.state?.teacherView)
    setTeacherId(history?.location?.state?.teacher_id)
    setGradeId(history?.location?.state?.grade)
    setSubjectId(history?.location?.state?.subject_id)
  }, [history]);


  useEffect(() => {
    if (gradeId) {
      if (history?.location?.state?.teacherView) {
        if (volumeId != null || volumeId != undefined ) {
          gradeListTable({
            grade_id: gradeId,
            session_year: selectedAcademicYear?.id,
            teacher_erp: history?.location?.state?.teacher_id,
            acad_session: history?.location?.state?.acad_sess_id,
            volume: volumeId,
            central_gs: history?.location?.state?.central_gs,
            subject_id: subjectId
          });
        } else {
          gradeListTable({
            grade_id: gradeId,
            session_year: selectedAcademicYear?.id,
            teacher_erp: history?.location?.state?.teacher_id,
            acad_session: history?.location?.state?.acad_sess_id,
            central_gs: history?.location?.state?.central_gs,
            subject_id: subjectId
          });
        }
      } else {
        if (volumeId != null || volumeId != undefined) {
          gradeListTable({
            grade_id: gradeId,
            session_year: selectedAcademicYear?.id,
            central_gs: history?.location?.state?.central_gs,
            acad_session: history?.location?.state?.acad_sess_id,
            volume: volumeId,
            subject_id: subjectId

          });
        } else {
          gradeListTable({
            grade_id: gradeId,
            session_year: selectedAcademicYear?.id,
            central_gs: history?.location?.state?.central_gs,
            acad_session: history?.location?.state?.acad_sess_id,
            subject_id: subjectId
          });
        }
      }
    }
  }, [volumeId, gradeId , subjectId]);

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
        setTableData(res?.data?.result);
        setLoading(false);
        transformData(res?.data?.result)

        // setStudentData(res.data.result);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  // let col = [...columns]
  const transformData = (res) => {
    if (columns?.length > 1) {
      const head = ([x, ...xs]) => x;
      let col = [head(columns)]
    } else {
      let col = [...columns]

      setColIndex(res[0]?.section_wise_completion?.length + 2)
      let transform = res[0]?.section_wise_completion.map((i, index) => {
        let newCol = {
          title: <span className='th-white pl-4 th-fw-700 '>{i?.section_name.replace(/sec|section/gi, "SEC")}</span>,
          align: 'center',
          width: 400,
          render: (data) => {
            return <Progress type='circle' percent={data?.section_wise_completion[index]?.percentage_completion} strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }} className='reportProgress' format={(percent) => `${percent}%`} width={60} />
          },
          key: 'section_name',
        }
        col.push(newCol)
      })
      setColumns(col)
    }

  }
  let innerCol = [...innerColumn]
  const transformDataInner = (res) => {
    if (innerColumn?.length > 1) {
      const head = ([x, ...xs]) => x;
      let innerCol = [head(innerColumn)]
    } else {
      let innerCol = [...innerColumn]
      let transform = res?.length > 0 && res[0]?.section_wise_completion.map((i, index) => {
        let newCol = {
          title: <span className='th-white pl-4 th-fw-700 '>{i?.section_name.replace(/sec|section/gi, "SEC")}</span>,
          align: 'center',
          width: 400,
          key: `${i?.section_name}`,
          render: (data) => {
            return <Progress type='circle' percent={data?.section_wise_completion[index]?.percentage_completion} strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }} format={(percent) => `${percent}%`} className='reportProgressChild' width={60} />
          },
        }
        innerCol.push(newCol)
      })
      setInnerColumn(innerCol)
    }
  }

  const handleBack = () => {
    history.goBack();
  }
  const expandedRowRender = (record, index) => {

    return (
      <Table
        columns={innerColumn}
        dataSource={collapseData}
        rowKey={(record) => record?.topic_id}
        pagination={false}
        className='th-inner-chapter'
        expandIconColumnIndex={innerColumn?.length}
        bordered
        style={{ width: '100%' }}
        scroll={{
          x: 1300,
          y: 1100,
        }}
      />
    );
  };

  const handleDownload = () => {
    const data = {
      session_year: selectedAcademicYear?.id,
      grade_id: gradeId,
      acad_session: history?.location?.state?.acad_sess_id,
      central_gs: history?.location?.state?.central_gs,
      export_as_excel: true,
      volume: volumeId,
      subject_id: history?.location?.state?.subject_id
    }
    axiosInstance
      .get(`${endpoints.ownerDashboard.chapterWise}`, {
        params: data,
        responseType: 'arraybuffer',
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((res) => {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'curriculumn.xls');

      })
      .catch((err) => {
        setLoading(false);
      });
  }

  const backSetting = () => {
    if (teacherView) {
    }
  }

  return (
    <Layout>
      <div style={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
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
              <Breadcrumb.Item className='th-black-1' onClick={() => backSetting()} >{teacherView ? 'Teacher Wise' : 'Subject Wise'}</Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1'>Chapter Wise</Breadcrumb.Item>
            </Breadcrumb>
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-start' }} >
            <div style={{ width: '12%', display: 'flex', justifyContent: 'space-between' }} >
              <Button onClick={handleBack} icon={<LeftOutlined />} className={clsx(classes.backButton)} >Back</Button>
              {user_level != 13 ?
                <Button onClick={handleDownload}>Download Report</Button>
                : ' '}
            </div>

          </Grid>
          <Form ref={formRef} style={{ display: 'flex', justifyContent: 'flex-start' , width: '50%' }} >

            <div className='col-md-3 col-6 pl-md-1'>
              <div className='text-left pl-md-1'>Grade</div>
              <Form.Item name='grade'>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder='Select Grade'
                  showSearch
                  // allowClear
                  defaultValue='All'
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e, value) => {
                    handleGrade(value);
                  }}
                  onClear={handleClearGrade}
                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                  bordered={false}
                >

                  {gradeOptions}
                </Select>
              </Form.Item>
            </div>

            <div className='col-md-3 col-6 pl-md-1'>
              <div className='text-left pl-md-1'>Subject</div>
              <Form.Item name='Subject'>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder='Select Subject'
                  showSearch
                  // allowClear
                  defaultValue='All'
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e, value) => {
                    handleSubject(value);
                  }}
                  onClear={handleClearSubject}
                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                  bordered={false}
                >

                  {subjectOptions}
                </Select>
              </Form.Item>
            </div>

            <div className='col-md-3 col-6 pl-md-1'>
              <div className='text-left pl-md-1'>Volume</div>
              <Form.Item name='volume'>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder='Select Volume'
                  showSearch
                  allowClear
                  defaultValue='All'
                  optionFilterProp='children'
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e, value) => {
                    handlevolume(value);
                  }}
                  onClear={handleClearVolume}
                  className='w-100 text-left th-black-1 th-bg-white th-br-4'
                  bordered={false}
                >

                  {volumeOptions}
                </Select>
              </Form.Item>
            </div>
          </Form>
          <div className='row mt-3' id='chapterTableScss' >
            <div className='col-12'>
              <Table
                className='th-table'
                rowClassName={(record, index) =>
                  index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                }
                loading={loading}
                columns={columns}
                rowKey={(record) => record?.chapter_id}
                expandable={{ expandedRowRender }}
                dataSource={tableData}
                pagination={false}
                expandIconColumnIndex={columns?.length}
                expandedRowKeys={expandedRowKeys}
                expandRowByClick={true}
                bordered
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
                  x: 1300,
                  y: 700,
                }}
              />
            </div>
          </div>
        </Grid>

      </div>
    </Layout>
  );
};

export default withRouter(CurriculumCompletionChapter);
