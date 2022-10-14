import React, { useState, useEffect, useContext ,useRef} from 'react';
import Layout from 'containers/Layout';
import { useHistory } from 'react-router';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import './images.css';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ConfirmModal from 'containers/assessment-central/assesment-card/confirm-modal';
import Loader from '../../components/loader/loader';
// import cakeImg from './Images/newcakeimage.jpg';
import {
  Grid,
  Card,
  CardContent,
  Box,
  TextField,
  Breadcrumbs,
  Typography,
  Button,
  Dialog,
  Tooltip,
  MenuItem
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import MyTinyEditor from 'containers/question-bank/create-question/tinymce-editor';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Rating from '@material-ui/lab/Rating';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MessageIcon from '@material-ui/icons/Message';
import { setDate } from 'date-fns/esm';
import endpoints from '../../config/endpoints';
// import Template from './Template';
import Template from './Template';
import './styles.scss';
import moment from 'moment';
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
  const [image, setImage] = useState('');
  // const [maxWidth, setMaxWidth] = useState('lg');
  const [text,setText] = useState('');
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
  const [searchId,setSeacrhId] = useState(null);
  const [activityCategory, setActivityCategory] = useState([]);
  const [openModal,setOpenModal] = useState(false);
  const fileRef = useRef()
  const [loading,setLoading] = useState(false);

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
    if(!height){
      setAlert('error', 'Please Add Height')
      return
    } else if(!width){
      setAlert('error', 'Please Add Width')
      return
    } else if(!placeholder){
      setAlert('error','Please Add Placeholder')
      return
    } else if(!x) {
      setAlert('error','Please Add X-Cordinate')
      return
    }else if(!y){
      setAlert('error', "Please Add Y-Cordinate")
      return
    }
    showDrawer(false);
    setFun(true);
  };
  let heightcor = 'px';
  const submitProcess=() => {
    const formData = new FormData();
    const body=
        [{"width":width, "height":height,"x_cordinate":x,"y_cordinate":y,"placeholder":placeholder}]
        // "image":selectedFile
    
    // formData.append('html_file', [{"width":width, "height":height,"x_cordinate":x,"y_cordinate":y,"placeholder":placeholder}]);
    formData.append('activity_type_id', searchId);
    formData.append('title', 'template 15sep 18:12pm');
    formData.append('image', selectedFile);
    formData.append('html_file', JSON.stringify([{"width":width, "height":height,"x_cordinate":x,"y_cordinate":y,"placeholder":placeholder}]));
    if(formData){
      setLoading(true)
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
          setLoading(false)
        });

    }
  }
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setFileUrl(URL.createObjectURL(event.target.files[0]));
  };
  const getActivityCategory = () => {
    setLoading(true)
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

  const handleActiveType = (event,value) =>{
    if(value){
      setSearch(value)
      setSeacrhId(value?.id)

    }
  }

  const submitTheResult = () => {
    setFileUrl(null);
    setSelectedFile(null);
    fileRef.current.value = null
    setAlert('success','Successfull Template Deleted')
  };


  const handleGoBack = () =>{
    history.goBack()
  }
  return (
    <div>
      {loading && <Loader/>}
    <Layout>
        <div className='layout-container-div ebookscroll'  style={{
        padding:"10px"
      }}>

        <Grid item xs={12} sm={2}>
        <Autocomplete
                size='small'
                limitTags={2}
                onChange={handleActiveType}
                id='create__class-type'
                // options={classTypes}
                options={activityCategory}
                getOptionLabel={(option) => option?.name || ''}
                filterSelectedOptions
                className='dropdownIcon'
                value={search}
                required
                renderInput={(params) => (
                  <TextField
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Activity Type'
                    placeholder='Activity Type'
                    required
                  />
                )}
              />
        </Grid>
        <div
            // style={{
            //   textAlign: 'center',
            //   display: 'flex',
            //   justifyContent: 'center',
            //   marginTop: '7px',
            // }}
          >
            {/* {selectedFile ? (
              <img style={{ height: '85px', width: '158px' }} src={fileUrl} />
            ) : null} */}
            <input
              hidden
              type='file'
              id='upload_video'
              onChange={onFileChange}
              accept='image/*,.pdf,video/*,.docx,audio/*,.csv,.xlsx'
              className='video-file-upload'
              style={{ fontSize: '20px' }}
              ref={fileRef}
            />
            <div
              className='video-file-upload'
              style={{
                marginTop: '24px',
                marginLeft: '23px',
              }}
            >
              <label htmlFor='upload_video'>
                <Tooltip title='Upload'>
                  <CloudUploadIcon />
                </Tooltip>
              </label>
              <label> {selectedFile ? selectedFile.name : 'Select File'}</label>{' '}
              &nbsp;&nbsp;
              <label>
                {selectedFile ? (
                  <Button
                    color='primary'
                    variant='contained'
                    size='small'
                    onClick={() => {
                      setOpenModal(true);
                    }}
                  >
                    Delete
                  </Button>
                ) : null}{' '}
              </label>
            </div>
          </div>
        &nbsp;&nbsp;
        {openModal && (
        <ConfirmModal
          submit={() => submitTheResult()}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
      <div>
        <Button variant='contained' color='primary' onClick={handleOpen}>
          Add Text
        </Button>
        &nbsp;&nbsp;
        <Button variant='contained' color='primary' onClick={handleGoBack}>
          Back
        </Button>
        &nbsp;&nbsp;

      </div>
      </div>
      <div style={{justifyContent:'center', display:'flex '}}>
      <div className='A4-template-cover'>
        <img src={fileUrl} 
        // style={{ width: '210mm', minHeight: '200mm' }}
        style={{ width: '502px', minHeight: '683px' }}

        />
        {fun == true && (
          <div
            style={{
              position: 'absolute',
              // top: `calc(258px + ${x.concat(heightcor)})`,
              // left:`calc(279px + ${y.concat(heightcor)})`,
              // top: `calc(185px + ${x.concat(heightcor)})`,
              // left:`calc(606px + ${y.concat(heightcor)})`,
              top: `${x.concat(heightcor)}`,
              left:`${y.concat(heightcor)}`,
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
                // textAlign: 'center',
                top: x.concat(heightcor),
                left: y.concat(heightcor),
              }}
              onChange={(e)=>setText(e.target.value)}
              placeholder={placeholder}
              rows='4'
              cols='30'
            />
          </div>
        )}
      </div>

      </div>
      <div style={{display:'flex', justifyContent:'center', margin:'15px'}}>
        <Button size='large' onClick={submitProcess} >
              Submit
            </Button>
      </div>
      <Dialog
        open={drawer}
        onClose={handleClose}
        style={{ borderRadius: '10px' }}
      >
        <Typography style={{ marginLeft: '10px' }}>Select Your Position</Typography>
        <Grid style={{width:'100%', padding:'15px'}} spacing={1} container>
          {/* <Grid item>
            <TextField
              variant='outlined'
              label='label'
              type='text'
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </Grid> */}
          <Grid item>
            <TextField
              variant='outlined'
              label='height'
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              variant='outlined'
              label='width'
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              variant='outlined'
              label='placeholder'
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
            />
          </Grid>
          {/* <Grid item>
            <TextField
              variant='outlined'
              label='value'
              value={valued}
              onChange={(e) => setValued(e.target.value)}
            />
          </Grid> */}
          <Grid item>
            <TextField
              variant='outlined'
              label='x-position'
              value={x}
              onChange={(e) => setX(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              variant='outlined'
              label='y-position'
              value={y}
              onChange={(e) => setY(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Button size='large' onClick={handleTextArea}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </Layout>
    </div>
  );
};
export default AddTemplates;