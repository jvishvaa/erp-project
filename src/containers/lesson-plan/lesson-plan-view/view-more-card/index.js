import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, IconButton, SvgIcon, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import './view-more.css';
import endpoints from '../../../../config/endpoints';
import download from '../../../../assets/images/download.svg';
import downloadAll from '../../../../assets/images/downloadAll.svg';
import Autocomplete from '@material-ui/lab/Autocomplete';

const ViewMoreCard = ({ viewMoreData, setViewMore, filterDataDown, periodDataForView, bulkDownloadPath }) => {
    const themeContext = useTheme();
    const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
    const [section, setSection] = useState();
    const {
        year: { session_year },
        grade: { grade__grade_name },
        subject: { subject_name },
        chapter: { chapter_name },
        volume: { volume_name }
    } = filterDataDown;

    const handleSection = (event, value) => {
        setSection('')
        if (value) {
            setSection(value);
        }
    }

    const handleComplete = () => {
        console.log('completed');
    }

    return (
        <Paper className="rootViewMore">
            <div className="viewMoreHeader">
                <div className="leftHeader">
                    <div className="headerTitle">
                        {periodDataForView?.period_name}
                    </div>
                    <div className="headerContent">
                        {filterDataDown?.chapter?.chapter_name}
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
                        {/* <div>Last updated on</div>
                        <div className="viewUpdatedDate">{periodDataForView?.updated_at?.substring(0, 10)}</div> */}

                        {/* <Autocomplete
                            style={{ width: '100%' }}
                            size='small'
                            onChange={handleSection}
                            id='section'
                            className="dropdownIcon"
                            value={section}
                            options={chapterDropdown}
                            getOptionLabel={(option) => option?.chapter_name}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant='outlined'
                                    label='Section'
                                    placeholder='Section'
                                />
                            )}
                        /> */}
                    </div>
                </div>
            </div>
            <div className="resourceBulkDownload">
                <div>Resources</div>
                <div className="downloadAllContainer">
                    <div className="downloadAllIcon">
                        <a href={bulkDownloadPath} target="_blank">
                            <SvgIcon
                                component={() => (
                                    <img
                                        style={{ height: '21px', width: '21px' }}
                                        src={downloadAll}
                                        alt='downloadAll'
                                    />
                                )}
                            />
                        </a>
                    </div>
                    <div className="downloadAllText">
                        Download All
                    </div>
                </div>
            </div>

            {viewMoreData?.map(p => (
                <div className="viewMoreBody">
                    <div className="bodyTitle">
                        {p?.document_type}
                    </div>
                    <div className="scrollableContent">
                        {p.media_file.map(file => (
                            <div className="bodyContent">
                                <div>{file}</div>
                                <div>
                                    <a href={`${endpoints.s3}lesson_plan/${file}/`} target="_blank">
                                        <SvgIcon
                                            component={() => (
                                                <img
                                                    style={{ height: '21px', width: '21px' }}
                                                    src={download}
                                                    alt='download'
                                                />
                                            )}
                                        />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <div className="completed_button_view_more">
                <Button
                    variant='contained'
                    style={{ color: 'white' }}
                    color="primary"
                    className="custom_button_master"
                    size='small'
                    onClick={handleComplete}
                >
                    Completed
                </Button>
            </div>
        </Paper>
    );
}

export default ViewMoreCard;