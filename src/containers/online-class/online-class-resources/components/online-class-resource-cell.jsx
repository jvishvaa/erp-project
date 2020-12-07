import React, { useState } from 'react';
import { Button, TableCell, TableRow } from '@material-ui/core';
import UploadModalWrapper from '../modal';
import UploadModal from '../upload-modal';

const OnlineClassResourceCell = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    index,
    currentPage,
    data: {
      id,
      scope,
      online_class: { id: classId, start_time: startTime, subject, title },
    },
    isHidden,
  } = props || {};

  let uploadModal = null;
  if (isModalOpen) {
    uploadModal = (
      <UploadModalWrapper open={isModalOpen} click={() => setIsModalOpen(false)} large>
        <UploadModal id={classId} onClose={() => setIsModalOpen(false)} type='resource' />
      </UploadModalWrapper>
    );
  }

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <TableRow key={id}>
        <TableCell align='center' className={`${isHidden ? 'hide' : 'show'}`}>
          {currentPage * 10 - (10 - index - 1)}
        </TableCell>
        <TableCell align='center'>{title}</TableCell>
        <TableCell align='center'>{subject?.subject_name}</TableCell>
        <TableCell align='center'>{startTime}</TableCell>
        <TableCell align='center'>
          {scope === true ? <Button onClick={handleClick}>Upload resource</Button> : ''}
        </TableCell>
      </TableRow>
      {uploadModal}
    </>
  );
};

export default OnlineClassResourceCell;
