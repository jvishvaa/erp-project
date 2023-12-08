export default (theme) => ({
  mainContainer: {
    padding: '0 10px',
    margin: '-15px 0 0',
    '& .MuiButton-root': {
      textTransform: 'none',
    },
    '& .MuiButton-root.MuiButton-outlinedPrimary': {
      backgroundColor: 'transparent',
    },
  },
  textField: {
    '& .MuiFormLabel-root': {
      fontSize: 13, // Example style
      // Add more styles as you need
    },
    '& .MuiInputBase-root': {
      fontSize: 12,
      '& input': {
        padding: '8px',
      },
      // Add more styles as you need
    },
  },
  autoCompleate: {
    '& .MuiInputBase-root': {
      fontSize: 12,
      padding: '4px 40px 4px 4px !important',
      // Add more styles as you need
    },
    '& .MuiFormLabel-root': {
      fontSize: 13, // Example style
      // Add more styles as you need
    },
    '& .MuiAutocomplete-endAdornment': {
      top: '3px',
      right: '1px !important',
      padding: '2px 0px 0px 0px',
      '& .MuiAutocomplete-clearIndicator, & .MuiAutocomplete-popupIndicator': {
        padding: '0',
        '& span': {
          padding: 0,
          '& svg': {
            height: '21px',
            width: '21px',
          },
        },
      },
    },
    '& .MuiChip-root': {
      fontSize: '12px',
      padding: 0,
    },
    '& .MuiChip-root, & .MuiChip-sizeSmall': {
      height: '20px',
    },
  },
  modal: {
    '& .MuiButton-root': {
      textTransform: 'none',
    },
    '& .MuiButton-root.MuiButton-outlinedPrimary': {
      backgroundColor: 'transparent',
    },
  },
  stepper: {
    '& .MuiStepIcon-text': {
      fill: '#fff',
    },
  },
  paperContent: {
    padding: '10px',
  },
  divider: {
    marginTop: theme.spacing(1),
  },
  tablecell: {
    padding: '4px 6px',
    border: '1px solid #DFE3E8',
    height: 'auto',
    fontSize: '11px',
    pageBreakInside: 'auto',
    pageBreakBefore: 'avoid',
    pageBreakAfter: 'avoid',

    // whiteSpace: "nowrap",
  },
  noBorder: {
    border: 'none',
  },
  tablecellimage: { width: '25%' },
  teblerow: {
    height: 'auto',
  },
  tablelogo: {
    height: '80px',
    weight: '80px',
  },
  backgroundlightgray: {
    backgroundColor: 'lightgray',
  },
  instruction: {
    fontFamily: 'inherit',
    fontSize: '12px',
    whiteSpace: 'inherit',
  },
  previewSectionHeader: {
    fontSize: '12px',
    fontWeight: '800',
    textDecoration: 'underline',
  },
  previewSectionDescription: {
    fontSize: '12px',
    fontWeight: '600',
  },
  questionPreviewTableStyle: {
    height: '400px',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: '3px',
      height: '3px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
    '&:hover': {
      boxShadow:
        'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px',
      cursor: 'pointer',
    },
  },
  chooseTemplateModalOptions: {
    minWidth: 'auto',
    position: 'relative',
    margin: '0',
    '& .MuiRadio-root': {
      position: 'absolute',
      top: '5px',
      left: '-3px',
    },
  },
  chooseTemplateModalOptionsContainer: {
    // height: "400px",
    overflowY: 'hidden',
    border: '1px solid #DFE3E8',
    padding: '0px ',
    backgroundColor: '#DFE3E8',
  },
  chooseTemplateTableContainer: {
    overflowY: 'hidden',
    overflowX: 'scroll',
    '&::-webkit-scrollbar': {
      width: '3px',
      height: '3px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  },
  chooseTemplateTableHead: {
    backgroundColor: '#F2F2F2',
    whiteSpace: 'nowrap',
  },
  chooseTemplateTableRow: {
    height: 'fit-content',
  },
  chooseTemplateCell: {
    padding: '3px 5px',
    border: '1px solid #949494',
    fontSize: '12px',
  },
  generatedQuestionDiv: {
    pageBreakInside: 'always !important',
    marginLeft: '0%',
    '& p': {
      marginBottom: '0px !important',
      textAlign: 'justify !important',
      maxWidth: '100% !important',
    },
    '& img': {
      maxWidth: '350px !important',
      maxHeight: '250px !important',
      objectFit: 'contain !important',
    },
  },
});
