/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import {
  Grid,
  SvgIcon,
 makeStyles,
  Typography,
} from '@material-ui/core';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import Users from '../../../../../assets/images/users.svg';
import axiosInstance from '../../../../../config/axios';
import endpoints from '../../../../../config/endpoints';
import './top-performer-card.css';


const useStyles = makeStyles((theme)=>({
  tooltiptext:theme.toolTipText,
}))


const TopPerformerCard = withRouter(({ history, ...props }) => {
  const classes = useStyles()
  const { subjects } = props || {};
  const { setAlert } = useContext(AlertNotificationContext);
  const [topPerformer, setTopPerformer] = useState([]);
  const [showTopPerformer, setShowTopPerformer] = useState(false);
  const [showTopPerformerIndex, setShowTopPerformerIndex] = useState();

  useEffect(() => {
    localStorage.removeItem('topperformer');
  }, [])

  const getFromLocalStorage = (id) => {
    const topPerformerData = JSON.parse(localStorage.getItem(`topperformer`)) || [];
    let response = '';
    topPerformerData.forEach((element) => {
      if (element[id]) response = element[id];
    })
    return response;
  }

  const setInLocalStorage = (data = [], id) => {
    const topPerformerData = JSON.parse(localStorage.getItem(`topperformer`)) || [];
    const newTopPerformer = {};
    newTopPerformer[id] = data || [];
    localStorage.setItem('topperformer', JSON.stringify([...topPerformerData, newTopPerformer]))
  }

  const handleTopPerformer = async (index, id) => {
    const storedData = getFromLocalStorage(id) || '';
    if (storedData) {
      setTopPerformer(storedData);
      setShowTopPerformer(true);
      setShowTopPerformerIndex(index);
    } else {
      try {
        const result = await axiosInstance.get(
          `${endpoints.homeworkStudent.getTopPerformer}?subject_id=${id}`
        );
        if (result?.data?.status_code === 200) {
          setInLocalStorage(result?.data?.data, id);
          setTopPerformer(result?.data?.data);
          setShowTopPerformer(true);
          setShowTopPerformerIndex(index);
        } else {
          setShowTopPerformer(true);
          setShowTopPerformerIndex(index);
          setAlert('error', result?.data?.message);
        }
      } catch (error) {
        setAlert('error', error?.message);
      }
    }
  };

  const handleTopPerformerRemove = (index) => {
    setShowTopPerformer(false);
    setShowTopPerformerIndex();
    setTopPerformer([]);
  };

  return (
    <>
      <Paper className='top-performer-card'>
        <div className='top-performer-header'>
          <span className='top-performer-tag'>Top performer</span>
        </div>
        {subjects.map((subject, index) => (
          <Typography
            variant='body2'
            className='homework_timeline_card_info top-performer-row'
            component='p'
            key={`top - performer - row${index}`}
          >
            <span className='top-performer-row-index'>{index + 1}.</span>
            <span className='subject_rating_first_letter'>
              {subject.subject_slag ? subject.subject_slag[0] : 'S'}
            </span>{' '}
            <span className='top_performer_rating_subject_name'>
              {subject.subject_slag}
            </span>
            <span
              className='top_performer_icon'
              onClick={() => handleTopPerformer(index, subject.id)}
              onMouseLeave={handleTopPerformerRemove}
            >
              <SvgIcon
                component={() => (
                  <img
                    style={{
                      width: '20px',
                      height: '20px',
                    }}
                    src={Users}
                    alt='submitted'
                  />
                )}
              />
              {(showTopPerformerIndex === index &&
                showTopPerformer &&
                topPerformer.length >= 0) ? (
                <span className={` ${classes.tooltiptext} tooltiptext`}>
                  {topPerformer.map((student, index) => (
                    <div
                      key={`top_performer_student${index}`}
                      className='student_details_info'
                    >
                      {index + 1}. {`${student.first_name} ${student.last_name}`}
                    </div>
                  ))}
                  {topPerformer.length <= 0 && <div className='student_details_info'>No Record Available!</div>}
                </span>
              ) : null}
            </span>
          </Typography>
        ))}
      </Paper>
    </>
  );
});

export default TopPerformerCard;
