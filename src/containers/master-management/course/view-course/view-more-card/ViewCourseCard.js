import React, { useContext, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  SvgIcon,
  Typography,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
// import { Button, useTheme ,IconButton} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import useStyles from './useStyles';
import endpoints from '../../../../../config/endpoints';
import axiosInstance from '../../../../../config/axios';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import deleteIcon from '../../../../../assets/images/delete.svg';
import attachmenticon from '../../../../../assets/images/attachmenticon.svg';
import Divider from '@material-ui/core/Divider';
import Layout from '../../../../Layout';
import { Context } from '../context/ViewStore';

const ViewCourseCard = ({ index, cData, setData }) => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();
  const [filePath, setFilePath] = useState([]);

  const [cardTitle, setCardTitle] = useState('');
  const [cardDesc, setCardDesc] = useState('');

  const [state, setState] = useContext(Context);

  const cardData = state.viewPeriodData;

  const handleCardSubmit = (e) => {
    const list = [...cData];
    list[index][e.target.name] = e.target.value;
    setData(list);
    // console.log(list,'=====')
  };

  const handleImageChange = (event) => {
    if (filePath.length < 10) {
      const data = event.target.files[0];
      const fd = new FormData();
      fd.append('file', event.target.files[0]);
      const list = [...cData];
      axiosInstance.post(`${endpoints.onlineCourses.fileUpload}`, fd).then((result) => {
        if (result.data.status_code === 200) {
          setFilePath([...filePath, result.data.result]);
          list[index]['files'] = [result.data.result.get_file_path];
          setAlert('success', result.data.message);
        } else {
          setAlert('error', result.data.message);
        }
      });
    } else {
      setAlert('warning', 'Exceed Maximum Number Attachment');
    }
  };

  const removeFileHandler = (i) => {
    // const list = [...filePath];
    filePath.splice(i, 1);
    setAlert('success', 'File successfully deleted');
  };

  const FileRow = (props) => {
    const { file, onClose, index } = props;
    return (
      <div className='file_row_image'>
        <div className='file_name_container'>File {index + 1}</div>
      </div>
    );
  };

  return (
    <>
      <Layout>
       
          {cardData?.map((data, index) => (
            <Paper
              className={classes.root}
              style={
                isMobile ? { margin: '0rem auto' } : { margin: '0rem auto -1.1rem auto' }
              }
            >
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography>{`${index + 1}`}</Typography>
                  <TextField
                    id={`title${index}`}
                    label='Period Title'
                    placeholder='Period Title'
                    multiline
                    rows='1'
                    color='secondary'
                    style={{ width: '100%' }}
                    name='title'
                    // defaultValue="Default Value"
                    value={data?.title}
                    variant='outlined'
                    //   onChange={ handleCardSubmit}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <TextField
                    id={`desc${index}`}
                    label='Period Description'
                    placeholder='Period Description'
                    multiline
                    rows='3'
                    color='secondary'
                    style={{ width: '100%' }}
                    name='description'
                    // defaultValue="Default Value"
                    value={data?.description}
                    variant='outlined'
                    //   onChange={handleCardSubmit}
                  />
                </Box>
              </Grid>
              {/* <div className='attachmentContainer'>
                <div style={{ display: 'flex' }} className='scrollable'>
        
                        <FileRow
                        />
                      
                
                </div>
              </div> */}
            </Paper>
          ))}

      </Layout>
    </>
  );
};

export default ViewCourseCard;
