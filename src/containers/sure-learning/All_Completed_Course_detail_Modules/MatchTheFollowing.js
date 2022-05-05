/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import styles from './TrainingUnit.style';
// import { useAlert } from '../../hoc/alert/alert';

function MatchTheFollowing({
  classes,
  receivedArray,
  totalArray,
  stepIndex,
  propFunc,
  totalQuestionArray,
  activeStepId,
}) {
  //   const [disableBox, setDisableBox] = useState(false);
  // const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));
  // const alert = useAlert();

  // const pDrag = e => {
  //   e.stopPropagation();
  // };

  const drag = (e) => {
    e.dataTransfer.setData('text', e.target.id);
    // console.log(`${e.target.id} Drag func`);

    // setTimeout(() => {
    //   e.target.style.display = "none";
    // }, 0);
  };

  const mainreceivedArray = receivedArray;
  const newReceivedArray = [...receivedArray];

  function shuffle(arra1) {
    let ctr = arra1.length;
    let temp;
    let index;

    // While there are elements in the array
    while (ctr > 0) {
      // Pick a random index
      index = Math.floor(Math.random() * ctr);
      // Decrease ctr by 1
      ctr -= 1;
      // And swap the last element with it
      temp = arra1[ctr];
      // eslint-disable-next-line no-param-reassign
      arra1[ctr] = arra1[index];
      // eslint-disable-next-line no-param-reassign
      arra1[index] = temp;
    }
    return arra1;
  }
  shuffle(newReceivedArray);

  const submitMtf = (e, stepIndexData) => {
    e.preventDefault();
    const totalLength = receivedArray.length;
    const answerArray = [];
    for (let i = 0; i < totalLength; i += 1) {
      // console.log(`answerBox${i}${stepIndexData}`);
      const answers = document.getElementById(`answerBox${i}${stepIndexData}`)
        .lastChild.innerHTML;
      // console.log(answers);
      answerArray.push(answers);
    }
    // console.log(answerArray);
    const attempted = answerArray.length === answerArray.filter((item) => item === 'error').length;
    let marks = 0;
    for (let i = 0; i < totalLength; i += 1) {
      if (receivedArray[i].answer === answerArray[i]) {
        marks += 1;
      }
    }
    // console.log(marks);
    // alert.success(marks);
    propFunc(totalQuestionArray, activeStepId, totalArray, marks, stepIndexData, attempted);
    return answerArray;
  };

  const drop = (e, index, stepIndexId) => {
    e.preventDefault();

    const mainBox = document.getElementById(`answerBox${index}${stepIndexId}`)
      .childElementCount;
    // console.log(innerBox);
    // console.log(mainBox);

    if (mainBox < 2) {
      const data = e.dataTransfer.getData('text');
      e.target.appendChild(document.getElementById(data));
      // console.log('Hii');
    } else {
      const innerBox = document.getElementById(`answerBox${index}${stepIndexId}`)
        .childNodes[1].childElementCount;
      if (innerBox !== 0) {
        const data = e.dataTransfer.getData('text');
        e.target.appendChild(document.getElementById(data));
      }
    }

    // child = temp.children;
    // console.log(child.length);
    // console.log(temp.childElementCount);
    // console.log(`${e.target.id} Drop func`);

    // document.getElementById(e.target.id).innerHTML = data;
    // e.dataTransfer.clearData();
  };

  const handleDragChange = (e) => {
    // eslint-disable-next-line no-console
    console.log(e.target.value);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  return (
    <div id={stepIndex + 350}>
      {/* <h1 style={{ textAlign: 'center' }}>Match the Following</h1> */}
      <div className={classes.mtfDiv} id={stepIndex + 186}>
        <div id={stepIndex + 100}>
          {mainreceivedArray.map((item, index) => (
            <div
              className={classes.mtfRow}
              key={
                Math.floor(Math.random() * 100)
                + index
                + stepIndex
                + Math.floor(Math.random() * 1000)
              }
            >
              <div
                style={{
                  border: '1px solid black',
                  textAlign: 'center',
                  width: '100%',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.question}
              </div>
            </div>
          ))}
        </div>
        <div id={stepIndex + 200}>
          {mainreceivedArray.map((item, index) => (
            <div
              className={classes.mtfRow}
              key={
                Math.floor(Math.random() * 100)
                + index
                + stepIndex
                + Math.floor(Math.random() * 1000)
              }
              // key={new Date().getTime()}
              style={{
                border: '1px solid green',
                width: '100%',
                textAlign: 'center',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onDrop={(e) => drop(e, index, stepIndex)}
              onDragOver={allowDrop}
              id={`answerBox${index}${stepIndex}`}
            >
              <p
                id={`noDisplay${index}${stepIndex}`}
                style={{ display: 'none' }}
              >
                error
              </p>
            </div>
          ))}
        </div>
        <div id={stepIndex + 300}>
          {newReceivedArray.map((item, index) => (
            <div
              className={classes.mtfRow}
              key={
                Math.floor(Math.random() * 100)
                + index
                + stepIndex
                + Math.floor(Math.random() * 1000)
              }
              draggable="true"
              style={{
                border: '1px solid red',
                width: '100%',
                textAlign: 'center',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              id={`jumbledBox${index}${stepIndex}`}
              onDrop={(e) => drop(e, index, stepIndex)}
              onDragOver={allowDrop}
            >
              <p
                draggable="true"
                onDragStart={drag}
                // onDragOver={pDrag}
                id={`drag${index}${stepIndex}`}
                onChange={handleDragChange}
                style={{
                  margin: 0,
                  cursor: 'pointer',
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {item.answer}
              </p>
            </div>
          ))}
        </div>
        {/* <div>Correct Answers : </div> */}
        <div />
        <button
          type="submit"
          style={{
            margin: '0 0 0 auto',
            padding: '0.7rem 0',
            width: '50%',
            display: 'block',
            border: '1px solid transparent',
            borderRadius: '5px',
            backgroundColor: '#4054b5',
            color: 'white',
            fontWeight: 'bold',
          }}
          // disabled={auth && auth.personal_info && auth.personal_info.role !== 'Teacher'}
          onClick={(e) => submitMtf(e, stepIndex)}
        >
          {activeStepId === totalQuestionArray.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}

MatchTheFollowing.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  receivedArray: PropTypes.instanceOf(Object).isRequired,
  totalArray: PropTypes.instanceOf(Object).isRequired,
  stepIndex: PropTypes.number.isRequired,
  propFunc: PropTypes.func.isRequired,
  totalQuestionArray: PropTypes.instanceOf(Object).isRequired,
  activeStepId: PropTypes.number.isRequired,
};

export default withStyles(styles)(MatchTheFollowing);
