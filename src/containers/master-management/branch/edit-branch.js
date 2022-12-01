import React, { useContext, useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  Switch,
  FormControlLabel,
  SvgIcon,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import { AttachmentPreviewerContext } from '../../../components/attachment-previewer/attachment-previewer-contexts/attachment-previewer-contexts'


const EditBranch = ({ branchData, handleGoBack, setLoading }) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const { id, branch_name, branch_code, address, logo } = branchData;

  const [branchName, setBranchName] = useState(branch_name || '');
  const [branchCode, setBranchCode] = useState(branch_code || '');
  const [branchAddress, setBranchAddress] = useState(address || '');
  const [file, setFile] = useState();
  const [viewFile, setViewFile] = useState(logo || '');

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const request = new FormData();
    request.append('branch_id',id);
    if (
      (branchName !== branch_name && branchName !== '') ||
      (branchAddress !== address && branchAddress !== '') ||
      (branchCode !== branch_code && branchCode !== '') ||
      (file !== logo && file !== '')
    ) {
      if (branchName !== branch_name && branchName !== '')
        request.append('branch_name',branchName);
      if (branchAddress !== address && branchAddress !== '')
        request.append('address',branchAddress);
      if (branchCode !== branch_code && branchCode !== '')
        request.append('branch_code', branchCode);
      if(file)
        request.append('logo',file)

      axiosInstance
        .put(`${endpoints.masterManagement.updateBranch}${id}`, request)
        .then((result) => {
          if (result.data.status_code === 200) {
            handleGoBack();
            setLoading(false);
            setAlert('success', 'Branch successfully updated');
          } else if(result.data.status_code === 409) {
            setAlert('error', "Branch Code Already Exist");
            setLoading(false);
          } else {
            setLoading(false);
            setAlert('error', result.data.message || result.data.msg);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.response.data.message || error.response.data.msg);
        });
    } else {
      setAlert('error', 'No Fields to Update');
      setLoading(false);
    }
  };

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <div style={{ width: '95%', margin: '20px auto' }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <abbr title={branchName} style={{ textDecoration: 'none' }}>
              <TextField
                id='subname'
                style={{ width: '100%' }}
                label='Branch Name'
                variant='outlined'
                size='small'
                value={branchName}
                inputProps={{ pattern: '^[a-zA-Z0-9 ]+', maxLength: 50 }}
                name='branchname'
                onChange={(e) => setBranchName(e.target.value)}
              />
            </abbr>
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <TextField
              id='branchcode'
              style={{ width: '100%' }}
              label='Branch Code'
              variant='outlined'
              size='small'
              value={branchCode}
              inputProps={{ pattern: '^[0-9]+$', maxLength: 3 }}
              name='branchcode'
              onChange={(e) => setBranchCode(e.target.value)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <TextField
              id='address'
              label='Address'
              variant='outlined'
              size='small'
              style={{ width: '100%' }}
              multiline
              rows={4}
              rowsMax={6}
              inputProps={{ maxLength: 500 }}
              value={branchAddress}
              name='address'
              onChange={(e) => setBranchAddress(e.target.value)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={isMobile ? 1 : 5}>
          <Grid item xs={11} sm={3} className={isMobile ? '' : 'addEditPadding'}>
            <input
              id='upload'
              label='Upload Logo'
              variant='outlined'
              size='small'
              style={{ width: '100%' }}
              name='File'
              type='file'
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Grid>
          <Grid item xs={1} sm={1} className={isMobile ? '' : 'addEditPadding'}>
            {viewFile !== '' ? (
              <>
                <SvgIcon
                  component={() => (
                    <VisibilityOutlinedIcon
                      style={{ width: 30, height: 30, cursor: 'pointer' }}
                      onClick={() => {
                        const fileSrc = viewFile;
                        openPreview({
                          currentAttachmentIndex: 0,
                          attachmentsArray: [
                            {
                              src: fileSrc,
                              // src: 'https://www.w3schools.com/html/pic_trulli.jpg',
                              name: fileSrc.split('.')[fileSrc.split('.').length - 2],
                              extension:
                                '.' + fileSrc.split('.')[fileSrc.split('.').length - 1],
                            },
                          ],
                        });
                      }}
                      color='primary'
                    />
                  )}
                />

                {console.log({ viewFile })}
                <div
                  style={{
                    width: '100px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '12px',
                  }}
                >
                  <small>{viewFile.split('/')[viewFile.split('/').length - 1]}</small>
                </div>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </div>

      <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '10px' }}>
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
          <Button
            variant='contained'
            className='cancelButton labelColor'
            style={{ width: '100%' }}
            size='medium'
            onClick={handleGoBack}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
          <Button
            variant='contained'
            style={{ color: 'white', width: '100%' }}
            color='primary'
            size='medium'
            type='submit'
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditBranch;
