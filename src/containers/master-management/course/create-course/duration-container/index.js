import React, { useState, useEffect } from 'react';
import {
    TextField,
    Switch,
    FormControlLabel,
    IconButton
} from '@material-ui/core';
import './duration.css';
import { Add, Remove } from '@material-ui/icons';

const DurationContainer = ({ clear }) => {
    const [noOfWeeks, setNoOfWeeks] = useState(null);
    const [toggle, setToggle] = useState(false);
    const [recursiveContent, setRecursiveContent] = useState([
        { weeks: '', price: '' }
    ]);

    const handleChange = (e, index) => {
        const list = [...recursiveContent];
        list[index][e.target.name] = e.target.value;
        setRecursiveContent(list);
    };

    const handleAdd = () => {
        const list = [...recursiveContent];
        list.push({ weeks: '', price: '' });
        setRecursiveContent(list);
    };

    const handleRemove = (index) => {
        const list = [...recursiveContent];
        list.splice(index, 1);
        setRecursiveContent(list);
    };

    const handleToggle = () => {
        setRecursiveContent([{ weeks: '', price: '' }]);
        setToggle(!toggle);
    };

    useEffect(() => {
        if (clear) {
            setRecursiveContent([{ weeks: '', price: '' }]);
            setToggle(false);
            setNoOfWeeks(null);
        }
    }, [clear]);

    return (
        <div className="durationWrapper">
            <div className="durationTag">
                Duration
            </div>
            <div className="durationContainer">
                <div className="weeksContainer">
                    <TextField
                        size='small'
                        id='weeks'
                        label='No. of weeks'
                        variant='outlined'
                        className='dropdownIcon'
                        type='number'
                        name='weeks'
                        value={noOfWeeks}
                        onChange={(e) => setNoOfWeeks(e.target.value)}
                        InputProps={{ inputProps: { min: 0, autoComplete: 'off' } }}
                    />
                </div>
                <div className="isRecursiveSwitch">
                    <FormControlLabel
                        className='switchLabel'
                        control={
                            <Switch
                                checked={toggle}
                                onChange={handleToggle}
                                name="optional"
                                color="primary"
                            />}
                        label={toggle ? 'Recurring' : 'Non-Recurring'}
                    />
                </div>
                <div className="recursiveContainer">
                    {recursiveContent.map((row, index) => (
                        <div className="recursiveRow">
                            <div className="addRemoveIconContainer">
                                {index === recursiveContent.length - 1 && toggle &&
                                    <Add className="addRecIcon" onClick={handleAdd} />
                                }
                                {index !== recursiveContent.length - 1 && toggle &&
                                    <Remove className="removeRecIcon" onClick={() => handleRemove(index)} />
                                }
                            </div>
                            <div className="recursiveWeekContainer">
                                <TextField
                                    size='small'
                                    id={`weeks${index}`}
                                    variant='outlined'
                                    name='weeks'
                                    placeholder='Weeks'
                                    value={!toggle ? noOfWeeks : row.weeks}
                                    onChange={e => handleChange(e, index)}
                                    InputProps={{ inputProps: { autoComplete: 'off', readOnly: !toggle } }}
                                />
                            </div>
                            <div className="recursivePriceContainer">
                                <TextField
                                    size='small'
                                    id={`price${index}`}
                                    variant='outlined'
                                    name='price'
                                    placeholder='Price'
                                    value={row.price}
                                    onChange={e => handleChange(e, index)}
                                    InputProps={{ inputProps: { autoComplete: 'off' } }}
                                />
                            </div>
                        </div>))}
                </div>
            </div>
        </div>
    )
}

export default DurationContainer;