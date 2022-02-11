import React, { useState } from 'react';
import {
  Grid,
  Box,
  Button,
  SwipeableDrawer,
  Dialog,
  FormControl,
  DialogContent,
  TextField,
  SvgIcon,
  Divider,
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';
import endpoints from 'config/endpoints';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import EditDiary from '../dialogs/editDairy';

const EditDiaryDialog = ({ isStudent, lesson, onClose, setOpen, periodId }) => {
  const [editDiaryOpen, setEditDiaryOpen] = useState(false);
  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};

  const handleBulkDownloads = (files) => {
    for (let i = 0; i < files?.length; i++) {
      window.open(`${endpoints.discussionForum.s3}/${files[i]}`);
    }
  };
  const s3Images = `${endpoints.assessmentErp.s3}/`;
  const handleEditDairy = () => {
    setEditDiaryOpen((prev) => !prev);
  };
  return (
    <div style={{ width: '800px', marginTop: '15%' }}>
      <div style={{ marginLeft: '5%', marginRight: '5%' }}>
        <h2>Today's Diary</h2>
      </div>
      <div style={{ position: 'absolute', top: '100px', right: '59px' }}>
        <CloseIcon style={{ cursor: 'pointer' }} onClick={onClose} />
      </div>
      <Divider />
      <FormControl fullWidth>
        <TextField
          multiline
          rows={6}
          style={{ marginLeft: '5%', marginRight: '5%', marginTop: '5%' }}
          id='outlined-basic'
          label='Details of Classwork'
          variant='outlined'
          InputLabelProps={{
            shrink: true,
          }}
          disabled
          margin='dense'
          defaultValue={lesson?.message}
        />
      </FormControl>
      <FormControl fullWidth>
        <TextField
          multiline
          style={{ marginTop: 20, marginLeft: '5%', marginRight: '5%' }}
          id='outlined-basic'
          rows={4}
          label='Tool Used'
          variant='outlined'
          margin='dense'
          InputLabelProps={{
            shrink: true,
          }}
          disabled
          defaultValue={lesson?.title}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            padding: '20px',
          }}
        >
          <div style={{ display: "flex" }}>
            {lesson?.documents?.map((image, index) => (
              <>
                <p style={{ fontSize: "15px", fontWeight: "900px" }}>File: {index + 1}</p>
                < img
                  src={`${s3Images}${image}`}
                  // className='underlineRemove'
                  style={{ marginLeft: '5%', marginRight: '5%', width: "10%", height: "50%", cursor: "pointer" }}
                  onClick={() => {
                    const fileSrc = `${s3Images}${image}`;
                    openPreview({
                      currentAttachmentIndex: 0,
                      attachmentsArray: [
                        {
                          src: fileSrc,
                          name: `demo`,
                          extension: '.png',
                        },
                      ],
                    });
                  }}

                />
                <br />
              </>
            ))}
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{}}>
              <Button
                variant='contained'
                onClick={() => handleBulkDownloads(lesson?.documents)}
                style={{ width: '200px', backgroundColor: '#576dc5' }}
                className='bulkDownloadIconViewMore'
              >
                Download Attachments
              </Button>
            </div>
            <div>
              {isStudent ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    // marginBottom: 15,
                    // marginTop: 20,
                  }}
                >
                  <Button
                    variant='contained'
                    style={{
                      backgroundColor: '#3780DE',
                      color: 'white',
                      padding: '7px 30px',
                      width: '150px',
                    }}
                    onClick={handleEditDairy}
                  >
                    Edit
                  </Button>
                </div>
              ) : null}
              <SwipeableDrawer
                anchor='right'
                open={editDiaryOpen}
                onClose={handleEditDairy}
                onOpen={handleEditDairy}
                style={{ padding: '20px' }}
              >
                <EditDiary
                  onClose={handleEditDairy}
                  lesson={lesson}
                  updateDiary={onClose}
                  periodId={periodId}
                />
              </SwipeableDrawer>
            </div>
          </div>
        </div>
      </FormControl >
      {/* </> */}
    </div >
  );
};
export default EditDiaryDialog;
