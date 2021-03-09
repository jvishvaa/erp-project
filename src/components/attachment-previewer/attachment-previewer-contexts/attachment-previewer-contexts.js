import React from 'react';

export const AttachmentPreviewerContext = React.createContext();
export function AttachmentPreviewerContextProvider({ children }) {
  const [attachments, setAttachments] = React.useState([]);
  // const [attachments, setAttachments] = React.useState([
  //   {
  //     src:
  //       'https://trello-attachments.s3.amazonaws.com/6019233e97c6e58477f2621f/602234c24df242896848ffb1/bd1cd4a0e00622346d164ee34a767b3b/Screenshot_from_2021-02-26_12-20-09.png',
  //     name: 'Screenshot_from_2021-02-26_12-20-09.png',
  //     extension: '.png',
  //   },
  //   {
  //     src: 'http://www.africau.edu/images/default/sample.pdf',
  //     name: 'Pdf file',
  //     extension: '.pdf',
  //   },
  // ]);
  // const [isOpen, setIsOpen] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(null);
  const [currentAttachmentIndex, setAttachmentIndex] = React.useState(0);

  const [
    onPreviewCloseCallBackExpression,
    setPreviewCloseCallBackExpression,
  ] = React.useState(() => {});

  function updateAttachementIndex(attachmentIndexFromConsumer, newAttachmentsArray) {
    const attachmentsArray = newAttachmentsArray || attachments;
    if (attachmentIndexFromConsumer !== currentAttachmentIndex) {
      const isValidIndex = attachmentsArray[attachmentIndexFromConsumer];
      setAttachmentIndex(isValidIndex ? +attachmentIndexFromConsumer : 0);
    }
  }
  function updateAttachments(attachmentsArray) {
    if (Array.isArray(attachmentsArray) && attachmentsArray.length) {
      setAttachments(attachmentsArray);
    }
    const isValidIndex = attachmentsArray[currentAttachmentIndex];
    if (isValidIndex) {
      // eslint-disable-next-line no-console
      console.log('Invalid idex');
    } else {
      setAttachmentIndex(0);
    }
  }
  function handleOpen() {
    setIsOpen(true);
  }
  function handleClose() {
    setIsOpen(false);
  }
  function openPreview(propObj) {
    const {
      currentAttachmentIndex: currentAttachmentIndexFromConsumer = null,
      attachmentsArray,
      onClose = () => {},
    } = propObj || {};
    setPreviewCloseCallBackExpression(onClose);
    updateAttachments(attachmentsArray);
    updateAttachementIndex(currentAttachmentIndexFromConsumer, attachmentsArray);
    handleOpen();
  }
  function closePreview() {
    handleClose();
  }

  React.useEffect(() => {
    if (isOpen === false) {
      if (onPreviewCloseCallBackExpression) {
        onPreviewCloseCallBackExpression();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function nextAttachment(callback = () => {}) {
    const isNextIndexValid = !!attachments[+(currentAttachmentIndex || 0) + 1];
    if (isNextIndexValid) {
      setAttachmentIndex(+currentAttachmentIndex + 1);
      callback({ message: 'Success', success: true });
    } else {
      callback({
        message: 'No further attachements, please navidate to previous attachment.',
        success: false,
      });
    }
  }
  function prevAttachment(callback = () => {}) {
    const isPrevIndexValid = !!attachments[+(currentAttachmentIndex || 0) - 1];
    if (isPrevIndexValid) {
      setAttachmentIndex(+currentAttachmentIndex - 1);
      callback({ message: 'Success', success: true });
    } else {
      callback({
        message: 'No previous attachements, please navidate to next attachment.',
        success: false,
      });
    }
  }
  return (
    <AttachmentPreviewerContext.Provider
      value={{
        attachments,
        currentAttachmentIndex,
        openPreview,
        closePreview,
        controls: {
          next: nextAttachment,
          prev: prevAttachment,
          count: Array.isArray(attachments) && attachments.length,
          isOpen,
          isNextAvailable: !!attachments[+(currentAttachmentIndex || 0) + 1],
          isPrevAvailable: !!attachments[+(currentAttachmentIndex || 0) - 1],
        },
      }}
    >
      {children}
    </AttachmentPreviewerContext.Provider>
  );
}
