import React, { useContext, useState, useEffect, useRef, createRef } from 'react';
import { Avatar, Badge, Drawer, Input, Tooltip } from 'antd';
import moment from 'moment';
import { groupBy } from 'lodash';
import {
  PlusOutlined,
  CheckSquareOutlined,
  CheckOutlined,
  EditOutlined,
  CalendarOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import HomeworkAssigned from 'v2/Assets/images/hwassign.png';
import HomeworkSubmit from 'v2/Assets/images/hwsubmit.png';
import HomeworkEvaluate from 'v2/Assets/images/task.png';
// import './styles.scss';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

const { Search } = Input;

const TimeTableNewUI = withRouter(() => {
  const [eachSub, setEachSub] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [submitData, setSubmitData] = useState();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [periods, setPeriods] = [
    [
      {
        _id: '65408ed2c3b8718cdc9bfb62',
        index: 0,
        guid: '83de29df-8381-47f2-b5e7-4a0a27bc972d',
        isActive: false,
        latitude: 11.008847,
        longitude: 24.195295,
        subject: [
          {
            id: 0,
            name: 'Lucinda Craig',
          },
          {
            id: 1,
            name: 'Bradshaw Boone',
          },
          {
            id: 2,
            name: 'Flora Mejia',
          },
          {
            id: 3,
            name: 'Blevins Hood',
          },
          {
            id: 4,
            name: 'Rachael Humphrey',
          },
          {
            id: 5,
            name: 'Roxanne Ford',
          },
          {
            id: 6,
            name: 'Johns Morse',
          },
        ],
      },
      {
        _id: '65408ed2a1ae1a9e26d15995',
        index: 1,
        guid: '0d39e12b-e944-47db-981b-fcbe947e84e3',
        isActive: true,
        latitude: -75.282228,
        longitude: 47.897199,
        subject: [
          {
            id: 0,
            name: 'Gilmore Guthrie',
          },
          {
            id: 1,
            name: 'Claudette Hicks',
          },
          {
            id: 2,
            name: 'Mayra Ochoa',
          },
          {
            id: 3,
            name: 'Gibbs Chen',
          },
          {
            id: 4,
            name: 'Emilia Richard',
          },
          {
            id: 5,
            name: 'Faye Winters',
          },
          {
            id: 6,
            name: 'Kathy Love',
          },
        ],
      },
      {
        _id: '65408ed29f5632da7db02653',
        index: 2,
        guid: '8ed279b6-22eb-4385-9aa5-d00e76b611fe',
        isActive: true,
        latitude: 55.690417,
        longitude: -78.797931,
        subject: [
          {
            id: 0,
            name: 'Marian Ramsey',
          },
          {
            id: 1,
            name: 'Owens Monroe',
          },
          {
            id: 2,
            name: 'Erickson Rose',
          },
          {
            id: 3,
            name: 'Cathy Joyner',
          },
          {
            id: 4,
            name: 'Kathryn Fuller',
          },
          {
            id: 5,
            name: 'Holly Hooper',
          },
          {
            id: 6,
            name: 'Sellers Mann',
          },
        ],
      },
      {
        _id: '65408ed2cd6ba55499c03126',
        index: 3,
        guid: 'b4003d46-0971-4ef2-8c47-aa2085836002',
        isActive: false,
        latitude: -79.702548,
        longitude: -177.465541,
        subject: [
          {
            id: 0,
            name: 'King Howard',
          },
          {
            id: 1,
            name: 'Etta Madden',
          },
          {
            id: 2,
            name: 'Mcdonald Medina',
          },
          {
            id: 3,
            name: 'Imogene Greer',
          },
          {
            id: 4,
            name: 'Darla Flowers',
          },
          {
            id: 5,
            name: 'Roxie Holden',
          },
          {
            id: 6,
            name: 'Jolene Mcconnell',
          },
        ],
      },
      {
        _id: '65408ed2c7af15f902202397',
        index: 4,
        guid: '3b4f38ca-bdcd-46cb-8764-070a29b09f7e',
        isActive: true,
        latitude: -23.872987,
        longitude: 64.03289,
        subject: [
          {
            id: 0,
            name: 'Hobbs Watkins',
          },
          {
            id: 1,
            name: 'Espinoza Mullins',
          },
          {
            id: 2,
            name: 'Bernice Pruitt',
          },
          {
            id: 3,
            name: 'Holland Velez',
          },
          {
            id: 4,
            name: 'Deena Clay',
          },
          {
            id: 5,
            name: 'Shelia Underwood',
          },
          {
            id: 6,
            name: 'Moss Clayton',
          },
        ],
      },
      {
        _id: '65408ed20ce76006809b7af4',
        index: 5,
        guid: '5cb8681d-40be-4112-ae1c-75aac90d1524',
        isActive: false,
        latitude: -5.719563,
        longitude: 120.1714,
        subject: [
          {
            id: 0,
            name: 'Elizabeth Holman',
          },
          {
            id: 1,
            name: 'Tonya Bray',
          },
          {
            id: 2,
            name: 'Elsie Torres',
          },
          {
            id: 3,
            name: 'Augusta Cooper',
          },
          {
            id: 4,
            name: 'Helena Delacruz',
          },
          {
            id: 5,
            name: 'Bright Hays',
          },
          {
            id: 6,
            name: 'Jo Norman',
          },
        ],
      },
      {
        _id: '65408ed221e3dfd992eda396',
        index: 6,
        guid: '8b7f132e-908a-4e49-89d9-ea225e01e9cb',
        isActive: false,
        latitude: 77.072719,
        longitude: -92.561508,
        subject: [
          {
            id: 0,
            name: 'Allen Britt',
          },
          {
            id: 1,
            name: 'Jeannie Riggs',
          },
          {
            id: 2,
            name: 'Schmidt Little',
          },
          {
            id: 3,
            name: 'Ladonna Weaver',
          },
          {
            id: 4,
            name: 'Saunders Munoz',
          },
          {
            id: 5,
            name: 'Therese Ramos',
          },
          {
            id: 6,
            name: 'Elisa Potter',
          },
        ],
      },
    ],
  ];

  const [days, setDays] = [
    [
      {
        index: 1,
        name: 'Monday ',
      },
      {
        index: 2,
        name: 'Tuesday ',
      },
      {
        index: 3,
        name: 'Wednesday ',
      },
      {
        index: 4,
        name: 'Thursday ',
      },
      {
        index: 5,
        name: 'Friday ',
      },
      {
        index: 6,
        name: 'Saturday ',
      },
      {
        index: 7,
        name: 'Sunday ',
      },
    ],
  ];

  return (
    <>
      <div className='tablewrap'>
        <table style={{ minHeight: '50vh' }} className='tableCon'>
          <thead>
            <tr
              className='headerarea '
              style={{ backgroundColor: '#D9D9D9', borderRadius: '10px 10px 0px 0px' }}
            >
              <th
                className='fixedcol tableH'
                style={{ verticalAlign: 'middle', borderRadius: '10px 0px 0px 0px' }}
              >
                <div className='th-14 th-fw-600 '>Periods</div>
              </th>
              {days?.length > 0 &&
                days?.map((item, index) => (
                  <th
                    className=''
                    style={{
                      padding: '15px 5px',
                      borderRadius: index == days?.length - 1 ? '0px 10px 0px 0px' : null,
                    }}
                  >
                    <div
                      style={{
                        // background: '#91A7CC',
                        margin: '2px',
                        borderRadius: '5px',
                        // color: 'white',
                      }}
                    >
                      <div className='d-flex justify-content-center'>{item?.name}</div>
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {periods?.map((item) => (
              <tr className='tableR' style={{ borderTop: 0 }}>
                {item?.longitude ? (
                  <>
                    <td
                      className='fixedcol tableD'
                      style={{ textAlign: 'center', verticalAlign: 'middle' }}
                    >
                      <div
                        className='card w-100 d-flex justify-content-center p-2'
                        style={{ height: '100px', background: '#D9D9D9' }}
                      >
                        <div>
                          <span>{item?.longitude}</span>
                        </div>
                      </div>
                    </td>
                    {item?.subject?.map((each) => (
                      <td className='tableD'>
                        <div
                          className='card w-100 d-flex justify-content-center p-2'
                          style={{ height: '100px', background: '#D9D9D9' }}
                        >
                          <div>
                            <span>{each?.name}</span>
                          </div>
                        </div>
                      </td>
                    ))}
                  </>
                ) : (
                  ''
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

export default connect()(TimeTableNewUI);
