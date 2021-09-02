import React from 'react';
import '../assess-attemption.css';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme)=>({
  mcqOptions:{
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '5px',
    background: theme.palette.primary.primarylightest,
    padding: '10px',
    width: '100%',
    textAlign: 'center',
    justifyContent: 'space-between',
    /* max-width: 400px, */
    cursor: 'pointer',
    marginBottom: '10px',
  },
  questionsubmitbtn:{
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: '5px',
    background: theme.palette.secondary.main,
    padding: '10px',
    width: '100%',
    textAlign: 'center',
    maxWidth: '400px',
    cursor: 'pointer',
    color: '#fff',
    marginTop: '20px',
  }
}))
const ComprehensionQuestion = () => {
  const classes = useStyles()
  return (
    <div>
      <div className='question-header'>
        Description specific to this test to be followed by all appearing students/pupils
        / attendees (Write if req. else leave empty)
      </div>
      <div className='question-numbers'>
        <div>Q1</div>
        <div>Progress - 1/20</div>
      </div>
      <div className='mcq-question-wrapper'>
        <h3>Look at the picture and choose the following options</h3>
        <img src='https://via.placeholder.com/150' alt='question image' />
        <div className={classes.mcqOptions}>True</div>
        <div className={classes.mcqOptions}>False</div>
        <div className={classes.questionsubmitbtn}>Next</div>
      </div>
    </div>
  );
};

export default ComprehensionQuestion;
