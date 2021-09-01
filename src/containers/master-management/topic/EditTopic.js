import React, { useContext, useState } from 'react';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { useHistory } from 'react-router-dom';

const EditTopic = ({ topicData, setLoading, handleGoBack }) => {
  //console.log(topicData)
  const history = useHistory();
  const topicUpdateApi = '/topics/';
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const { setAlert } = useContext(AlertNotificationContext);

  const [topicName, setTopicName] = useState(topicData.topic_name || '');
  const [chapterId, setChapterId] = useState(topicData.chapter.id);
  const [topicId, setTopicId] = useState(topicData.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let request = {};
    if (topicName !== topicData.topic_name && topicName !== '') {
      request['topic_name'] = topicName.replace(/\//g, '');
      request['chapter'] = chapterId;
      axiosInstance
        .put(
          `${endpoints.masterManagement.updateTopic}${topicId}${topicUpdateApi}`,
          request
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setTopicName('');
            setLoading(false);
            setAlert('success', result.data.message);
            handleGoBack();
          } else {
            setLoading(false);
            setAlert(
              'error',
              result.data.description ? result.data.description : result.data.message
            );
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
        });
    } else {
      if (topicName === topicData.topic_name) {
        setAlert('error', 'You entered same topic name !');
      } else {
        setAlert('error', 'No Fields to Update!');
      }
      setLoading(false);
    }
  };

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <div style={{ width: '95%', margin: '20px auto' }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <TextField
              id='chname'
              style={{ width: '100%' }}
              label='Topic Name'
              variant='outlined'
              size='small'
              value={topicName}
              inputProps={{ accept: '^[a-zA-Z0-9 +_-]+', maxLength: 100 }}
              //inputProps={{pattern:'^[a-zA-Z0-9]+',maxLength:100}}
              name='chname'
              onChange={(e) => setTopicName(e.target.value)}
              required
            />
          </Grid>
        </Grid>
      </div>

      <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '10px' }}>
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
          <Button
            variant='contained'
            style={{ width: '100%' }}
            className='cancelButton labelColor'
            size='medium'
            onClick={handleGoBack}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
          <Button
            variant='contained'
            style={{ color: 'white', width: '100%' }}
            color='primary'
            size='medium'
            type='submit'
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditTopic;
