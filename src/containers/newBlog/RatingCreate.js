import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import {
  Button,
  Input,
  Select,
  Divider as AntDivider,
  Breadcrumb,
  Spin,
  Table,
  Modal as ModalAnt,
  Tag,
  message,
  Popconfirm,
  Typography,
} from 'antd';
import {
  DeleteFilled,
  PlusOutlined,
  SnippetsOutlined,
  AuditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditFilled,
  StopOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { makeStyles, Switch } from '@material-ui/core';
import Layout from 'containers/Layout';
import './styles.scss';
import endpoints from '../../config/endpoints';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '90vw',
    width: '95%',
    margin: '20px auto',
    marginTop: theme.spacing(4),
    boxShadow: 'none',
  },
  searchTable: {
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  dividerColor: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  container: {
    maxHeight: '70vh',
    maxWidth: '90vw',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },

  customTabRoot: {
    color: 'red',
    backgroundColor: 'green',
  },
  customTabIndicator: {
    backgroundColor: 'orange',
  },

  tableCell: {
    color: 'black !important',
    backgroundColor: '#ADD8E6 !important',
  },
  tableCells: {
    color: 'black !important',
    backgroundColor: '#F0FFFF !important',
  },
  vl: {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    height: '45px',
  },
  buttonColor: {
    color: `${theme.palette.primary.main} !important`,
    // backgroundColor: 'white',
  },
  tabStyle: {
    color: 'white !important',
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  tabStatic: {
    position: 'static',
    paddingLeft: '19px',
    paddingRight: '39px',
    paddingTop: '36px',
  },
  buttonColor1: {
    color: 'grey !important',
    backgroundColor: 'white',
  },
  buttonColor2: {
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: 'white',
  },
  selected1: {
    background: `${theme.palette.primary.main} !important`,
    color: 'white !important',
  },
  selected2: {
    background: `${theme.palette.primary.main} !important`,
    color: 'white !important',
  },
  tabsFont: {
    '& .MuiTab-wrapper': {
      color: 'white',
      fontWeight: 'bold',
    },
  },
  tabsFont1: {
    '& .MuiTab-wrapper': {
      color: 'black',
      fontWeight: 'bold',
    },
  },
}));

const visualOptionData = [
  { name: 'good', id: 1 },
  { name: 'can do better', id: 2 },
];

const RatingCreate = () => {
  const history = useHistory();
  const { Option } = Select;
  const [moduleId, setModuleId] = React.useState();
  const [month, setMonth] = React.useState('1');
  const [status, setStatus] = React.useState('');
  const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);
  const { setAlert } = useContext(AlertNotificationContext);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [drawers, setDrawers] = useState(false);
  const [value, setValue] = useState(0);
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [accordianBulkFilter, setAccordianBulkFilter] = useState(false);
  const [creativityType, setCreativityType] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPhy, setShowPhy] = useState(false);
  const [score1, setScore1] = useState('');
  const [creativity, setCreativity] = useState('');
  const [score2, setScore2] = useState('');
  const [score3, setScore3] = useState('');
  const [score4, setScore4] = useState('');
  const [score5, setScore5] = useState('');
  const [inputList, setInputList] = useState([{ name: '', rating: '', score: null }]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [viewParameterFlag, setViewParameterFlag] = useState(false);
  const [antDrawer, setAntDrawer] = useState(false);
  const [visualInputlList, setVisualInputList] = useState([{ name: '', score: null }]);
  const [selectedOption, setSelectedOption] = useState('');
  const [onOptionVisible, setOnOptionVisible] = useState(false);
  const [onOptionModal, setOnOptionModal] = useState(false);
  const [optionTitleSelected, setOptionTitle] = useState('');
  const [optionList, setOptionList] = useState([
    { name: '', score: null, status: false },
  ]);
  const [visualActivity, setVisualActivity] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState(false);
  const [mainActivityType, setMainActivityType] = useState(null);
  const [ActivityType, setActivityType] = useState(null);
  const [subActivityType, setSubActivityType] = useState(null);
  const [remarksType, setRemarksType] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditData, setIsEditData] = useState([]);
  const [editOption, setEditOption] = useState([]);
  const [activityCategory, setActivityCategory] = useState([]);
  const [activityCategoryRemarks, setActivityCategoryRemarks] = useState([]);
  const [physicalActivityToggle, setPhysicalActivityToggle] = useState(false);
  const [physicalActivityHideAddCriteria, setPhysicalActivityHideAddCriteria] =
    useState(true);

  const isJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const columns = [
    {
      title: <span className='th-white th-fw-700 '>Activity Type Name </span>,
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: <span className='th-white th-fw-700 '>Sub Activity Name </span>,
      dataIndex: 'erp_id',
      key: 'erp_id',
      align: 'center',
      render: (text, row) => <p>{row?.sub_type ? row?.sub_type : <b>NA</b>}</p>,
    },
    {
      title: <span className='th-white th-fw-700 '>Criteria Title</span>,
      dataIndex: 'criteria_title',
      key: 'erp_id',
      align: 'center',
      render: (text, row) => (
        <p>{row?.criteria_title ? row?.criteria_title : <b>NA</b>}</p>
      ),
    },
    {
      title: <span className='th-white th-fw-700 '>Criteria Name</span>,
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      render: (text, row) => {
        return (
          <p>
            {row.grading_scheme.map((item) => (
              <p>{item.name ? item?.name : <b>NA</b>}</p>
            ))}
          </p>
        );
      },
    },
    {
      title: <span className='th-white th-fw-700 '>Rating</span>,
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      render: (text, row) => {
        return (
          <>
            <p>
              {row.va_rating[0]
                ? row.va_rating[0].map((item) => <p>{item?.name}</p>)
                : row.grading_scheme.map((item, index) => (
                    <p>
                      {isJSON(item.rating)
                        ? JSON.parse(item?.rating)[index]?.name
                        : item.rating}
                    </p>
                  ))}
            </p>
          </>
        );
      },
    },
    {
      title: <span className='th-white th-fw-700 '>Score</span>,
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      render: (text, row) => {
        return (
          <p>
            {row.grading_scheme.map((item) => (
              <p>{item?.score ? item?.score : <b>NA</b>}</p>
            ))}
          </p>
        );
      },
    },
    {
      title: <span className='th-white th-fw-700 '>Action</span>,
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      render: (text, row) => {
        return (
          <div style={{ display: 'flex' }}>
            {row?.is_editable ? (
              <>
                <Tag
                  icon={<EditFilled className='th-14' />}
                  color={'geekblue'}
                  className='th-br-5 th-pointer py-1 px-1'
                  onClick={(e) => handleEdit(e, row)}
                >
                  Edit
                </Tag>
                <Popconfirm
                  title='Delete the Remarks ?'
                  description='Are you sure to delete this remarks?'
                  onConfirm={() => handleDelete(row)}
                  onOpenChange={() => ''}
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                >
                  <Tag
                    icon={<DeleteFilled className='="th-14' />}
                    color={'red'}
                    className='th-br-5 th-pointer py-1'
                  >
                    Delete
                  </Tag>
                </Popconfirm>
              </>
            ) : (
              <Tag
                color={'magenta'}
                icon={<StopOutlined className='="th-14' />}
                className='th-br-5 py-1'
              >
                Permission Denied
              </Tag>
            )}
          </div>
        );
      },
    },
  ];

  const handleListAdd = () => {
    setInputList([
      ...inputList,
      {
        name: '',
        rating: '',
        score: null,
      },
    ]);
  };

  const handleListAddEdit = () => {
    const newData = isEditData.grading_scheme.concat({
      id: '',
      name: '',
      rating: '',
      score: '',
      va_rating: '',
    });
    setIsEditData({ ...isEditData, grading_scheme: newData });
  };

  const [view, setViewed] = useState(false);
  const [branchView, setBranchView] = useState(true);
  const [branchSearch, setBranchSearch] = useState(true);

  const handleClose = () => {
    setViewing(false);
    setInputList([{ name: '', rating: '', score: null }]);
    setVisualInputList([{ name: '', score: null }]);
    setOptionList([{ name: '', score: null, status: false }]);
  };

  const [data, setData] = useState('');
  const [assigned, setAssigned] = useState(false);

  const [assingeds, setAssigneds] = useState([]);
  const getAssinged = () => {
    axios
      .get(`${endpoints.newBlog.unAssign}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setAssigneds(response.data.result);
      });
  };

  useEffect(() => {
    getAssinged();
  }, []);

  const validateActivityTypeSubmit = () => {
    let isFormValid = true;

    if (
      ActivityType?.name.toLowerCase() !== 'visual art' ||
      ActivityType?.name.toLowerCase() !== 'music' ||
      ActivityType?.name.toLowerCase() !== 'dance' ||
      ActivityType?.name.toLowerCase() !== 'theatre'
    ) {
      if (showPhy) {
        if (physicalActivityToggle) {
          if (!ActivityType?.name) {
            message.error('Please Select Activity Type');
            isFormValid = false;
          } else if (!subActivityType?.name) {
            message.error('Please Select Sub-Activity Type');
            isFormValid = false;
          } else if (!remarksType) {
            message.error('Please Select Criteria Title');
            isFormValid = false;
          }
          visualInputlList.forEach((q, index) => {
            const error = validateActivityTypeSubmitQuestions(q);
            if (error && isFormValid) {
              message.error('Please Enter Questions');
              isFormValid = false;
            }
          });
          optionList.forEach((q, index) => {
            const error = validateActivityTypeSubmitOptions(q);
            if (error && isFormValid) {
              message.error('Please Enter Options & Marks');
              isFormValid = false;
            }
          });
        } else {
          if (!ActivityType?.name) {
            message.error('Please Select Activity Type');
            isFormValid = false;
          } else if (!subActivityType?.name) {
            message.error('Please Select Sub-Activity Type');
            isFormValid = false;
          } else if (!remarksType) {
            message.error('Please Enter Criteria Title');
            isFormValid = false;
          }
          inputList.forEach((q, index) => {
            const error = validateActivityTypeSubmitQuestions(q);
            if (error && isFormValid) {
              message.error('Please Enter Criteria Name');
              isFormValid = false;
            }
          });
          const uniqueValues = new Set(inputList.map((e) => e.name));
          if (uniqueValues.size < inputList.length) {
            message.error('Duplicate Name Found');
            isFormValid = false;
          }
        }
      } else {
        inputList.forEach((item, index) => {
          debugger;
          if (!item?.name && isFormValid) {
            message.error('Please Enter Criteria Name');
            isFormValid = false;
          } else if (!item?.rating && isFormValid) {
            message.error('Please Enter Rating');
            isFormValid = false;
          } else if (item.score == null && isFormValid) {
            message.error('Please Enter Score');
            isFormValid = false;
          }
        });
      }
    }

    return isFormValid;
  };

  const validateActivityTypeSubmitQuestions = (obj) => {
    let error = false;
    if (!obj.name) {
      error = true;
    }
    return error;
  };

  const validateActivityTypeSubmitOptions = (obj) => {
    let error = false;
    if (!obj.name) {
      error = true;
    }
    if (!obj.score) {
      error = true;
    }
    return error;
  };

  const handleActivityTypeSubmit = () => {
    var body;
    if (validateActivityTypeSubmit()) {
      if (physicalActivityToggle) {
        const arr1 = visualInputlList?.map((obj) => {
          return { ...obj, rating: optionList };
          return obj;
        });
        body = {
          sub_type: subActivityType?.name,
          activity_type: ActivityType?.name,
          criteria_title: remarksType,
          grading_scheme: arr1,
          is_dropdown: 'True',
        };
      } else {
        const uniqueValues = new Set(inputList.map((e) => e.name));
        if (uniqueValues.size < inputList.length) {
          message.error('Duplicate Name Found');
          return;
        }
        body = {
          sub_type: subActivityType?.name,
          activity_type: ActivityType?.name,
          grading_scheme: inputList,
          criteria_title:
            ActivityType?.name.toLowerCase() === 'public speaking' ? '' : remarksType,
        };
      }
      setLoading(true);
      axios
        .post(`${endpoints.newBlog.activityTypeSubmit}`, body, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) => {
          if (response?.data?.status_code == 400) {
            setLoading(false);
            message.error(response?.data?.message);
            return;
          } else {
            message.success(response?.data?.message);
            setLoading(false);
            setActivityType(null);
            setRemarksType(null);
            handleClose();
            getActivityCategory();
            return;
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };
  const handleActivityTypeSubmitEdit = () => {
    if (!isEditData?.name) {
      message.error('Please Enter Activity Type');
      return;
    }
    const uniqueValues = new Set(isEditData?.grading_scheme?.map((e) => e.name));
    if (uniqueValues.size < isEditData?.grading_scheme?.length) {
      message.error('Duplicate Name Found');
      return;
    }
    let body = { ...isEditData };
    setLoading(true);
    axios
      .post(`${endpoints.newBlog.activityTypeSubmitEdit}`, body, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response?.data?.status_code == 400 || response?.data?.status_code == 422) {
          setLoading(false);
          message.error({
            content: response?.data?.message,
            style: {
              zIndex: '2000',
            },
          });
          return;
        } else {
          message.success({
            content: response?.data?.message,
            style: {
              zIndex: '2000',
            },
          });

          setLoading(false);
          setActivityType(null);
          setFilterData([]);
          getActivityCategory();
          handleModalCloseEdit();
          handleActivity(search);
          return;
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getActivityCategory = () => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.getActivityTypesApi}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setActivityCategory(response?.data);
        if (response) {
          let res = response?.data?.result.filter((item) => {
            return item.name !== 'Public Speaking' && item.name !== 'Blog Activity';
          });
          setActivityCategoryRemarks(res);
        }
        setLoading(false);
      });
  };
  useEffect(() => {
    setPhysicalActivityHideAddCriteria(true);
    getActivityCategory();
  }, []);

  const handleInputCreativity = (event, index) => {
    const { value } = event.target;
    const newInputList = [...inputList];
    newInputList[index].name = value;
    setInputList(newInputList);
  };
  const handleInputCreativityEdit = (event, index) => {
    const { value } = event.target;
    const newInputList = { ...isEditData };
    let newData = newInputList.grading_scheme;
    newData[index].name = value;
    let modifiedData = { ...newData['grading_scheme'], ...isEditData };
    setIsEditData(modifiedData);
  };
  const handleInputRating = (event, index) => {
    const { value } = event.target;
    if (value > 5 || value < 0) {
      setAlert('error', 'Please Enter Number In Between 0 to 5');
      return;
    }
    const newInputList = [...inputList];
    newInputList[index].rating = value;
    setInputList(newInputList);
  };

  const handleInputRatingEdit = (event, index) => {
    const { value } = event.target;
    if (value > 5 || value < 0) {
      setAlert('error', 'Please Enter Number In Between 0 to 5');
      return;
    }
    const newInputList = { ...isEditData };
    let newData = newInputList.grading_scheme;
    newData[index].rating = value;
    let modifiedData = { ...newData['grading_scheme'], ...isEditData };
    setIsEditData(modifiedData);
  };

  const handleInputChange1 = (event, index) => {
    const { value } = event?.target;
    let newInputList = [...inputList];
    newInputList[index].score = Number(value);
    setInputList(newInputList);
  };

  const handleInputChange1Edit = (event, index) => {
    const { value } = event.target;
    const newInputList = { ...isEditData };
    let newData = newInputList.grading_scheme;
    newData[index].score = Number(value);
    let modifiedData = { ...newData['grading_scheme'], ...isEditData };
    setIsEditData(modifiedData);
  };

  const viewDisplay = () => {
    setViewing(true);
  };

  const handleCreateTemplate = () => {
    history.push('/blog/templates');
  };

  const handleRemoveItem = (index) => {
    const newList = [...inputList];
    newList.splice(index, 1);
    setInputList(newList);
  };

  const handleRemoveItemEdit = (input, index) => {
    let res = isEditData.grading_scheme.filter((item) => {
      return item.name !== 'Overall';
    });
    if (res.length > 1) {
      const newFileList = isEditData.grading_scheme.slice();
      newFileList.splice(index, 1);
      setIsEditData({ ...isEditData, grading_scheme: newFileList });
    } else {
      message.error('At least one Criteria Name is compulsory!');
    }
  };

  let vaRating = (obj) => {
    let rating = obj?.grading_scheme.map((item) => {
      if (obj.is_round_available == false && item?.va_rating == null) {
        if (item?.va_rating == null && item?.rating.includes('[{') == true) {
          return JSON.parse(item.rating);
          // return item?.rating
        }
      } else {
        return JSON.parse(item?.va_rating);
      }
    });
    return rating;
  };

  const handleActivity = (e) => {
    let array = [];
    if (e) {
      setSearch(e);
      setLoading(true);
      axios
        .get(`${endpoints.newBlog.getActivityType}?name=${e}`, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) => {
          response.data.result.map((obj) => {
            let temp = {};
            temp['id'] = obj?.id;
            temp['grading_scheme_id'] = obj?.grading_scheme_id;
            temp['name'] = obj?.name;
            temp['sub_type'] = obj?.sub_type;
            temp['criteria_title'] = obj?.criteria_title;
            temp['grading_scheme'] = obj?.grading_scheme;
            temp['question'] = obj?.grading_scheme?.map((item) => item?.name);
            temp['va_rating'] = vaRating(obj);
            temp['is_round_available'] = obj?.is_round_available;
            // temp['va_rating'] = obj?.grading_scheme.map((item) => JSON.parse(item?.va_rating));
            temp['is_editable'] = obj?.is_editable;
            array.push(temp);
          });
          setFilterData(array);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (ActivityType?.name == 'Physical Activity') {
      setShowPhy(true);
    } else {
      setShowPhy(false);
    }
  }, [ActivityType]);

  useEffect(() => {
    if (isEditData?.name == 'Physical Activity') {
      setShowPhy(true);
    } else {
      setShowPhy(false);
    }
  }, [isEditData]);

  const handleVisualInputApp = () => {
    if (visualInputlList?.length < 7) {
      setVisualInputList([
        ...visualInputlList,
        {
          name: '',
          score: null,
        },
      ]);
    } else {
      message.error('Please add 7 questions only!!');
    }
  };

  const handleVisualInputAppEdit = () => {
    if (isEditData.grading_scheme.length < 7) {
      const newData = isEditData.grading_scheme.concat({
        id: '',
        name: '',
        score: null,
      });
      setIsEditData({ ...isEditData, grading_scheme: newData });
    } else {
      message.error('Please add 7 questions only!!');
    }
  };

  const mainActivityOption = activityCategory?.result?.map((each) => {
    if (each.name !== 'Public Speaking') {
      return (
        <Option value={each?.name} name={each?.name}>
          {each?.name}
        </Option>
      );
    }
  });

  const activityOption = activityCategoryRemarks?.map((each) => {
    return (
      <Option value={each?.name} name={each?.name}>
        {each?.name}
      </Option>
    );
  });

  const activityOptionSub = activityCategory?.sub_types?.map((each) => {
    return (
      <Option value={each?.sub_type} name={each?.sub_type} sub_type={each?.sub_type}>
        {each?.sub_type}
      </Option>
    );
  });

  const handleOptionInputAdd = () => {
    if (optionList?.length < 10) {
      setOptionList([
        ...optionList,
        {
          name: '',
          score: null,
          status: false,
        },
      ]);
    } else {
      message.error('Please add 10 options only!!');
    }
  };

  const handleOptionInputAddEdit = () => {
    if (editOption?.length < 10) {
      const newData = editOption.concat({
        id: '',
        name: '',
        score: null,
        status: false,
      });
      setEditOption(newData);
    } else {
      message.error('Please add 10 options only!!');
    }
  };

  const handleOptionInput = (event, index) => {
    if (event) {
      const { value } = event.target;
      const newInputList = [...optionList];
      newInputList[index].name = value;
      setOptionList(newInputList);
    }
  };

  const handleOptionInputEdit = (event, index) => {
    if (event) {
      const { value } = event.target;
      const newInputList = [...editOption];
      let newData = newInputList;
      newData[index].name = value;
      let modifiedData = [...newData];
      setEditOption(modifiedData);
    }
  };

  const handleMarksInput = (event, index) => {
    const { value } = event.target;
    let newInputList = [...optionList];
    newInputList[index].score = value;
    setOptionList(newInputList);
  };

  const handleMarksInputEdit = (event, index) => {
    const { value } = event.target;
    let newInputList = [...editOption];
    newInputList[index].score = value;
    setEditOption(newInputList);
  };

  const validateOptionSubmit = () => {
    let isFormValid = true;
    if (!ActivityType?.name) {
      message.error('Please Select Activity Type');
      isFormValid = false;
    } else if (!remarksType) {
      message.error('Please Select Criteria Title');
      isFormValid = false;
    } else if (visualInputlList.length > 0 || optionList.length > 0) {
      visualInputlList.forEach((q, index) => {
        const error = validateQuestions(q);
        if (error && isFormValid) {
          message.error('Please Enter Questions');
          isFormValid = false;
        }
      });
      optionList.forEach((q, index) => {
        const error = validateOptions(q);
        if (error && isFormValid) {
          message.error('Please Enter Options & Marks');
          isFormValid = false;
        }
      });
    }

    return isFormValid;
  };

  const validateQuestions = (obj) => {
    let error = false;
    if (!obj.name) {
      error = true;
    }
    return error;
  };

  const validateOptions = (obj) => {
    let error = false;
    if (!obj.name) {
      error = true;
    }
    if (!obj.score) {
      error = true;
    }
    return error;
  };

  const handleOptionSubmit = () => {
    if (validateOptionSubmit()) {
      const arr1 = visualInputlList?.map((obj) => {
        return { ...obj, rating: optionList };
        return obj;
      });
      let body = {
        activity_type: ActivityType?.name,
        criteria_title: remarksType,
        grading_scheme: arr1,
      };

      setLoading(true);
      axios
        .post(`${endpoints.newBlog.visualOptionSubmit}`, body, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((res) => {
          if (res.data.status_code == 400) {
            message.error({
              content: res?.data?.message,
              style: {
                zIndex: '2000',
              },
            });
            setLoading(false);
            return;
          } else {
            setLoading(false);
            message.success({
              content: res.data.message,
              style: {
                zIndex: '2000',
              },
            });
            setActivityType(null);
            setRemarksType(null);
            handleClose();
            getActivityCategory();
            setFilterData([]);
            return;
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  const handleOptionSubmitEdit = () => {
    const arr1 = isEditData.grading_scheme?.map((obj) => {
      return { ...obj, rating: editOption };
      return obj;
    });
    let body = {
      name: isEditData?.name,
      id: isEditData?.id,
      criteria_title: isEditData?.criteria_title,
      grading_scheme: arr1,
      is_round_available: isEditData?.is_round_available,
    };

    setLoading(true);
    axios
      .post(`${endpoints.newBlog.activityTypeSubmitEdit}`, body, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((res) => {
        if (res.data.status_code == 400 || res?.data?.status_code == 422) {
          message.error({
            content: res.data.message,
            style: {
              zIndex: '2000',
            },
          });
          setLoading(false);
          handleModalCloseEdit();
          handleActivity(search);
          return;
        } else {
          setLoading(false);
          message.success({
            content: res.data.message,
            style: {
              zIndex: '2000',
            },
          });
          setActivityType(null);
          handleModalCloseEdit();
          setFilterData([]);
          getActivityCategory();
          handleActivity(search);
          return;
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleOptionDelete = (id, index) => {
    let newOptionList = [...optionList];
    // let newList = newOptionList.filter((item) => item?.name !== id?.name);
    newOptionList.splice(index, 1);
    setOptionList(newOptionList);
  };

  const handleOptionDeleteEdit = (id, index) => {
    let newOptionList = [...editOption];
    // let newList = newOptionList.filter((item) => item?.name !== id?.name);
    newOptionList.splice(index, 1);
    setEditOption(newOptionList);
  };

  const handleQuestion = (event, index) => {
    if (event) {
      const { value } = event.target;
      const newInputList = [...visualInputlList];
      newInputList[index].name = value;
      setVisualInputList(newInputList);
    }
  };

  const handleQuestionEdit = (event, index) => {
    if (event) {
      const { value } = event.target;
      const newInputList = { ...isEditData };
      let newData = newInputList.grading_scheme;
      newData[index].name = value;
      let modifiedData = { ...newData['grading_scheme'], ...isEditData };
      setIsEditData(modifiedData);
    }
  };

  const handleRemoveVisualQuestion = (id, index) => {
    let newVisualList = [...visualInputlList];
    // const newList = newVisualList.filter((item) => item?.name !== id?.name);
    newVisualList.splice(index, 1);
    setVisualInputList(newVisualList);
  };

  const handleRemoveVisualQuestionEdit = (id, index) => {
    const newFileList = isEditData.grading_scheme.slice();
    newFileList.splice(index, 1);
    setIsEditData({ ...isEditData, grading_scheme: newFileList });
  };

  const handleActivityChange = (event, value) => {
    setPhysicalActivityToggle(false);
    setActivityType(value);
  };

  const handleSubActivityChange = (event, value) => {
    setSubActivityType(value);
  };

  const handleModalClose = () => {
    setViewing(false);
    setActivityType(null);
    setRemarksType(null);
    setInputList([{ name: '', rating: '', score: null }]);
    setVisualInputList([{ name: '', score: null }]);
    setOptionList([{ name: '', score: null, status: false }]);
  };

  const handleModalCloseEdit = () => {
    setIsEdit(false);
    setIsEditData([]);
  };

  const handleInputRemarks = (event) => {
    const { value } = event.target;
    setRemarksType(value);
  };
  const handleInputRemarksEdit = (event) => {
    const { value } = event.target;
    const newInputList = { ...isEditData, criteria_title: value };
    setIsEditData(newInputList);
  };
  const handleDelete = (data) => {
    if (data) {
      setLoading(true);
      axios
        .delete(
          `${endpoints.newBlog.criteriaDelete}${data?.id}/?grading_scheme_id=${data?.grading_scheme_id}`,
          {
            headers: {
              'X-DTS-HOST': X_DTS_HOST,
            },
          }
        )
        .then((response) => {
          if (response?.data?.status_code) {
            message.success(response?.data?.message);
            setActivityType(null);
            setFilterData([]);
            getActivityCategory();
            setLoading(false);
            handleActivity(search);
            return;
          } else {
            message.warning(response?.data?.message);
            setLoading(false);
            return;
          }
        })
        .catch((err) => {
          message.error(err);
          return;
        });
    }
  };
  const handleEdit = (e, data) => {
    setIsEdit(false);
    if (e) {
      setIsEdit(true);
      setIsEditData(data);
      // let optionData = data?.va_rating[0];
      let varatingArr = data?.va_rating[0];
      let optionData;
      if (varatingArr == undefined) {
        optionData = [];
      } else {
        optionData = data?.va_rating[0];
      }
      // let optionData = varatingArr == undefined ? [] : (varatingArr.every(el => e == undefined) ? null : data?.va_rating[0])
      // let optionData = varatingArr.every(el => e == undefined) ? null : data?.va_rating[0];
      setEditOption(optionData);
    }
  };

  const handlePhysicalActivityToggle = (event) => {
    setPhysicalActivityToggle(event.target.checked);
  };

  useEffect(() => {
    setRemarksType(null);
    setSubActivityType(null);
    setInputList([{ name: '', rating: '', score: null }]);
    setVisualInputList([{ name: '', score: null }]);
    setOptionList([{ name: '', score: null, status: false }]);
  }, [ActivityType]);
  return (
    <Layout>
      {''}
      <div className='row px-2'>
        <div className='col-md-8' style={{ zIndex: 2 }}>
          <Breadcrumb separator='>'>
            <Breadcrumb.Item href='/blog/wall/central/redirect' className='th-grey th-16'>
              Activity Management
            </Breadcrumb.Item>
            <Breadcrumb.Item className='th-grey th-16'>Create rating</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='row th-bg-white th-br-5 m-3 h-50'>
          {loading ? (
            <div
              className='d-flex align-items-center justify-content-center w-100 text-center'
              style={{ height: '50vh' }}
            >
              <Spin tip='Loading' />
            </div>
          ) : (
            <div className='col-12'>
              <div className='row p-3 align-items-end'>
                {/* <div className='col-12 d-flex' style={{ height: '6%' }}> */}
                <div className='col-md-6 mb-sm-0 p-0'>
                  <div className='py-1'>Select Activity Type</div>
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    placeholder='Select Activity Type'
                    showSearch
                    value={search}
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    onChange={(e) => {
                      handleActivity(e);
                    }}
                    className='w-50 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={true}
                  >
                    {mainActivityOption}
                  </Select>
                </div>
                <div className='col-md-6'>
                  <div className='d-flex align-item-center justify-content-between'>
                    <div className='text-center'>
                      <Tag
                        icon={<SnippetsOutlined className='th-14' />}
                        color='geekblue'
                        className='th-br-5 th-pointer py-1'
                        onClick={() => history.push('/create-subject-wise-rating')}
                      >
                        <span className='th-fw-500 th-14'> Subject Wise Ratings</span>
                      </Tag>
                    </div>
                    <div className='text-center'>
                      <Tag
                        icon={<SnippetsOutlined className='th-14' />}
                        color='geekblue'
                        className='th-br-5 th-pointer py-1'
                        onClick={handleCreateTemplate}
                      >
                        <span className='th-fw-500 th-14'>Add Templates</span>
                      </Tag>
                    </div>
                    <div className='text-center'>
                      <Tag
                        icon={<AuditOutlined className='th-14' />}
                        color='purple'
                        className='th-br-5 th-pointer py-1 th-14 th-fw-500'
                        onClick={viewDisplay}
                      >
                        Add Criteria
                      </Tag>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row mt-5'>
                <div className='col-md-12'>
                  <>
                    {filterData?.length !== 0 ? (
                      <Table
                        className='th-table'
                        rowClassName={(record, index) =>
                          `'th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                        }
                        pagination={false}
                        scroll={{ y: '50vh' }}
                        loading={loading}
                        columns={columns}
                        dataSource={filterData}
                      />
                    ) : (
                      <div
                        className='row justify-content-center align-item-center mt-5'
                        style={{ height: '47 vh' }}
                      >
                        <img src={NoDataIcon} />
                      </div>
                    )}
                  </>
                </div>
              </div>
            </div>
          )}
        </div>
        <ModalAnt
          title='Create Rating'
          centered
          open={viewing}
          visible={viewing}
          footer={null}
          className='th-upload-modal'
          onOk={() => setViewing(false)}
          onCancel={handleModalClose}
          width={1000}
        >
          <div className='row'>
            <div className='row mt-1'>
              <div className='col-md-6 md-sm-0'>Activity Types</div>
            </div>
            <div className='row mt-1'>
              <div className='col-md-10 md-sm-0'>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder='Select Activity Type'
                  showSearch
                  value={ActivityType}
                  optionFilterProp='children'
                  filterOption={(input, option) => {
                    return (
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(e, value) => handleActivityChange(e, value)}
                  className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                  bordered={true}
                >
                  {activityOption}
                </Select>
              </div>
            </div>
            {ActivityType && ActivityType?.name.toLowerCase() === 'physical activity' ? (
              <>
                <div className='row mt-2'>
                  <div className='col-md-6 md-sm-0'>Sub-Activity</div>
                </div>
                <div className='row mt-2'>
                  <div className='col-md-10 md-sm-0'>
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      placeholder='Sub Activity Type'
                      // showSearch
                      value={subActivityType}
                      optionFilterProp='children'
                      filterOption={(input, option) => {
                        return (
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => handleSubActivityChange(e, value)}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={true}
                    >
                      {activityOptionSub}
                    </Select>
                  </div>
                </div>
              </>
            ) : (
              ''
            )}
            <div className='col-md-12'>
              {ActivityType ? (
                <>
                  {(ActivityType && ActivityType?.name.toLowerCase() === 'visual art') ||
                  ActivityType?.name.toLowerCase() === 'music' ||
                  ActivityType?.name.toLowerCase() === 'dance' ||
                  ActivityType?.name.toLowerCase() === 'theatre' ? (
                    <div className='row mt-2'>
                      <AntDivider
                        orientation='left'
                        orientationMargin='0'
                        plain
                        style={{ alignItems: 'flex-start' }}
                      >
                        Add Criteria Title
                      </AntDivider>
                      <div className='col-10 question-visual'>
                        <Input
                          placeholder='Criteria Title'
                          width={100}
                          showCount
                          maxLength='100'
                          value={remarksType}
                          onChange={(e) => handleInputRemarks(e)}
                        />
                      </div>
                      <AntDivider
                        orientation='left'
                        orientationMargin='0'
                        plain
                        style={{ alignItems: 'flex-start' }}
                      >
                        Add Questions
                      </AntDivider>
                      {visualInputlList
                        ? visualInputlList.map((input, index) => (
                            <>
                              <div className='col-10 question-visual'>
                                <Input
                                  placeholder='Question'
                                  width={100}
                                  maxLength='500'
                                  showCount
                                  value={input?.name}
                                  onChange={(event) => handleQuestion(event, index)}
                                />
                              </div>
                              <div className='col-2 delete-visual-icon'>
                                {visualInputlList && visualInputlList.length > 1 ? (
                                  <DeleteFilled
                                    onClick={() =>
                                      handleRemoveVisualQuestion(input, index)
                                    }
                                    style={{
                                      cursor: 'pointer',
                                      fontSize: '18px',
                                      color: 'darkblue',
                                    }}
                                  />
                                ) : (
                                  ''
                                )}
                              </div>
                            </>
                          ))
                        : 'No Item In The List'}

                      <div className='col-12 padding-style'>
                        <Button
                          type='primary'
                          icon={<PlusOutlined />}
                          onClick={handleVisualInputApp}
                        >
                          Add Question
                        </Button>
                      </div>
                      <AntDivider
                        orientation='left'
                        orientationMargin='0'
                        plain
                        style={{ alignItems: 'flex-start' }}
                      >
                        Add Options & Marks
                      </AntDivider>
                      {optionList
                        ? optionList.map((input, index) => (
                            <div className='row'>
                              <div className='col-7' style={{ padding: '0.5rem 0rem' }}>
                                <Input
                                  value={input?.name}
                                  placeholder='Option'
                                  maxLength='100'
                                  showCount
                                  width={100}
                                  onChange={(event) => handleOptionInput(event, index)}
                                />
                              </div>
                              <div
                                className='col-3'
                                style={{ padding: '0.5rem 0rem 0.5rem 0.5rem' }}
                              >
                                <Input
                                  placeholder='Marks'
                                  value={input?.score}
                                  width={100}
                                  maxLength='3'
                                  showCount
                                  onChange={(event) => handleMarksInput(event, index)}
                                />
                              </div>
                              <div className='col-2 delete-visual-icon'>
                                {optionList && optionList.length > 1 ? (
                                  <DeleteFilled
                                    style={{
                                      cursor: 'pointer',
                                      fontSize: '18px',
                                      color: 'darkblue',
                                    }}
                                    onClick={() => handleOptionDelete(input, index)}
                                  />
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                          ))
                        : 'No Option In The List'}
                      <div className='col-12' style={{ padding: '0.5rem 0rem' }}>
                        <Button
                          icon={<PlusOutlined />}
                          onClick={handleOptionInputAdd}
                          type='primary'
                        >
                          Add Option
                        </Button>
                      </div>
                      <div className='col-12 padding-style'>
                        <Button type='primary' onClick={handleOptionSubmit}>
                          Submit
                        </Button>

                        <Button
                          type='primary'
                          onClick={handleClose}
                          style={{ marginLeft: '0.5rem' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className='row mt-2'>
                        {ActivityType &&
                        ActivityType.name.toLowerCase() === 'public speaking' ? (
                          ''
                        ) : (
                          <>
                            {showPhy ? (
                              <>
                                <AntDivider
                                  orientation='left'
                                  orientationMargin='0'
                                  plain
                                  style={{ alignItems: 'flex-start' }}
                                >
                                  Add Criteria Title
                                </AntDivider>
                                <div className='col-10 px-0'>
                                  <Input
                                    placeholder='Criteria Title'
                                    width={100}
                                    maxLength='100'
                                    showCount
                                    value={remarksType}
                                    onChange={(event) => handleInputRemarks(event)}
                                    inputList
                                  />
                                </div>
                              </>
                            ) : (
                              ''
                            )}
                          </>
                        )}
                      </div>
                      {showPhy ? (
                        <div className='col-md-12 col-6 d-flex  px-0'>
                          <Typography className='d-flex align-items-center'>
                            Question and Answer(Enable or Disable)
                          </Typography>
                          <div className='d-flex align-items-center'>
                            <Switch
                              onChange={handlePhysicalActivityToggle}
                              checked={physicalActivityToggle}
                            />
                          </div>
                        </div>
                      ) : (
                        ''
                      )}

                      {physicalActivityToggle ? (
                        <>
                          <AntDivider
                            orientation='left'
                            orientationMargin='0'
                            plain
                            style={{ alignItems: 'flex-start' }}
                          >
                            Add Questions
                          </AntDivider>
                          {visualInputlList
                            ? visualInputlList.map((input, index) => (
                                <>
                                  <div className='row'>
                                    <div className='col-10 question-visual'>
                                      <Input
                                        placeholder='Question'
                                        width={100}
                                        maxLength='500'
                                        showCount
                                        value={input?.name}
                                        onChange={(event) => handleQuestion(event, index)}
                                      />
                                    </div>
                                    <div className='col-2 delete-visual-icon'>
                                      {visualInputlList && visualInputlList.length > 1 ? (
                                        <DeleteFilled
                                          onClick={() =>
                                            handleRemoveVisualQuestion(input, index)
                                          }
                                          style={{
                                            cursor: 'pointer',
                                            fontSize: '18px',
                                            color: 'darkblue',
                                          }}
                                        />
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                  </div>
                                </>
                              ))
                            : 'No Item In The List'}

                          <div className='col-12 padding-style'>
                            <Button
                              type='primary'
                              icon={<PlusOutlined />}
                              onClick={handleVisualInputApp}
                            >
                              Add Question
                            </Button>
                          </div>
                          <AntDivider
                            orientation='left'
                            orientationMargin='0'
                            plain
                            style={{ alignItems: 'flex-start' }}
                          >
                            Add Options & Marks
                          </AntDivider>
                          {optionList
                            ? optionList.map((input, index) => (
                                <div className='row'>
                                  <div
                                    className='col-7'
                                    style={{ padding: '0.5rem 0rem' }}
                                  >
                                    <Input
                                      value={input?.name}
                                      placeholder='Option'
                                      maxLength='100'
                                      showCount
                                      width={100}
                                      onChange={(event) =>
                                        handleOptionInput(event, index)
                                      }
                                    />
                                  </div>
                                  <div
                                    className='col-3'
                                    style={{ padding: '0.5rem 0rem 0.5rem 0.5rem' }}
                                  >
                                    <Input
                                      placeholder='Marks'
                                      value={input?.score}
                                      width={100}
                                      maxLength='3'
                                      showCount
                                      onChange={(event) => handleMarksInput(event, index)}
                                    />
                                  </div>
                                  <div className='col-2 delete-visual-icon'>
                                    {optionList && optionList.length > 1 ? (
                                      <DeleteFilled
                                        style={{
                                          cursor: 'pointer',
                                          fontSize: '18px',
                                          color: 'darkblue',
                                        }}
                                        onClick={() => handleOptionDelete(input, index)}
                                      />
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                              ))
                            : 'No Option In The List'}
                          <div className='col-12' style={{ padding: '0.5rem 0rem' }}>
                            <Button
                              icon={<PlusOutlined />}
                              onClick={handleOptionInputAdd}
                              type='primary'
                            >
                              Add Option
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className='row mt-2'>
                            <AntDivider
                              orientation='left'
                              orientationMargin='0'
                              plain
                              style={{ alignItems: 'flex-start' }}
                            >
                              Add Criteria Name
                            </AntDivider>
                          </div>
                          {inputList
                            ? inputList.map((input, index) => (
                                <>
                                  <div className='row mt-2'>
                                    <div className='col-10 px-0'>
                                      <Input
                                        placeholder='Criteria Name'
                                        width={100}
                                        showCount
                                        maxLength='500'
                                        value={input?.name}
                                        onChange={(event) =>
                                          handleInputCreativity(event, index)
                                        }
                                      />
                                    </div>
                                    {showPhy ? (
                                      ''
                                    ) : (
                                      <>
                                        <div className='col-10'>
                                          <Input
                                            placeholder='Rating'
                                            width={100}
                                            showCount
                                            maxLength='1'
                                            value={input?.rating}
                                            onChange={(event) =>
                                              handleInputRating(event, index)
                                            }
                                          />
                                        </div>
                                        <div className='col-10'>
                                          <Input
                                            placeholder='Score'
                                            width={100}
                                            showCount
                                            maxLength='3'
                                            value={input?.score}
                                            onChange={(event) =>
                                              handleInputChange1(event, index)
                                            }
                                          />
                                        </div>
                                      </>
                                    )}
                                    <div className='col-2 d-flex align-items-center'>
                                      {inputList && inputList.length > 1 ? (
                                        <DeleteFilled
                                          onClick={() => handleRemoveItem(index)}
                                          style={{
                                            cursor: 'pointer',
                                            fontSize: '18px',
                                            color: 'darkblue',
                                          }}
                                        />
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                  </div>
                                </>
                              ))
                            : 'No item in the list '}
                          {physicalActivityHideAddCriteria && showPhy ? (
                            ''
                          ) : (
                            <>
                              <div className='row mt-2'>
                                <div className='col-12 mb-2 th-black-1  text-truncate px-0'>
                                  <Button
                                    icon={<PlusOutlined />}
                                    type='primary'
                                    className='th-br-5 th-pointer py-1 th-14 th-fw-500'
                                    onClick={handleListAdd}
                                  >
                                    Add Criteria
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}

                      <AntDivider />
                      <div className='row mb-3 ml-1'>
                        <div className='col-12 th-black-1 px-0'>
                          <Button
                            icon={<CheckCircleOutlined />}
                            color='green'
                            type='primary'
                            className='th-br-5 th-pointer py-1 th-14 th-fw-500 mr-2'
                            onClick={handleActivityTypeSubmit}
                          >
                            Submit
                          </Button>
                          <Button
                            icon={<CloseCircleOutlined />}
                            color='red'
                            type='primary'
                            className='th-br-5 th-pointer py-1 th-14 th-fw-500'
                            onClick={handleModalClose}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div
                  className='row justify-content-center align-item-center m-5'
                  style={{ height: '25vh' }}
                >
                  <img src={NoDataIcon} />
                </div>
              )}
            </div>
          </div>
        </ModalAnt>
        <ModalAnt
          title='Edit Rating'
          centered
          open={isEdit}
          visible={isEdit}
          footer={null}
          className='th-upload-modal'
          onOk={() => setViewing(false)}
          onCancel={handleModalCloseEdit}
          width={1000}
        >
          <div className='row p-2'>
            <div className='col-md-12 md-sm-0'>
              <div className='row mt-2'>
                <div className='col-md-6 md-sm-0'>Activity Types</div>
              </div>
              <div className='row mt-2'>
                <div className='col-md-6 md-sm-0'>
                  <Input className='mt-2' disabled placeholder={isEditData?.name} />
                </div>
              </div>

              {isEditData && isEditData?.name === 'Physical Activity' ? (
                <>
                  <div className='row mt-2'>
                    <div className='col-md-6 md-sm-0'>Sub-Activity</div>
                  </div>
                  <div className='row mt-2'>
                    <div className='col-md-6 md-sm-0'>
                      <Input
                        className='mt-2'
                        disabled
                        placeholder={isEditData?.sub_type}
                      />
                    </div>
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
            <div className='col-md-12'>
              {Object.keys(isEditData).length > 0 ? (
                <>
                  {isEditData?.name.toLowerCase() === 'visual art' ||
                  isEditData?.name.toLowerCase() === 'music' ||
                  isEditData?.name.toLowerCase() === 'dance' ||
                  isEditData?.name.toLowerCase() === 'theatre' ? (
                    <div className='row m-2'>
                      <AntDivider
                        orientation='left'
                        orientationMargin='0'
                        plain
                        style={{ alignItems: 'flex-start' }}
                      >
                        Add Criteria Title
                      </AntDivider>
                      <div className='col-10 question-visual'>
                        <Input
                          placeholder='Criteria Title'
                          width={100}
                          maxLength='100'
                          showCount
                          defaultValue={isEditData?.criteria_title}
                          value={
                            Object.keys(isEditData)
                              ? isEditData?.criteria_title
                              : remarksType
                          }
                          onChange={(e) => handleInputRemarksEdit(e)}
                        />
                      </div>
                      <AntDivider
                        orientation='left'
                        orientationMargin='0'
                        plain
                        style={{ alignItems: 'flex-start' }}
                      >
                        Add Questions
                      </AntDivider>
                      {Object.keys(isEditData)
                        ? isEditData?.grading_scheme.map((input, index) => (
                            <>
                              <div className='col-10 question-visual'>
                                <Input
                                  placeholder='Question'
                                  width={100}
                                  maxLength='100'
                                  showCount
                                  value={input?.name}
                                  onChange={(event) => handleQuestionEdit(event, index)}
                                />
                              </div>
                              <div className='col-2 delete-visual-icon'>
                                <DeleteFilled
                                  onClick={() =>
                                    handleRemoveVisualQuestionEdit(input, index)
                                  }
                                  style={{
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    color: 'darkblue',
                                  }}
                                />
                              </div>
                            </>
                          ))
                        : 'No Item In The List'}
                      <div className='col-12 padding-style'>
                        <Button
                          type='primary'
                          icon={<PlusOutlined />}
                          onClick={handleVisualInputAppEdit}
                        >
                          Add Question
                        </Button>
                      </div>

                      {editOption.length > 0 && (
                        <>
                          <AntDivider
                            orientation='left'
                            orientationMargin='0'
                            plain
                            style={{ alignItems: 'flex-start' }}
                          >
                            Add Options & Marks
                          </AntDivider>
                          {Object.keys(editOption)
                            ? editOption?.map((input, index) => (
                                <div className='row'>
                                  <div
                                    className='col-6'
                                    style={{ padding: '0.5rem 0rem' }}
                                  >
                                    <Input
                                      value={input?.name}
                                      placeholder='Option'
                                      width={100}
                                      maxLength='100'
                                      showCount
                                      onChange={(event) =>
                                        handleOptionInputEdit(event, index)
                                      }
                                    />
                                  </div>
                                  <div
                                    className='col-3'
                                    style={{ padding: '0.5rem 0.5rem' }}
                                  >
                                    <Input
                                      placeholder='Marks'
                                      value={input?.score}
                                      width={100}
                                      maxLength='2'
                                      showCount
                                      onChange={(event) =>
                                        handleMarksInputEdit(event, index)
                                      }
                                    />
                                  </div>
                                  <div className='col-3 delete-visual-icon'>
                                    <DeleteFilled
                                      style={{
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        color: 'darkblue',
                                      }}
                                      onClick={() => handleOptionDeleteEdit(input, index)}
                                    />
                                  </div>
                                </div>
                              ))
                            : 'No Option In The List'}
                          <div className='col-12' style={{ padding: '0.5rem 0rem' }}>
                            <Button
                              icon={<PlusOutlined />}
                              onClick={handleOptionInputAddEdit}
                              type='primary'
                            >
                              Add Option
                            </Button>
                          </div>
                        </>
                      )}
                      <div className='col-12 padding-style'>
                        <Button type='primary' onClick={handleOptionSubmitEdit}>
                          Submit
                        </Button>

                        <Button
                          type='primary'
                          onClick={handleModalCloseEdit}
                          style={{ marginLeft: '0.5rem' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {isEditData?.is_round_available === true ? (
                        <>
                          <div className='row'>
                            {isEditData.name.toLowerCase() === 'public speaking' ? (
                              ''
                            ) : (
                              <>
                                <div className='row mt-2'>
                                  <div className='col-md-6 md-sm-0'>
                                    Add Criteria Title
                                  </div>
                                </div>
                                <div className='row mt-2'>
                                  <div className='col-md-6 mt-2'>
                                    <Input
                                      maxLength={100}
                                      showCount
                                      placeholder='Criteria Title'
                                      defaultValue={isEditData?.criteria_title}
                                      width={100}
                                      value={
                                        Object.keys(isEditData)
                                          ? isEditData?.criteria_title
                                          : remarksType
                                      }
                                      onChange={(event) => handleInputRemarksEdit(event)}
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          <div className='row mt-2'>
                            <div className='col-md-6 md-sm-0'>Add Criteria Name</div>
                          </div>

                          {Object.keys(isEditData)
                            ? isEditData?.grading_scheme?.map((input, index) => (
                                <>
                                  <div className='row m-2'>
                                    <div
                                      className='col-md-6 mt-2 md-sm-0'
                                      style={{
                                        display:
                                          input?.name.toLowerCase() == 'overall'
                                            ? 'none'
                                            : '',
                                      }}
                                    >
                                      <Input
                                        showCount
                                        maxLength={500}
                                        placeholder='Criteria'
                                        width={100}
                                        defaultValue={input?.name}
                                        value={input?.name}
                                        onChange={(event) =>
                                          handleInputCreativityEdit(event, index)
                                        }
                                      />
                                    </div>

                                    {showPhy ? (
                                      ''
                                    ) : (
                                      <>
                                        <div
                                          className='col-3'
                                          style={{
                                            display:
                                              input?.name.toLowerCase() == 'overall'
                                                ? 'none'
                                                : '',
                                          }}
                                        >
                                          <Input
                                            placeholder='Rating'
                                            width={100}
                                            value={input?.rating}
                                            onChange={(event) =>
                                              handleInputRatingEdit(event, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className='col-3'
                                          style={{
                                            display:
                                              input?.name.toLowerCase() == 'overall'
                                                ? 'none'
                                                : '',
                                          }}
                                        >
                                          <Input
                                            placeholder='Score'
                                            width={100}
                                            value={input?.score}
                                            onChange={(event) =>
                                              handleInputChange1Edit(event, index)
                                            }
                                          />
                                        </div>
                                      </>
                                    )}
                                    {/* <div className='col-2 d-flex align-items-center'>
                                      <DeleteFilled
                                        onClick={() => handleRemoveItemEdit(input, index)}
                                        style={{
                                          cursor: 'pointer',
                                          fontSize: '18px',
                                          color: 'darkblue',
                                          display:
                                            input?.name.toLowerCase() == 'overall'
                                              ? 'none'
                                              : '',
                                        }}
                                      />
                                    </div> */}
                                  </div>
                                </>
                              ))
                            : 'No item in the list '}
                          {/* <div className='row m-2'>
                            <div className='col-12 mb-2 th-black-1  text-truncate'>
                              <Button
                                icon={<PlusOutlined />}
                                type='primary'
                                className='th-br-5 th-pointer py-1 th-14 th-fw-500'
                                onClick={handleListAddEdit}
                              >
                                Add Remarks
                              </Button>
                            </div>
                          </div> */}
                          <AntDivider />
                          <div className='row mb-3 ml-1'>
                            <div className='col-12 th-black-1'>
                              <Button
                                icon={<CheckCircleOutlined />}
                                color='green'
                                type='primary'
                                className='th-br-5 th-pointer py-1 th-14 th-fw-500 mr-2'
                                onClick={handleActivityTypeSubmitEdit}
                              >
                                Submit
                              </Button>
                              <Button
                                icon={<CloseCircleOutlined />}
                                color='red'
                                type='primary'
                                className='th-br-5 th-pointer py-1 th-14 th-fw-500'
                                onClick={handleModalCloseEdit}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className='row m-2'>
                            <AntDivider
                              orientation='left'
                              orientationMargin='0'
                              plain
                              style={{ alignItems: 'flex-start' }}
                            >
                              Add Criteria Title
                            </AntDivider>
                            <div className='col-10 question-visual'>
                              <Input
                                placeholder='Criteria Title'
                                width={100}
                                maxLength='100'
                                showCount
                                defaultValue={isEditData?.criteria_title}
                                value={
                                  Object.keys(isEditData)
                                    ? isEditData?.criteria_title
                                    : remarksType
                                }
                                onChange={(e) => handleInputRemarksEdit(e)}
                              />
                            </div>
                            <AntDivider
                              orientation='left'
                              orientationMargin='0'
                              plain
                              style={{ alignItems: 'flex-start' }}
                            >
                              Add Questions
                            </AntDivider>
                            {Object.keys(isEditData)
                              ? isEditData?.grading_scheme.map((input, index) => (
                                  <>
                                    <div className='col-10 question-visual'>
                                      <Input
                                        placeholder='Question'
                                        width={100}
                                        maxLength='100'
                                        showCount
                                        value={input?.name}
                                        onChange={(event) =>
                                          handleQuestionEdit(event, index)
                                        }
                                      />
                                    </div>
                                    <div className='col-2 delete-visual-icon'>
                                      <DeleteFilled
                                        onClick={() =>
                                          handleRemoveVisualQuestionEdit(input, index)
                                        }
                                        style={{
                                          cursor: 'pointer',
                                          fontSize: '18px',
                                          color: 'darkblue',
                                        }}
                                      />
                                    </div>
                                  </>
                                ))
                              : 'No Item In The List'}
                            <div className='col-12 padding-style'>
                              <Button
                                type='primary'
                                icon={<PlusOutlined />}
                                onClick={handleVisualInputAppEdit}
                              >
                                Add Question
                              </Button>
                            </div>

                            {editOption.length > 0 && (
                              <>
                                <AntDivider
                                  orientation='left'
                                  orientationMargin='0'
                                  plain
                                  style={{ alignItems: 'flex-start' }}
                                >
                                  Add Options & Marks
                                </AntDivider>
                                {Object.keys(editOption)
                                  ? editOption?.map((input, index) => (
                                      <div className='row'>
                                        <div
                                          className='col-6'
                                          style={{ padding: '0.5rem 0rem' }}
                                        >
                                          <Input
                                            value={input?.name}
                                            placeholder='Option'
                                            width={100}
                                            maxLength='100'
                                            showCount
                                            onChange={(event) =>
                                              handleOptionInputEdit(event, index)
                                            }
                                          />
                                        </div>
                                        <div
                                          className='col-3'
                                          style={{ padding: '0.5rem 0.5rem' }}
                                        >
                                          <Input
                                            placeholder='Marks'
                                            value={input?.score}
                                            width={100}
                                            maxLength='2'
                                            showCount
                                            onChange={(event) =>
                                              handleMarksInputEdit(event, index)
                                            }
                                          />
                                        </div>
                                        <div className='col-3 delete-visual-icon'>
                                          <DeleteFilled
                                            style={{
                                              cursor: 'pointer',
                                              fontSize: '18px',
                                              color: 'darkblue',
                                            }}
                                            onClick={() =>
                                              handleOptionDeleteEdit(input, index)
                                            }
                                          />
                                        </div>
                                      </div>
                                    ))
                                  : 'No Option In The List'}
                                <div
                                  className='col-12'
                                  style={{ padding: '0.5rem 0rem' }}
                                >
                                  <Button
                                    icon={<PlusOutlined />}
                                    onClick={handleOptionInputAddEdit}
                                    type='primary'
                                  >
                                    Add Option
                                  </Button>
                                </div>
                              </>
                            )}
                            <div className='col-12 padding-style'>
                              <Button type='primary' onClick={handleOptionSubmitEdit}>
                                Submit
                              </Button>

                              <Button
                                type='primary'
                                onClick={handleModalCloseEdit}
                                style={{ marginLeft: '0.5rem' }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div
                  className='row justify-content-center align-item-center m-5'
                  style={{ height: '25vh' }}
                >
                  <img src={NoDataIcon} />
                </div>
              )}
            </div>
          </div>
        </ModalAnt>
      </div>
    </Layout>
  );
};
export default RatingCreate;
