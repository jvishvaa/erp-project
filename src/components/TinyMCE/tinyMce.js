// import React, { Component } from 'react';
// import tinymce from 'tinymce';
// import 'tinymce/icons/default';
// import 'tinymce/themes/silver/theme';
// import 'tinymce/skins/ui/oxide/skin.min.css';
// // import '@vipindev/tinymce-s3-uploader-plugin'
// import 'tinymce/plugins/advlist';
// import 'tinymce/plugins/autolink';
// import 'tinymce/plugins/link';
// import 'tinymce/plugins/image';
// import 'tinymce/plugins/lists';
// import 'tinymce/plugins/charmap';
// import 'tinymce/plugins/print';
// import 'tinymce/plugins/preview';
// import 'tinymce/plugins/hr';
// import 'tinymce/plugins/anchor';
// import 'tinymce/plugins/pagebreak';
// import 'tinymce/plugins/spellchecker';
// import 'tinymce/plugins/searchreplace';
// import 'tinymce/plugins/wordcount';
// import 'tinymce/plugins/visualblocks';
// import 'tinymce/plugins/visualchars';
// import 'tinymce/plugins/code';
// import 'tinymce/plugins/fullscreen';
// import 'tinymce/plugins/insertdatetime';
// import 'tinymce/plugins/media';
// import 'tinymce/plugins/nonbreaking';
// import 'tinymce/plugins/save';
// import 'tinymce/plugins/table';
// import 'tinymce/plugins/contextmenu';
// import 'tinymce/plugins/directionality';
// import 'tinymce/plugins/template';
// import 'tinymce/plugins/paste';
// import 'tinymce/plugins/textcolor';
// import './math';
// import './Language';
// import './ascii2unicode';
// import './VirtualKeyboard/virtual_drop_down';

// class TinyMce extends Component {
//   constructor() {
//     super();
//     this.state = { editor: null, data: false };
//   }

//   componentDidMount() {
//     tinymce.init({
//       selector: `#${this.props.id}`,
//       browser_spellcheck: true,
//       contextmenu: false,
//       skin: false,
//       forced_root_block: false,
//       plugins:
//         ' save table contextmenu directionality template paste textcolor searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker wordcount table AwsS3Upload math ಕನ್ನಡ ascii2unicode dropdown editor_drop_down',
//       toolbar:
//         'insertfile undo redo | styleselect | sizeselect | bold italic | fontselect | fontsizeselect | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | AwsS3UploadButton | print preview media fullpage | forecolor backcolor emoticons | math mathhelp ಕನ್ನಡ ascii2unicode dropdown editor_drop_down',
//       setup: (editor) => {
//         this.setState({ editor });
//         editor.on('keyup change', () => {
//           const content = editor.getContent();
//           this.props.get(content, this.props.id);
//         });
//       },
//       Awss3UploadSettings: {
//         buttonText: 'Upload Files',
//         folderName: 'userImages',
//         bucketName: 'letseduvate',
//         awsAuth: {
//           region: 'ap-south-1',
//           accessKeyId: 'AKIAQWJOGETZUMF4ZPWU',
//           secretAccessKey: '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',
//         },
//         progress: {
//           successCallback: (editor, url) => {
//             switch (url.split('.').pop().toLowerCase()) {
//               case 'png':
//               case 'jpg':
//               case 'jpeg': {
//                 editor.execCommand(
//                   'mceInsertContent',
//                   false,
//                   `<img src="${url}" style="display: block;margin: 0 auto; " />`
//                 );
//                 break;
//               }
//               case 'mp3': {
//                 editor.execCommand(
//                   'mceInsertContent',
//                   false,
//                   `<audio controls><source src="${url}" type="audio/mpeg">Your browser does not support the audio element.</audio>`
//                 );
//                 break;
//               }
//               case 'wav': {
//                 editor.execCommand(
//                   'mceInsertContent',
//                   false,
//                   `<audio controls><source src="${url}" type="audio/wav">Your browser does not support the audio element.</audio>`
//                 );
//                 break;
//               }
//               // case 'ogg': {
//               //   editor.execCommand('mceInsertContent', false, `<audio controls><source src="${url}" type="audio/ogg">Your browser does not support the audio element.</audio>`)
//               //   break
//               // }
//               case 'mp4': {
//                 editor.execCommand(
//                   'mceInsertContent',
//                   false,
//                   `<video width="400" controls><source src="${url}" type="video/mp4"> Your browser does not support HTML5 video.</video>
//               `
//                 );
//                 break;
//               }
//               default: {
//                 editor.execCommand(
//                   'mceInsertContent',
//                   false,
//                   `<a href="${url}">${url}</a>`
//                 );
//               }
//             }
//           },
//         },
//       },
//     });
//   }

//   componentWillUnmount() {
//     tinymce.remove(this.state.editor);
//   }

//   render() {
//     return (
//       <div style={{ width: '100%' }}>
//         <textarea
//           id={this.props.id}
//           value={this.props.content}
//           onChange={(e) => console.log(encodeURIComponent)}
//           style={{ minHeight: '50vh' }}
//         />
//       </div>
//     );
//   }
// }

// export default TinyMce;
