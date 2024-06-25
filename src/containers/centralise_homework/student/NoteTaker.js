import React, { useEffect, useState } from 'react';
import MyTinyEditor from '../../question-bank/create-question/tinymce-editor';
import './style.css';
import ReactQuillEditor from 'components/reactQuill';
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

  const handleNoteTakerContent = (content, delta, source, editor) => {
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
        {/* <MyTinyEditor
          id={`notetaker${hwData?.name}`}
          content={noteTakerContent}
          handleEditorChange={handleNoteTakerContent}
          placeholder={`Write yor note for ${hwData?.name}`}
          className='th-editor'
        /> */}
        <div className='py-2 w-100 font-weight-normal'>
          <ReactQuillEditor
            id={`notetaker${hwData?.name}`}
            value={noteTakerContent}
            onChange={(content, delta, source, editor) =>
              handleNoteTakerContent(content, delta, source, editor)
            }
            placeholder={`Write yor note for ${hwData?.name}`}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default NoteTaker;
