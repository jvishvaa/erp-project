import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MyTinyEditor = ({ id, description, handleEditorChange, setOpenEditor }) => {
  return (
    <Editor
      id={id}
      name='tinymce'
      value={description}
      onEditorChange={handleEditorChange}
      init={{
        selector: 'textarea#myTextArea',
        placeholder: 'Question goes here...',
        menubar: false,
        plugins: ['lists link file image media paste help wordcount'],
        content_style: 'body { color: #014b7e; font-size: 14pt; font-family: Arial; }',
        toolbar:
          'fontselect fontsizeselect bold italic alignleft aligncenter alignright underline bullist numlist file image media customInsertButton',
        // setup: function (editor) {
        //     editor.ui.registry.addButton('customInsertButton', {
        //         text: 'Finish',
        //         onAction: function (_) {
        //             setOpenEditor(false);
        //         }
        //     });
        // },
        image_title: true,
        automatic_uploads: true,
        file_picker_types: 'file image media',
        file_picker_callback: function (cb, value, meta) {
          var input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.onchange = function () {
            var file = this.files[0];
            // axiosInstance.post(`${endpoints.}`)
            setTimeout(() => {
              var imageUrl = URL.createObjectURL(file);
              // var imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSScT3fIZdyH0OiFY1n1jVeEwrZ0PZy_FwzjA&usqp=CAU"
              cb(imageUrl, { alt: 'My alt text' });
            }, 100);
          };
          input.click();
        },
      }}
    />
  );
};

export default MyTinyEditor;
