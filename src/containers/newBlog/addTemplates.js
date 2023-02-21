import React, { useState, useEffect, useContext, useRef } from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import './images.css';
import {
  Breadcrumb,
  Button,
  Select,
  Modal,
  Form,
  Input,
} from 'antd';
import {
  CheckCircleOutlined,
} from '@ant-design/icons';
import { makeStyles } from '@material-ui/core/styles';
import endpoints from '../../config/endpoints';
import './styles.scss';
const useStyles = makeStyles((theme) => ({
  card: {
    marginLeft: '20rem',
    width: '38rem',
    backgroundColor: '#FFFFFF',
  },
  tinymceHeight: {
    height: '298px !important',
  },
  box: {
    width: '38rem',
    height: '20rem',
    backgroundColor: '#EBEEF3',
  },
  internalCard: {
    width: '30rem',
    height: '14rem',
  },
}));
function AddTemplates() {
  const history = useHistory();
  const { Option } = Select;
  const [image, setImage] = useState('');
  const [text, setText] = useState('');
  const [trued, setTrued] = useState(false);
  const [label, setLabel] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [valued, setValued] = useState('');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [fun, setFun] = useState(false);
  const [drawer, showDrawer] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { setAlert } = useContext(AlertNotificationContext);
  const [search, setSearch] = useState('');
  const [searchId, setSeacrhId] = useState(null);
  const [activityCategory, setActivityCategory] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleImage = () => {
    setTrued(true);
    setImage(
      'https://activities-k12.s3.amazonaws.com/dev/olvorchidnaigaon/activity_templates/22/newcakeimage.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQWJOGETZQGELPWVJ%2F20220919%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220919T053241Z&X-Amz-Expires=21600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEiRjBEAiAz2BYd1FmanO0B4b4ddr4BuqgBmKdvbtvPOXeuNWoLfAIgN8QzEyKfhPwc5fSNmTNjvhgxXZqLwtgxzdtCoLx%2FaWQq0AQIPxADGgwwNDc4NzgzODI4MzUiDC7JK%2B13fBWI%2Bsz%2FWSqtBIHXEU7xJCa6HYWm42hBLQqZS%2FPci19y4xDM3%2F4PLTRWh56OYnAnuP0TG75PBxd3aly0Zw29KZXh3hMn4PzOm6oJPWSYddeDFCw01NT5plRO94spvycAx8cypU%2FRhH7ndqMAEoabrWcfEd1EpLKrRoUG3RnoowYegCHSEkM9YxSZDi%2FGg7yvUWMmUjL2tS%2BiymkFlaKBO6xx%2FWtRVFgdvfoDnnqutB%2B7ZNhgTvsLJZeDlyPSrmNE0zzb3CUU2ZJC%2FThKCtgqToAuZDg0EueRPNXI5dsmo1g5JQ4BDUq5MJb3cmspLf5hDKHWZYa8vQwM6YjttZcPOwN38S%2F1t8sUFzMtNmQOPk053MePKwd6ScLztQFT422e8rVx%2Fk6udsHbc46De%2Fd2BLAYk4oSlB5uy%2FVhs1fAXOi9RTl4JEZafjiWTzCw%2B41ZFAsLqJalD9rNfu7HVu3foi6TI%2FlpqnLMmpMgWc8s6kyk%2FwjWYfxbWVqJG0A%2BLM0FxzPLtAcoSesj4LY2lxlMxToNakEb2HInxwMBsuR1YUYXMXjoUta5nwDX%2Bna1u9npY%2BGWWyrRD9yz0OTgeBgObq7ENx8UEgSx%2FJncBhxoF%2F4dhUeakugzZmAsLHyPerj9PIQz7d5at6rtu3OxLBLjvildoqOhaUygiDrsWFmC9%2F2%2Fn71AlEuctwK3Pl25Osh8%2FwkZwKy2QaSmjzBHOCzV1I04UHhXoIT35ekeoMqc16xHfto4vR8TMIP7n5kGOqoBDsS%2F2pcELwSv57toAInTJABLKv1Mly%2BUKUgtlzoHDahvgPhrLpADgGPb8UDaca99mXbr1TFSrUtynyz3UzgDbAiz6zJmxctol7GdnuohgWvt1tZajG1ht%2Fha%2FpaEquhuNoAYBTo0C40BqBO%2FBLmJt1%2FPpBzFX%2B9KHMSugzC2iCwZEPPzLR0S9YqzOtEyX52%2FJ%2FbOBHYEHblbIZVL6VLZl6sCtFHtlA93uVE%3D&X-Amz-Signature=84e6ec33560254c18badcf202979737305a8290a87e2278434e5d8fe4405bc10'
    );
  };
  const handleOpen = () => {
    showDrawer(true);
  };
  const handleClose = () => {
    showDrawer(false);
  };
  const handleTextArea = () => {
    if (!height) {
      setAlert('error', 'Please Add Height');
      return;
    } else if (!width) {
      setAlert('error', 'Please Add Width');
      return;
    } else if (!placeholder) {
      setAlert('error', 'Please Add Placeholder');
      return;
    } else if (!x) {
      setAlert('error', 'Please Add X-Cordinate');
      return;
    } else if (!y) {
      setAlert('error', 'Please Add Y-Cordinate');
      return;
    }
    showDrawer(false);
    setFun(true);
  };
  let heightcor = 'px';
  const submitProcess = () => {
    const formData = new FormData();
    const body = [
      {
        width: width,
        height: height,
        x_cordinate: x,
        y_cordinate: y,
        placeholder: placeholder,
      },
    ];

    formData.append('activity_type_id', searchId);
    formData.append('title', 'template 15sep 18:12pm');
    formData.append('image', selectedFile);
    formData.append(
      'html_file',
      JSON.stringify([
        {
          width: width,
          height: height,
          x_cordinate: x,
          y_cordinate: y,
          placeholder: placeholder,
        },
      ])
    );
    if (formData) {
      setLoading(true);
      axios
        .post(`${endpoints.newBlog.createTemplates}`, formData, {
          headers: {
            // Authorization: `${token}`,
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) => {
          setAlert('success', response?.data?.message);
          history.push('/blog/blogview');
          setLoading(false);
        });
    }
  };
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setFileUrl(URL.createObjectURL(event.target.files[0]));
  };
  const getActivityCategory = () => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.getActivityType}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setActivityCategory(response.data.result);
        setLoading(false);
      });
  };

  useEffect(() => {
    getActivityCategory();
  }, []);

  const handleActiveType = (event, value) => {
    if (value) {
      setSearch(value);
      setSeacrhId(value?.id);
    }
  };

  const submitTheResult = () => {
    setFileUrl(null);
    setSelectedFile(null);
    fileRef.current.value = null;
    setAlert('success', 'Successfull Template Deleted');
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const activityOption = activityCategory.map((each) => {
    return (
      <Option value={each?.name} key={each?.id} name={each.name} sub_type={each.sub_type}>
        {each?.name}
      </Option>
    );
  });

  return (
    <div>
      <Layout>
        <div className='px-3'>
          <div className='row'>
            <div className='col-md-6 pl-2'>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item
                  href='/'
                  className='th-black th-pointer th-16'
                >
                  Activity
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  href=''
                  className='th-black th-pointer th-16'
                >
                  Create Rating
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  href=''
                  className='th-black th-pointer th-16'
                >
                  Add Template
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div className='col-12 mt-5 th-br-5 py-3 th-bg-white'>
            <div className='row'>
              <div className='d-flex col-12 px-0'>
                <div className='col-md-4 mb-sm-0 p-0 m-1'>
                  <Form.Item name='activity type'>
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      placeholder='Activity Type'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      // onChange={(e) => {
                      //   handleActivity(e);
                      // }}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={false}
                    >
                      {activityOption}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-4 mb-sm-0 p-0 m-1'>
                  <Input
                    type='file'
                    inputRef={fileRef}
                    accept='image/x-png,image/gif,image/jpeg,image/jpeg,video/mp4'
                    inputProps={{ accept: '.mp4,.jpeg,.png' }}
                    onChange={onFileChange}
                    // onChange={handleFileChange}
                  />
                </div>
                <div className='col-md-4 md-sm-0 p-0 m-1'>
                  <Button onClick={handleOpen} type='primary' className='ant-btn th-400'>
                    Add Text
                  </Button>
                </div>
              </div>
              <div className='d-flex justify-content-center align-item-center row'>
                <div className='A4-template-cover'>
                  <img
                    src={fileUrl}
                    style={{ width: '502px', minHeight: '683px' }}
                  />
                  {fun == true && (
                    <div
                      style={{
                        position: 'absolute',
                        top: `${x.concat(heightcor)}`,
                        left: `${y.concat(heightcor)}`,
                      }}
                    >
                      <textarea
                        id='w3review'
                        style={{
                          border: 'none',
                          outline: 'none',
                          background: 'rgba(153,172,229,.25)',
                          height: height.concat(heightcor),
                          width: width.concat(heightcor),
                          position: 'absolute',
                          top: x.concat(heightcor),
                          left: y.concat(heightcor),
                        }}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={placeholder}
                        rows='4'
                        cols='30'
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className='d-flex justify-content-center align-item-center row p-0'>
                <div className='col-3 p-0 mt-4'>
                  <Button type="primary" className='w-100 th-400' onClick={submitProcess}>
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Modal
            title='Add Template Text'
            centered
            open={drawer}
            visible={drawer}
            footer={null}
            className='th-upload-modal'
            onOk={() => showDrawer(true)}
            onCancel={handleClose}
            width={1000}
          >
            <div className='d-flex align-item-center row p-2'>
              <div className='col-md-3'>
                <Input
                  placeholder='height'
                  onChange={(e) => setHeight(e.target.value)}
                  className='w-100'
                />
              </div>
              <div className='col-md-3'>
                <Input
                  placeholder='width'
                  onChange={(e) => setWidth(e.target.value)}
                  className='w-100'
                />
              </div>
              <div className='col-md-3'>
                <Input
                  placeholder='placeholder'
                  onChange={(e) => setPlaceholder(e.target.value)}
                  className='w-100'
                />
              </div>
              <div className='col-md-3'>
                <Input
                  placeholder='x-poisition'
                  onChange={(e) => setX(e.target.value)}
                  className='w-100'
                />
              </div>
              <div className='col-md-3 mt-4'>
                <Input
                  placeholder='y-poisition'
                  onChange={(e) => setY(e.target.value)}
                  className='w-100'
                />
              </div>
              <div className='col-md-3 mt-4'>
                <Button
                  icon={<CheckCircleOutlined />}
                  className='w-100 th-400'
                  onClick={handleTextArea}
                >
                  Submit
                </Button>
              </div>

              {/* </div> */}
            </div>
          </Modal>
        </div>
      </Layout>
    </div>
  );
}
export default AddTemplates;