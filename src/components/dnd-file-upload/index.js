import React, { useCallback, useMemo, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import './styles.scss';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#014b7e',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#014b7e',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const textEllipsis = {
  width: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textAlign: 'center',
};

const activeStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};
const DNDFileUpload = ({ value, handleChange, fileType, typeNames }) => {
  const { setAlert } = useContext(AlertNotificationContext);

  const onDrop = (acceptedFiles) => {
    handleChange(acceptedFiles[0]);
  };

  console.log('fileType ', fileType);

  const onDropRejected = (files) => {
    console.log('files', files);
    setAlert('error', `Upload only ${typeNames} format`);
  };
  const {
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop, accept: fileType, onDropRejected });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <div {...getRootProps({ style })}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p style={textEllipsis}>Drop the files here ...</p>
      ) : value ? (
        <p style={textEllipsis}>{value.name || value} </p>
      ) : (
        <>
          <p style={textEllipsis} style={{ marginBottom: 1 }}>
            Drag 'n' drop some files here, or click to select files
          </p>
          {typeNames ? <p>files: {typeNames}</p>:null}
       </>
      )}
    </div>
  );
};

export default DNDFileUpload;
