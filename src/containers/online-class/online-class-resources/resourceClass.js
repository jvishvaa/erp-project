import React, {useContext} from 'react';
import { Button, Grid, Typography, withStyles } from '@material-ui/core';
import moment from 'moment';
import UploadModalWrapper from './modal';
import UploadModal from './upload-modal';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { useLocation } from 'react-router-dom';
import '../../teacherBatchView/style.scss';
import '../erp-view-class/admin/index.css'
import APIREQUEST from "../../../config/apiRequest";

const StyledButton = withStyles({
    root: {
        height: '31px',
        minWidth: '100px',
        maxWidth: '150px',
        fontSize: '18px',
        fontFamily: 'Poppins',
        textTransform: 'capitalize',
        backgroundColor: '#ff6b6b',
        borderRadius: '5px',
        textAlign: 'center',
    }
})(Button);

export default function ResourceClassComponent(props) {
    const [ isModalOpen, setIsModalOpen ] = React.useState(false);
    const [ isDownload, setIsDownload ] = React.useState([]);
    const [ isDown, setIsDown] = React.useState(0);
    const [ isUpload, setIsUpload ] = React.useState(0);
    const [ hideButton, setHideButton ] = React.useState(false);
    const { setAlert } = useContext(AlertNotificationContext);
    
    const location = useLocation();
    const getClassName = () => {
       
        let classIndex= props.classIndex;
        
        
        return [
          `teacherBatchFullViewMainCard${classIndex}`,
          `teacherBatchFullViewHeader${classIndex}`,
          `addTextColor${classIndex}`,
          `darkButtonBackground${classIndex}`,
        ];
      };
    const handleIsUpload = () => {
        setIsUpload(isUpload + 1);
    }
    

    let uploadModal = null;
    if (isModalOpen) {
        uploadModal = (
        <UploadModalWrapper open={isModalOpen} click={() => setIsModalOpen(false)} large>
            <UploadModal
                id={props.resourceId}
                classDate={moment(props.date).format('DD-MM-YYYY')}
                onClose={() => setIsModalOpen(false)}
                handleIsUpload={handleIsUpload}
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
        const download = (path) => {
            window.open(path, '_blank');
        }
        const downloadFilePath = (files) => {
            files.map((file) => download(`${endpoints.discussionForum.s3}/${file}`));
        }
        isDownload && isDownload.map((path) => downloadFilePath(path.files));
        
    }

    const msApiOnclsResource = ()=>{
        APIREQUEST("get", `/oncls/v1/oncls-resources/?online_class_id=${props.resourceId}&class_date=${moment(props.date).format('DD-MM-YYYY')}`)
        .then((res)=>{
            if(res.data.result.length > 0) {
                res.data.result.map((path) => {
                    if(path.files !== null && path.files.length > 0) {
                        setHideButton(true);
                    }
                })
            }
            setIsDownload(res.data.result);
            setIsDown(res.data.status_code);
        })
        .catch((error) => console.log(error))
    }

    React.useEffect(() => {
        const params = {
            online_class_id: props.resourceId,
            
            class_date: moment(props.date).format('DD-MM-YYYY')
        };
        setHideButton(false);

        if(JSON.parse(localStorage.getItem('isMsAPI'))){
            msApiOnclsResource()
            return;
        }

        axiosInstance.get(`${endpoints.onlineClass.resourceFile}?online_class_id=${props.resourceId}&class_date=${moment(props.date).format('DD-MM-YYYY')}`)
        .then((res) => {
            if(res.data.result.length > 0) {
                res.data.result.map((path) => {
                    if(path.files !== null && path.files.length > 0) {
                        setHideButton(true);
                    }
                })
            }
           
            setIsDownload(res.data.result);
            setIsDown(res.data.status_code);
            
        })
        .catch((error) => console.log(error))
    },[props.date, isUpload]);

    return (
        <>
        
            <Grid  container spacing={1} style={{marginTop: '10px'}}>
                <Grid item xs={hideButton && isDown === 200 ? 4 : 6} >
                    <Typography>
                        {moment(props.date).format('DD-MM-YYYY')}
                    </Typography>
                </Grid>
                <Grid item xs={ hideButton && isDown === 200 ? 4 : 6}>
                    <StyledButton
                        onClick={handleClick}
                        color="primary"
                        className={`teacherFullViewSmallButtons1 ${getClassName()[1]}`}
                    >
                        Upload
                    </StyledButton>
                </Grid>
                {hideButton && isDown === 200 && (
                    <Grid item xs={4}>
                        <StyledButton
                            onClick={handleDownload}
                            className={`teacherFullViewSmallButtons1 ${getClassName()[1]}`}
                            color="primary"
                        >
                            Download
                        </StyledButton>
                    </Grid>
                )}
            </Grid>
            {uploadModal}
        </>
    )
}

export const ResourceClass = React.memo(ResourceClassComponent);