import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    Grid,
    Card,
    Button,
    Typography,
    SvgIcon,
    Dialog,
    Slide,
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router-dom';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import EbookPdf from 'containers/ebooks/EbookPDF';
import {
    EyeFilled,
} from '@ant-design/icons';

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}))(Tooltip);
const useStyles = makeStyles((theme) => ({

    card: {
        textAlign: 'center',
        margin: theme.spacing(1),
        backgroundPosition: 'center',
        backgroundSize: 'auto',
    },
    textEffect: {
        overflow: 'hidden',
        display: '-webkit-box',
        maxWidth: '100%',
        '-webkit-line-clamp': '3',
        '-webkit-box-orient': 'vertical',
        textOverflow: 'ellipsis',
        margin: '0%',
        padding: '0%',
        height: '65px !important',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
    },
}));
function Transition(props) {
    return <Slide direction='up' {...props} />;
}

const EbookList = (props) => {
    const classes = useStyles();
    const { data, totalEbooks } = props;
    const [loading, setLoading] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [open, setOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [selectedItem, setSelectedItem] = useState('');

    const handleClickOpen = (data) => {
        setSelectedItem(data);
        const ebookName = data.ebook_name;
        const necrtUrl = data.ebook_link;
        const url = data.ebook_file_type;
        if (ebookName && ebookName.includes('NCERT')) {
            window.open(necrtUrl);
        } else {
            const { host } = new URL(axiosInstance.defaults.baseURL)
            const hostSplitArray = host.split('.')
            const subDomainLevels = hostSplitArray.length - 2
            let domain = ''
            let subDomain = ''
            let subSubDomain = ''
            if (hostSplitArray.length > 2) {
                domain = hostSplitArray.slice(hostSplitArray.length - 2).join('')
            }
            if (subDomainLevels === 2) {
                subSubDomain = hostSplitArray[0]
                subDomain = hostSplitArray[1]
            } else if (subDomainLevels === 1) {
                subDomain = hostSplitArray[0]
            }
            setPdfUrl(url && url);
            setLoading(true);
            setOpen(true);
            axiosInstance
                .get(`${endpoints.ebook.EbookUser}?ebook_id=${data.id}`
                )
                .then(({ data }) => {
                    console.log(data);
                    setLoading(false);
                    setPageNumber(data.page_number);
                    setTimeSpent(data.time_spent);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedItem('');
    };

    return (
        <div className={classes.root} style={{minHeight: '300px'}} >
            {data.length > 0 ? (
                <div style={{width: '80%' , margin: '0 auto'}}>
                    {data?.length > 0 && (
                        data?.map((item, i) => (
                            <div style={{display: 'flex' , justifyContent: 'space-between'}} >
                                <span>{i + 1}. {item?.ebook_name}</span>
                                <div className='ml-3'>
                                    <EyeFilled
                                        className='th-primary'
                                        fontSize={20}
                                        style={{ verticalAlign: 'inherit' }}
                                        onClick={() => handleClickOpen(item)}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                ''
            )}

            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                style={{ zIndex: '10000' }}
                TransitionComponent={Transition}
            >
                <Grid>
                    <EbookPdf
                        pageNumber={pageNumber}
                        timeStore={timeSpent}
                        id={selectedItem?.id}
                        url={`${pdfUrl && pdfUrl}`}
                        passLoad={loading}
                        goBackFunction={handleClose}
                        name={selectedItem?.ebook_name}
                    />
                </Grid>
            </Dialog>
        </div>
    );
}

export default withRouter(EbookList);
