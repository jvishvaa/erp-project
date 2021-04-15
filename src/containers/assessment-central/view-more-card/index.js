import React, {useContext, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import axiosInstance from '../../../config/axios';
import { useTheme, IconButton, SvgIcon } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
// import './view-more.css';
import endpoints from '../../../config/endpoints';
// import download from '../../../../assets/images/download.svg';
// import downloadAll from '../../../../assets/images/downloadAll.svg';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import {Context} from '../Store';
import { fetchRoleDataById } from '../../../redux/actions';

const ViewMoreCard = ({ viewMoreData, setViewMore, filterDataDown, periodDataForView,  setSelectedIndex }) => {
    // const { year: { session_year }, grade: { grade_name }, subject: { subject: { subject_name } }, chapter: { chapter_name }, volume: { volume_name } } = filterDataDown;
    // const { setAlert } = useContext(AlertNotificationContext);

    // const [queName,setQueName] = useState(viewMoreData.parent)
    // const [queAnsDetails,setQueAnsDetails] = useState(viewMoreData.child.map(d=>d.question_answer))

    const [data,setData]= useContext(Context)
    
        // let q=data.questions.map(p=>p.topic)
    // let mappingData = queAnsDetails[1].map(p=>p.question)
    return (
        <Paper className="rootViewMore">
            <div className="viewMoreHeader">
                <div className="leftHeader">
                    <div className="headerTitle">
                        {/* QUESTION:{data.questions[0].topic_name} */}
                    </div>
                    <div className="headerContent">
                        {/* {filterDataDown?.chapter?.chapter_name} */}
                    </div>
                </div>
                <div className="rightHeader">
                    <div className="headerTitle closeIcon">
                        <IconButton
                            // onClick={() => {
                            //     setViewMore(false);
                            //     setSelectedIndex(-1);
                            // }}
                        >
                            <CloseIcon color='primary' />
                        </IconButton>
                    </div>
                    <div className="headerContent">
                        {/* <div>Last updated on</div> */}
                        {/* <div className="viewUpdatedDate">{periodDataForView?.updated_at?.substring(0, 10)}</div> */}
                    </div>
                </div>
            </div>
            {/* <div className="resourceBulkDownload">
                <div>Resources</div>
                <div className="downloadAllContainer">
                    <div className="downloadAllIcon">
                        <IconButton  className="bulkDownloadIconViewMore">
                            <SvgIcon
                                component={() => (
                                    <img
                                        style={{ height: '21px', width: '21px' }}
                                        src={downloadAll}
                                        alt='downloadAll'
                                    />
                                )}
                            />
                        </IconButton>
                    </div>
                    <div className="downloadAllText">
                        Download All
                    </div>
                </div>
            </div> */}

            {/* {queAnsDetails[1]?.map(p => (
                <div className="viewMoreBody">
                    <div className="bodyTitle">
                        <div>{p?.chapter_name}</div>  
                        <div className='totalPeriod'>Question-{p?.question}</div>
                    </div>
                  <div className="scrollableContent">
                            <div className="">    
                               <div>Answer-</div>
                                <div>
                                    {p?.answer}
                                </div> 
                            </div>
                    </div> 
                </div>
            ))} */}
        </Paper>
    );
}

export default ViewMoreCard;