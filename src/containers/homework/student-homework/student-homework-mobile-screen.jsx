import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
//import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { SvgIcon } from '@material-ui/core';

import Grid from '@material-ui/core/Grid';
import './student-homework.css';
import studentHomeworkEvaluted from '../../../assets/images/Group-8288.svg';
import hwFileUnopened from '../../../assets/images/hw-file-unopened.svg';
import hwFileOpened from '../../../assets/images/Group-8243.svg';
//import hwFileNotSubmitted from '../../../assets/images/cross.svg';
import hwSubmitted from '../../../assets/images/hw-given.svg';
import Divider from '@material-ui/core/Divider';
import moment from 'moment';
import MobileOptional from './student-homework-mobile-optional-screen';
import HomeworkTimeline from './components/homework-timeline';
import TopPerformerCard from './components/top-performer-card/top-performer-card';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
 dayicon : theme.dayIcon

}));
/*
function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}
*/
const StudenthomeworkMobileScreen = (props) => {
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  //const [secondary, setSecondary] = React.useState(false);
  const [subJson, setSubJson] = React.useState([]);
  const [subJectName, setSubjectName] = React.useState('');
  const [optionalLength, setOptionalLength] = React.useState(null);

  const showSubjectWise = (subName, rowWiseSub) => {
    let finalJson = [];
    for (let i of rowWiseSub) {
      finalJson.push({
        subject: i[subName],
        date: i['date'],
        subName: subName,
      });
    }
    setSubJson(finalJson);
  };

  const setMobileJson = (finalJson) => {
    setSubJson(finalJson);
  };

  useEffect(() => {
    const handleStatusChange = () => {
      let finalJson = [];
      const jsonValue = props.mobileScreenResponse
        ? props.mobileScreenResponse.rows
        : null;
      for (let j of jsonValue) {
        setSubjectName(Object.keys(j));
      }
      for (let i of jsonValue) {
        finalJson.push({
          subject: i[subJectName[1]],
          date: i['date'],
        });
      }
      setSubJson(finalJson);
    };
    handleStatusChange();
  }, [props]);

  useEffect(() => {
    const findOptional = () => {
      const options = props.mobileScreenResponse
        ? props.mobileScreenResponse.header
        : null;
      const subjects = [];
      for (let k of options) {
        if (k.isOptional === true) {
          subjects.push(k.subject_slag);
        }
      }
      setOptionalLength(subjects);
    };
    findOptional();
  }, [props]);

  return (
    <div className='mobile-screen-container'>
      <div
        className='mobile-screen-subject-button'
        style={{ display: 'flex', justifyContent: 'flex-start' }}
      >
        {props &&
          props.mobileScreenResponse.header.map((headerName, index) => {
            return (
              <div className='mobile-button-without-opt'>
                {!headerName.isOptional &&
                  headerName.subject_slag !== 'date' &&
                  headerName.subject_slag !== undefined && (
                    <div key={index} className='sub-btn'>
                      <Button
                        variant='outlined'
                        className='mb-btn'
                        style={{ marginRight: '10px' }}
                        color='secondary'
                        key={index}
                        onClick={() =>
                          showSubjectWise(
                            headerName.subject_slag,
                            props.mobileScreenResponse.rows,
                            index
                          )
                        }
                      >
                        {headerName.subject_slag}
                      </Button>
                    </div>
                  )}

                <div className='modal-button-popup'>
                  {headerName && headerName.isOptional === true ? (
                    <MobileOptional
                      // count={ headerName.isOptional === true && headerName.subject_slag.length && optionalLength.length}
                      subjectName={props.mobileScreenResponse.header}
                      subject={props.mobileScreenResponse.rows}
                      showSubjectWise={setMobileJson}
                      nameofSubject={
                        headerName.isOptional === true && headerName.subject_slag
                      }
                      options={optionalLength}
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
      </div>
      <div className='mobile-screen-content'>
        <Grid item xs={12} md={6}>
          <div className={classes.demo}>
            <List dense={dense}>
              {subJson.map((name, index) => {
                return (
                  <div key={index}>
                    <ListItem className='mobile-screen-list-item'>
                      <ListItemAvatar>
                        <div className={classes.dayicon}>
                          {moment(name.date).format('dddd').split('')[0]}
                        </div>
                      </ListItemAvatar>
                      <ListItemText
                        className='dates'
                        primary={moment(name.date).format('DD-MM-YYYY')}
                        // secondary={secondary ? 'Secondary text' : null}
                      />

                      <ListItemSecondaryAction>
                        <IconButton edge='end' aria-label='delete'>
                          {name.subject &&
                            name.subject.isOpened === true &&
                            name.subject.isSubmited === true && (
                              <SvgIcon
                                component={() => (
                                  <img
                                    onClick={() => {
                                      props.handleOpenHomework(
                                        name.subject.homeworkId,
                                        name.date,
                                        name.subName,
                                        2
                                      );
                                    }}
                                    style={{ width: '25px', marginRight: '5px' }}
                                    src={hwSubmitted}
                                    alt='evaluated'
                                  />
                                )}
                              />
                            )}
                          {name.subject &&
                            name.subject.isOpened === true &&
                            name.subject &&
                            name.subject.isSubmited === false && (
                              <SvgIcon
                                component={() => (
                                  <img
                                    onClick={() => {
                                      props.handleOpenHomework(
                                        name.subject.homeworkId,
                                        name.date,
                                        name.subName,
                                        1
                                      );
                                    }}
                                    style={{ width: '25px', marginRight: '5px' }}
                                    src={hwFileOpened}
                                    alt='evaluated'
                                  />
                                )}
                              />
                            )}
                          {name.subject && name.subject.isOpened === false && (
                            <SvgIcon
                              component={() => (
                                <img
                                  onClick={() => {
                                    props.handleOpenHomework(
                                      name.subject.homeworkId,
                                      name.date,
                                      name.subName,
                                      1
                                    );
                                  }}
                                  style={{ width: '25px', marginRight: '5px' }}
                                  src={hwFileUnopened}
                                  alt='evaluated'
                                />
                              )}
                            />
                          )}

                          {name.subject &&
                            name.subject.isEvaluted === true &&
                            name.subject.isSubmited && (
                              <SvgIcon
                                component={() => (
                                  <img
                                    onClick={() => {
                                      props.handleOpenHomework(
                                        name.subject.homeworkId,
                                        name.date,
                                        name.subName,
                                        3
                                      );
                                    }}
                                    style={{ width: '25px', marginRight: '5px' }}
                                    src={studentHomeworkEvaluted}
                                    alt='evaluated'
                                  />
                                )}
                              />
                            )}
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant='inset' component='li' />
                  </div>
                );
              })}
            </List>
            <Grid xs={12} lg={3} item style={{ padding: '20px', marginRight: '10px' }}>
              <Grid className='homework_right_wrapper' container>
                <Grid lg={12} className='homework_right_wrapper_items' item>
                  {props &&
                    props.studentHomeworkData.header?.is_hw_ration &&
                    props.homeworkTimelineDisplay && (
                      <HomeworkTimeline
                        setHomeworkTimelineDisplay={props.setHomeworkTimelineDisplay}
                        moduleId={props.moduleId}
                      />
                    )}
                </Grid>
                <Grid lg={12} className='homework_right_wrapper_items' item>
                  {props.studentHomeworkData.header?.is_top_performers && (
                    <TopPerformerCard subjects={props.mendaterySubjects} />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </div>
    </div>
  );
};

export default StudenthomeworkMobileScreen;
