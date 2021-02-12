import React from 'react';
import { Button, Grid, Typography, withStyles } from '@material-ui/core';
import moment from 'moment';
import UploadModalWrapper from './modal';
import UploadModal from './upload-modal';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { useLocation } from 'react-router-dom';

const StyledButton = withStyles({
    root: {
        height: '31px',
        width: '100%',
        fontSize: '18px',
        fontFamily: 'Poppins',
        textTransform: 'capitalize',
        backgroundColor: '#ff6b6b',
        borderRadius: '10px',
    }
})(Button);

export default function ResourceClassComponent(props) {
    const [ isModalOpen, setIsModalOpen ] = React.useState(false);
    const [ isDownload, setIsDownload ] = React.useState([]);
    const [ isDown, setIsDown] = React.useState(0);
    const location = useLocation();

    let uploadModal = null;
    if (isModalOpen) {
        uploadModal = (
        <UploadModalWrapper open={isModalOpen} click={() => setIsModalOpen(false)} large>
            <UploadModal
                id={props.resourceId}
                classDate={moment(props.date).format('DD-MM-YYYY')}
                onClose={() => setIsModalOpen(false)} 
                type='resource'
            />
        </UploadModalWrapper>
        );
    }

    const handleClick = () => {
        setIsModalOpen(true);
    };
    const handleDownload = (e) => {
        e.preventDefault();
        isDownload && isDownload.map((path) => {
            path.files && path.files.map((file, i) => window.location.href=(`${endpoints.s3}/${file}`))
            //window.location.href=(`${endpoints.s3}/${path?.files[0]}`
        })
    }

    React.useEffect(() => {
        const params = {
            online_class_id: props.resourceId,
            class_date: moment(props.date).format('DD-MM-YYYY')
        };
        axiosInstance.get(`${endpoints.onlineClass.resourceFile}?online_class_id=${props.resourceId}&class_date=${moment(props.date).format('DD-MM-YYYY')}`)
        .then((res) => {
            setIsDownload(res.data.result);
            setIsDown(res.data.status_code);
        })
        .catch((error) => console.log(error))
    },[props.date]);

    return (
        <>
            <Grid  container spacing={1} style={{marginTop: '5px'}}>
                <Grid item xs={isDown === 200 ? 4 : 6} >
                    <Typography>
                        {moment(props.date).format('DD-MM-YYYY')}
                    </Typography>
                </Grid>
                <Grid item xs={isDown === 200 ? 4 : 6}>
                    <StyledButton
                        onClick={handleClick}
                        color="primary"
                    >
                        Upload
                    </StyledButton>
                </Grid>
                <Grid item xs={4}>
                    {isDown === 200 && (
                        <StyledButton
                            //href={`${endpoints.s3}/${isDownload.length > 0  ? isDownload[0]?.files[0] : ''}`}
                            //href={isDownload && isDownload.map((path) => (`${endpoints.s3}/${files && files[0]}`))}
                            onClick={handleDownload}
                            color="primary"
                        >
                            Download
                        </StyledButton>
                    )}
                </Grid>
            </Grid>
            {uploadModal}
        </>
    )
}

export const ResourceClass = React.memo(ResourceClassComponent);