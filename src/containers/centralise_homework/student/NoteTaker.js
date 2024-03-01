import React, { useEffect, useState } from 'react';
import MyTinyEditor from '../../question-bank/create-question/tinymce-editor';
import './style.css';
const NoteTaker = ({ ...props }) => {
  const {
    attachmentView,
    setAttachmentView,
    handleAttachmentView,
    handleNoteTakerView,
    selectedHomework,
    setSelectedHomework,
    selectedHomeworkIndex,
    setSelectedHomeworkIndex,
    homeworkData,
  } = props;
  const [noteTakerContent, setNoteTakerContent] = useState('');
  const [hwData, setHwData] = useState(selectedHomework);

  const handleNoteTakerContent = (content, editor) => {
    setNoteTakerContent(content);
  };

  console.log({ selectedHomework });

  useEffect(() => {
    setHwData(selectedHomework);
  }, [selectedHomework]);

  console.log({ hwData });

  return (
    <React.Fragment>
      <div className='w-100'>
        {selectedHomework?.name} {selectedHomeworkIndex}
        <MyTinyEditor
          id={`notetaker${hwData?.name}`}
          content={noteTakerContent}
          handleEditorChange={handleNoteTakerContent}
          placeholder={`Write yor note for ${hwData?.name}`}
          className='th-editor'
        />
      </div>
    </React.Fragment>
  );
};

export default NoteTaker;
