import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Grid,
    useTheme,
    IconButton,
    Dialog,
    AppBar,
    Slide,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import moment from 'moment';
import { Close } from '@material-ui/icons';
import ViewBook from 'containers/intelligent-textbook/chapterpage/ViewBook';
import { useSelector } from 'react-redux';
import { Card, Divider, Tag, Button, Pagination, Empty } from 'antd';
import { LeftOutlined, EditOutlined, ClearOutlined, CloseSquareOutlined, UndoOutlined , EyeFilled} from '@ant-design/icons';


const isOrchids =
    window.location.host.split('.')[0] === 'orchids' ||
        window.location.host.split('.')[0] === 'qa'
        ? true
        : false;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        margin: '-10px auto',
        boxShadow: 'none',
    },
    container: {
        maxHeight: '70vh',
        width: '100%',
    },
    textEffect: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: theme.palette.secondary.main,
        marginTop: '15px',
    },
}));

function Transition(props) {
    return <Slide direction='up' {...props} />;
}

const IbookList = (props) => {
    const history = useHistory();
    const classes = useStyles();
    const { data, totalEbooks } = props;
    const [loading, setLoading] = useState(false);
    const { setAlert } = useContext(AlertNotificationContext);
    const themeContext = useTheme();
    const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
    const [booksData, setBooksData] = useState([]);
    const [totalPages, setTotalPages] = useState('');
    const [pageNo, setPageNo] = useState(1);
    const limit = 8;
    const [clearFilter, setclearFilter] = useState(false);
    const [acadmicYear, setAcadmicYear] = useState('');
    const [branch, setBranch] = useState('');
    const [grade, setGrade] = useState('');
    const [subject, setSubject] = useState('');
    const [volume, setVolume] = useState('');
    const [board, setBoard] = useState('');
    const [moduleId, setModuleId] = useState('');
    const [chapter, setChapter] = useState('');
    const [keyConcept, setKeyConcept] = useState('');
    const [open, setOpen] = useState(false);
    const [bookImage, setBookImage] = useState('https://d3ka3pry54wyko.cloudfront.net/');
    const [bookId, setbookId] = useState('');
    const [chapterId, setchapterId] = useState('');
    const [bookUid, setbookUid] = useState('');
    const [localStorageName, setlocalStorageName] = useState('');
    const [environment, setenvironment] = useState('');
    const [type, settype] = useState('');
    const [bookName, setbookName] = useState('');
    const [showGrievanceModal, setShowGrievanceModal] = useState(false);
    const { user_level } = JSON.parse(localStorage.getItem('userDetails')) || {};
    const userDetails = JSON.parse(localStorage.getItem('userDetails'))?.user_id || {};
    const selectedAcademicYear = useSelector(
        (state) => state.commonFilterReducer?.selectedYear
      );


    const getDomainName = () => {
        let token = JSON.parse(localStorage.getItem('userDetails')).token || {};
        const { host } = new URL(axiosInstance.defaults.baseURL);
        const hostSplitArray = host.split('.');
        const subDomainLevels = hostSplitArray.length - 2;
        let domain = '';
        let subDomain = '';
        let subSubDomain = '';
        if (hostSplitArray.length > 2) {
            domain = hostSplitArray.slice(hostSplitArray.length - 2).join('');
        }
        if (subDomainLevels === 2) {
            subSubDomain = hostSplitArray[0];
            subDomain = hostSplitArray[1];
        } else if (subDomainLevels === 1) {
            subDomain = hostSplitArray[0];
        }
        return subDomain;
    };
    const handleCloseGrievanceModal = () => {
        setShowGrievanceModal(false);
    };

    useEffect(() => {
        if (branch != '') {
            getEbook(
                acadmicYear,
                branch,
                grade,
                subject,
                volume,
                board,
                moduleId,
                chapter,
                keyConcept
            );
        }
    }, [pageNo]);
    const handlePagination = (event, page) => {
        setPageNo(page);
    };

    const handleBookOpen = (item) => {
        const path = item?.path.split('/');
        setbookId(item?.id);
        setchapterId();
        setbookName(item.book_name);
        setbookUid(item?.book_uid);
        setlocalStorageName(item?.local_storage_id);
        setenvironment(path[0]);
        settype(path[1]);
        setOpen(true);
    };

    const handleFilter = (
        acad,
        branch,
        grade,
        sub,
        vol,
        board,
        moduleId,
        chapter,
        keyConcept
    ) => {
        setAcadmicYear(acad);
        setBranch(branch);
        setGrade(grade);
        setSubject(sub);
        setVolume(vol);
        setBoard(board);
        setModuleId(moduleId);
        setChapter(chapter);
        setKeyConcept(keyConcept);
        getEbook(acad, branch, grade, sub, vol, board, moduleId, chapter, keyConcept);
    };

    const getEbook = (
        acad,
        branch,
        grade,
        subject,
        vol,
        board,
        moduleId,
        chapter,
        keyConcept
    ) => {
        const filterAcad = `${acad ? `&academic_year=${acad?.id}` : ''}`;
        const filterBranch = `${branch ? `&branch=${branch}` : ''}`;
        const filterGrade = `${grade ? `&grade=${grade?.central_grade}` : ''}`;
        const filterSubject = `${subject ? `&subject=${subject?.central_subject}` : ''}`;
        const filterVolumes = `${vol ? `&volume=${vol?.id}` : ''}`;
        const filterBoard = `${board?.length !== 0 ? `&board_id=${board}` : ''}`;
        const filterModule = `${moduleId?.length !== 0 ? `&lt_module=${moduleId?.id}` : ''}`;
        const filterChapter = `${chapter?.length !== 0 ? `&chapter_id=${chapter?.id}` : ''}`;
        const filterKeyConcept = `${keyConcept?.length !== 0 ? `&key_concept_id=${keyConcept?.id}` : ''
            }`;
        if (!branch) {
            setAlert('warning', 'Please Select Branch');
            setBooksData([]);
            setTotalPages('');
            return;
        } else if (!grade) {
            setAlert('warning', 'Please Select Grade');
            setBooksData([]);
            setTotalPages('');
            return;
        } else if (!subject) {
            setAlert('warning', 'Please Select Subject');
            setBooksData([]);
            setTotalPages('');
            return;
        } else if (!vol) {
            setAlert('warning', 'Please Select Volume');
            setBooksData([]);
            setTotalPages('');
            return;
        } else if (!board?.length > 0) {
            setAlert('warning', 'Please Select Board');
            setBooksData([]);
            setTotalPages('');
        } else if (
            branch ||
            grade ||
            subject ||
            vol ||
            moduleId?.length > 0 ||
            chapter?.length > 0 ||
            keyConcept?.length > 0
        ) {
            setLoading(true);
            axiosInstance
                .get(
                    `${endpoints.ibook.studentBook
                    }?domain_name=${getDomainName()}&book_status=1&page=${pageNo}&page_size=${limit}${filterBranch}${filterGrade}${filterSubject}${filterVolumes}${filterBoard}${filterModule}${filterChapter}${filterKeyConcept}`
                )
                .then((result) => {
                    if (result.data.status_code === 200) {
                        setBooksData(result.data.result.result);
                        setTotalPages(Math.ceil(result.data.result.count / limit));
                        setAlert('success', result.data.message);
                        setLoading(false);
                    } else {
                        setLoading(false);
                        setAlert('error', result.data.message);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    setAlert('error', error.message);
                });
        } else {
            setLoading(false);
            setBooksData([]);
            setTotalPages('');
        }
    };

    useEffect(() => {
        setBooksData([]);
        setTotalPages('');
    }, [clearFilter]);
    const handleClose = () => {
        setOpen(false);
        ebookClose({
            ebook_id: bookId,
            user_id: userDetails,
            lst_opened_date : new Date(),
            book_type: '4',
            page_number : '1',
            session_year : selectedAcademicYear?.id
        })
    };
    const ebookClose = (params) => {
        axiosInstance
            .post(`${endpoints.ebook.ebookClose}`, params)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });

    }



    return (
        <>
            {data?.length > 0 ?
                <div className={classes.root} style={{ minHeight: '30vh' , height: '40vh' , overflow: 'scroll' , marginTop: '1%'  }}>
                        {data?.length > 0 && data.map((item, index) => (
                            <>
                                <div className='ebookCard' style={{ margin: '1%' }} >
                                    <div style={{ margin: '3%' , display: 'flex' , justifyContent: 'space-between' , alignItems: 'center' }}>
                                        <img alt="example" src={`${bookImage}${item?.path}${item?.book_image}`} style={{ width: '100px', height: '100px', padding: '1%' }} />
                                        <span>{item?.book_name.charAt(0).toUpperCase() + item?.book_name.slice(1)}</span>
                                        <Button icon={<EyeFilled />} onClick={() => handleBookOpen(item)} />

                                    </div>
                                    <Divider style={{margin: '0px'}}/>
                                </div>

                            </>
                        ))}

                 


                    <Dialog
                        fullScreen
                        open={open}
                        onClose={handleClose}
                        style={{ zIndex: '10000' }}
                        TransitionComponent={Transition}
                    >

                        <Grid>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                                <div style={{ width: '20px' }} ></div>
                                <span style={{ textAlign: 'center', fontWeight: '600', fontSize: '20px', fontFamily: 'initial' }} >{bookName}</span>
                                <div style={{ zIndex: '1000' }} >
                                    <Button icon={<CloseSquareOutlined />} onClick={() => handleClose()} >Close</Button>
                                </div>
                            </div>
                            <ViewBook
                                bookId={bookId}
                                chapterId={chapterId}
                                bookUid={bookUid}
                                localStorageName={localStorageName}
                                environment={environment}
                                type={type}
                                close={handleClose}
                                name={bookName}
                            />
                        </Grid>
                        {/* </Grid> */}
                    </Dialog>
                </div>
                : <div style={{ minHeight: '50vh' }} >
                    <Empty style={{ marginTop: '5%' }} />
                </div>
            }
        </>
    );
};

export default IbookList;
