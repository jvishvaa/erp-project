import React, { useState, useContext } from 'react';
import {
    Button,
    Divider,
    TextField,
    Box,
    Checkbox,
    Slide,
    FormGroup,
    FormControlLabel,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Tabs, Tab, TableRow, FormControl } from '@material-ui/core';
import { TabContext, TabPanel, TabList } from '@material-ui/lab';
import { styled } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import { useEffect } from 'react';
import axiosInstance from 'config/axios';
import { AlertNotificationContext } from '../../.././context-api/alert-context/alert-state';
import endpoints from 'config/endpoints';
import Loader from '../../../components/loader/loader';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='right' ref={ref} {...props} />;
});

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
const Input = styled('input')({
    display: 'none',
});

const CreateCwEditDialoge = (props) => {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('1');
    const { setAlert } = useContext(AlertNotificationContext);
    const [quizData, setQuizData] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState([]);
    const [filesData, setFilesData] = React.useState({});
    const [selectedFiles, setSelectedFiles] = React.useState([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [description, setDescription] = React.useState('');
    const [quizDesc, setQuizDesc] = useState();
    const [editDescription, setEditDescription] = useState(null);
    const [links, setLinks] = useState([]);
    const [newDescription, setNewDescription] = useState("");
    var priodID = props.periodClassWorkId;

    useEffect(() => {
        EditCwView()
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = (e, value) => {
        setSelectedQuiz(value);
    };

    const TopicContentView = () => {
        axiosInstance
            .get(`${endpoints.lessonPlanTabs.topicData}?topic_id=${props?.topicId}`)
            .then((result) => {
                if (result?.data?.status_code === 200) {
                    const filesData = result.data?.result;
                    const filesDataObj = {};
                    filesData.forEach((file) =>
                        file.media_file.forEach((filePath) => (filesDataObj[filePath] = false))
                    );
                    setFilesData(filesDataObj);
                } else {
                    setAlert('error', result?.data?.message);
                }
            })
            .catch((error) => {
                setAlert('error', error?.message);
            });
    };



    const EditCwView = () => {
        axiosInstance
            .get(`${endpoints.lessonPlanTabs.getCwDetails.replace('<period_classowrk_id>', priodID)}`)
            .then((result) => {
                if (result?.data?.status_code === 200) {
                    setEditDescription(result?.data?.result?.discription)
                    setNewDescription(result?.data?.result?.discription)
                    setLinks(result?.data?.result?.classwork_files)
                    setAlert('success', result?.data?.message);

                } else {
                    setAlert('error', "Fetched Class Work");
                }
            })
            .catch((error) => {
                setAlert('error', error?.message);
            });
    };

    const updatecwData = () => {
        axiosInstance
            .put(`${endpoints.lessonPlanTabs.getCwDetails.replace('<period_classowrk_id>', priodID)}`, {
                classwork_files: [...selectedFiles, ...links
                ],
                discription: newDescription
            })
            .then((result) => {
                if (result?.data?.status_code === 200) {

                } else {
                    setAlert('error', result?.message);
                }
            })
            .catch((error) => {
                setAlert('error', error?.message);
            });
    };

    const handleCreteClassworkAPI = (payload) => {
        axiosInstance
            .post(`${endpoints.period.createPeriodAPI}`, payload)
            .then((result) => {
                if (result?.data?.status_code === 201) {
                    setAlert('success', result?.data?.message);
                } else {
                    setAlert('error', result?.data?.message);
                }
                props.onClose();
            })
            .catch((error) => {
                setAlert('error', error?.response.data.developer_msg);
            });
    };

    const handleCreate = () => {
        if (!description) {
            setError(true);
            return;
        }
        if (description || selectedFiles.length) {
            let obj = {
                period_id: props.periodId,
                description: description,
            };
            if (selectedFiles.length) {
                obj['classwork_files'] = selectedFiles;
            }
            handleCreteClassworkAPI(obj);
        }
    };

    const handleAssign = () => {
        if (quizDesc || selectedQuiz) {
            let obj1 = {
                period_id: props.periodId,
                description: quizDesc,
                test_id: selectedQuiz?.id,
            };
            handleCreteClassworkAPI(obj1);
        }
    };

    const handleFileChange = (event) => {
        setFilesData({ ...filesData, [event.target.name]: event.target.checked });
        if (event.target.checked) {
            setSelectedFiles([...selectedFiles, event.target.name]);
        } else {
            const index = selectedFiles.indexOf(event.target.name);
            const data = [...selectedFiles];
            data.splice(index, 1);
            setSelectedFiles(data);
        }
    };

    useEffect(() => {
        if (props?.topicId) {
            TopicContentView();
        }
    }, []);

    return (
        <div>
            {loading && <Loader />}
            <div style={{ marginTop: '10%', marginLeft: '3%', fontSize: '18px' }}>
                <b>Edit Class Work</b>
            </div>
            <div
                style={{ position: 'absolute', top: '74px', right: '59px', cursor: 'pointer' }}
                onClick={props.onClose}
            >
                <CloseIcon />
            </div>
            <Divider />

            <Box lg={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box md={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label='lab API tabs example'>
                            <Tab
                                style={{ minWidth: '50%' }}
                                variant='fullWidth'
                                label='Class Notes'
                                value='1'
                            />
                            {/* <Tab style={{ minWidth: '50%' }} label='Quiz' value='2' /> */}
                        </TabList>
                        <Divider />
                    </Box>
                    <TabPanel value='1' style={{ backgroundColor: '#ede6e6' }}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '90%', borderRadius: '10px' }}>
                                <TextField
                                    style={{
                                        background: 'white',
                                        marginTop: '10px',
                                        marginLeft: '5%',
                                        borderRadius: '10px',
                                    }}
                                    type='text'
                                    fullWidth
                                    // editDescription
                                    value={newDescription}
                                    onChange={(e) => {
                                        setError(false);
                                        // setDescription(e.target.value);
                                        setNewDescription(e.target.value);
                                    }}
                                    multiline
                                    rows={4}
                                    variant='outlined'
                                />
                                {error && (
                                    <p style={{ marginLeft: '5%', color: 'red' }}>
                                        Please fill the description to proceed.
                                    </p>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', marginTop: '10px', marginBottom: '10px' }}>
                            <div style={{ marginTop: '10px', marginLeft: 40 }}>Resources</div>
                        </div>
                        <div
                            style={{
                                height: '16vh',
                                width: '90%',
                                marginLeft: '5%',
                                overflowY: 'scroll',
                                background: 'whitesmoke',
                            }}
                        >
                            <FormControl>
                                <FormGroup>
                                    {Object.keys(filesData).map((file) => (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={filesData[file]}
                                                    onChange={handleFileChange}
                                                    name={file}
                                                />
                                            }
                                            label={file.split('/')[file.split('/').length - 1]}
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>

                        </div>
                        {/* {filesError && <p style={{ marginLeft: '5%', color: 'red' }} >Select files to proceed.</p>} */}
                        <div style={{ display: 'flex', marginTop: '10px', marginBottom: '10px' }}>
                            <div style={{ marginTop: '10px', marginLeft: 40 }}>Selected Resources</div>
                        </div>
                        <div
                            style={{
                                height: '10vh',
                                width: '90%',
                                marginLeft: '5%',
                                overflowY: 'scroll',
                                background: 'whitesmoke',
                            }}
                        >
                            <FormControl>
                                <FormGroup>
                                    {links.map((file) => {
                                        return (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={true}
                                                        // onChange={handleFileChange}
                                                        name={file}
                                                    />
                                                }
                                                label={file.split('/')[file.split('/').length - 1]}
                                            />);
                                    })}
                                </FormGroup>
                            </FormControl>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexFlow: 'row-reverse wrap',
                                marginTop: '1%',
                                marginRight: '5%',
                            }}
                        >
                            <div>
                                <Button
                                    variant='contained'
                                    color='#9E9E9E'
                                    style={{ padding: '5px', width: '250px' }}
                                    // onClick={updatecwData, props.onClose}
                                    onClick={() => {
                                        updatecwData()
                                        props.onClose()
                                    }
                                    }
                                >
                                    Update Class Work
                                </Button>
                            </div>
                        </div>
                    </TabPanel>

                </TabContext>
            </Box>
        </div>
    );
};
export default CreateCwEditDialoge;






// <TabPanel value='2'>
//                         <div style={{ background: 'whitesmoke' }}>
//               {quizData.slice(0, 5).map((item, index) => {
//                 const isItemSelectedId = isSelected(item.id);
//                 return (
//                   <div
//                     style={{ marginTop: '10px', border: '1px solid black', display: 'flex' }}
//                   >
//                     <div>
//                       <Checkbox
//                         onChange={(event) => handleClick(event, item.test_name)}
//                         name={item.test_name}
//                         key={item.id}
//                         selected={isItemSelectedId}
//                       />
//                     </div>
//                     <div style={{ marginTop: '10px' }}>{item.test_name}</div>
//                   </div>
//                 )
//               })}
//             </div>
//                         <Autocomplete
//                             id='quiz'
//                             size='small'
//                             options={quizData || []}
//                             getOptionLabel={(option) => option.test_name}
//                             onChange={handleClick}
//                             style={{ width: 350 }}
//                             renderInput={(params) => (
//                                 <TextField
//                                     className='create__class-textfield'
//                                     {...params}
//                                     variant='outlined'
//                                     label='Assign Quiz'
//                                     placeholder='Assign quiz'
//                                 />
//                             )}
//                         />

//                         <div style={{ marginTop: '10px' }}>
//                             <TextField
//                                 id='description'
//                                 label='Description'
//                                 style={{ background: 'white', marginTop: '10px' }}
//                                 value={quizDesc}
//                                 type='text'
//                                 fullWidth
//                                 onChange={(e) => setQuizDesc(e.target.value)}
//                                 multiline
//                                 rows={4}
//                                 variant='outlined'
//                             />
//                         </div>
//                         <div
//                             style={{
//                                 display: 'flex',
//                                 flexFlow: 'row-reverse wrap',
//                                 marginTop: '3%',
//                                 marginRight: '5%',
//                             }}
//                         >
//                             <div>
//                                 <Button
//                                     variant='contained'
//                                     color='#9E9E9E'
//                                     style={{ padding: '5px', width: '250px' }}
//                                     onClick={handleAssign}
//                                 >
//                                     Assign
//                                 </Button>
//                             </div>
//                             <div>
//                                 <Button
//                                     variant='contained'
//                                     color='primary'
//                                     style={{ padding: '5px', width: '250px', marginLeft: '-5%' }}
//                                     onClick={handleClose}
//                                 >
//                                     Clear
//                                 </Button>
//                             </div>
//                         </div>
//                     </TabPanel>
