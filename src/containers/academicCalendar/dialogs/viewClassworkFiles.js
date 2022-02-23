import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogTitle ,DialogContent,SvgIcon} from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

import VisibilityIcon from '@material-ui/icons/Visibility';
import { AttachmentPreviewerContext } from '../../../components/attachment-previewer/attachment-previewer-contexts';



const ViewClassworkFiles = ({ openModal, setOpenModal, files}) => {
    const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Dialog
      className='reminderDialog'
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby='draggable-dialog-title'
    >
      <DialogTitle
        style={{ cursor: 'move', color: '#014b7e' }}
        id='draggable-dialog-title'
      >
        <div>ClassWork Files</div>
      </DialogTitle>
      <DialogContent>
      {files?.map((data) => {
                    const name = data.split('/')[data.split('/').length - 1];
                    const fileNewName = name.split('.')[name.split('.').length - 2];
                    const exten = '.' + name.split('.')[name.split('.').length - 1];
                    const newFileName = name + '.' + exten;
                    return (
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <InsertDriveFileIcon style={{ height: 60, width: 60 }} />
                        <p className='fileName' title={name || ''}>{fileNewName}</p>
                        <p className='fileNameext' title={name || ''}>{exten}</p>
                        <SvgIcon
                          component={() => (
                            <VisibilityIcon
                              onClick={() => {
                                // const fileSrc = `${endpoints.lessonPlan.s3}${data}`;
                                openPreview({
                                  currentAttachmentIndex: 0,
                                  attachmentsArray: [
                                    {
                                      src: data,
                                      name: name.split('.')[name.split('.').length - 2],
                                      extension:
                                        '.' + name.split('.')[name.split('.').length - 1],
                                    },
                                  ],
                                });
                              }}
                              color='primary'
                            />
                          )}
                        />
                      </div>
                    );
                  })}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
    </Dialog>
  );
};
export default ViewClassworkFiles;
