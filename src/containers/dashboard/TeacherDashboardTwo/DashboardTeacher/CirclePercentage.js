// import './CirclePercentage.scss';
import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { buildStyles } from 'react-circular-progressbar';

const CirclePercentage = ({ width, height, percent, pathcolor }) => {
  const percentage = Number(percent);
  return (
    <div style={{ width: width, height: height }}>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          pathColor: pathcolor ? pathcolor : '#479ED8',
        })}
      />
    </div>
  );
};
export default CirclePercentage;
