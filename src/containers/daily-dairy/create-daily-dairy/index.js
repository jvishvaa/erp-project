import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  SvgIcon,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from '@material-ui/core';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Slide,
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios';
import { useFormik } from 'formik';
import { useStyles } from '../../user-management/useStyles';
import cuid from 'cuid';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../Layout';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import attachmenticon from '../../../assets/images/attachmenticon.svg';
import deleteIcon from '../../../assets/images/delete.svg';
import Loading from '../../../components/loader/loader';
import validationSchema from '../../user-management/schemas/school-details';
import {
  fetchBranchesForCreateUser,
  fetchGrades,
  fetchSections,
  fetchAcademicYears as getAcademicYears,
  fetchSubjects as getSubjects,
} from '../../../redux/actions/index';
import { Context } from '../context/context';
// import AddHomework from '../../../assets/images/AddHomework.svg';
import AssignedHomework from '../../../assets/images/hw-given.svg';
import QuestionCard from '../../../components/question-card';
import { useDispatch, useSelector } from 'react-redux';
import { addHomeWork } from 'redux/actions/teacherHomeworkActions';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import './daily-diary-scrollbar.css';
import InfoIcon from '@material-ui/icons/Info';

const CreateDailyDairy = (details, onSubmit) => {
  const dispatch = useDispatch();
  const { user_id } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [academicYears, setAcademicYears] = useState([]);
  const [queIndexCounter, setQueIndexCounter] = useState(0);
  const [assignedHomework, setAssignedHomework] = useState('');
  const [assignedHomeworkModal, setAssignedHomeworkModal] = useState('');
  const [hwId, sethwId] = useState();
  const [hwMappingID, setHwMappingID] = useState();
  const [declined, setDeclined] = useState(false);
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [sectionMappingID, setSectionMappingID] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapterDropdown, setChapterDropdown] = useState([]);
  const [filePath, setFilePath] = useState([]);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [searchAcademicYear, setSearchAcademicYear] = useState('');
  const [academicYear, setAcademicYear] = useState([]);
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [subjectIds, setSubjectIds] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [recap, setRecap] = useState('');
  const [detail, setDetails] = useState('');
  const [summary, setSummary] = useState('');
  const [tools, setTools] = useState('');
  const [homework, setHomework] = useState('');
  const [errors, setErrors] = useState({ branches: '', grades: '' });
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [files, setFiles] = useState([]);
  const [showIcon, setShowIcon] = useState(false);
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [homeworkCreated, setHomeworkCreated] = useState(false);
  // context
  const [state, setState] = useContext(Context);
  const { isEdit, editData } = state;
  const { setIsEdit, setEditData } = setState;
  const [filterData, setFilterData] = useState({
    year: '',
    branch: '',
    grade: '',
    section: '',
    subject: '',
    chapter: '',
  });

  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const [moduleId, setModuleId] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [acadId, setAcadId] = useState();
  const [homeworkTitle, setHomeworkTitle] = useState('');
  const [homeworkInstructions, setHomeworkInstructions] = useState('');
  const [submissionDate, setSubmissionDate] = useState(moment().format('YYYY-MM-DD'));
  const [questionList, setQuestionList] = useState([
    {
      id: cuid(),
      question: '',
      attachments: [],
      is_attachment_enable: false,
      max_attachment: 2,
      penTool: false,
    },
  ]);

  const handleChange = (index, field, value) => {
    const form = questionList[index];
    const modifiedForm = { ...form, [field]: value };
    setQuestionList((prevState) => [
      ...prevState.slice(0, index),
      modifiedForm,
      ...prevState.slice(index + 1),
    ]);
  };

  const removeQuestion = (index) => {
    setQuestionList((prevState) => [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1),
    ]);
  };

  const addNewQuestion = (index) => {
    setQuestionList((prevState) => [
      ...prevState.slice(0, index),
      {
        id: cuid(),
        question: '',
        attachments: [],
        is_attachment_enable: false,
        max_attachment: 2,
        penTool: false,
      },
      ...prevState.slice(index),
    ]);
  };

  const handleAddHomeWork = async () => {
    if (!homeworkTitle) {
      setAlert('error', 'Please add Homework Title');
      return;
    }
    if (!homeworkInstructions) {
      setAlert('error', 'Please add Homework Instructions');
      return;
    }
    const reqObj = {
      name: homeworkTitle,
      description: homeworkInstructions,
      section_mapping: [sectionMappingID],
      subject: filterData?.subject?.id,
      date: moment().format('YYYY-MM-DD'),
      last_submission_date: submissionDate,
      questions: questionList.map((q) => {
        const qObj = q;
        delete qObj.errors;
        delete qObj.id;
        return qObj;
      }),
    };
    try {
      // const response = await onAddHomework(reqObj, isEdit, hwId);
      const response = await dispatch(addHomeWork(reqObj, isEdit, hwId));
      setAlert('success', 'Homework added');
      setShowHomeworkForm(false);
      checkAssignedHomework({
        section_mapping: sectionMappingID,
        subject: subjectIds,
        date: moment().format('YYYY-MM-DD'),
        // user_id: user_id,
      });
      setHomeworkTitle('');
      setHomeworkInstructions('');
      setHomeworkCreated(true);
    } catch (error) {
      setAlert('error', 'Failed to add homework');
    }
    // }
  };

  const handleSubmissionDateChange = (event, value) => {
    setSubmissionDate(value);
  };
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Diary' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Teacher Diary') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      academic_year: details.academic_year,
      branch: details.branch,
      grade: details.grade,
      section: details.section,
      subjects: details.subjects,
      chapters: details.chapters,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  useEffect(() => {
    if (moduleId) {
      axiosInstance
        .get(`${endpoints.userManagement.academicYear}?module_id=${moduleId}`)
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setAcademicYear(result?.data?.data);
            const defaultValue = result?.data?.data?.[0];
            handleAcademicYear({}, defaultValue);
          } else {
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
        });
    }
  }, [moduleId]);
  const handleAcademicYear = (event = {}, value = '') => {
    if (state?.isEdit) {
      editData.academic_year = value;
    }
    setSearchAcademicYear('');
    setFilterData({
      ...filterData,
      year: '',
      branch: '',
      grade: '',
      section: '',
      subject: '',
      chapter: '',
    });
    if (value) {
      setSearchAcademicYear(value);
      setFilterData({
        ...filterData,
        year: value,
        branch: '',
        grade: '',
        section: '',
        subject: '',
        chapter: '',
      });
      fetchBranchesForCreateUser(value?.id, moduleId).then((data) => {
        const transformedData = data
          ? data?.map((obj) => ({
              id: obj.id,
              branch_name: obj.branch_name,
              academicYearId: obj?.acadId,
            }))
          : [];
        setBranches(transformedData);
      });
    }
  };

  const handleChangeBranch = (values) => {
    if (values) {
      setAcadId(values[0]);
      fetchGrades(searchAcademicYear?.id, values, moduleId).then((data) => {
        const transformedData = data
          ? data.map((grade) => ({
              id: grade.grade_id,
              grade_name: grade.grade__grade_name,
            }))
          : [];
        setGrades(transformedData);
      });
    } else {
      setGrades([]);
      setSections([]);
      setSubjectDropdown([]);
      setChapterDropdown([]);
    }
  };

  const handleChangeGrade = (values, branch) => {
    if (branch && values) {
      fetchSections(searchAcademicYear?.id, branch, [values], moduleId).then((data) => {
        const transformedData = data
          ? data.map((section) => ({
              id: section.section_id,
              section_name: `${section.section__section_name}`,
              section_mapping_id: section.id,
            }))
          : [];
        const filteredSelectedSections =
          formik.values.section &&
          formik.values?.section.filter(
            (sec) => transformedData.findIndex((data) => data?.id === sec?.id) > -1
          );
        setSections(transformedData);
        formik.setFieldValue('section', filteredSelectedSections);
      });
      // fetchSubjects(branch, values);
    } else {
      setSections([]);
      setSubjectDropdown([]);
      setChapterDropdown([]);
    }
  };

  const fetchSubjects = (branch, grade, section) => {
    if (branch && grade && section) {
      getSubjects(searchAcademicYear?.id, branch, grade, section, moduleId).then(
        (data) => {
          const transformedData = data.map((obj) => ({
            ids: obj.id,
            id: obj.subject__id,
            subject_name: obj.subject__subject_name,
          }));
          setSubjectDropdown(transformedData);
          const filteredSelectedSubjects = formik?.values?.subjects?.filter(
            (sub) => transformedData.findIndex((data) => data?.id === sub?.id) > -1
          );
          formik.setFieldValue('subjects', filteredSelectedSubjects);
        }
      );
    } else {
      setSubjectDropdown([]);
      setChapterDropdown([]);
    }
  };

  const handleSection = (e, value) => {
    if (state?.isEdit) {
      editData.section[0] = value;
    }
    setFilterData({ ...filterData, section: '', subject: '', chapter: '' });
    if (value) {
      setSectionMappingID(value?.section_mapping_id);
      setFilterData({ ...filterData, section: value, subject: '', chapter: '' });
      formik.setFieldValue('section', value);
      const {
        values: { branch = {}, grade = [] },
      } = formik;
      fetchSubjects([branch], [grade], [value]);
    }
  };

  const handleSubject = (event, value) => {
    if (state?.isEdit) {
      editData.subject = value;
    }
    formik.setFieldValue('chapters', '' || []);
    formik.setFieldValue('subjects', '' || []);
    setFilterData({ ...filterData, subject: '', chapter: '' });
    setAssignedHomework();
    setHomework('');
    setShowIcon(false);
    setHomeworkCreated(false);
    if (value) {
      setSubjectName(value?.subject_name);
      setFilterData({ ...filterData, subject: value, chapter: '' });
      formik.setFieldValue('subjects', value);
      formik.setFieldValue('chapters', '' || []);
      setSubjectIds(value?.id);

      checkAssignedHomework({
        section_mapping: sectionMappingID,
        subject: value?.id,
        date: moment().format('YYYY-MM-DD'),
        // user_id: user_id,
      });
      axiosInstance
        .get(
          `${endpoints.questionBank.chapterList}?subject_id=${value?.ids}&subject=${value?.id}&session_year=${filterData?.branch?.id}&sch_grade_id=${filterData?.grade?.id}&sch_sy_id=${filterData?.year?.id}`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setChapterDropdown(result?.data?.result);
          } else {
            setAlert('error');
          }
        })
        .catch((error) => {
          setAlert('error');
        });
    }
  };

  const validateFileSize = (size) => {
    return size / 1024 / 1024 > 25 ? false : true;
  };

  const closeAssignedHomeworkModal = () => {
    setAssignedHomeworkModal(false);
    setDeclined(true);
  };

  const mapAssignedHomework = () => {
    axiosInstance
      .post(`${endpoints?.dailyDairy?.assignHomeworkDiary}`, {
        hw_id: assignedHomework[0]?.id,
      })
      .then((result) => {
        if (result?.data?.status_code == 201) {
          setHwMappingID(result?.data?.data?.hw_dairy_mapping_id);
          setAssignedHomeworkModal(false);
          axiosInstance
            .get(`academic/${assignedHomework[0]?.id}/hw-questions/?hw_status=1`)
            .then((result) => {
              if (result?.data?.status_code == 200) {
                const info = `Title: ${result?.data?.data?.homework_name}\nDescription: ${
                  result?.data?.data?.description
                } \nLast Submission Date: ${moment(
                  result?.data?.data?.last_submission_dt
                ).format(
                  'YYYY-MM-DD'
                )} \nQuestions:\n${result?.data?.data?.hw_questions?.map(
                  (item, index) => `${index + 1}. ${item?.question}`
                )}`;
                setHomework(info);
              }
            })
            .catch((error) => setAlert('error', error?.message));
        }
      })
      .catch((error) => setAlert('error', error?.message));
  };

  const handleImageChange = (event) => {
    let fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    let selectedFileType = event.target.files[0]?.type;
    if (!fileType.includes(selectedFileType)) {
      setAlert('error', 'File Type not supported');
      event.target.value = '';
      return;
    }
    const fileSize = event.target.files[0]?.size;
    if (!validateFileSize(fileSize)) {
      setAlert('error', 'File size must be less than 25MB');
      event.target.value = '';
      return;
    }
    // if (filePath?.length <  10) {
    if (isEdit) {
    } else if (
      !formik.values?.branch.id ||
      !formik.values?.grade ||
      !formik.values?.section ||
      !formik.values?.subjects ||
      !subjectIds
    ) {
      setAlert('error', 'Please select all fields');
      return;
    }

    setLoading(true);
    const data = event.target.files[0];
    const fd = new FormData();
    fd.append('file', data);
    fd.append(
      'branch_name',
      isEdit ? editData?.branch?.branch_name : formik.values.branch?.branch_name
    );
    fd.append('grades', isEdit ? editData?.grade[0]?.id : formik.values.grade?.id);
    axiosInstance.post(`academic/dairy-upload/`, fd).then((result) => {
      if (result?.data?.status_code === 200) {
        setLoading(false);
        if (editData?.documents) {
          // let imageData = editData.documents;
          // imageData.push(result?.data?.result);
          // setFilePath(imageData);
          setFilePath([...filePath, result?.data?.result]);
        } else {
          setFilePath([...filePath, result?.data?.result]);
        }
        setAlert('success', result?.data?.message);
      } else {
        setLoading(false);

        setAlert('error', result?.data?.message);
      }
    });
  };

  const handleSubmit = async () => {
    if (filterData?.branch?.length === 0) {
      setAlert('error', 'Select Branch!');
      return;
    }
    if (!filterData?.grade) {
      setAlert('error', 'Select Grade!');
      return;
    }
    if (!filterData?.section) {
      setAlert('error', 'Select Section!');
      return;
    }
    if (!filterData?.subject) {
      setAlert('error', 'Select Subject!');
      return;
    }
    // if (!filterData?.chapter) {
    //   setAlert('error', 'Select Chapter!');
    //   return;
    // }
    const createDairyEntry = endpoints.dailyDairy.createDailyDairy;
    const mapId = formik.values?.section?.section_mapping_id;
    const ids = formik.values?.section
      ? [formik.values.section].map((el) => el.id)
      : setAlert('error', 'Fill all the required fields');
    const grade = formik.values?.grade ? [formik.values.grade].map((el) => el.id) : '';
    const section = formik.values?.section
      ? [formik.values.section].map((el) => el.id)
      : '';
    if (
      !formik.values?.section ||
      !formik.values?.grade ||
      !formik.values?.subjects ||
      !formik.values?.branch.id
    ) {
      return setAlert('error', 'Please select all fields');
    }
    const teacherReport = [];
    try {
      const response = await axiosInstance.post(
        createDairyEntry,
        filePath && filePath.length > 0
          ? {
              academic_year: acadId?.academicYearId,
              module_id: moduleId,
              branch: formik.values?.branch?.id,
              grade,
              section,
              section_mapping: [mapId],
              subject: subjectIds,
              chapter: formik.values.chapters?.id,
              documents: filePath,
              teacher_report: {
                previous_class: recap,
                summary,
                class_work: detail,
                tools_used: tools,
                homework,
              },
              dairy_type: 2,
              is_central: formik.values?.chapters?.is_central,
              hwMappingID: hwMappingID,
            }
          : {
              academic_year: acadId?.academicYearId,
              branch: formik.values?.branch?.id,
              module_id: moduleId,
              grade,
              section,
              section_mapping: [mapId],
              subject: subjectIds,
              chapter: formik.values?.chapters?.id,
              teacher_report: {
                previous_class: recap,
                summary,
                class_work: detail,
                tools_used: tools,
                homework,
              },
              dairy_type: 2,
              is_central: formik.values?.chapters?.is_central,
              hwMappingID: hwMappingID,
            },
        {
          headers: {
            // 'application/json' is the modern content-type for JSON, but some
            // older servers may use 'text/json'.
            // See: http://bit.ly/text-json
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { message, status_code: statusCode } = response.data;
      if (statusCode === 200) {
        if (message === 'Daily Dairy created successfully') {
          setAlert('success', message);
          history.push('/diary/teacher');
        } else {
          setAlert('error', message);
        }
      }
    } catch (error) {
      setAlert('error', error?.message);
    }
  };

  const handleEdited = () => {
    let payload = {
      academic_year: acadId?.academicYearId,
      branch: editData.branch.id,
      grade: editData.grade.id,
      section: [editData.section.id],
      subject: editData.subject.id,
      chapter: editData.chapter.id,
      teacher_report: {
        previous_class: recap && recap.length > 0 ? recap : editData.teacher_report.recap,
        summary:
          summary && summary.length > 0 ? summary : editData.teacher_report.summary,
        class_work:
          detail && detail.length > 0 ? detail : editData.teacher_report.class_work,
        tools_used:
          tools && tools.length > 0 ? tools : editData.teacher_report.tools_used,
        homework:
          homework && homework.length > 0 ? homework : editData.teacher_report.homework,
      },
      dairy_type: 2,
    };

    if (filePath?.length) {
      payload['documents'] = filePath;
    }

    axiosInstance
      .put(
        `${endpoints.dailyDairy.updateDelete}${editData.id}/update-delete-dairy/`,
        payload
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAlert('success', result?.data?.message);
          setState({ editData: [], isEdit: false });
          history.push('/diary/teacher');
        } else {
          setAlert('error', 'Something went wrong');
        }
      })
      .catch((error) => {
        setAlert('error', 'Something went wrong');
      });
  };

  const FileRow = (props) => {
    const { file, onClose, index } = props;
    setFiles(file);
    return (
      <>
        <div className='file_row_image_new'>
          <div className='file_name_container_new'>{index + 1}</div>
          <div>
            <span onClick={onClose}>
              <SvgIcon
                component={() => (
                  <img
                    style={
                      isMobile
                        ? {
                            marginLeft: '',
                            width: '20px',
                            height: '20px',
                            // padding: '5px',
                            cursor: 'pointer',
                          }
                        : {
                            width: '20px',
                            height: '20px',
                            // padding: '5px',
                            cursor: 'pointer',
                          }
                    }
                    src={deleteIcon}
                    alt='given'
                  />
                )}
              />
            </span>
          </div>
        </div>
      </>
    );
  };
  const handleBack = () => {
    history.push('/diary/teacher');
    setState({ isEdit: false, editData: [] });
  };
  const removeFileHandler = (i, file) => {
    // delete editData.documents[
    if (editData.documents) {
      let list = [...filePath];
      setLoading(true);
      axiosInstance
        .post(`${endpoints.circular.deleteFile}`, {
          file_name: `${file}`,
          daily_diary_id: `${editData?.id}`,
        })
        .then((result) => {
          if (result?.data?.status_code === 204) {
            list.splice(i, 1);
            setFilePath(list);
            setAlert('success', result?.data?.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          // setAlert('error', error.message);
          setLoading(false);
        });
    }
    if (!editData?.documents) {
      const list = [...filePath];
      axiosInstance
        .post(`${endpoints.circular.deleteFile}`, {
          file_name: `${file}`,
        })
        .then((result) => {
          if (result?.data?.status_code === 204) {
            list.splice(i, 1);
            setFilePath(list);
            setAlert('success', result?.data?.message);
          } else {
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (assignedHomework && homeworkCreated) {
      mapAssignedHomework();
    }
  }, [assignedHomework]);
  let imageCount = 1;
  useEffect(() => {
    if (editData?.documents) {
      if (imageCount) {
        setFilePath(editData?.documents);
        imageCount = 0;
      }
    }
  }, [editData]);
  useEffect(() => {
    if (details?.branch) {
      handleChangeBranch([details?.branch]);
      if (details.grade && details.grade.length > 0) {
        handleChangeGrade(details?.grade, [details.branch]);
      }
    }
    if (details?.subjects && details?.subjects?.length > 0) {
      axios
        .get(
          `/academic/chapters/?academic_year=${searchAcademicYear?.id}&subject=${subjectIds}`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setChapterDropdown(result?.data?.result);
          } else {
            setAlert('error');
          }
        })
        .catch((error) => {
          setAlert('error');
        });
    }
  }, []);

  const RedirectToHomework = () => {
    const session_year = filterData?.year?.id;
    const branchID = state.isEdit ? editData.branch : filterData?.branch?.id;
    const gradeID = state.isEdit ? editData.grade[0] : filterData?.grade?.id;
    const subjectID = state.isEdit ? editData.subject : filterData?.subject?.id;
    history.push(
      `/homework/add/${moment().format(
        'YYYY-MM-DD'
      )}/${session_year}/${branchID}/${gradeID}/${subjectName}/${subjectID}`
    );
  };
  const classes = useStyles();
  const checkAssignedHomework = (params = {}) => {
    axiosInstance
      .get(`${endpoints?.dailyDairy?.assignHomeworkDiary}`, { params: { ...params } })
      .then((result) => {
        if (result?.data?.status == 200) {
          if (result?.data?.data.length > 0) {
            setAssignedHomework(result?.data?.data);
          }
          setShowIcon(true);
        }
      })
      .catch((error) => setAlert('error', error?.message));
  };
  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}

      <Layout>
        <div
          className='daily-dairy-scroll'
          style={{
            height: '90vh',
            overflowX: 'hidden',
            overflowY: 'scroll',
          }}
        >
          <CommonBreadcrumbs
            componentName='Daily Diary'
            childComponentName={state.isEdit ? 'Edit Dairy' : 'Create New'}
          />
          <Grid
            container
            spacing={isMobile ? 3 : 5}
            style={{ width: widerWidth, margin: wider }}
          >
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <FormControl fullWidth className={classes.margin} variant='outlined'>
                <Autocomplete
                  size='small'
                  style={{ width: '100%' }}
                  onChange={handleAcademicYear}
                  id='year'
                  className='dropdownIcon'
                  options={academicYear}
                  getOptionLabel={(option) => option?.session_year}
                  value={state.isEdit ? editData.academic_year : searchAcademicYear}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Academic Year'
                      placeholder='Academic Year'
                    />
                  )}
                />
                <FormHelperText style={{ color: 'red' }}>
                  {formik.errors.academic_year ? formik.errors.academic_year : ''}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                id='branch'
                name='branch'
                onChange={(e, value) => {
                  if (state?.isEdit) {
                    editData.branch = value;
                  }
                  setFilterData({
                    ...filterData,
                    branch: value,
                    grade: '',
                    section: [],
                    subject: [],
                    chapter: '',
                  });
                  state?.isEdit
                    ? formik.setFieldValue('branch', value)
                    : formik.setFieldValue('branch', value);
                  formik.setFieldValue('grade', []);
                  formik.setFieldValue('section', []);
                  formik.setFieldValue('subjects', []);
                  handleChangeBranch(value ? [value] : null);
                }}
                // value={state.isEdit ? editData.branch : formik.values.branch || {}}
                value={state.isEdit ? editData.branch : filterData?.branch}
                options={branches}
                className='dropdownIcon'
                getOptionLabel={(option) => option?.branch_name || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Branch'
                    placeholder='Branch'
                  />
                )}
                size='small'
              />
              <FormHelperText style={{ color: 'red' }}>
                {errors.branches ? errors.branches : ''}
              </FormHelperText>
            </Grid>
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <FormControl fullWidth className={classes.margin} variant='outlined'>
                <Autocomplete
                  id='grade'
                  name='grade'
                  onChange={(e, value) => {
                    if (state?.isEdit) {
                      editData.grade[0] = value;
                    }
                    setFilterData({
                      ...filterData,
                      grade: value,
                      section: '',
                      subject: '',
                      chapter: '',
                    });
                    formik.setFieldValue('grade', value);
                    formik.setFieldValue('section', []);
                    formik.setFieldValue('subjects', []);
                    handleChangeGrade(value || null, [formik.values.branch]);
                  }}
                  // multiple
                  // value={state.isEdit ? editData.grade[0] : formik.values.grade}
                  value={state.isEdit ? editData.grade[0] : filterData?.grade || {}}
                  options={grades}
                  className='dropdownIcon'
                  getOptionLabel={(option) => option?.grade_name || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Grade'
                      placeholder='Grade'
                    />
                  )}
                  getOptionSelected={(option, value) => option?.id == value?.id}
                  size='small'
                />
                <FormHelperText style={{ color: 'red' }}>
                  {formik.errors.grade ? formik.errors.grade : ''}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={isMobile ? 3 : 5}
            style={{ width: widerWidth, margin: wider }}
          >
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <FormControl fullWidth className={classes.margin} variant='outlined'>
                <Autocomplete
                  id='section'
                  name='section'
                  onChange={(e, value) => handleSection(e, value)}
                  value={state.isEdit ? editData.section[0] : filterData?.section || {}}
                  options={sections}
                  getOptionLabel={(option) =>
                    option.section_name || option.section__section_name
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Section'
                      placeholder='Section'
                    />
                  )}
                  getOptionSelected={(option, value) => option?.id == value?.id}
                  size='small'
                />
                <FormHelperText style={{ color: 'red' }}>
                  {formik.errors.section ? formik.errors.section : ''}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <FormControl
                color='secondary'
                fullWidth
                className={classes.margin}
                variant='outlined'
              >
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleSubject}
                  id='subj'
                  value={state.isEdit ? editData.subject : filterData?.subject || {}}
                  options={subjectDropdown}
                  className='dropdownIcon'
                  getOptionLabel={(option) => option?.subject_name}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Subject'
                      placeholder='Subject'
                    />
                  )}
                />
                <FormHelperText style={{ color: 'red' }}>
                  {formik.errors?.subjects ? formik.errors?.subjects : ''}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <FormControl fullWidth className={classes.margin} variant='outlined'>
                <Autocomplete
                  id='chapters'
                  style={{ width: '100%' }}
                  size='small'
                  onChange={(e, value) => {
                    if (state?.isEdit) {
                      editData.chapter[0] = value;
                    }
                    setFilterData({ ...filterData, chapter: value });
                    formik.setFieldValue('chapters', value);
                  }}
                  value={state.isEdit ? editData?.chapter[0] : filterData?.chapter || {}}
                  options={chapterDropdown}
                  className='dropdownIcon'
                  getOptionLabel={(option) => option?.chapter_name}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Chapter'
                      placeholder='Chapter'
                    />
                  )}
                />
              </FormControl>
            </Grid>
            {showIcon && !assignedHomework && (
              <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showHomeworkForm}
                      onChange={() => setShowHomeworkForm((prevState) => !prevState)}
                      name='checkedB'
                      color='primary'
                    />
                  }
                  label='Assign Homework'
                />
              </Grid>
            )}
          </Grid>

          {/* <<<<<<<<<< EDITOR PART  >>>>>>>>>> */}
          <div>
            <div className={classes.descriptionBorder}>
              <Grid
                container
                spacing={isMobile ? 3 : 5}
                style={{ width: widerWidth, margin: wider }}
              >
                <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
                  <TextField
                    id='outlined-multiline-static'
                    label='Recap of previous class'
                    multiline
                    rows='3'
                    color='primary'
                    style={{ width: '100%', marginTop: '1.25rem' }}
                    defaultValue={
                      state.isEdit ? editData.teacher_report.previous_class : []
                    }
                    variant='outlined'
                    onChange={(e) => setRecap(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
                  <TextField
                    id='outlined-multiline-static'
                    label='Details of classwork'
                    multiline
                    rows='3'
                    color='primary'
                    style={{ width: '100%', marginTop: '1.25rem' }}
                    defaultValue={state.isEdit ? editData.teacher_report.class_work : []}
                    variant='outlined'
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
                  <TextField
                    id='outlined-multiline-static'
                    label='Summary'
                    multiline
                    rows='3'
                    color='primary'
                    style={{ width: '100%', marginTop: '1.25rem' }}
                    defaultValue={state.isEdit ? editData.teacher_report.summary : []}
                    variant='outlined'
                    onChange={(e) => setSummary(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={isMobile ? 3 : 5}
                style={{ width: widerWidth, margin: wider }}
              >
                <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
                  <TextField
                    id='outlined-multiline-static'
                    label='Tools Used'
                    multiline
                    rows='3'
                    color='primary'
                    style={{ width: '100%', marginTop: '1.25rem' }}
                    defaultValue={state.isEdit ? editData.teacher_report.tools_used : []}
                    variant='outlined'
                    onChange={(e) => setTools(e.target.value)}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  className={isMobile ? '' : 'filterPadding'}
                  style={{ position: 'relative' }}
                >
                  <TextField
                    id='outlined-multiline-static'
                    label='Homework'
                    multiline
                    rows='3'
                    color='primary'
                    value={state.isEdit ? editData.teacher_report.homework : homework}
                    style={{ width: '100%', marginTop: '1.25rem' }}
                    defaultValue={state.isEdit ? editData.teacher_report.homework : []}
                    variant='outlined'
                    onChange={(e) => setHomework(e.target.value)}
                  />
                  {showIcon ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        left: '10%',
                        bottom: '30%',
                      }}
                    >
                      {assignedHomework && !homework ? (
                        <div
                          onClick={() => {
                            mapAssignedHomework();
                          }}
                          className='th-pointer'
                        >
                          <span>
                            {/* <img src={HomeworkAsigned} className='py-3 th-pointer' /> */}
                            <InfoIcon className='th-primary' />
                          </span>
                          <span className='ml-2 th-fw-500'>
                            Homework Exists (click to Assign)
                          </span>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {hwMappingID && homework ? (
                    <div className='pl-3'>
                      <span>
                        <img src={AssignedHomework} className='py-3' />
                      </span>
                      <span className='ml-2 py-3 th-black-2 th-16 th-primary'>
                        Homework Mapped to Diary
                      </span>
                    </div>
                  ) : null}
                </Grid>

                <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {filePath?.length > 0 &&
                      filePath?.map((file, i) => (
                        <FileRow
                          key={`homework_student_question_attachment_${i}`}
                          file={file}
                          index={i}
                          onClose={() => removeFileHandler(i, file)}
                        />
                      ))}
                  </div>
                  <div style={isMobile ? { marginTop: '1%' } : { marginTop: '10%' }}>
                    <Button
                      startIcon={
                        <SvgIcon
                          component={() => (
                            <img
                              style={{ height: '20px', width: '20px' }}
                              src={attachmenticon}
                            />
                          )}
                        />
                      }
                      className={classes.attchmentbutton}
                      title='Attach Supporting File'
                      variant='contained'
                      size='medium'
                      disableRipple
                      disableElevation
                      disableFocusRipple
                      disableTouchRipple
                      component='label'
                      style={{ textTransform: 'none' }}
                    >
                      <input
                        type='file'
                        style={{ display: 'none' }}
                        id='raised-button-file'
                        accept='image/*, .pdf'
                        onChange={handleImageChange}
                      />
                      Add Document
                    </Button>
                    <br />
                    <small className={classes.acceptedfiles}>
                      {' '}
                      Accepted files: [ jpeg,jpg,png,pdf ]
                    </small>
                  </div>
                </Grid>
              </Grid>
            </div>
            {showHomeworkForm && (
              <Grid
                container
                spacing={isMobile ? 3 : 5}
                style={{ width: '100%', margin: '10px 0px' }}
              >
                <div
                  className={classes.descriptionBorder}
                  style={{ width: '100%', padding: '2%' }}
                >
                  <Grid className='homework-create-questions-container' container md={12}>
                    <Grid item xs={12} sm={4} style={{ margin: '10px 0px' }}>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                          size='small'
                          variant='dialog'
                          format='YYYY-MM-DD'
                          // margin='none'
                          // className='button'
                          className='dropdownIcon'
                          id='date-picker'
                          label='Due Date'
                          inputVariant='outlined'
                          fullWidth
                          value={submissionDate}
                          onChange={handleSubmissionDateChange}
                          // className='dropdown'
                          style={{ width: '100%' }}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={12} className='form-field'>
                      <FormControl variant='outlined' fullWidth size='small'>
                        <InputLabel htmlFor='component-outlined'>Title</InputLabel>
                        <OutlinedInput
                          id='title'
                          name='title'
                          // onChange={() => {}}
                          inputProps={{ maxLength: 30 }}
                          label='Title'
                          autoFocus
                          value={homeworkTitle}
                          onChange={(e) => {
                            setHomeworkTitle(e.target.value);
                          }}
                          //error={errors.name ? true : false}
                          //helperText="Title is required"
                        />
                        {/* <FormHelperText style={{ color: 'red' }}>{errors.name}</FormHelperText> */}
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      className='form-field'
                      style={{ margin: '10px 0px' }}
                    >
                      <FormControl variant='outlined' fullWidth size='small'>
                        <InputLabel htmlFor='component-outlined'>Instruction</InputLabel>
                        <OutlinedInput
                          id='description'
                          name='Instruction'
                          onChange={(e) => {
                            setHomeworkInstructions(e.target.value);
                          }}
                          inputProps={{ maxLength: 250 }}
                          multiline
                          rows={4}
                          rowsMax={6}
                          label='Instruction'
                          value={homeworkInstructions}
                          //error={true}
                          //helperText="Description required"
                        />
                        <FormHelperText style={{ color: 'red' }}>
                          {/* {errors.description} */}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} className='form-field'>
                      {questionList?.map((question, index) => (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          isEdit={false}
                          index={index}
                          addNewQuestion={addNewQuestion}
                          handleChange={handleChange}
                          removeQuestion={removeQuestion}
                          sessionYear={academicYear}
                          branch={filterData?.branch?.id}
                          grade={filterData?.grade?.id}
                          subject={filterData?.subject?.id}
                        />
                      ))}
                    </Grid>

                    <Grid
                      container
                      item
                      xs={12}
                      spacing={1}
                      style={{ marginTop: '10px' }}
                    >
                      <Grid item xs={12} md={6} className='form-field'>
                        <div className='finish-btn-container'>
                          <Button
                            variant='contained'
                            // style={{ color: 'white', width: '100%' }}
                            // color='secondary'
                            onClick={() => {
                              setQueIndexCounter(queIndexCounter + 1);
                              addNewQuestion(queIndexCounter + 1);
                            }}
                          >
                            Add Another Question
                          </Button>
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6} className='form-field'>
                        <div className='finish-btn-container'>
                          <Button
                            variant='contained'
                            style={{ color: 'white', width: '100%' }}
                            color='primary'
                            onClick={handleAddHomeWork}
                          >
                            Finish
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            )}
            <div>
              <Button
                variant='contained'
                style={{ marginLeft: '37px', marginTop: '20px' }}
                onClick={handleBack}
                className='labelColor cancelButton'
              >
                BACK
              </Button>
              <Button
                variant='contained'
                color='primary'
                style={{ marginLeft: '20px', marginTop: '20px', color: 'white' }}
                onClick={state.isEdit ? handleEdited : handleSubmit}
              >
                {state.isEdit ? 'Update' : 'Submit'}
              </Button>
            </div>
            <Dialog
              open={!declined && assignedHomeworkModal}
              onClose={closeAssignedHomeworkModal}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
            >
              <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                  Homework already exists, do you want to link it to Diary?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeAssignedHomeworkModal} color='primary'>
                  No
                </Button>
                <Button onClick={mapAssignedHomework} color='primary' autoFocus>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CreateDailyDairy;
