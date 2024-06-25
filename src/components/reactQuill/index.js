import React, { useState, Fragment, useEffect, useContext } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.scss'

const Size = Quill.import('formats/size');
Size.whitelist = [
  '8px',
  '10px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '28px',
  '32px',
  '36px',
  '40px',
  '48px',
  '56px',
  '64px',
  '72px',
];
Quill.register(Size, true);
// const Font = Quill.import('formats/font')
// Font.whitelist = ['Sans Serif','serif','monospace','inconsolata', 'roboto', 'mirza', 'arial'];
// Quill.register(Font, true);

const modules = {
  toolbar: [
    // [{ font: ['Sans Serif','serif','monospace','inconsolata', 'roboto', 'mirza', 'arial'] }],
    [{ font: [] }],
    [
      {
        size: [
          '8px',
          '10px',
          '12px',
          '14px',
          '16px',
          '18px',
          '20px',
          '24px',
          '28px',
          '32px',
          '36px',
          '40px',
          '48px',
          '56px',
          '64px',
          '72px',
        ],
      },
    ], // Pixel text sizes
    // [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    // [{ color: [] }, { background: [] }],
    // [{ script: 'sub' }, { script: 'super' }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    // [{ indent: '-1' }, { indent: '+1' }],
    // [{ direction: 'ltr' }],
    [{ align: [] }],
    ['image'],
    // ['link', 'image', 'video'],
    // ['clean'],
  ],
};
const formats = [
  'font',
  'size', // Add size to the formats
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'script',
  'sub',
  'super',
  'list',
  'bullet',
  'indent',
  'direction',
  'align',
  'link',
  'image',
  'video',
];

// Data values for tooltips
const tooltipData = {
  'ql-font': 'Fonts',
  'ql-size': 'Size',
  'ql-bold': 'Bold (Ctrl+B)',
  'ql-italic': 'Italic (Ctrl+I)',
  'ql-underline': 'Underline (Ctrl+U)',
  'ql-strike': 'Strikethrough',
  'ql-header': 'Header',
  'ql-list[value="ordered"]': 'Ordered List',
  'ql-list[value="bullet"]': 'Bullet List',
  'ql-align': 'Align',
  'ql-align[value=""]': 'Align Left',
  'ql-align[value="center"]': 'Align Center',
  'ql-align[value="right"]': 'Align Right',
  'ql-align[value="justify"]': 'Justify',
  'ql-link': 'Insert Link',
  'ql-image': 'Insert Image',
  'ql-video': 'Insert Video',
  'ql-clean': 'Remove Formatting'
};

const ReactQuillEditor = ({ value = '', onChange = () => {}, placeholder = '', id }) => {
  useEffect(() => {
    console.log({ value }, 'ReactQuillEditor');
  });
  useEffect(() => {
    const addTooltips = () => {
      Object.keys(tooltipData).forEach((key) => {
        const elements = document.querySelectorAll(`.${key}`);
        elements.forEach((element) => {
          element.setAttribute('title', tooltipData[key]);
        });
      });

      // Add specific tooltips for list buttons
      const orderedListButton = document.querySelector('.ql-list[value="ordered"]');
      const bulletListButton = document.querySelector('.ql-list[value="bullet"]');
      if (orderedListButton) {
        orderedListButton.setAttribute('title', 'Ordered List');
      }
      if (bulletListButton) {
        bulletListButton.setAttribute('title', 'Bullet List');
      }

      // Add specific tooltips for alignment buttons
      const alignLeftButton = document.querySelector('.ql-align[value=""]');
      const alignCenterButton = document.querySelector('.ql-align[value="center"]');
      const alignRightButton = document.querySelector('.ql-align[value="right"]');
      const alignJustifyButton = document.querySelector('.ql-align[value="justify"]');
      if (alignLeftButton) {
        alignLeftButton.setAttribute('title', 'Align Left');
      }
      if (alignCenterButton) {
        alignCenterButton.setAttribute('title', 'Align Center');
      }
      if (alignRightButton) {
        alignRightButton.setAttribute('title', 'Align Right');
      }
      if (alignJustifyButton) {
        alignJustifyButton.setAttribute('title', 'Justify');
      }
    };

    // Add tooltips after the component mounts and whenever the toolbar changes
    addTooltips();
  }, []);
  const onChangeHandler = (content, delta, source, editor) => {
    console.log({ content, delta, source, editor }, 'ReactQuillEditorUtpal');
    if (source !== 'user') {
      return;
    }
    onChange(content, delta, source, editor);
  };
  return (
    <>
      <ReactQuill
        id={id}
        value={value}
        onChange={(content, delta, source, editor) =>
          onChangeHandler(content, delta, source, editor)
        }
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </>
  );
};

export default ReactQuillEditor;
