/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useState } from 'react';

import ReactHtmlParser from 'react-html-parser';
import { ContainerContext } from '../../../../Layout';
import endpoints from '../../../../../config/endpoints';

import { AssessmentHandlerContext } from '../../../assess-attemption/assess-attemption-context';

import '../../assess-attemption.css';

const imgSt = {
  border: '1px solid #055888',
  marginBottom: 'none',
  width: '100px',
  height: 'auto',
  margin: 'auto',
  maxHeight: '100px',
  objectFit: 'contain',
  cursor: 'pointer',
};

const MatchFollowingQuestion = (props) => {
  function drawline(p1, p2, lineId) {
    function getAngleBetweenTwoPoints(p1, p2) {
      // https://gist.github.com/conorbuck/2606166
      const angleDeg = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
      return angleDeg;
    }
    function getDistance(p1, p2) {
      const xDistance = p2.x - p1.x;
      const yDistance = p2.y - p1.y;
      return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }
    // eslint-disable-next-line no-param-reassign
    lineId = `line-${lineId}`;
    const line = document.getElementById(lineId)
      ? document.getElementById(lineId)
      : document.createElement('div');
    line.style.width = `${getDistance(p1, p2) - 20}px`;
    line.id = lineId;
    line.className = 'lines';
    line.style.border = `1px solid #DC7C00`;
    line.style.position = 'absolute';
    line.style.left = `${p1.x}px`;
    line.style.top = `${p1.y}px`;
    line.style.transformOrigin = 'top left';
    line.style.transform = `rotate(${getAngleBetweenTwoPoints(p1, p2)}deg)`;
    // line.style.zIndex = 100000;
    if (!document.getElementById(lineId)) {
      document.body.appendChild(line);
    }
  }
  const addWHtoxy = (obj) => {
    const { x, y, height, width } = obj || {};
    return { ...obj, x: x + width / 2, y: y + height / 2 };
  };
  const boundingClientRect = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      const rect = element.getBoundingClientRect();
      const { bottom, height, left, right, top, width, x, y } = rect || {};
      const name = elementId;
      return addWHtoxy({ bottom, height, left, right, top, width, x, y, name });
    }
    return {};
  };
  const removeLines = () => {
    let points = document.getElementsByClassName('lines');
    for (let i = 0; i < points.length; i++) {
      const element = points[i];
      element.style.display = 'none';
      element.parentNode.removeChild(element);
    }
    points = document.getElementsByClassName('lines');
    for (let i = 0; i < points.length; i++) {
      const element = points[i];
      element.style.display = 'none';
      element.parentNode.removeChild(element);
    }
  };
  const drawlinesFromPoints = (linesObj) => {
    removeLines();
    Object.entries(linesObj).forEach(([p1Label, p2Label]) => {
      const p1 = boundingClientRect(p1Label);
      const p2 = boundingClientRect(p2Label);
      drawline(p1, p2, p1.name);
    });
  };

  const { containerRef } = useContext(ContainerContext);

  const {
    controls: { attemptQuestion },
  } = useContext(AssessmentHandlerContext);
  const { questionObj: currentQuestionObj } = props || {};
  const {
    // id: qId,
    question_answer: questionAnswer,
    // user_response: { attemption_status: attemptionStatus } = {},
  } = currentQuestionObj || {};

  const [{ options = [], question, matchingOptions }] =
    questionAnswer && questionAnswer.length
      ? questionAnswer
      : [{ options: [], matchingOptions: [] }];

  const [dragStart, setDragstart] = useState();
  // const [dragEnd, setDragEnd] = useState();

  const [lines, _setLines] = React.useState({});
  const linesRef = React.useRef(lines);
  const setLines = (data) => {
    linesRef.current = data;
    _setLines(data);
  };
  const getLines = () => linesRef.current;
  const updateLines = (startPoint, endPoint) => {
    const tempLines = { ...lines };
    // const lines = { p00: 'p01' };
    /* Delete already existing key, val */
    delete tempLines[startPoint];
    delete tempLines[endPoint];
    Object.entries(tempLines).forEach((keyValArray) => {
      if (keyValArray.includes(startPoint) || keyValArray.includes(endPoint)) {
        const [key] = keyValArray;
        delete tempLines[key];
      }
    });
    tempLines[startPoint] = endPoint;
    setLines({ ...tempLines });
    drawlinesFromPoints({ ...tempLines });
  };
  const handleScroll = () => drawlinesFromPoints(getLines());

  React.useEffect(() => {
    removeLines();
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('resize', handleScroll);
    return () => {
      removeLines();
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', () => drawlinesFromPoints(getLines()));
    };
  }, []);
  const onDragStart = (event) => {
    const rect = event.target.getBoundingClientRect();
    const { bottom, height, left, right, top, width, x, y } = rect || {};
    const { name } = event.target;
    const tempObj = { bottom, height, left, right, top, width, x, y, name };
    setDragstart(tempObj);
  };

  const onDragEnd = (event) => {
    setDragstart(undefined);
    const rect = event.target.getBoundingClientRect();
    const { bottom, height, left, right, top, width, x, y } = rect || {};
    const { name } = event.target;
    const dragEnd = { bottom, height, left, right, top, width, x, y, name };
    /* Add width and height to x y to maintain point center to element */
    // const p1 = addWHtoxy(dragStart);
    // const p2 = addWHtoxy(dragEnd);
    // drawline(p1, p2, dragStart.name);
    updateLines(dragStart.name, dragEnd.name);
  };

  const drawLineWithCursor = (event) => {
    const { x, y, width, height, name: lineId } = dragStart || {};
    const p1 = { x: x + width / 2, y: y + height / 2 };
    const p2 = { x: event.clientX, y: event.clientY };
    if (dragStart) {
      drawline(p1, p2, lineId);
    }
  };

  const noOfRows = options.length === matchingOptions.length ? options.length : 0;
  const dummyRowsArray = new Array(noOfRows).fill('dummy');
  const points = dummyRowsArray.map((row, rowIndex) => {
    const { optionValue: questionValue, images: [quesImgSrc] = [] } =
      options[rowIndex] || {};
    const { images: [ansImgSrc] = [], optionValue: answerValue } =
      matchingOptions[rowIndex] || {};
    const rowArray = [
      {
        name: `p${rowIndex + 1}1`,
        option: options[rowIndex],
        matchingOption: matchingOptions[rowIndex],
        src: endpoints.discussionForum.s3 + quesImgSrc,
        value: questionValue,
      },
      {
        name: `p${rowIndex + 1}2`,
        option: options[rowIndex],
        matchingOption: matchingOptions[rowIndex],
        src: endpoints.discussionForum.s3 + ansImgSrc,
        value: answerValue,
      },
    ];
    return rowArray;
  });
  return (
    <div>
      <div className='mcq-question-wrapper'>
        <h3>{ReactHtmlParser(question)}</h3>
        <div className='match-question-wrapper-'>
          <table
            className='match-t-f-table'
            onMouseMove={drawLineWithCursor}
            name='match-app'
          >
            {points.map((pointObj, pointIndex) => {
              const [questionPointObj, answerPointObj] = pointObj || [];
              // const { images: [quesImgSrc] = [] } = options[rowIndex] || {};
              // const { images: [ansImgSrc] = [] } = matchingOptions[rowIndex] || {};
              return (
                <tr>
                  <td>
                    <span>
                      <img
                        src={questionPointObj.src}
                        alt={questionPointObj.name}
                        id={questionPointObj.name}
                        name={questionPointObj.name}
                        value={questionPointObj.value}
                        className='points'
                        onClick={(event) => {
                          if (!dragStart) {
                            onDragStart(event);
                          }
                          event.stopPropagation();
                        }}
                        style={{
                          ...imgSt,
                          cursor: 'grab',
                          ...(dragStart && dragStart.name === questionPointObj.name
                            ? { border: '5px solid white' }
                            : {}),
                        }}
                      />
                    </span>
                  </td>
                  <td>
                    <span>
                      <img
                        onClick={(event) => {
                          console.log(event.target.value, 'event.target.value');
                          const { name: starPoint } = dragStart || {};
                          if (dragStart && starPoint !== event.target.name) {
                            onDragEnd(event);
                          } else {
                            // onDragStart(event);
                          }
                          event.stopPropagation();
                        }}
                        style={{ ...imgSt, cursor: dragStart ? 'grab' : 'no-drop' }}
                        className={['points', dragStart ? 'grow' : ''].join(' ')}
                        src={answerPointObj.src}
                        alt={answerPointObj.name}
                        id={answerPointObj.name}
                        name={answerPointObj.name}
                        value={answerPointObj.value}
                      />
                    </span>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </div>
  );
};

export default MatchFollowingQuestion;
// const drawLine = (event) => {
//   const {
//     bottom,
//     height,
//     left,
//     right,
//     top,
//     width,
//     x,
//     y,
//   } = event.target.getBoundingClientRect();
//   const rect = { x: x + width / 2, y: y + height / 2 };
//   const line = document.createElement('div');
//   line.style.width = '500px';
//   line.id = 'line';
//   line.style.border = '10px solid red';
//   line.style.position = 'absolute';
//   line.style.transitionDelay = '2s';
//   line.style.left = `${rect.x}px`;
//   line.style.top = `${rect.y}px`;
//   line.style.zIndex = 100000;
//   document.body.appendChild(line);
// };
// React.useEffect(() => {
//   const points = document.getElementsByClassName('points');
//   for (let i = 0; i < points.length; i++) {
//     updateCoordinates(points[i]);
//   }
// }, []);

// const updateCoordinates = (event) => {
/* 
  const coordinates = {
    p00: { name:"p00", x: 1, y: 1, distance: { p00: 0, ...all points distance }, angle: { p00: 0, ...all points angles } },
    p01: { x: 1, y: 1, distance: { p00: 0 }, angle: { p00: 0 } },
    p10: { x: 1, y: 1 },
    p11: { x: 1, y: 1 },
    p20: { x: 1, y: 1 },
    p21: { x: 1, y: 1 },
    p30: { x: 1, y: 1 },
    p31: { x: 1, y: 1 },
  };
  */

//   const { bottom, height, left, right, top, width, x, y } = event.target
//     ? event.target.getBoundingClientRect()
//     : event.getBoundingClientRect();
//   const { name: elementName } = event.target ? event.target : event;
//   const currentPointRect = {
//     name: elementName,
//     bottom,
//     height,
//     left,
//     right,
//     top,
//     width,
//     x,
//     y,
//   };
//   const updatedCoordinatesRect = {
//     ...coordinates,
//     [elementName]: currentPointRect,
//   };

//   const updatedCoordinates = {};
//   Object.values(updatedCoordinatesRect).forEach((refPoint) => {
//     const distanceObj = {};
//     const angleObj = {};
//     Object.values(updatedCoordinatesRect).forEach((point) => {
//       const { name } = point || {};
//       const angleDeg = getAngleBetweenTwoPoints(refPoint, point);
//       const distance = getDistance(refPoint, point);
//       angleObj[name] = angleDeg;
//       distanceObj[name] = distance;
//     });
//     const tempObj = { ...refPoint, distance: distanceObj, angle: angleObj };
//     updatedCoordinates[refPoint.name] = tempObj;
//   });
//   setCoordinates({ ...updatedCoordinates });
// };
