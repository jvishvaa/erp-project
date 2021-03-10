import React from 'react';
import { AttachmentPreviewerContextProvider } from './attachment-previewer-contexts';
import { AttachmentPreviewerUI } from './attachment-previewer-ui';

function AttachmentPreviewer({ children, ...restProps }) {
  return (
    <AttachmentPreviewerContextProvider>
      <AttachmentPreviewerUI />
      {children}
    </AttachmentPreviewerContextProvider>
  );
}
export default AttachmentPreviewer;
