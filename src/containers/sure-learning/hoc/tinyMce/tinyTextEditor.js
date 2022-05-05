import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import PropTypes from 'prop-types';
import './textEditor.css';

const TinyTextEditor = ({
  initialValue, value, onChange, id, heightInchs,
}) => (
  <Editor
    id={id}
    apiKey="avuvy4c3g10sluz8vrm03j34cawyl6ajjms52nhfulk40aeb"
    // this value is commented in Role-management version, 
    //  issue is: Press any key cursor going at starting value -- >initialValue={initialValue}
    value={value}
    init={{
      height: heightInchs || 200,
      images_upload_url: 'postAcceptor.php',
      automatic_uploads: false,
      language_url: '/languages/fi.js',
      language: 'hi_IN',
      browser_spellcheck: true,
      contextmenu: false,
      video_template_callback(data) {
        // eslint-disable-next-line no-useless-concat
        return `<video width="${data.width}" height="${data.height}"${data.poster ? ` poster="${data.poster}"` : ''} controls="controls">\n` + `<source src="${data.source1}"${data.source1mime ? ` type="${data.source1mime}"` : ''} />\n${data.source2 ? `<source src="${data.source2}"${data.source2mime ? ` type="${data.source2mime}"` : ''} />\n` : ''}</video>`;
      },
      spellchecker_rpc_url: 'spellchecker.php',
      plugins: [
        'lists link image paste help wordcount',
        'spellchecker',
        'media',
      ],
      toolbar: 'undo redo | spellchecker | formatselect | fontselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image media| help',
    }}
    onEditorChange={onChange}
  />
);

function dummy() {
}

TinyTextEditor.defaultProps = {
  onChange: dummy(),
  value: 'heelo',
  initialValue: 'dummy',
  id: 'dummyId',
  heightInchs: 200,
};

TinyTextEditor.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  initialValue: PropTypes.string,
  id: PropTypes.string,
  heightInchs: PropTypes.number,
};

export default TinyTextEditor;
