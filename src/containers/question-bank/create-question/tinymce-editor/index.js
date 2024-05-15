import React, { useContext } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import axios from 'axios';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import ENVCONFIG from '../../../../config/config';
import useStyles from './useStyles';
const MyTinyEditor = ({
  id,
  content,
  handleEditorChange,
  setOpenEditor,
  placeholder,
  filterDataTop = {},
  filterDataBottom = {},
  hideImageUpload = false,
}) => {
  const { TINYMCE_API_KEY = 'g8mda2t3wiq0cvb9j0vi993og4lm8rrylzof5e6lml5x8wua' } =
    ENVCONFIG || {};
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  return (
    <div className={classes.myTinyEditor}>
      <Editor
        id={id}
        name='tinymce'
        initialValue={content} //value={content}
        onEditorChange={handleEditorChange}
        apiKey={TINYMCE_API_KEY}
        init={{
          selector: 'textarea#myTextArea',
          placeholder: placeholder,
          menubar: false,
          paste_data_images: true,
          plugins:
            id?.startsWith('studentAnswerEditor') || id?.startsWith('descriptioneditor')
              ? ['lists link file paste wordcount']
              : ['lists link file image paste wordcount'],
          content_style: 'body { font-size: 14pt; font-family: Arial; }',
          toolbar:
            `fontselect fontsizeselect bold italic alignleft aligncenter alignright underline bullist numlist file ${hideImageUpload ? '':'image'} customInsertButton`,
          setup:
            id?.startsWith('questionEditor') &&
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
                const payload = {
                  file: file[0],
                  grade_id: filterDataTop?.grade?.grade_id,
                  subject_name: filterDataTop?.subject?.subject_id,
                  question_categories_id: filterDataBottom.category?.id,
                  question_type: filterDataBottom.type?.id,
                };
                Object.entries(payload).forEach(([key, value]) => {
                  if (value) {
                    formData.append(key, value);
                  }
                });
                axiosInstance
                  .post(`${endpoints.assessmentErp.fileUpload}`, formData)
                  .then((result) => {
                    if (result.data.status_code === 200) {
                      let imageUrl = `${endpoints.assessmentErp.s3}/${result.data?.result}`;
                      cb(imageUrl, { alt: 'My alt text' });
                    } else {
                      setAlert('error', "Can't upload the following image.");
                    }
                  })
                  .catch((error) => {
                    setAlert('error', "Can't upload the following image.");
                  });
              }
            };
            input.click();
          },
        }}
      />
    </div>
  );
};

export default MyTinyEditor;
