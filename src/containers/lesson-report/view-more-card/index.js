import React from 'react';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, IconButton, SvgIcon } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import './view-more.css';
import endpoints from '../../../config/endpoints';
import download from '../../../assets/images/download.svg';
import downloadAll from '../../../assets/images/downloadAll.svg';

const ViewMoreCard = ({ viewMoreData, setViewMore, filterDataDown, periodDataForView, bulkDownloadPath }) => {
    const themeContext = useTheme();
    const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
    console.log(periodDataForView,'mmmmmmm',viewMoreData)
    // const {year:{session_year}, grade:{grade_name}, subject:{subject:{subject_name}}, chapter:{chapter_name}, volume:{volume_name}} = filterDataDown;
    return (
        <Paper className="rootViewMore">
            <div className="viewMoreHeader">
                <div className="leftHeader">
                    <div className="headerTitle">
                        {periodDataForView?.first_name}
                    </div>
                    <div className="headerContent">
                        {periodDataForView?.section_name}
                    </div>
                </div>
                <div className="rightHeader">
                    <div className="headerTitle closeIcon">
                        <IconButton
                            onClick={() => setViewMore(false)}
                        >
                            <CloseIcon color='primary' />
                        </IconButton>
                    </div>
                    <div className="headerContent">
                        <div>Last Session Conducted On</div>
                        {/* <div className="viewUpdatedDate">{periodDataForView?.updated_at?.substring(0, 10)}</div> */}
                        <div className="viewUpdatedDate">03-01-2021</div>

                    </div>
                </div>
            </div>
            <div className="resourceBulkDownload">
                <div>Chapter Wise Details</div>

            </div>
            {viewMoreData?.map(p => (
                <div className="viewMoreBody">
                    <div className="bodyTitle">
                      <div>{p?.chapter_name}</div>  
                        <div className='totalPeriod'>Total Period - {p?.no_of_periods}</div>
                    </div>
                  <div className="scrollableContent">
                        {/* {p.media_file.map(file => ( */}
                            <div className="bodyContent">
                                
                               <div>Period Completed</div>
                                <div>
                                    {p.completed_periods}
                                </div> 
                            </div>
                        {/* ))} */}
                    </div> 
                </div>
            ))}


        </Paper>
    );
}

export default ViewMoreCard;
