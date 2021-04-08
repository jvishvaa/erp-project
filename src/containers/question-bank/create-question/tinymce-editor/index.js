import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';

const MyTinyEditor = ({
  id,
  content,
  handleEditorChange,
  setOpenEditor,
  placeholder,
  filterDataTop,
  filterDataBottom,
}) => {
  return (
    <Editor
      id={id}
      name='tinymce'
      value={content}
      onEditorChange={handleEditorChange}
      init={{
        selector: 'textarea#myTextArea',
        placeholder: placeholder,
        menubar: false,
        plugins: ['lists link file image paste wordcount'],
        content_style: 'body { color: #014b7e; font-size: 14pt; font-family: Arial; }',
        toolbar:
          'fontselect fontsizeselect bold italic alignleft aligncenter alignright underline bullist numlist file image customInsertButton',
        setup:
          id.startsWith('questionEditor') &&
          function (editor) {
            editor.ui.registry.addButton('customInsertButton', {
              text: 'Finish',
              onAction: function (_) {
                setOpenEditor(false);
              },
            });
          },
        image_title: true,
        automatic_uploads: true,
        file_picker_types: 'file image media',
        file_picker_callback: function (cb, value, meta) {
          var input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.onchange = function (e) {
            let file = e.target.files;
            if (
              file &&
              file[0] &&
              (file[0].name.lastIndexOf('.jpg') > 0 ||
                file[0].name.lastIndexOf('.jpeg') > 0 ||
                file[0].name.lastIndexOf('.png') > 0)
            ) {
              const formData = new FormData();
              formData.append('file', file[0]);
              formData.append('grade_name', filterDataTop.grade?.grade_name);
              formData.append(
                'subject_name',
                filterDataTop.subject?.subject?.subject_name
              );
              formData.append('question_categories', filterDataBottom.category.category);
              formData.append('question_type', filterDataBottom.type?.question_type);
              axiosInstance
                .post(`${endpoints.questionBank.uploadFile}`, formData)
                .then((result) => {
                  if (result.data.status_code === 200) {
                    let imageUrl = `${endpoints.s3}${result.data?.result}`;
                    cb(imageUrl, { alt: 'My alt text' });
                  } else {
                  }
                })
                .catch((error) => {});
            }
          };
          input.click();
        },
      }}
    />
  );
};

export default MyTinyEditor;
