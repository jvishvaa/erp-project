import React, { useState, useEffect } from 'react';
import useStyles from './useStyles';

const JoinLimitContainer = (props) => {
  const { setSelectedLimit } = props;
  const classes = useStyles();
  const [joinLimits, setJoinLimits] = useState([
    { limit: '1:1', isSelected: true },
    { limit: '1:5', isSelected: false },
    { limit: '1:10', isSelected: false },
    { limit: '1:20', isSelected: false },
    { limit: '1:30', isSelected: false },
  ]);
  const handleClickJoinLimit = (index) => {
    const list = [...joinLimits].map((value) =>
      value.isSelected ? { ...value, isSelected: false } : value
    );
    list[index]['isSelected'] = true;
    setJoinLimits(list);
    setSelectedLimit(list[index]['limit']);
  };

  return (
    <div className={classes.joinLimitWrapper}>
      <div className='joinLimitTag'>Join Limit</div>
      <div className='joinLimitContainer'>
        {joinLimits.map((value, index) => (
          <div
            className={value.isSelected ? 'singleJoinLimitSelected' : 'singleJoinLimit'}
            onClick={() => handleClickJoinLimit(index)}
          >
            {value.limit}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinLimitContainer;
