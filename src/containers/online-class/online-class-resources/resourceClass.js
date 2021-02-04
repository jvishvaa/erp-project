import React from 'react';
import { Button, Grid, Typography, withStyles } from '@material-ui/core';
import moment from 'moment';
import UploadModalWrapper from './modal';
import UploadModal from './upload-modal';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';

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
    console.log(props.resourceId);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

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
    const handleDownload = () => {
        axiosInstance.get(`${endpoints.onlineClass.resourceFile}?online_class_id=${props.resourceId}&class_date=${moment(props.date).format('DD-MM-YYYY')}`)
        .then((res) => console.log(res))
        .catch((error) => console.log(error))
    }

    return (
        <>
            <Grid  container spacing={1} style={{marginTop: '5px'}}>
                <Grid item xs={4}>
                    <Typography>
                        {moment(props.date).format('DD-MM-YYYY')}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <StyledButton
                        onClick={handleClick}
                    >
                        Upload
                    </StyledButton>
                </Grid>
                <Grid item xs={4}>
                    <StyledButton
                        onClick={handleDownload}
                    >
                        Download
                    </StyledButton>
                </Grid>
            </Grid>
            {uploadModal}
        </>
    )
}

export const ResourceClass = React.memo(ResourceClassComponent);