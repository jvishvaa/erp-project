import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { SvgIcon } from '@material-ui/core';

import Grid from '@material-ui/core/Grid';
import './student-homework.css';
import studentHomeworkEvaluted from '../../../assets/images/Group-8288.svg';
import hwFileUnopened from '../../../assets/images/hw-file-unopened.svg';
import hwFileOpened from '../../../assets/images/Group-8243.svg';
import hwFileNotSubmitted from '../../../assets/images/cross.svg';
import hwSubmitted from '../../../assets/images/hw-given.svg';
import Divider from '@material-ui/core/Divider';
import moment from 'moment';
import MobileOptional from './student-homework-mobile-optional-screen';

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

}));

function generate(element) {
    return [0, 1, 2].map((value) =>
        React.cloneElement(element, {
            key: value,
        }),
    );
}


const StudenthomeworkMobileScreen = (props) => {

    const classes = useStyles();
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const [subJson, setSubJson] = React.useState([]);
    const [subJectName, setSubjectName] = React.useState('');
    const [optionalLength, setOptionalLength] = React.useState(null);

    const showSubjectWise = (subName, rowWiseSub) => {
        console.log(subName, rowWiseSub, "subName, rowWiseSub")
        let finalJson = []
        for (let i of rowWiseSub) {
            finalJson.push({
                subject: i[subName],
                date: i['date']
            })
        }
        console.log(finalJson, "00")
        setSubJson(finalJson);

    }

    const setMobileJson = (finalJson) =>{
        setSubJson(finalJson);
    }

    useEffect(() => {
        const handleStatusChange = () => {
            let finalJson = []
            const jsonValue = props.mobileScreenResponse ? props.mobileScreenResponse.rows : null;
            for (let j of jsonValue) {
                setSubjectName(Object.keys(j))
            }
            for (let i of jsonValue) {
                finalJson.push({
                    subject: i[subJectName[1]],
                    date: i['date']
                })
            }
            setSubJson(finalJson);
        }
        handleStatusChange();

    }, [props])

    useEffect(() => {
        const findOptional = () => {
            const options = props.mobileScreenResponse ? props.mobileScreenResponse.header : null;
            const subjects = []
            for (let k of options) {
                // console.log(k, "opo")
                if (k.isOptional === false) {
                    subjects.push(k.subject_slag)


                }
            }
            setOptionalLength(subjects)
           
        }
        findOptional()
    }, [props])

    return (
        <div className="mobile-screen-container">
            <div className="mobile-screen-subject-button">

                {
                    props && props.mobileScreenResponse.header.map((headerName, index) => {
                        return !headerName.isOptional && headerName.subject_slag !== 'date' && headerName.subject_slag !== undefined &&
                            <>  
                                
                                <Button variant="outlined" style={{ marginRight: '10px' }} color="secondary" key={index} onClick={() => showSubjectWise(headerName.subject_slag, props.mobileScreenResponse.rows, index)}>
                                    {headerName.subject_slag}
                                    
                                </Button>
                                </>
                    })
                }
                             <MobileOptional count={optionalLength !== null && optionalLength.length}
                                     
                                        subjectName={props.mobileScreenResponse.header}
                                        subject={props.mobileScreenResponse.rows}
                                        showSubjectWise={setMobileJson}
                                    />

            </div>
            <div className="mobile-screen-content">
                <Grid item xs={12} md={6}>
                    <div className={classes.demo}>
                        <List dense={dense}>
                            {
                                subJson.map((name, index) => {
                                    return (
                                        <div key={index}>
                                            <ListItem >
                                                <ListItemAvatar>
                                                    <div className='day-icon'>
                                                        {moment(name.date).format('dddd').split('')[0]}
                                                    </div>

                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={name.date}
                                                // secondary={secondary ? 'Secondary text' : null}
                                                />

                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" aria-label="delete">
                                                        {
                                                            name.subject && name.subject.isOpened && <SvgIcon
                                                                component={() => (
                                                                    <img
                                                                        style={{ width: '25px', marginRight: '5px' }}
                                                                        src={hwFileOpened}
                                                                        alt='evaluated'
                                                                    />
                                                                )}
                                                            />

                                                        }

                                                        {
                                                            name.subject.isEvaluted && <SvgIcon
                                                                component={() => (
                                                                    <img
                                                                        style={{ width: '25px', marginRight: '5px' }}
                                                                        src={hwSubmitted}
                                                                        alt='evaluated'
                                                                    />
                                                                )}
                                                            />
                                                        }


                                                        {
                                                            name.subject.isSubmited && <SvgIcon
                                                                component={() => (
                                                                    <img
                                                                        style={{ width: '25px', marginRight: '5px' }}
                                                                        src={hwSubmitted}
                                                                        alt='evaluated'
                                                                    />
                                                                )}
                                                            />
                                                        }



                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </div>

                                    )
                                })
                            }

                        </List>
                    </div>
                </Grid>

            </div>
        </div>
    )
}


export default StudenthomeworkMobileScreen;