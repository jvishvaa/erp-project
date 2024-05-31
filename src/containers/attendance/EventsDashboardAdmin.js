import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Input,
  Table,
  Pagination,
  Empty,
  Row,
  Col,
  Spin,
  Form,
  Drawer,
  Popconfirm,
  Tag,
  Card,
  Select,
  DatePicker,
  Modal,
  Timeline,
  InputNumber,
  Radio,
  notification,
  List,
  Popover,
} from 'antd';
import {
  PlusOutlined,
  InfoCircleTwoTone,
  FileExcelOutlined,
  PlusCircleOutlined,
  DownOutlined,
  EyeOutlined,
  EditOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  ClearOutlined,
  SyncOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import endpoints from 'v2/config/endpoints';
import axiosInstance from 'config/axios';
import moment from 'moment';
import { useForm } from 'antd/lib/form/Form';
import './eventsDashboard.css';
import Slider from 'react-slick';
import MediaDisplay from './mediaDisplayEvents';
import { saveAs } from 'file-saver';

const modules = {
  toolbar: [
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline'],
  ],
};
const formats = ['list', 'bullet', 'bold', 'italic', 'underline'];
const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const EventsDashboardAdmin = () => {
  const notificationDuration = 3;
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const { TextArea } = Input;
  const [filterForm] = useForm();
  const [feedBackModalForm] = useForm();
  const [eventForm] = useForm();
  const [studentListForm] = useForm();
  const user_level = localStorage.getItem('userDetails')
    ? JSON.parse(localStorage.getItem('userDetails')).user_level
    : '';
  const is_superuser = localStorage.getItem('userDetails')
    ? JSON.parse(localStorage.getItem('userDetails'))?.is_superuser
    : '';
  const branch = sessionStorage.getItem('selected_branch')
    ? JSON.parse(sessionStorage.getItem('selected_branch'))
    : '';
  const branchList = sessionStorage.getItem('branch_list')
    ? JSON.parse(sessionStorage.getItem('branch_list'))
    : '';
  const session_year = sessionStorage.getItem('acad_session')
    ? JSON.parse(sessionStorage.getItem('acad_session'))?.id
    : '';

  const is_central_user = [1, 2].includes(user_level) || is_superuser ? true : false;
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);

  const [selectedTag, setSelectedTag] = useState();
  const [selectedDays, setSelectedDays] = useState();

  const [id, setId] = useState();
  const [feedBackModalOpen, setFeedBackModalOpen] = useState(false);
  const [feedBackLoading, setFeedBackLoading] = useState(false);
  const [feedBackFlag, setFeedBackFlag] = useState('');

  const [timeLineDrawerOpen, setTimeLineDrawerOpen] = useState(false);
  const [timelineLoading, setTimeLineLoading] = useState(false);
  const [timeLineData, setTimeLineData] = useState([]);

  const [studentEventId, setStudenEventId] = useState(null);
  const [studentCurrentPage, setStudentCurrentPage] = useState(1);
  const [studentDrawerOpen, setStudentDrawerOpen] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentList, setStudentList] = useState([]);

  const [eventId, setEventId] = useState(null);
  const [eventDrawerOpen, setEventDrawerOpen] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventData, setEventData] = useState([]);

  const [acadSessionIds, setAcadSessionIds] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [eventHighlights, setEventHighlights] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState(1);
  const [refundPolicy, setRefundPolicy] = useState(1);
  const [refundPolicyData, setRefundPolicyData] = useState([
    {
      days: '',
      percent: '',
      amount: '',
    },
  ]);

  const [drawerWidth, setDrawerWidth] = useState(
    window.innerWidth <= 768 ? '90%' : window.innerWidth <= 992 ? '50%' : '30%'
  );
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileLinks, setFileLinks] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const [viewEventModalOpen, setViewEventModalOpen] = useState(false);
  const [viewEvent, setViewEvent] = useState();

  useEffect(() => {
    const handleResize = () => {
      setDrawerWidth(
        window.innerWidth <= 768 ? '90%' : window.innerWidth <= 992 ? '50%' : '30%'
      );
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    fetchTableData();
  }, [currentPage]);
  useEffect(() => {
    if (studentDrawerOpen) {
      fetchStudentList({
        id: studentEventId,
      });
    }
  }, [studentCurrentPage]);
  useEffect(() => {
    if (selectedDays) {
      filterForm.setFieldsValue({
        date_filter: [moment(), moment().add(selectedDays, 'days')],
      });
    } else {
      filterForm.setFieldsValue({
        date_filter: [moment(), moment().add(10, 'days')],
      });
    }
    handleFetchTableData();
  }, [selectedTag, selectedDays]);

  const handleFetchTableData = () => {
    if (currentPage == 1) {
      fetchTableData();
    } else {
      setCurrentPage(1);
    }
  };
  const fetchTableData = () => {
    const values = filterForm.getFieldsValue();
    let acad_session;
    if (is_central_user) {
      acad_session = values?.branch_filter?.length
        ? values?.branch_filter?.join(',')
        : null;
    } else {
      acad_session = branch?.id;
    }
    setLoading(true);
    let params = {
      page: currentPage,
      acad_session: acad_session ?? acad_session,
      start_date: values?.date_filter?.length
        ? values?.date_filter[0].format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD'),
      end_date: values?.date_filter?.length
        ? values?.date_filter[1].format('YYYY-MM-DD')
        : moment().add(10, 'days').format('YYYY-MM-DD'),
      approval_status: selectedTag ?? selectedTag,
    };
    axiosInstance
      .get(`${endpoints.eventsDashboard.eventsListApi}`, {
        params: params,
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setTableData(response?.data?.result);
        }
      })
      .catch((error) => {
        notification['error']({
          message: 'OOPS! Something went wrong. Please try again',
          duration: notificationDuration,
          className: 'notification-container',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchStudentList = ({ id }) => {
    const searchErp = studentListForm.getFieldsValue()?.erp_id;
    setStudentLoading(true);
    let params = {
      page: studentCurrentPage,
      event_id: id,
      erp_id: searchErp ?? searchErp,
    };
    axiosInstance
      .get(`${endpoints.eventsDashboard.studentListApi}`, {
        params: params,
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setStudentList(response?.data?.result);
        }
      })
      .catch((error) => {
        notification['error']({
          message: 'OOPS! Something went wrong. Please try again',
          duration: notificationDuration,
          className: 'notification-container',
        });
      })
      .finally(() => {
        setStudentLoading(false);
      });
  };
  const createEvent = () => {
    const values = eventForm.getFieldsValue();
    const formData = new FormData();
    formData.append('title', values?.event_name);
    formData.append('event_name', values?.event_name);
    formData.append('acad_session', values?.acad_session);
    formData.append('grades', values?.grade_ids);
    formData.append('highlight', eventHighlights);
    formData.append('description', eventDescription);
    formData.append('reg_start', values?.reg_dates[0].format('YYYY-MM-DD'));
    formData.append('reg_end', values?.reg_dates[0].format('YYYY-MM-DD'));
    formData.append('event_date', values?.event_date.format('YYYY-MM-DD'));
    formData.append('is_subscription_need', values?.is_subscription_need);
    if (values?.is_subscription_need) {
      formData.append('event_price', values?.event_price);
      formData.append('refundable', values?.refundable);
      if (values?.refundable) {
        let formatted_policy = refundPolicyData
          .map((policy) => `${policy.days}:${policy.percent}`)
          .join(',');
        formData.append('policies', formatted_policy);
      }
    }
    if (selectedFiles?.length) {
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('attachments', selectedFiles[i]);
      }
    }
    setEventLoading(true);
    axiosInstance
      .post(`${endpoints.eventsDashboard.eventApi}`, formData)
      .then((response) => {
        if (response?.data?.status_code == 201) {
          notification['success']({
            message: 'Hurray! Event created successfully.',
            duration: notificationDuration,
            className: 'notification-container',
          });
          closeEventDrawer();
          handleFetchTableData();
        }
      })
      .catch((error) => {
        notification['error']({
          message: 'OOPS! Something went wrong. Please try again',
          duration: notificationDuration,
          className: 'notification-container',
        });
      })
      .finally(() => {
        setEventLoading(false);
      });
  };
  const editEvent = () => {
    const values = eventForm.getFieldsValue();
    const formData = new FormData();
    formData.append('title', values?.event_name);
    formData.append('event_name', values?.event_name);
    formData.append('acad_session', values?.acad_session);
    formData.append('grades', values?.grade_ids);
    formData.append('highlight', eventHighlights);
    formData.append('description', eventDescription);
    formData.append('reg_start', values?.reg_dates[0].format('YYYY-MM-DD'));
    formData.append('reg_end', values?.reg_dates[0].format('YYYY-MM-DD'));
    formData.append('event_date', values?.event_date.format('YYYY-MM-DD'));
    formData.append('is_subscription_need', values?.is_subscription_need);
    if (values?.is_subscription_need) {
      formData.append('event_price', values?.event_price);
      formData.append('refundable', values?.refundable);
      if (values?.refundable) {
        let formatted_policy = refundPolicyData
          .map((policy) => `${policy.days}:${policy.percent}`)
          .join(',');
        formData.append('policies', formatted_policy);
      }
    }
    if (selectedFiles?.length) {
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('attachments', selectedFiles[i]);
      }
    }
    if (removedFiles?.length) {
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('attachments_removal', removedFiles[i]);
      }
    }
    setEventLoading(true);
    axiosInstance
      .patch(`/academic/${eventId}/event-manage/`, formData)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          notification['success']({
            message: 'Hurray! Event updated successfully.',
            duration: notificationDuration,
            className: 'notification-container',
          });
          closeEventDrawer();
          handleFetchTableData();
        }
      })
      .catch((error) => {
        notification['error']({
          message: 'OOPS! Something went wrong. Please try again',
          duration: notificationDuration,
          className: 'notification-container',
        });
      })
      .finally(() => {
        setEventLoading(false);
      });
  };
  const approveEvent = ({ approveId }) => {
    const formData = new FormData();
    formData.append('approval_status', 4);
    setLoading(true);
    axiosInstance
      .patch(`/academic/${approveId}/event-manage/`, formData)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          notification['success']({
            message: 'Hurray! Event Approved Successfully',
            duration: notificationDuration,
            className: 'notification-container',
          });
        }
        fetchTableData();
      })
      .catch((error) => {
        notification['error']({
          message: 'OOPS! Something went wrong. Please try again',
          duration: notificationDuration,
          className: 'notification-container',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const rejectEvent = () => {
    const remarks = feedBackModalForm?.getFieldsValue()?.remarks;
    const formData = new FormData();
    formData.append('approval_status', 2);
    formData.append('remarks', remarks);
    setFeedBackLoading(true);
    axiosInstance
      .patch(`/academic/${id}/event-manage/`, formData)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          notification['success']({
            message: 'Hurray! Event Rejected Successfully',
            duration: notificationDuration,
            className: 'notification-container',
          });
        }
        closeFeedBackModal();
        fetchTableData();
      })
      .catch((error) => {
        notification['error']({
          message: 'OOPS! Something went wrong. Please try again',
          duration: notificationDuration,
          className: 'notification-container',
        });
      })
      .finally(() => {
        setFeedBackLoading(false);
      });
  };
  const cancelEvent = () => {
    const remarks = feedBackModalForm?.getFieldsValue()?.remarks;
    const formData = new FormData();
    formData.append('approval_status', 3);
    formData.append('remarks', remarks);
    setFeedBackLoading(true);
    axiosInstance
      .patch(`/academic/${id}/event-manage/`, formData)
      .then((response) => {
        if (response?.data?.status_code == 200) {
          notification['success']({
            message: 'Hurray! Event Cancelled Successfully',
            duration: notificationDuration,
            className: 'notification-container',
          });
        }
        closeFeedBackModal();
        fetchTableData();
      })
      .catch((error) => {
        notification['error']({
          message: 'OOPS! Something went wrong. Please try again',
          duration: notificationDuration,
          className: 'notification-container',
        });
      })
      .finally(() => {
        setFeedBackLoading(false);
      });
  };

  const quillRef1 = useRef(null);
  const quillRef2 = useRef(null);
  const handleChangeEventHighlights = (content, delta, source, editor) => {
    console.log(content);
    const text = editor.getText();
    if (text.length <= 3000) {
      setEventHighlights(content);
    } else {
      notification['error']({
        message: 'OOPS! Max Words Limit Reached',
        duration: notificationDuration,
        className: 'notification-container',
      });
      const truncatedContent = text.slice(0, 3000);
      setEventHighlights(truncatedContent);
      const quill = quillRef1.current.getEditor();
      quill.setText(truncatedContent);
    }
  };
  const handleChangeEventDescription = (content, delta, source, editor) => {
    const text = editor.getText();
    if (text.length <= 3000) {
      setEventDescription(content);
    } else {
      notification['error']({
        message: 'OOPS! Max Words Limit Reached',
        duration: notificationDuration,
        className: 'notification-container',
      });
      const truncatedContent = text.slice(0, 3000);
      setEventDescription(truncatedContent);
      const quill = quillRef2.current.getEditor();
      quill.setText(truncatedContent);
    }
  };

  const handleDownloadAll = async (files) => {
    for (const item of files) {
      const fullName = item?.split('.').pop();
      await downloadFile(`${item}`, fullName);
    }
  };
  const downloadFile = async (url, fullName) => {
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, fullName);
  };
  const fetchGradeList = ({ branchIds }) => {
    console.log(branchIds);
    axiosInstance
      .get(
        `${endpoints.eventsDashboard.gradeListApi}?session_year=${session_year}&branch_id=${branchIds}`
      )
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setGradeList(response?.data?.data);
        }
      })
      .catch((error) => {
        notification['error']({
          message: 'OOPS! Something went wrong. Please try again',
          duration: notificationDuration,
          className: 'notification-container',
        });
      })
      .finally(() => {});
  };
  const handleBranchChange = () => {
    const acad_session = eventForm.getFieldsValue()?.acad_session;
    if (acad_session?.length) {
      let branchIds;
      if (acad_session.includes('all')) {
        const allIds = branchList.map((each) => each?.id);
        eventForm.setFieldsValue({
          acad_session: allIds,
        });
        branchIds = branchList.map((each) => each?.branch?.id);
      } else {
        branchIds = branchList
          .filter((each) => acad_session.includes(each?.id))
          .map((each) => each?.branch?.id);
      }
      fetchGradeList({ branchIds });
    } else {
      eventForm.setFieldsValue({
        acad_session: [],
      });
    }
    eventForm.setFieldsValue({
      grade_ids: [],
    });
    setGradeList([]);
  };
  const handleGradeChange = () => {
    const grade_ids = eventForm.getFieldsValue()?.grade_ids;
    if (grade_ids?.length) {
      if (grade_ids.includes('all')) {
        const allIds = gradeList.map((each) => each?.grade_id);
        eventForm.setFieldsValue({
          grade_ids: allIds,
        });
      }
    } else {
      eventForm.setFieldsValue({
        grade_ids: [],
      });
    }
  };
  const handleClearAll = () => {
    if (is_central_user) {
      filterForm.setFieldsValue({
        branch_filter: [],
      });
      if (!selectedTag || !selectedDays) {
        handleFetchTableData();
      }
    }
    setSelectedTag();
    setSelectedDays();
  };
  const openFeedBackModal = ({ key, id }) => {
    setId(id);
    setFeedBackFlag(key);
    setFeedBackModalOpen(true);
  };
  const closeFeedBackModal = () => {
    setFeedBackModalOpen(false);
    setFeedBackFlag('');
    setId();
    feedBackModalForm.resetFields();
  };
  const openTimeLineDrawer = () => {
    setTimeLineDrawerOpen(true);
    setTimeLineData([]);
  };
  const closeTimeLineDrawer = () => {
    setTimeLineDrawerOpen(false);
    setTimeLineData([]);
  };
  const openEventDrawer = ({ key, rowData }) => {
    if (key === 'create') {
      eventForm.setFieldsValue({
        is_subscription_need: true,
        refundable: true,
      });
      setEventDrawerOpen(true);
    } else {
      let branchIds = branchList
        .filter((each) => rowData?.acad_session.includes(each?.id))
        .map((each) => each?.branch?.id);
      fetchGradeList({ branchIds });
      eventForm.setFieldsValue({
        event_name: rowData?.title,
        acad_session: rowData?.acad_session,
        grade_ids: rowData?.grades,
        highlight: rowData?.highlight,
        description: rowData?.description,
        reg_dates: [moment(rowData?.reg_start), moment(rowData?.reg_end)],
        event_date: moment(rowData?.event_date),
        is_subscription_need: rowData?.is_subscription_need,
        event_price: rowData?.event_price,
        refundable: rowData?.refundable,
      });
      setEventHighlights(rowData?.highlight);
      setEventDescription(rowData?.description);
      setSubscriptionStatus(rowData?.is_subscription_need);
      setRefundPolicy(rowData?.refundable);
      let data = [];
      Object.entries(rowData?.policy).forEach(([days, percent]) => {
        let policyData = { days: days, percent: percent, amount: '' };
        data.push(policyData);
      });
      console.log(data);
      setRefundPolicyData(data);
      setFileLinks(rowData?.attachments);
      setEventId(rowData?.id);
      setEventDrawerOpen(true);
    }
  };
  const closeEventDrawer = () => {
    setEventDrawerOpen(false);
    eventForm.resetFields();
    setGradeList([]);
    setEventHighlights('');
    setEventDescription();
    setSubscriptionStatus(1);
    setRefundPolicy(1);
    setRefundPolicyData([
      {
        days: '',
        percent: '',
        amount: '',
      },
    ]);
    setSelectedFiles([]);
    // for edit
    setEventData([]);
    setTimeout(() => {
      setEventId(null);
    }, 1000);
  };
  const openStudentDrawer = (id) => {
    setStudentDrawerOpen(true);
    fetchStudentList({ id: id });
    setStudenEventId(id);
  };
  const closeStudentDrawer = () => {
    setStudentDrawerOpen(false);
    setStudentCurrentPage(1);
    setStudenEventId();
    setStudentList([]);
  };
  const openViewEventModal = (row) => {
    setViewEventModalOpen(true);
    setViewEvent(row);
  };
  const closeViewEventModal = () => {
    setViewEventModalOpen(false);
    setViewEvent();
  };

  const handleSubscriptionStatusChange = (val) => {
    setSubscriptionStatus(val);
  };
  const handleRefundPolicyChange = (val) => {
    if (val) {
      setRefundPolicyData([
        {
          days: '',
          percent: '',
          amount: '',
        },
      ]);
    } else {
      setRefundPolicyData([]);
    }
    setRefundPolicy(val);
  };
  const handleAdd = () => {
    if (refundPolicyData?.length < 4) {
      let newPolicy = {
        days: '',
        percent: '',
        amount: '',
      };
      setRefundPolicyData([...refundPolicyData, newPolicy]);
    } else {
      notification['error']({
        message: 'Only 04 policies allowed!',
        duration: notificationDuration,
        className: 'notification-container',
      });
    }
  };
  const handleDelete = (index) => {
    let policies = refundPolicyData.slice();
    policies.splice(index, 1);
    setRefundPolicyData(policies);
    if (policies?.length === 0) {
      setRefundPolicy(1);
      eventForm.setFieldsValue({
        refund_policy: 1,
      });
    }
  };
  const handleChange = (value, index, key) => {
    let policies = [...refundPolicyData];
    policies[index] = { ...policies[index], [key]: value };
    setRefundPolicyData(policies);
  };

  const validFileFormats = ['jpg', 'jpeg', 'png', 'pdf', 'mp3', 'mp4'];
  const maxSize = 20 * 1024 * 1024;
  const maxFileCount = 10;
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (file.size > maxSize) {
        notification.error({
          message: 'File Size Error',
          description: `${file.name} exceeds the maximum size of 50 MB`,
          duration: notificationDuration,
          className: 'w-100',
        });
        return false;
      } else if (!validFileFormats.includes(fileExtension)) {
        notification.error({
          message: 'File Format Error',
          description: `${
            file.name
          } is not a supported format. Supported formats are: ${validFileFormats.join(
            ', '
          )}`,
          duration: notificationDuration,
          className: 'w-100',
        });
        return false;
      }
      return true;
    });
    const combinedFiles = [...selectedFiles, ...validFiles];
    if (combinedFiles.length > maxFileCount) {
      notification.error({
        message: 'File Count Error',
        description: `You can only upload a maximum of ${maxFileCount} files.`,
        duration: notificationDuration,
        className: 'w-100',
      });
      setSelectedFiles(combinedFiles.slice(0, maxFileCount));
    } else {
      setSelectedFiles(combinedFiles);
    }
  };

  const handleFileRemove = (index) => {
    const updatedFiles = selectedFiles.filter((_, fileIndex) => fileIndex !== index);
    setSelectedFiles(updatedFiles);
  };
  const handleFileLinkRemove = (index) => {
    const removedFile = fileLinks[index];
    setRemovedFiles([...removedFiles, removedFile]);

    const newFileLinks = fileLinks.filter((_, i) => i !== index);
    setFileLinks(newFileLinks);
  };
  const handlePreview = (file) => {
    setPreviewFile(file);
    setPreviewVisible(true);
  };

  const renderPreviewContent = (file) => {
    const fileURL = URL.createObjectURL(file);
    if (file.type.startsWith('image/')) {
      return <img src={fileURL} alt={file.name} style={{ width: '100%' }} />;
    } else if (file.type.startsWith('video/')) {
      return <video controls style={{ width: '100%' }} src={fileURL} />;
    } else if (file.type.startsWith('audio/')) {
      return <audio controls style={{ width: '100%' }} src={fileURL} />;
    } else if (file.type === 'application/pdf') {
      return <embed src={fileURL} type='application/pdf' width='100%' height='400px' />;
    } else {
      return <p>No preview available</p>;
    }
  };
  const columns = [
    {
      title: <span className='th-white cl-12 th-fw-700'></span>,
      align: 'center',
      render: (data, row, index) => (
        <span className='th-black-1 cl-12'>
          {(currentPage - 1) * pageSize + index + 1}.
        </span>
      ),
    },
    {
      title: <span className='th-white cl-12 th-fw-700'>Event Name</span>,
      align: 'left',
      render: (data, row) => (
        <Tag
          onClick={() => openViewEventModal(row)}
          color='geekblue'
          style={{ cursor: 'pointer' }}
          className='tag-hover th-br-4 shadow'
        >
          <span className='th-black-1 cl-12'>
            {row?.title && row?.title.length > 15
              ? row?.title.substring(0, 15) + '...'
              : row?.title}
          </span>
        </Tag>
      ),
    },
    {
      title: <span className='th-white cl-12 th-fw-700'>Reg. End Date</span>,
      align: 'center',
      width: '15%',
      sorter: (a, b) => new Date(a.reg_end) - new Date(b.reg_end),
      render: (data, row) => <span className='th-black-1 cl-12'>{row?.reg_end}</span>,
    },
    {
      title: <span className='th-white cl-12 th-fw-700'>Event Date</span>,
      align: 'center',
      sorter: (a, b) => new Date(a.event_date) - new Date(b.event_date),
      render: (data, row) => <span className='th-black-1 cl-12'>{row?.event_date}</span>,
    },
    {
      title: <span className='th-white cl-12 th-fw-700'>Reg. Count</span>,
      align: 'center',
      render: (data, row) => (
        <Tag
          color='geekblue'
          style={{ cursor: 'pointer' }}
          className='tag-hover th-br-4 shadow'
          icon={<EyeOutlined className='cl-12' />}
          onClick={() => openStudentDrawer(row?.id)}
        >
          <span className='th-black-1 cl-12'>{row?.students_count} Students </span>
        </Tag>
      ),
    },
    {
      title: <span className='th-white cl-12 th-fw-700'>Status</span>,
      align: 'center',
      render: (data, row) => (
        <>
          {row?.approval_status === 1 && (
            <Tag icon={<ReloadOutlined />} className='th-br-4 cl-pending'>
              Pending
            </Tag>
          )}
          {row?.approval_status === 2 && (
            <Popover placement='topRight' content={`Remarks: ${row?.remarks}`}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Tag icon={<CloseCircleOutlined />} className='th-br-4 cl-rejected'>
                  Rejected
                </Tag>
                <InfoCircleTwoTone className='icon-hover' />
              </div>
            </Popover>
          )}
          {row?.approval_status === 3 && (
            <Popover placement='topRight' content={`Remarks: ${row?.remarks}`}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Tag icon={<CloseOutlined />} className='th-br-4 cl-cancelled'>
                  Cancelled
                </Tag>
                <InfoCircleTwoTone className='icon-hover' />
              </div>
            </Popover>
          )}

          {row?.approval_status === 4 && (
            <Tag icon={<CheckOutlined />} className='th-br-4 cl-approved'>
              Approved
            </Tag>
          )}
        </>
      ),
    },
    {
      title: <span className='th-white cl-12 th-fw-700'>Action</span>,
      align: 'center',
      key: 'action',
      render: (data, row) => {
        return (
          <>
            <Popover placement='topRight' content='View Event'>
              <Button
                shape='circle'
                size='small'
                icon={<EyeOutlined />}
                onClick={() => openViewEventModal(row)}
                className='icon-hover cl-view shadow'
              />
            </Popover>
            {row?.approval_status === 1 && (
              <Popover placement='topRight' content='Edit Event'>
                <Button
                  shape='circle'
                  size='small'
                  icon={<EditOutlined />}
                  onClick={() => openEventDrawer({ key: 'edit', rowData: row })}
                  className='icon-hover cl-edit shadow'
                />
              </Popover>
            )}
            {[8, 26].includes(user_level) && (
              <>
                {row?.approval_status === 4 && (
                  <Popover placement='topRight' content='Cancel Event'>
                    <Button
                      shape='circle'
                      size='small'
                      icon={<CloseOutlined />}
                      onClick={() => openFeedBackModal({ key: 'cancel', id: row?.id })}
                      className='icon-hover cl-cancelled shadow'
                    />
                  </Popover>
                )}
                {row?.approval_status === 1 && (
                  <>
                    <Popconfirm
                      placement='bottomRight'
                      title='Are you sure to Approve the Event ?'
                      onConfirm={() => approveEvent({ approveId: row?.id })}
                    >
                      <Popover placement='topRight' content='Approve Event'>
                        <Button
                          shape='circle'
                          size='small'
                          icon={<CheckOutlined />}
                          className='icon-hover cl-approved shadow'
                        />
                      </Popover>
                    </Popconfirm>
                    <Popover placement='topRight' content='Reject Event'>
                      <Button
                        shape='circle'
                        size='small'
                        icon={<CloseOutlined />}
                        onClick={() => openFeedBackModal({ key: 'reject', id: row?.id })}
                        className='icon-hover cl-rejected shadow'
                      />
                    </Popover>
                  </>
                )}
              </>
            )}
          </>
        );
      },
    },
  ];
  const studentColumns = [
    {
      title: <span className='th-white cl-12 th-fw-700'></span>,
      align: 'center',
      render: (data, row, index) => (
        <span className='th-black-1 cl-12'>
          {(studentCurrentPage - 1) * pageSize + index + 1}.
        </span>
      ),
    },
    {
      title: <span className='th-white cl-12 th-fw-700'>ERP ID</span>,
      align: 'center',
      render: (data, row) => <span className='th-black-1 cl-12'>{row?.erp_id}</span>,
    },
    {
      title: <span className='th-white cl-12 th-fw-700'>Name</span>,
      align: 'center',
      render: (data, row) => (
        <span className='th-black-1 cl-12'>
          {row?.name && row?.name.length > 15
            ? row?.name.substring(0, 15) + '...'
            : row?.name}
        </span>
      ),
    },
    {
      title: <span className='th-white cl-12 th-fw-700'>Branch</span>,
      align: 'center',
      render: (data, row) => <span className='th-black-1 cl-12'>{row?.branch}</span>,
    },
    {
      title: <span className='th-white cl-12 th-fw-700'>Grade</span>,
      align: 'center',
      render: (data, row) => <span className='th-black-1 cl-12'>{row?.grade}</span>,
    },
    {
      title: <span className='th-white cl-12 th-fw-700'>Section</span>,
      align: 'center',
      render: (data, row) => <span className='th-black-1 cl-12'>{row?.section}</span>,
    },
    {
      title: <span className='th-white cl-12 th-fw-700'>Status</span>,
      align: 'center',
      render: (data, row) => (
        <>
          {!row?.is_unsub && (
            <Tag className='custom-tag cl-approved' icon={<CheckCircleOutlined />}>
              Subscribed
            </Tag>
          )}
          {row?.is_unsub && (
            <Tag className='custom-tag cl-cancelled' icon={<CloseCircleOutlined />}>
              Un Subscribed
            </Tag>
          )}
        </>
      ),
    },
  ];
  const noDataLocale = {
    emptyText: (
      <div className='d-flex justify-content-center mt-5 th-grey'>
        <Empty
          description={
            <div>
              No data found. <br />
              Please try again.
            </div>
          }
        />
      </div>
    ),
  };
  const branchOptions = branchList?.map((each) => (
    <Option key={each?.id} value={each?.id}>
      {each?.branch?.branch_name}
    </Option>
  ));
  const gradeOptions = gradeList?.map((each) => (
    <Option key={each?.grade_id} value={each?.grade_id}>
      {each?.grade_name}
    </Option>
  ));
  return (
    <>
      <div
        className='row d-flex justify-content-between'
        style={{ paddingLeft: '15px', paddingRight: '15px' }}
      >
        <div>
          <Button
            size='small'
            className={`custom-tag ${
              selectedTag === 1 ? 'cl-pending-active' : 'cl-pending'
            }`}
            onClick={() => (selectedTag === 1 ? setSelectedTag() : setSelectedTag(1))}
            icon={<ReloadOutlined />}
          >
            {`Pending: ${tableData?.counts?.pending}`}
          </Button>
          <Button
            size='small'
            className={`custom-tag ${
              selectedTag === 4 ? 'cl-approved-active' : 'cl-approved'
            }`}
            onClick={() => (selectedTag === 4 ? setSelectedTag() : setSelectedTag(4))}
            icon={<CheckCircleOutlined />}
          >
            {`Approved: ${tableData?.counts?.approved}`}
          </Button>
          <Button
            size='small'
            className={`custom-tag ${
              selectedTag === 2 ? 'cl-rejected-active' : 'cl-rejected'
            }`}
            onClick={() => (selectedTag === 2 ? setSelectedTag() : setSelectedTag(2))}
            icon={<CloseCircleOutlined />}
          >
            {`Rejected: ${tableData?.counts?.rejected}`}
          </Button>
          <Button
            size='small'
            className={`custom-tag ${
              selectedTag === 3 ? 'cl-cancelled-active' : 'cl-cancelled'
            }`}
            onClick={() => (selectedTag === 3 ? setSelectedTag() : setSelectedTag(3))}
            icon={<CloseCircleOutlined />}
          >
            {`Cancelled: ${tableData?.counts?.cancelled}`}
          </Button>
        </div>
        <div>
          <Tag className='custom-tag-1 cl-grey'>
            <span className='custom-tag-text-1'>{`Total : ${tableData?.counts?.total}`}</span>
          </Tag>
          <Tag className='custom-tag-1 cl-grey'>
            <span className='custom-tag-text-1'>{`Live : ${tableData?.counts?.live}`}</span>
          </Tag>
          <Button
            size='small'
            type='primary'
            className='th-br-4 shadow'
            icon={<PlusCircleOutlined />}
            onClick={() => openEventDrawer({ key: 'create' })}
          >
            Create Event
          </Button>
        </div>
      </div>
      <div className='row mb-2'>
        <Form id='filterForm' form={filterForm} className='row col-12'>
          <div className='col-lg-3 col-md-6 col-sm-12 col-12'>
            <Popover placement='bottomLeft' content='Select Event Date Filter'>
              <Form.Item name='date_filter'>
                <RangePicker
                  format='DD/MM/YYYY'
                  className='w-100 text-left th-black-1 th-br-4 shadow'
                  defaultValue={filterForm?.getFieldsValue()?.date_filter}
                  disabled={selectedDays}
                  onChange={() => handleFetchTableData()}
                />
              </Form.Item>
            </Popover>
          </div>

          <div className='col-lg-4 col-md-6 col-sm-12 col-12 d-flex justify-content-around mt-1 mb-2'>
            <Popover placement='bottomLeft' content='Next 07 days Events'>
              <Button
                size='small'
                className={`custom-tag th-br-4 ${
                  selectedDays === 7 ? 'cl-days-active' : 'cl-days'
                }`}
                onClick={() =>
                  selectedDays === 7 ? setSelectedDays() : setSelectedDays(7)
                }
                icon={<ClockCircleOutlined />}
              >
                7 Days
              </Button>
            </Popover>
            <Popover placement='bottomLeft' content='Next 15 days Events'>
              <Button
                size='small'
                className={`custom-tag th-br-4 ${
                  selectedDays === 15 ? 'cl-days-active' : 'cl-days'
                }`}
                onClick={() =>
                  selectedDays === 15 ? setSelectedDays() : setSelectedDays(15)
                }
                icon={<ClockCircleOutlined />}
              >
                15 Days
              </Button>
            </Popover>
            <Popover placement='bottomLeft' content='Next 30 days Events'>
              <Button
                size='small'
                className={`custom-tag th-br-4 ${
                  selectedDays === 30 ? 'cl-days-active' : 'cl-days'
                }`}
                onClick={() =>
                  selectedDays === 30 ? setSelectedDays() : setSelectedDays(30)
                }
                icon={<ClockCircleOutlined />}
              >
                30 Days
              </Button>
            </Popover>
          </div>
          {is_central_user && (
            <div className='col-lg-3 col-md-6 col-sm-6 col-6 mb-2'>
              <Form.Item name='branch_filter'>
                <Select
                  mode='multiple'
                  maxTagCount={1}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  showArrow={true}
                  suffixIcon={<DownOutlined className='th-grey' />}
                  placeholder='Select Branch'
                  showSearch
                  optionFilterProp='children'
                  dropdownMatchSelectWidth={false}
                  filterOption={(input, options) => {
                    return (
                      options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={() => handleFetchTableData()}
                  className='w-100 text-left th-black-1 th-bg-grey th-br-4 shadow'
                >
                  {branchOptions}
                </Select>
              </Form.Item>
            </div>
          )}
          <div className='d-flex col-lg-2 col-md-6 col-sm-6 col-6 mt-1 mb-2'>
            <Button
              size='small'
              type='default'
              className='cl-button th-br-4 shadow'
              onClick={() => handleClearAll()}
              icon={<ClearOutlined />}
            >
              Clear All
            </Button>
          </div>
        </Form>
      </div>
      <div className='mt-2'>
        <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
          <div className='shadow'>
            <Table
              className='cl-table'
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
              }
              loading={loading}
              columns={columns}
              rowKey={(record) => record?.id}
              dataSource={tableData?.results}
              pagination={false}
              locale={noDataLocale}
              scroll={{
                x: 'max-content',
                y: '100vh',
              }}
            />
            <div className='d-flex justify-content-center py-2'>
              <Pagination
                current={currentPage}
                pageSize={15}
                showSizeChanger={false}
                onChange={(page) => {
                  setCurrentPage(page);
                }}
                total={tableData?.count}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={`Reason for ${feedBackFlag === 'reject' ? 'Rejecting' : 'Cancelling'}`}
        visible={feedBackModalOpen}
        onCancel={closeFeedBackModal}
        className={`cl-modal ${
          feedBackFlag === 'reject' ? 'cl-modal-rejected' : 'cl-modal-cancelled'
        }`}
        footer={[
          <Row justify='space-around'>
            <Col>
              <Button
                size='small'
                type='default'
                className='th-br-4 cl-button shadow'
                onClick={closeFeedBackModal}
              >
                Close
              </Button>
            </Col>
            <Col>
              <Button
                size='small'
                className={`shadow th-br-4 ${
                  feedBackFlag === 'reject' ? 'cl-rejected-active' : 'cl-cancelled-active'
                }`}
                form='feedBackModalForm'
                htmlType='submit'
                icon={<CloseCircleOutlined />}
              >
                {feedBackFlag === 'reject' ? 'Reject' : 'Cancel'}
              </Button>
            </Col>
          </Row>,
        ]}
      >
        {feedBackLoading ? (
          <div className='d-flex justify-content-center align-items-center mt-2'>
            <Spin tip='Hold on! Great things take time!' size='large' />
          </div>
        ) : (
          <div className='col-lg-12 col-md-12 col-sm-12 col-12 mt-2 mb-2'>
            <Form
              id='feedBackModalForm'
              form={feedBackModalForm}
              layout='vertical'
              onFinish={feedBackFlag === 'reject' ? rejectEvent : cancelEvent}
            >
              <Row align='middle' gutter={24}>
                <Col span={24}>
                  <Form.Item
                    name='remarks'
                    label='Remarks'
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Remarks',
                      },
                    ]}
                  >
                    <TextArea
                      rows={3}
                      maxLength={300}
                      showCount
                      placeholder='Enter Remarks'
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        )}
      </Modal>
      <Drawer
        title='Time Line'
        visible={timeLineDrawerOpen}
        onClose={closeTimeLineDrawer}
        className='cl-drawer'
        closeIcon={false}
        footer={[
          <Row justify='space-around'>
            <Col>
              <Button
                size='small'
                type='default'
                className='shadow th-br-4 cl-button'
                onClick={closeTimeLineDrawer}
              >
                Close
              </Button>
            </Col>
          </Row>,
        ]}
        width={drawerWidth}
      >
        <div>
          {timelineLoading ? (
            <div className='d-flex justify-content-center align-items-center mt-2'>
              <Spin tip='Hold on! Great things take time!' size='large' />
            </div>
          ) : (
            <>
              {timeLineData && timeLineData?.length === 0 && (
                <Empty style={{ marginTop: '200px' }} description='No Data Found' />
              )}
              {timeLineData && timeLineData?.length !== 0 && (
                <>
                  <Timeline pending={true} mode='left' style={{ width: '100%' }}>
                    {timeLineData?.map((eachStep, index) => {
                      return (
                        <Timeline.Item
                          key={index}
                          color='green'
                          dot={<CheckCircleOutlined />}
                          label={
                            <>
                              <div
                                style={{
                                  fontSize: '14px',
                                  color: '#a1a1c2',
                                }}
                              >
                                {moment(eachStep?.created_at).format('MMMM Do YYYY')}
                              </div>
                              <div
                                style={{
                                  fontSize: '12px',
                                  color: '#a1a1c2',
                                }}
                              >
                                {moment(eachStep?.created_at).format('h:mm:ss a')}
                              </div>
                            </>
                          }
                        >
                          <span style={{ color: '#595c97' }}> {eachStep?.title}</span>
                        </Timeline.Item>
                      );
                    })}
                  </Timeline>
                </>
              )}
            </>
          )}
        </div>
      </Drawer>
      <Drawer
        title={eventId ? 'Update Event' : 'Create Event'}
        visible={eventDrawerOpen}
        closeIcon={false}
        className={`cl-drawer-1 ${eventId ? 'cl-drawer-1-edit' : 'cl-drawer-1-create'}`}
        footer={[
          <Row justify='space-around'>
            <Col>
              <Button
                size='small'
                type='default'
                className='shadow th-br-4 cl-button'
                onClick={closeEventDrawer}
              >
                Close
              </Button>
            </Col>
            <Col>
              <Button
                size='small'
                className={`shadow btn-block th-br-4 ${
                  eventId ? 'cl-drawer-1-edit-button' : 'cl-drawer-1-create-button'
                }`}
                icon={
                  eventLoading ? (
                    <SyncOutlined spin />
                  ) : eventId ? (
                    <EditOutlined />
                  ) : (
                    <PlusCircleOutlined />
                  )
                }
                form='eventForm'
                htmlType='submit'
              >
                {eventId ? 'Update Event' : 'Create Event'}
              </Button>
            </Col>
          </Row>,
        ]}
        width='90%'
      >
        <>
          {eventLoading ? (
            <div className='center-screen'>
              <Spin tip='Hold on! Great things take time!' size='large' />
            </div>
          ) : (
            <>
              <div className='mt-2'>
                <Form
                  id='eventForm'
                  form={eventForm}
                  onFinish={eventId ? editEvent : createEvent}
                  layout='vertical'
                  className='row col-lg-12 col-md-12 col-sm-12 cl-form'
                >
                  <div className='col-lg-6 col-md-12 col-sm-12 col-12 mb-2'>
                    <Form.Item
                      name='event_name'
                      label='Event Name'
                      rules={[
                        {
                          required: true,
                          message: 'Please Enter Event Name',
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const maxCharCount = 199;
                            if (value && value.length > maxCharCount) {
                              return Promise.reject(
                                new Error(`Event name must be less than 200 characters`)
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input
                        placeholder='Enter Event Name'
                        className='w-100 text-left th-black-1 th-br-4 shadow'
                        allowClear
                        showCount
                        maxLength={200}
                      />
                    </Form.Item>
                  </div>
                  <div className='col-lg-3 col-md-6 col-sm-12 col-12 mb-2'>
                    <Form.Item
                      name='acad_session'
                      label='Branch'
                      rules={[
                        {
                          required: true,
                          message: 'Please Select Branch',
                        },
                      ]}
                    >
                      <Select
                        mode='multiple'
                        maxTagCount={1}
                        allowClear
                        getPopupContainer={(trigger) => trigger.parentNode}
                        showArrow={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        placeholder='Select Branch'
                        showSearch
                        optionFilterProp='children'
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={() => handleBranchChange()}
                        className='w-100 text-left th-black-1 th-bg-grey th-br-4 shadow'
                      >
                        {branchList && branchList?.length > 0 && (
                          <>
                            <Option key='all' value='all'>
                              Select All
                            </Option>
                            {branchOptions}
                          </>
                        )}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-lg-3 col-md-6 col-sm-12 col-12 mb-2'>
                    <Form.Item
                      name='grade_ids'
                      label='Grade'
                      rules={[
                        {
                          required: true,
                          message: 'Please Select Grade',
                        },
                      ]}
                    >
                      <Select
                        mode='multiple'
                        maxTagCount={1}
                        allowClear
                        getPopupContainer={(trigger) => trigger.parentNode}
                        showArrow={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        placeholder='Select Grade'
                        showSearch
                        optionFilterProp='children'
                        dropdownMatchSelectWidth={false}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={() => handleGradeChange()}
                        className='w-100 text-left th-black-1 th-bg-grey th-br-4 shadow'
                      >
                        {gradeList && gradeList.length > 0 && (
                          <>
                            <Option key='all' value='all'>
                              Select All
                            </Option>
                            {gradeOptions}
                          </>
                        )}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-lg-12 col-md-12 col-sm-12 col-12 mb-2'>
                    <Form.Item
                      name='highlight'
                      label='Event Highlights'
                      rules={[
                        {
                          required: true,
                          message: 'Please Enter Event Highlights',
                        },
                      ]}
                    >
                      <ReactQuill
                        ref={quillRef1}
                        defaultValue={eventHighlights}
                        onChange={handleChangeEventHighlights}
                        modules={modules}
                        formats={formats}
                        className='shadow'
                        placeholder='Please Enter Event Highlights'
                      />
                    </Form.Item>
                  </div>
                  <div className='col-lg-12 col-md-12 col-sm-12 col-12 mb-2'>
                    <Form.Item
                      name='description'
                      label='Event Description'
                      rules={[
                        {
                          required: true,
                          message: 'Please Enter Event Description',
                        },
                      ]}
                    >
                      <ReactQuill
                        ref={quillRef2}
                        value={eventDescription}
                        onChange={handleChangeEventDescription}
                        modules={modules}
                        formats={formats}
                        className='shadow'
                        placeholder='Please Enter Event Description'
                      />
                    </Form.Item>
                  </div>

                  <div className='col-lg-4 col-md-6 col-sm-6 col-6 mb-2'>
                    <Form.Item
                      name='reg_dates'
                      label='Registration (Start Date - End Date)'
                      rules={[
                        {
                          required: true,
                          message: 'Please Select Registration Date Range',
                        },
                      ]}
                    >
                      <RangePicker
                        format='DD/MM/YYYY'
                        className='w-100 text-left th-black-1 th-br-4 shadow'
                        allowClear
                        disabledDate={(current) =>
                          current && current < moment().endOf('day').subtract(1, 'day')
                        }
                      />
                    </Form.Item>
                  </div>
                  <div className='col-lg-2 col-md-6 col-sm-6 col-6 mb-2'>
                    <Form.Item
                      name='event_date'
                      label='Event Date'
                      rules={[
                        {
                          required: true,
                          message: 'Please Select Date',
                        },
                      ]}
                    >
                      <DatePicker
                        placeholder='Event Date'
                        format='DD/MM/YYYY'
                        className='w-100 text-left th-black-1 th-br-4 shadow'
                        allowClear
                        disabledDate={(current) =>
                          current && current < moment().endOf('day').subtract(1, 'day')
                        }
                      />
                    </Form.Item>
                  </div>
                  <div className='col-lg-3 col-md-6 col-sm-6 col-6 mb-2'>
                    <Form.Item
                      name='is_subscription_need'
                      label='Is subscription needed ?'
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Radio.Group
                        name='radiogroup'
                        onChange={(e) => handleSubscriptionStatusChange(e.target.value)}
                        defaultValue={subscriptionStatus}
                      >
                        <Radio className='th-br-4 shadow' value={true}>
                          Yes
                        </Radio>
                        <Radio className='th-br-4 shadow' value={false}>
                          No
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                  {subscriptionStatus && (
                    <>
                      <div className='col-lg-3 col-md-6 col-sm-6 col-6 mb-2'>
                        <Form.Item
                          name='event_price'
                          label='Amount'
                          rules={[
                            {
                              required: true,
                              message: 'Please Enter Event Cost',
                            },
                          ]}
                        >
                          <InputNumber
                            placeholder='Enter Event Cost'
                            className='w-100 text-left th-black-1 th-br-4 shadow'
                            allowClear
                            addonBefore='Rs'
                            min={0}
                            max={100000}
                          />
                        </Form.Item>
                      </div>
                      <div className='col-lg-12 col-md-12 col-sm-12 col-12 mb-2'>
                        <Form.Item
                          name='refundable'
                          label='Refund Policy'
                          rules={[
                            {
                              required: true,
                              message: 'Please Select Refund Policy',
                            },
                          ]}
                        >
                          <Radio.Group
                            name='policies'
                            onChange={(e) => handleRefundPolicyChange(e.target.value)}
                            defaultValue={refundPolicy}
                          >
                            <Radio className='th-br-4 shadow mb-2' value={false}>
                              No Refund will be provided once subscribed
                            </Radio>
                            <Radio className='th-br-4 shadow' value={true}>
                              Refund based on remaining days
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                        {refundPolicy && (
                          <>
                            <div className='row'>
                              <div className='col-12 text-right'>
                                <Button
                                  icon={<PlusOutlined />}
                                  size='small'
                                  className={`th-br-4 shadow ${
                                    eventId
                                      ? 'cl-drawer-1-add-button-edit'
                                      : 'cl-drawer-1-add-button-create'
                                  }`}
                                  onClick={() => handleAdd()}
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                            {refundPolicyData.map((each, index) => {
                              return (
                                <>
                                  <div className='row'>
                                    <div className='col-lg-3 col-md-3 col-sm-5 col-5'>
                                      <Form.Item
                                        name={`days_${index}`}
                                        rules={[
                                          {
                                            required: true,
                                            message: 'Please Enter Days',
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          placeholder='No Of Days Before'
                                          className='w-100 text-left th-black-1 th-br-4 shadow'
                                          allowClear
                                          addonAfter='days'
                                          min={1}
                                          max={1000}
                                          defaultValue={parseInt(each?.days)}
                                          onChange={(e) => handleChange(e, index, 'days')}
                                        />
                                      </Form.Item>
                                    </div>
                                    <div className='col-lg-3 col-md-3 col-sm-5 col-5'>
                                      <Form.Item
                                        name={`percent_${index}`}
                                        rules={[
                                          {
                                            required: true,
                                            message: 'Please Enter Percentage',
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          placeholder='Amount Percentage'
                                          className='w-100 text-left th-black-1 th-br-4 shadow'
                                          allowClear
                                          addonAfter='%'
                                          min={1}
                                          max={100}
                                          defaultValue={parseInt(each?.percent)}
                                          onChange={(e) =>
                                            handleChange(e, index, 'percent')
                                          }
                                        />
                                      </Form.Item>
                                    </div>
                                    {/* <div className='col-lg-3 col-md-3 col-sm-6 col-6'>
                                      <Form.Item name={`amount_${index}`}>
                                        <InputNumber
                                          placeholder='Refund Amount'
                                          className='w-100 text-left th-black-1 th-br-4 shadow'
                                          allowClear
                                          addo  search: e.target.value,nBefore='Rs'
                                          disabled
                                          value={each?.amount}
                                          onChange={(e) =>
                                            handleChange(e, index, 'amount')
                                          }
                                        />
                                      </Form.Item>
                                    </div> */}
                                    <div className='col-lg-3 col-md-3 col-sm-2 col-2'>
                                      <Button
                                        shape='circle'
                                        size='small'
                                        icon={<CloseOutlined />}
                                        onClick={() => handleDelete(index)}
                                        className='icon-hover cl-cancelled shadow'
                                      />
                                    </div>
                                  </div>
                                </>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </>
                  )}
                  <div className='col-lg-12 col-md-12 col-sm-12 col-12 mt-2'>
                    <Form.Item
                      name='attachments'
                      label={`Upload attachments. Valid formats: ${validFileFormats.join(
                        '/'
                      )}. Max ${
                        maxSize / (1024 * 1024)
                      } MB allowed for each file. And max ${maxFileCount} files allowed.`}
                    >
                      <Button
                        size='small'
                        className={`th-br-4 shadow ${
                          eventId
                            ? 'cl-drawer-1-edit-button'
                            : 'cl-drawer-1-create-button'
                        }`}
                        icon={<CloudUploadOutlined />}
                        onClick={() => document.getElementById('fileInput').click()}
                      >
                        Upload Attachments
                      </Button>
                      <input
                        type='file'
                        id='fileInput'
                        style={{ display: 'none' }}
                        accept='.pdf, .jpg, .jpeg, .png, .gif, .bmp, .mp4, .mkv, .avi, .mp3, .wav, .ogg'
                        multiple
                        onChange={handleFileChange}
                      />
                    </Form.Item>
                    {fileLinks && fileLinks?.length > 0 && (
                      <div className='mt-2'>
                        <div className='row'>
                          {fileLinks.map((file, index) => (
                            <div
                              className='col-lg-4 col-md-6 col-sm-12 col-12'
                              key={index}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  border: '1px solid #d9d9d9',
                                  borderRadius: '4px',
                                  padding: '4px',
                                }}
                                // onClick={() =>
                                //   window.open(URL.createObjectURL(file), '_blank')
                                // }
                              >
                                <span
                                  style={{
                                    flex: 1,
                                    color: 'blue',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    marginRight: '8px',
                                  }}
                                >
                                  {file.length > 20
                                    ? file
                                        .substring(file.lastIndexOf('/') + 1)
                                        .substring(0, 20) + '...'
                                    : file}
                                </span>
                                <Button
                                  shape='circle'
                                  size='small'
                                  icon={<DeleteOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFileLinkRemove(index);
                                  }}
                                  className='icon-hover cl-rejected shadow'
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedFiles && selectedFiles?.length == 0 && (
                      <div className='mb-4'> </div>
                    )}
                    {selectedFiles && selectedFiles?.length > 0 && (
                      <div className='mt-2'>
                        <div className='row'>
                          {selectedFiles.map((file, index) => (
                            <div
                              className='col-lg-4 col-md-6 col-sm-12 col-12'
                              key={index}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  border: '1px solid #d9d9d9',
                                  borderRadius: '4px',
                                  padding: '4px',
                                }}
                                onClick={() => handlePreview(file)}
                              >
                                <span
                                  style={{
                                    flex: 1,
                                    color: 'blue',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    marginRight: '8px',
                                  }}
                                >
                                  {file.name.length > 20
                                    ? file.name.substring(0, 20) + '...'
                                    : file.name}
                                </span>
                                <Button
                                  shape='circle'
                                  size='small'
                                  icon={<DeleteOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFileRemove(index);
                                  }}
                                  className='icon-hover cl-rejected shadow'
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Form>
              </div>
            </>
          )}
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={() => setPreviewVisible(false)}
          >
            {previewFile && renderPreviewContent(previewFile)}
          </Modal>
        </>
      </Drawer>
      <Modal
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{viewEvent?.title}</span>
            <Button
              size='small'
              type='default'
              className='th-br-4 cl-button shadow'
              onClick={closeViewEventModal}
            >
              Close
            </Button>
          </div>
        }
        visible={viewEventModalOpen}
        className='cl-modal-preview'
        footer={null}
        onCancel={() => closeViewEventModal()}
        style={{
          top: '1%',
        }}
        width='90%'
      >
        <>
          <div className='row mt-2 mb-2'>
            <div className='row col-lg-12 col-md-12 col-sm-12 col-12'>
              <div className='col-lg-8 col-md-7 col-sm-8 col-12'>
                {viewEvent?.attachments?.length > 0 ? (
                  <Slider {...settings} className='th-slick th-post-slick'>
                    {viewEvent?.attachments?.map((each) => (
                      <MediaDisplay
                        mediaName={each}
                        mediaLink={each}
                        alt='File Not Supported'
                        className='w-100 th-br-20 p-3'
                        style={{ objectFit: 'contain' }}
                      />
                    ))}
                  </Slider>
                ) : null}

                {viewEvent?.attachments?.length > 0 && (
                  <div className='text-right'>
                    <Button
                      type='link'
                      className='th-10'
                      icon={<DownloadOutlined />}
                      onClick={() => {
                        handleDownloadAll(viewEvent?.attachments);
                      }}
                    >
                      Download all attachments
                    </Button>
                  </div>
                )}
              </div>
              <div className='col-lg-4 col-md-5 col-sm-12 col-12'>
                <List
                  size='small'
                  className='cl-list shadow'
                  header={<div className='cl-list-header'>Event Details</div>}
                  dataSource={[
                    { title: 'Reg Start Date', content: viewEvent?.reg_start },
                    { title: 'Reg End Date', content: viewEvent?.reg_end },
                    { title: 'Event Date', content: viewEvent?.event_date },
                    { title: 'Amount', content: `Rs. ${viewEvent?.event_price}` },
                  ]}
                  renderItem={(item) => (
                    <List.Item className='cl-list-item'>
                      <strong>{item.title}:</strong> {item.content}
                    </List.Item>
                  )}
                />
              </div>
            </div>
            <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
              <Card className='cl-card shadow'>
                <div className='card-content'>
                  <div className='card-title'>Event Highlights</div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: viewEvent?.highlight,
                    }}
                  />
                </div>
              </Card>

              <Card className='cl-card shadow'>
                <div className='card-content'>
                  <div className='card-title'>Event Description</div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: viewEvent?.description,
                    }}
                  />
                </div>
              </Card>
            </div>
          </div>
        </>
      </Modal>
      <Drawer
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Student List</span>
            <Button
              size='small'
              type='default'
              className='th-br-4 cl-button shadow'
              onClick={closeStudentDrawer}
            >
              Close
            </Button>
          </div>
        }
        visible={studentDrawerOpen}
        onClose={closeStudentDrawer}
        className='cl-drawer-2'
        closeIcon={false}
        footer={null}
        width='90%'
      >
        <div>
          {false ? (
            <div className='center-screen'>
              <Spin tip='Hold on! Great things take time!' size='large' />
            </div>
          ) : (
            <>
              <div className='col-lg-4 col-md-6 col-sm-6 col-12 mb-2'>
                <Form form={studentListForm}>
                  <Form.Item name='erp_id'>
                    <Input
                      placeholder='Search Student Erp'
                      suffix={<SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                      className='w-100 text-left th-black-1 th-br-4 shadow'
                      onChange={(e) => {
                        const timeout = setTimeout(() => {
                          fetchStudentList({
                            id: studentEventId,
                          });
                        }, 500);
                        return () => clearTimeout(timeout);
                      }}
                      allowClear
                    />
                  </Form.Item>
                </Form>
              </div>
              <div className='mt-2'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                  <div className='shadow'>
                    <Table
                      className='cl-table'
                      rowClassName={(record, index) =>
                        index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                      }
                      loading={studentLoading}
                      columns={studentColumns}
                      rowKey={(record) => record?.id}
                      dataSource={studentList?.results}
                      pagination={false}
                      locale={noDataLocale}
                      scroll={{
                        x: 'max-content',
                        y: '100vh',
                      }}
                    />
                    <div className='d-flex justify-content-center py-2'>
                      <Pagination
                        current={studentCurrentPage}
                        pageSize={15}
                        showSizeChanger={false}
                        onChange={(page) => {
                          setStudentCurrentPage(page);
                        }}
                        total={studentList?.count}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default EventsDashboardAdmin;
