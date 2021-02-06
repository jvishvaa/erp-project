import React, { useState } from 'react'
import './join-limit.css';

const JoinLimitContainer = (props) => {

    const { clear, setClear } = props;

    const [joinLimits, setJoinLimits] = useState([
        { limit: '1:1', isSelected: true },
        { limit: '1:5', isSelected: false },
        { limit: '1:10', isSelected: false },
        { limit: '1:20', isSelected: false },
        { limit: '1:30', isSelected: false },
    ]);

    const handleClickJoinLimit = (index) => {
        const list = [...joinLimits].map(value => value.isSelected ? { ...value, isSelected: false } : value)
        list[index]['isSelected'] = true;
        setJoinLimits(list);
        setClear(!clear);
    };

    return (
        <div className="joinLimitWrapper">
            <div className="joinLimitTag">Join Limit</div>
            <div className="joinLimitContainer">
                {joinLimits.map((value, index) => (
                    <div className={value.isSelected ? "singleJoinLimitSelected" : "singleJoinLimit"} onClick={() => handleClickJoinLimit(index)}>{value.limit}</div>
                ))}
            </div>
        </div>
    )
}

export default JoinLimitContainer;