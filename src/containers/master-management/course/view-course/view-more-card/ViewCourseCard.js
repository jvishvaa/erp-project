import React, { useContext, useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  SvgIcon,
  Typography,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import '../../create-course/style.css';
import { useHistory, useParams } from 'react-router-dom';
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
import downloadAll from '../../../../../assets/images/downloadAll.svg';

const ViewCourseCard = ({ index, cData, setData }) => {
  const themeContext = useTheme();
  const history = useHistory();
  const { id } = useParams();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [aolCardData, setAolCardData] = useState([]);
  const [state, setState] = useContext(Context);

  const cardData = state.viewPeriodData;


  const FileRow = (props) => {
    const { file, onClose, index } = props;
    return (
      <div className='file_row_image'>
        <div className='file_name_container'>File {index + 1}</div>
      </div>
    );
  };

  const handleBack = () => {
    history.goBack();
  };
  useEffect(() => {
    axiosInstance
      .get(`${endpoints.aol.courseList}?periods=all&course_id=${id}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAolCardData(result.data.result);
        }
      });
  }, [id]);

  const handleDownload = (e) => {
    e.preventDefault();
    aolCardData &&
      aolCardData.map((path) => {
        path.files &&
          path.files.map((file, i) => (window.location.href = `${endpoints.s3}/${file}`));
      });
  };

  // if (id) {
  //   return (
  //     <>
  //       <Layout>
  //         <Grid container spacing={2} style={{ marginLeft: '2rem' }}>
  //           {aolCardData &&
  //             aolCardData?.map((data, index) => (
  //               <div className='courseCardContainer'>
  //                 <Grid item xs={12} style={{ marginBottom: '1rem' }}>
  //                   <Box>
  //                     <div className='periodCrossWrapper'>
  //                       <div className='periodTag'>Period {`${index + 1}`}</div>
  //                     </div>
  //                     <TextField
  //                       id={`title${index}`}
  //                       label='Period Title'
  //                       placeholder='Period Title'
  //                       multiline
  //                       rows='1'
  //                       className='periodDescBox'
  //                       inputProps={{
  //                         readOnly: true,
  //                       }}
  //                       color='secondary'
  //                       style={{ width: '100%' }}
  //                       name='title'
  //                       value={data?.title}
  //                       variant='outlined'
  //                     />
  //                   </Box>
  //                 </Grid>
  //                 <Grid item xs={12}>
  //                   <Box>
  //                     <TextField
  //                       id={`desc${index}`}
  //                       label='Period Description'
  //                       placeholder='Period Description'
  //                       multiline
  //                       rows='3'
  //                       className='periodDescBox'
  //                       inputProps={{
  //                         readOnly: true,
  //                       }}
  //                       color='secondary'
  //                       style={{ width: '100%' }}
  //                       name='description'
  //                       value={data?.description}
  //                       variant='outlined'
  //                     />
  //                   </Box>
  //                 </Grid>
  //                 <Grid item xs={12}>
  //                   <div style={{ display: 'flex', marginLeft: '5px' }}>
  //                     <Typography>No Of Files : {data.files.length} </Typography>
  //                     {data.files.length > 0 ? (
  //                       <IconButton onClick={handleDownload}>
  //                         <SvgIcon
  //                           component={() => (
  //                             <img
  //                               target='blank'
  //                               style={{ height: '21px', width: '21px' }}
  //                               src={downloadAll}
  //                               alt='downloadAll'
  //                             />
  //                           )}
  //                         />
  //                       </IconButton>
  //                     ) : (
  //                       ''
  //                     )}
  //                   </div>
  //                 </Grid>
  //               </div>
  //             ))}
  //         </Grid>
  //         <Button className='periodBackButton2' onClick={handleBack}>
  //           Back
  //         </Button>
  //       </Layout>
  //     </>
  //   );
  // }
  
  return (
    <>
      <Layout>
        <Grid container spacing={5} style={{ marginLeft: '2rem' }}>
          {cardData?.map((data, index) => (
            <div className='courseCardContainer'>
              <Grid item xs={12} style={{ marginBottom: '1rem' }}>
                <Box>
                  <div className='periodCrossWrapper'>
                    <div className='periodTag'>Period {`${index + 1}`}</div>
                  </div>
                  <TextField
                    id={`title${index}`}
                    label='Period Title'
                    placeholder='Period Title'
                    multiline
                    rows='1'
                    inputProps={{
                      readOnly: true,
                    }}
                    className='periodDescBox'
                    color='secondary'
                    style={{ width: '100%' }}
                    name='title'
                    value={data?.title}
                    variant='outlined'
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <TextField
                    id={`desc${index}`}
                    label='Period Description'
                    placeholder='Period Description'
                    multiline
                    rows='3'
                    inputProps={{
                      readOnly: true,
                    }}
                    className='periodDescBox'
                    color='secondary'
                    style={{ width: '100%' }}
                    name='description'
                    value={data?.description}
                    variant='outlined'
                  />
                </Box>
              </Grid>
            </div>
          ))}
        </Grid>
        <Button className='periodBackButton2' onClick={handleBack}>
          Back
        </Button>
      </Layout>
    </>
  );
};

export default ViewCourseCard;
