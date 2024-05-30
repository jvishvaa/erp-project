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
  FileTextOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
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

const EventsDashboardAdmin = () => {
  const eventData1 = [
    {
      title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      highlight:
        '<p><strong>The Evolution and Impact of Technology on Modern Society</strong></p><p><em><u>Introduction</u></em></p><ul><li>Technology has profoundly shaped human civilization, influencing various aspects of life, from communication to healthcare, transportation, and beyond. This essay delves into the historical evolution of technology, its current impact on society, and its potential future trajectories.</li><li>The Historical Evolution of Technology</li><li>Early Innovations</li></ul><p><br></p><ol><li>Stone Tools: The earliest known use of tools dates back to approximately 2.6 million years ago. Early humans used simple stone tools to hunt and gather food, marking the beginning of technological development.</li><li>Agricultural Revolution: Around 10,000 BCE, the Agricultural Revolution began. Humans transitioned from nomadic lifestyles to settled agricultural communities. This period saw the invention of tools like the plow and irrigation systems, which significantly boosted food production.</li></ol><p>The Industrial Revolution</p><p><br></p><p><em>Mechanization: The 18th century Industrial Revolution introduced machinery that transformed manufacturing processes. Key inventions included the steam engine, spinning jenny, and power loom, which dramatically increased production capacity.</em></p><p><em>Urbanization: Industrialization led to mass migration from rural areas to cities, as people sought employment in factories. This period also saw the development of railways and telegraph systems, enhancing transportation and communication.</em></p><p><em>The Information Age</em></p><p><br></p><p>C<u>omputers: The mid-20th century marked the advent of computers, revolutionizing how information is processed and stored. The first programmable computer, the ENIAC, was developed in 1945.</u></p><p><u>Internet: The creation of the internet in the late 20th century further accelerated technological progress. It transformed communication, commerce, and entertainment, making information readily accessible to a global audience.</u></p><p><u>The Current Impact of Technology on Soc</u>iety</p><p>Communication</p><p><br></p><ul><li>Instant Messaging: Platforms like WhatsApp, Telegram, and Signal enable instant communication across vast distances, making it easier to stay connected with family, friends, and colleagues.</li><li>Social Media: Websites like Facebook, Twitter, and Instagram have reshaped social interactions, providing platforms for sharing experiences, opinions, and news.</li><li>Healthcare</li><li><br></li><li>Medical Devices: Innovations like MRI machines, pacemakers, and robotic surgical systems have significantly improved diagnostic and treatment capabilities.</li><li>Telemedicine: The rise of telemedicine has made healthcare more accessible, allowing patients to consult with doctors remotely through video calls and online chat systems.</li><li>Education</li><li><br></li><li>E-Learning: Online platforms like Coursera, Udemy, and Khan Academy offer a vast array of courses, making education more accessible to people worldwide.</li><li>Digital Classrooms: Tools like Zoom, Google Classroom, and Microsoft Teams have enabled remote learning, especially significant during the COVID-19 pandemic.</li></ul><p>Economy</p><p><br></p><p><strong>E-Commerce: Online marketplaces like Amazon, eBay, and Alibaba have</strong></p>',
      description:
        '<p><strong>The Evolution and Impact of Technology on Modern Society</strong></p><p><em><u>Introduction</u></em></p><ul><li>Technology has profoundly shaped human civilization, influencing various aspects of life, from communication to healthcare, transportation, and beyond. This essay delves into the historical evolution of technology, its current impact on society, and its potential future trajectories.</li><li>The Historical Evolution of Technology</li><li>Early Innovations</li></ul><p><br></p><ol><li>Stone Tools: The earliest known use of tools dates back to approximately 2.6 million years ago. Early humans used simple stone tools to hunt and gather food, marking the beginning of technological development.</li><li>Agricultural Revolution: Around 10,000 BCE, the Agricultural Revolution began. Humans transitioned from nomadic lifestyles to settled agricultural communities. This period saw the invention of tools like the plow and irrigation systems, which significantly boosted food production.</li></ol><p>The Industrial Revolution</p><p><br></p><p><em>Mechanization: The 18th century Industrial Revolution introduced machinery that transformed manufacturing processes. Key inventions included the steam engine, spinning jenny, and power loom, which dramatically increased production capacity.</em></p><p><em>Urbanization: Industrialization led to mass migration from rural areas to cities, as people sought employment in factories. This period also saw the development of railways and telegraph systems, enhancing transportation and communication.</em></p><p><em>The Information Age</em></p><p><br></p><p>C<u>omputers: The mid-20th century marked the advent of computers, revolutionizing how information is processed and stored. The first programmable computer, the ENIAC, was developed in 1945.</u></p><p><u>Internet: The creation of the internet in the late 20th century further accelerated technological progress. It transformed communication, commerce, and entertainment, making information readily accessible to a global audience.</u></p><p><u>The Current Impact of Technology on Soc</u>iety</p><p>Communication</p><p><br></p><ul><li>Instant Messaging: Platforms like WhatsApp, Telegram, and Signal enable instant communication across vast distances, making it easier to stay connected with family, friends, and colleagues.</li><li>Social Media: Websites like Facebook, Twitter, and Instagram have reshaped social interactions, providing platforms for sharing experiences, opinions, and news.</li><li>Healthcare</li><li><br></li><li>Medical Devices: Innovations like MRI machines, pacemakers, and robotic surgical systems have significantly improved diagnostic and treatment capabilities.</li><li>Telemedicine: The rise of telemedicine has made healthcare more accessible, allowing patients to consult with doctors remotely through video calls and online chat systems.</li><li>Education</li><li><br></li><li>E-Learning: Online platforms like Coursera, Udemy, and Khan Academy offer a vast array of courses, making education more accessible to people worldwide.</li><li>Digital Classrooms: Tools like Zoom, Google Classroom, and Microsoft Teams have enabled remote learning, especially significant during the COVID-19 pandemic.</li></ul><p>Economy</p><p><br></p><p><strong>E-Commerce: Online marketplaces like Amazon, eBay, and Alibaba have</strong></p>',

      event_date: '2030-07-19',
      reg_start: '2024-06-19',
      reg_end: '2024-06-22',
      event_price: 1000,
      refundable: true,
      acad_session: [1167],
      grades: [475],
      attachments: [
        'https://storage.googleapis.com/erp-academic-stage/social_media/QA ORCHIDS SCHOOL/1716454116_007c1a2f-15a2-4c89-a5ce-380fad3e2544897992928990733919.mp4',
        'https://storage.googleapis.com/erp-academic-stage/social_media/QA ORCHIDS SCHOOL/1716454080_5d832e19-95ee-409e-acf3-7b00e983d083264880289815280921.jpg',
        'https://storage.googleapis.com/erp-academic-stage/social_media/QA ORCHIDS SCHOOL/1716453965_1716355804_a72629b8-4bd7-4fab-bc3f-e00949a623e85134508219723903403.mp4',
        'https://storage.googleapis.com/erp-academic-stage/social_media/QA ORCHIDS SCHOOL/1716453976_1716355928_VID_20240331_164706.mp4',
        'https://storage.googleapis.com/erp-academic-stage/social_media/QA ORCHIDS SCHOOL/1716453982_1716193988_jpg (2).jpg',
        'https://storage.googleapis.com/erp-academic-stage/social_media/QA ORCHIDS SCHOOL/1716453972_1716193989_jpg (3).jpg',
        'https://storage.googleapis.com/erp-academic-stage/social_media/QA ORCHIDS SCHOOL/1716453977_1716194020_big_buck_bunny_720p_1mb.mp4',
        'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
      ],
      image: [
        'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
      ],
      video: [
        'https://storage.googleapis.com/erp-academic-stage/dev/observation/video-record/12058_202[…]3%2017%3A21%3A51.084155_tic-observation-1716465074235.mp4',
        'https://storage.googleapis.com/erp-academic-stage/dev/observation/video-record/12058_202[…]3%2017%3A21%3A51.084155_tic-observation-1716465074235.mp4',

        'https://storage.googleapis.com/erp-academic-stage/dev/observation/video-record/12058_202[…]3%2017%3A21%3A51.084155_tic-observation-1716465074235.mp4',

        'https://storage.googleapis.com/erp-academic-stage/dev/observation/video-record/12058_202[…]3%2017%3A21%3A51.084155_tic-observation-1716465074235.mp4',
      ],
      policy: {
        12: '30',
        8: '20',
      },
      approval_status: 1,
      students_count: 0,
      policy_dates: {
        '2030-07-07': 300.0,
        '2030-07-11': 200.0,
      },
      id: 756,
    },
  ];
  let viewEvent = eventData1[0];
  const event = eventData1[0];
  const notificationDuration = 3;
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const { TextArea } = Input;
  const [feedBackModalForm] = useForm();
  const [eventForm] = useForm();
  const user_level = localStorage.getItem('userDetails')
    ? JSON.parse(localStorage.getItem('userDetails')).user_level
    : '';
  const is_superuser = localStorage.getItem('userDetails')
    ? JSON.parse(localStorage.getItem('userDetails'))?.is_superuser
    : '';
  const branchList = sessionStorage.getItem('branch_list')
    ? JSON.parse(sessionStorage.getItem('branch_list'))
    : '';
  const session_year = sessionStorage.getItem('acad_session')
    ? JSON.parse(sessionStorage.getItem('acad_session'))?.id
    : '';

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState({
    counts: {
      total: 512,
      live: 123,
      rejected: 178,
      pending: 512,
      cancelled: 23,
      approved: 345,
    },
    count: 34,
    results: [
      {
        title:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
        highlight: null,
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        event_date: '2030-07-19',
        reg_start: '2024-06-19',
        reg_end: '2024-06-22',
        event_price: 1000,
        refundable: true,
        acad_session: [1167],
        grades: [475],
        attachments: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787895_12058_2024_05_27_11_01_35.531278_Screenshot_20230705_151602_01.jpg',
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
        ],
        policy: {
          12: '30',
          8: '20',
        },
        approval_status: 1,
        students_count: 0,
        policy_dates: {
          '2030-07-07': 300.0,
          '2030-07-11': 200.0,
        },
        id: 756,
      },
      {
        title: 'Go Cosmos',
        highlight: null,
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        event_date: '2030-07-17',
        reg_start: '2024-06-19',
        reg_end: '2024-06-22',
        event_price: 1000,
        refundable: true,
        acad_session: [1167],
        grades: [475],
        attachments: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787895_12058_2024_05_27_11_01_35.531278_Screenshot_20230705_151602_01.jpg',
        ],
        pdf: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
        ],
        image: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        ],
        video: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.969321_Screenshot_20230705_151924.jpg',
        ],
        policy: {
          12: '30',
          8: '20',
        },
        approval_status: 2,
        students_count: 0,
        policy_dates: {
          '2030-07-07': 300.0,
          '2030-07-11': 200.0,
        },
        remarks: 'Some data is missing',
      },
      {
        title: 'Go Cosmos',
        highlight: null,
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        event_date: '2030-07-18',
        reg_start: '2024-06-19',
        reg_end: '2024-06-22',
        event_price: 1000,
        refundable: true,
        acad_session: [1167],
        grades: [475],
        attachments: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787895_12058_2024_05_27_11_01_35.531278_Screenshot_20230705_151602_01.jpg',
        ],
        pdf: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
        ],
        image: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        ],
        video: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.969321_Screenshot_20230705_151924.jpg',
        ],
        policy: {
          12: '30',
          8: '20',
        },
        approval_status: 3,
        students_count: 0,
        policy_dates: {
          '2030-07-07': 300.0,
          '2030-07-11': 200.0,
        },
        remarks: 'Some data is missing',
      },
      {
        title: 'Go Cosmos',
        highlight: null,
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        event_date: '2030-07-20',
        reg_start: '2024-06-19',
        reg_end: '2024-06-22',
        event_price: 1000,
        refundable: true,
        acad_session: [1167],
        grades: [475],
        attachments: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787895_12058_2024_05_27_11_01_35.531278_Screenshot_20230705_151602_01.jpg',
        ],
        pdf: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
        ],
        image: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        ],
        video: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.969321_Screenshot_20230705_151924.jpg',
        ],
        policy: {
          12: '30',
          8: '20',
        },
        approval_status: 4,
        students_count: 0,
        policy_dates: {
          '2030-07-07': 300.0,
          '2030-07-11': 200.0,
        },
      },
      {
        title:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
        highlight: null,
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        event_date: '2030-07-19',
        reg_start: '2024-06-19',
        reg_end: '2024-06-22',
        event_price: 1000,
        refundable: true,
        acad_session: [1167],
        grades: [475],
        attachments: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787895_12058_2024_05_27_11_01_35.531278_Screenshot_20230705_151602_01.jpg',
        ],
        pdf: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
        ],
        image: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        ],
        video: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.969321_Screenshot_20230705_151924.jpg',
        ],
        policy: {
          12: '30',
          8: '20',
        },
        approval_status: 1,
        students_count: 0,
        policy_dates: {
          '2030-07-07': 300.0,
          '2030-07-11': 200.0,
        },
        id: 756,
      },
      {
        title:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
        highlight: null,
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        event_date: '2030-07-19',
        reg_start: '2024-06-19',
        reg_end: '2024-06-22',
        event_price: 1000,
        refundable: true,
        acad_session: [1167],
        grades: [475],
        attachments: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787895_12058_2024_05_27_11_01_35.531278_Screenshot_20230705_151602_01.jpg',
        ],
        pdf: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
        ],
        image: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        ],
        video: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.969321_Screenshot_20230705_151924.jpg',
        ],
        policy: {
          12: '30',
          8: '20',
        },
        approval_status: 1,
        students_count: 0,
        policy_dates: {
          '2030-07-07': 300.0,
          '2030-07-11': 200.0,
        },
        id: 756,
      },
      {
        title:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
        highlight: null,
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        event_date: '2030-07-19',
        reg_start: '2024-06-19',
        reg_end: '2024-06-22',
        event_price: 1000,
        refundable: true,
        acad_session: [1167],
        grades: [475],
        attachments: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787895_12058_2024_05_27_11_01_35.531278_Screenshot_20230705_151602_01.jpg',
        ],
        pdf: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
        ],
        image: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        ],
        video: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.969321_Screenshot_20230705_151924.jpg',
        ],
        policy: {
          12: '30',
          8: '20',
        },
        approval_status: 1,
        students_count: 0,
        policy_dates: {
          '2030-07-07': 300.0,
          '2030-07-11': 200.0,
        },
        id: 756,
      },
      {
        title:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
        highlight: null,
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        event_date: '2030-07-19',
        reg_start: '2024-06-19',
        reg_end: '2024-06-22',
        event_price: 1000,
        refundable: true,
        acad_session: [1167],
        grades: [475],
        attachments: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787895_12058_2024_05_27_11_01_35.531278_Screenshot_20230705_151602_01.jpg',
        ],
        pdf: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
        ],
        image: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        ],
        video: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.969321_Screenshot_20230705_151924.jpg',
        ],
        policy: {
          12: '30',
          8: '20',
        },
        approval_status: 1,
        students_count: 0,
        policy_dates: {
          '2030-07-07': 300.0,
          '2030-07-11': 200.0,
        },
        id: 756,
      },
      {
        title:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
        highlight: null,
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        event_date: '2030-07-19',
        reg_start: '2024-06-19',
        reg_end: '2024-06-22',
        event_price: 1000,
        refundable: true,
        acad_session: [1167],
        grades: [475],
        attachments: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787895_12058_2024_05_27_11_01_35.531278_Screenshot_20230705_151602_01.jpg',
        ],
        pdf: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
        ],
        image: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        ],
        video: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.969321_Screenshot_20230705_151924.jpg',
        ],
        policy: {
          12: '30',
          8: '20',
        },
        approval_status: 1,
        students_count: 0,
        policy_dates: {
          '2030-07-07': 300.0,
          '2030-07-11': 200.0,
        },
        id: 756,
      },
      {
        title:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
        highlight: null,
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        event_date: '2030-07-19',
        reg_start: '2024-06-19',
        reg_end: '2024-06-22',
        event_price: 1000,
        refundable: true,
        acad_session: [1167],
        grades: [475],
        attachments: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787895_12058_2024_05_27_11_01_35.531278_Screenshot_20230705_151602_01.jpg',
        ],
        pdf: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.344057_Screenshot_20230705_151643_01.jpg',
        ],
        image: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787897_12058_2024_05_27_11_01_37.828236_Screenshot_20230705_151911.jpg',
        ],
        video: [
          'https://storage.googleapis.com/erp-academic-stage/dev/events/1716787896_12058_2024_05_27_11_01_36.969321_Screenshot_20230705_151924.jpg',
        ],
        policy: {
          12: '30',
          8: '20',
        },
        approval_status: 1,
        students_count: 0,
        policy_dates: {
          '2030-07-07': 300.0,
          '2030-07-11': 200.0,
        },
        id: 756,
      },
    ],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [selectedTag, setSelectedTag] = useState();
  const [selectedDays, setSelectedDays] = useState();

  const [feedBackModalOpen, setFeedBackModalOpen] = useState(false);
  const [feedBackLoading, setFeedBackLoading] = useState(false);
  const [feedBackFlag, setFeedBackFlag] = useState('');

  const [timeLineDrawerOpen, setTimeLineDrawerOpen] = useState(false);
  const [timelineLoading, setTimeLineLoading] = useState(false);
  const [timeLineData, setTimeLineData] = useState([]);

  const [eventId, setEventId] = useState(null);
  const [eventDrawerOpen, setEventDrawerOpen] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventData, setEventData] = useState([]);

  const [gradeList, setGradeList] = useState([]);
  const [eventHighlights, setEventHighlights] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState(1);
  const [refundPolicy, setRefundPolicy] = useState(2);
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
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const [viewEventModalOpen, setViewEventModalOpen] = useState(false);
  // const [viewEvent, setViewEvent] = useState();

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
  const fetchGradeList = () => {
    const branch_ids = eventForm.getFieldsValue()?.branch_ids;
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.eventsDashboard.gradeListApi}?session_year=${session_year}&branch_id=${branch_ids}`
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
      .finally(() => {
        setLoading(false);
      });
  };
  const createEvent = () => {
    const branch_ids = eventForm.getFieldsValue()?.branch_ids;
    setEventLoading(true);
    axiosInstance
      .post(`${endpoints}academic/event-manage/`)
      .then((response) => {
        if (response?.data?.status_code == 201) {
          notification['success']({
            message: 'Hurray! Event created successfully.',
            duration: notificationDuration,
            className: 'notification-container',
          });
          closeEventDrawer();
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
  const editEvent = () => {};

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
  const handleBranchChange = () => {
    const branch_ids = eventForm.getFieldsValue()?.branch_ids;
    if (branch_ids?.length) {
      if (branch_ids.includes('all')) {
        const allIds = branchList.map((each) => each?.branch?.id);
        eventForm.setFieldsValue({
          branch_ids: allIds,
        });
      }
      fetchGradeList();
    } else {
      eventForm.setFieldsValue({
        branch_ids: [],
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
    setSelectedTag();
    setSelectedDays();
  };
  const openFeedBackModal = ({ key }) => {
    setFeedBackFlag(key);
    setFeedBackModalOpen(true);
  };
  const closeFeedBackModal = () => {
    setFeedBackModalOpen(false);
    setFeedBackFlag('');
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
        subscription: 1,
        refund_policy: 2,
      });
      setEventDrawerOpen(true);
    } else {
      // setform with rowData
      setEventId(rowData?.id);
      setEventDrawerOpen(true);
    }
  };
  const closeEventDrawer = () => {
    setEventDrawerOpen(false);
    setEventData([]);
    eventForm.resetFields();
    setGradeList([]);
    setTimeout(() => {
      setEventId(null);
    }, 1000);
  };
  const openViewEventModal = (row) => {
    setViewEventModalOpen(true);
  };
  const closeViewEventModal = () => {
    setViewEventModalOpen(false);
  };

  const handleReject = () => {};
  const handleSubscriptionStatusChange = (val) => {
    setSubscriptionStatus(val);
  };
  const handleRefundPolicyChange = (val) => {
    if (val === 2) {
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
          className='tag-hover th-br-4'
        >
          <span className='th-black-1 cl-12 shadow'>
            {row?.title.length > 15 ? row?.title.substring(0, 15) + '...' : row?.title}
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
          className='tag-hover th-br-4 shadow'
          icon={<FileExcelOutlined className='cl-12' />}
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
              {/* <EyeOutlined
                onClick={() => openViewEventModal(row)}
                className='icon-hover'
                style={{
                  color: '#007ACC',
                }}
              /> */}
              <Button
                shape='circle'
                size='small'
                icon={<EyeOutlined />}
                onClick={() => openViewEventModal(row)}
                className='icon-hover cl-view shadow'
              />
            </Popover>
            {/* <Popover placement='topRight' title='TimeLine'>
              <RiseOutlined
                onClick={() => openTimeLineDrawer()}
                className='icon-hover'
                style={{
                  color: '#F08080',
                }}
              />
            </Popover> */}
            {row?.approval_status === 1 && (
              <Popover placement='topRight' content='Edit Event'>
                {/* <EditOutlined
                  onClick={() => openEventDrawer({ key: 'edit', rowData: row })}
                  className='icon-hover'
                  style={{
                    color: '#00BCD4',
                  }}
                /> */}
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
                    {/* <CloseCircleOutlined
                      onClick={() => openFeedBackModal({ key: 'cancel' })}
                      className='icon-hover color-cancelled'
                    /> */}
                    <Button
                      shape='circle'
                      size='small'
                      icon={<CloseOutlined />}
                      onClick={() => openFeedBackModal({ key: 'cancel' })}
                      className='icon-hover cl-cancelled shadow'
                    />
                  </Popover>
                )}
                {row?.approval_status === 1 && (
                  <>
                    <Popconfirm
                      placement='bottomRight'
                      title='Are you sure to Approve the Event ?'
                    >
                      <Popover placement='topRight' content='Approve Event'>
                        {/* <CheckCircleOutlined className='icon-hover color-approved' /> */}
                        <Button
                          shape='circle'
                          size='small'
                          icon={<CheckOutlined />}
                          className='icon-hover cl-approved shadow'
                        />
                      </Popover>
                    </Popconfirm>
                    <Popover placement='topRight' content='Reject Event'>
                      {/* <CloseCircleOutlined
                        onClick={() => openFeedBackModal({ key: 'reject' })}
                        className='icon-hover color-rejected'
                      /> */}
                      <Button
                        shape='circle'
                        size='small'
                        icon={<CloseOutlined />}
                        onClick={() => openFeedBackModal({ key: 'reject' })}
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
    <Option
      key={each?.branch?.id}
      value={each?.branch?.id}
      branch_name={each?.branch?.branch_name}
    >
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
        <div className='col-lg-3 col-md-6 col-sm-12 col-12 mb-2'>
          <RangePicker
            format='MM/DD/YYYY'
            className='w-100 text-left th-black-1 th-br-4 shadow'
            allowClear={true}
          />
        </div>
        <div className='col-lg-4 col-md-6 col-sm-12 col-12 d-flex justify-content-around align-items-center'>
          <Button
            size='small'
            className={`custom-tag th-br-4 ${
              selectedDays === 7 ? 'cl-days-active' : 'cl-days'
            }`}
            onClick={() => (selectedDays === 7 ? setSelectedDays() : setSelectedDays(7))}
            icon={<ClockCircleOutlined />}
          >
            7 Days
          </Button>
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
        </div>
        {[1, 2].includes(user_level) ||
          is_superuser ||
          (true && (
            <div className='col-lg-3 col-md-6 col-sm-6 col-6 mb-2'>
              <Select
                mode='multiple'
                maxTagCount={3}
                allowClear
                getPopupContainer={(trigger) => trigger.parentNode}
                showArrow={true}
                suffixIcon={<DownOutlined className='th-grey' />}
                placeholder='Select Branch'
                showSearch
                optionFilterProp='children'
                dropdownMatchSelectWidth={false}
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                className='w-100 text-left th-black-1 th-bg-grey th-br-4 shadow'
              >
                {branchOptions}
              </Select>
            </div>
          ))}
        <div className='d-flex align-items-center col-lg-2 col-md-6 col-sm-6 col-6 mb-2'>
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
              onFinish={handleReject}
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
            <div className='d-flex justify-content-center align-items-center'>
              <Spin tip='Hold on! Great things take time!' size='large' />
            </div>
          ) : (
            <>
              <div className='mt-2'>
                <Form
                  id='eventForm'
                  form={eventForm}
                  onFinish={eventId ? editEvent() : createEvent()}
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
                      name='branch_ids'
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
                      name='event_highlights'
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
                        value={eventHighlights}
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
                      name='event_description'
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
                        format='MM/DD/YYYY'
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
                      name='subscription'
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
                        <Radio className='th-br-4 shadow' value={1}>
                          Yes
                        </Radio>
                        <Radio className='th-br-4 shadow' value={2}>
                          No
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                  {subscriptionStatus === 1 && (
                    <>
                      <div className='col-lg-3 col-md-6 col-sm-6 col-6 mb-2'>
                        <Form.Item
                          name='amount'
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
                          name='refund_policy'
                          label='Refund Policy'
                          rules={[
                            {
                              required: true,
                              message: 'Please Select Refund Policy',
                            },
                          ]}
                        >
                          <Radio.Group
                            name='radiogroup'
                            onChange={(e) => handleRefundPolicyChange(e.target.value)}
                            defaultValue={refundPolicy}
                          >
                            <Radio className='th-br-4 shadow mb-2' value={1}>
                              No Refund will be provided once subscribed
                            </Radio>
                            <Radio className='th-br-4 shadow' value={2}>
                              Refund based on remaining days
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                        {refundPolicy === 2 && (
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
                                          value={each?.days}
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
                                          value={each?.percent}
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
                                          addonBefore='Rs'
                                          disabled
                                          value={each?.amount}
                                          onChange={(e) =>
                                            handleChange(e, index, 'amount')
                                          }
                                        />
                                      </Form.Item>
                                    </div> */}
                                    <div className='col-lg-3 col-md-3 col-sm-2 col-2'>
                                      {/* <CloseCircleOutlined
                                        onClick={() => handleDelete(index)}
                                        className='color-cancelled icon-hover'
                                        style={{
                                          fontSize: 24,
                                          marginTop: 6,
                                          cursor: 'pointer',
                                        }}
                                      /> */}
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
                      name='files'
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
                    {selectedFiles?.length == 0 && <div className='mb-4'> </div>}
                    {selectedFiles?.length > 0 && (
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
                                {/* <DeleteOutlined
                                  className='th-red th-pointer th-20 icon-hover'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFileRemove(index);
                                  }}
                                /> */}
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
                  // <Slider {...settings} className='th-slick th-post-slick'>
                  //   {viewEvent?.attachments?.map((each) => (
                  <MediaDisplay
                    mediaName={viewEvent?.attachments}
                    mediaLinks={viewEvent?.attachments}
                    alt='File Not Supported'
                    className='w-100 th-br-20 p-3'
                    style={{ objectFit: 'contain' }}
                  />
                ) : //   ))}
                // </Slider>
                null}

                {/* {viewEvent?.attachments?.length > 0 && (
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
                )} */}
              </div>
              <div className='col-lg-4 col-md-5 col-sm-12 col-12'>
                <List
                  size='small'
                  className='cl-list shadow'
                  header={<div className='cl-list-header'>Event Details</div>}
                  dataSource={[
                    { title: 'Reg Start Date', content: viewEvent.reg_start },
                    { title: 'Reg End Date', content: viewEvent.reg_end },
                    { title: 'Event Date', content: viewEvent.event_date },
                    { title: 'Amount', content: `Rs. ${viewEvent.event_price}` },
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
    </>
  );
};

export default EventsDashboardAdmin;
