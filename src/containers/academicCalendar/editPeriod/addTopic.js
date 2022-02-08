import React, { useEffect, useState, useContext } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, Grid, Box } from '@material-ui/core';
import './academicStyles.scss';
import Card from './card';
import axios from 'axios';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../.././context-api/alert-context/alert-state';
import apiRequest from '../../../config/apiRequest'
import endpoints from '../../../config/endpoints'

export default function AddTopic({ setPeriodUI, periodId, uniqueIdd, setUniqueIdd, setAssignedTopic }) {
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [volumesList, setVolumesList] = useState([]);
  const [chaptersList, setChaptersList] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [isCard, setCardCalled] = useState(false);

  useEffect(() => {
    fetchVolumes();
  }, [selectedVolume]);

  useEffect(() => {
    if (selectedVolume) {
      fetchChaptersList();
    }
  }, [selectedVolume,selectedChapter]);

  const fetchVolumes = () => {
    axios
      .get(endpoints.period.retrieveVolumeDetails, {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setSelectedChapter('');
          const topicList = result.data?.result?.results;
          setVolumesList(topicList);
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  };
  const fetchChaptersList = () => {
    axiosInstance
      .get(
        `/period/${periodId}/chapters-list/?volume=${selectedVolume.id}`
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          const lists = result.data?.result?.chapter_list;
          setChaptersList(lists);
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  };

  const handleChapter = (value) => {
    setSelectedChapter(value);
    setCardCalled(true);
  };
  return (
    <>
      <div className='addtopicWrapper'>
        <div className='addTopicTitle'>Add Topic</div>
        <Box p={1} style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Autocomplete
            id='combo-box-demo'
            onChange={(event, value) => {
              setSelectedVolume(value);
            }}
            value={selectedVolume?.volume_name}
            options={volumesList}
            getOptionLabel={(option) => option?.volume_name}
            style={{ width: 200, margin: '0 9%' }}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Volume'
                variant='outlined'
                size='small'
                style={{ background: '#fff', borderRadius: '10px' }}
              />
            )}
          />
          <Autocomplete
            id='combo-box-demo'
            options={chaptersList}
            value={selectedChapter?.chapter_name}
            getOptionLabel={(option) => option.chapter_name}
            style={{ width: 350 }}
            onChange={(event, value) => handleChapter(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Subject'
                variant='outlined'
                size='small'
                style={{ background: '#fff', borderRadius: '10px' }}
              />
            )}
          />
        </Box>
      </div>
      {isCard && <Card setPeriodUI={setPeriodUI} chapterId={isCard} periodId={periodId} selectedChapter={selectedChapter} setAssignedTopic={setAssignedTopic} uniqueIdd={uniqueIdd}
        setUniqueIdd={setUniqueIdd} />}
    </>
  );
}
