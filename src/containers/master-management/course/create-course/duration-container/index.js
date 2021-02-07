import React, { useState, useEffect } from 'react';
import {
    TextField,
    Switch,
    FormControlLabel,
    Button
} from '@material-ui/core';
import './duration.css';
import { Add, Remove } from '@material-ui/icons';

const DurationContainer = (props) => {

    const {
        selectedLimit,
        collectData,
        setCollectData,
    } = props;

    const [noOfWeeks, setNoOfWeeks] = useState(null);
    const [toggle, setToggle] = useState(false);
    const [recursiveContent, setRecursiveContent] = useState([
        { weeks: '', price: '' }
    ]);

    useEffect(() => {
        if (selectedLimit) {
            const index=collectData.findIndex(datarow => datarow['limit'] === selectedLimit);
            setNoOfWeeks(collectData[index]['weeks']);
            setToggle(collectData[index]['toggle']);
            setRecursiveContent(collectData[index]['data']);
        }
    }, [selectedLimit]);

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

    const handleSave = () => {
        const list = [...collectData];
        for (let i = 0; i < list.length; i++) {
            if (list[i]['limit'] === selectedLimit) {
                list[i]['weeks'] = noOfWeeks;
                list[i]['toggle'] = toggle;
                list[i]['data'] = recursiveContent;
                break;
            }
        }
        setCollectData(list);
        console.log(collectData);
    };

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
                            <div className="weekContainer">
                            <div className="recursiveWeekContainer">
                                <TextField
                                    size='small'
                                    id={`weeks${index}`}
                                    variant='outlined'
                                    type='number'
                                    name='weeks'
                                    placeholder='Weeks'
                                    value={!toggle ? noOfWeeks : row.weeks}
                                    onChange={e => handleChange(e, index)}
                                    InputProps={{ inputProps: { min:0, autoComplete: 'off', readOnly: !toggle } }}
                                />
                            </div>
                            <div className="weekTag">Weeks:</div>
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
            <div className="buttonContainer">
                <Button onClick={handleSave}>
                    Save
                </Button>
            </div>
        </div>
    )
}

export default DurationContainer;