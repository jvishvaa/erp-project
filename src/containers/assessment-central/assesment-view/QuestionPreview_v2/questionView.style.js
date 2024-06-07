export default (theme) => ({
  number: {
    '&input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    width: '100%',
  },
  publishSelect: {
    height: '30px',
    backgroundColor: '#ff6b6b',
    color: '#fff',
    borderColor: '#ff6b6b',
    outline: 'none',
    borderRadius: '4px 4px 4px 4px',
  },
  publishSelectOption: {
    paddingTop: '5px',
    paddingBottom: '5px',
    '-mozPddingBottom': '5px',
    '-webkitPaddingBottom': '5px',
  },
  publishButton: {
    borderRadius: '4px 4px 4px 4px',
    marginLeft: '4px',
    minWidth: '30px',
    height: '30px',
  },
  generatedQuestion: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  chapterField: {
    backgroundColor: '#E8F1FF',
    '& input': {
      color: '#458CFF',
    },
  },
  bloomsField: {
    backgroundColor: '#E8F1FF',
    '& input': {
      color: '#458CFF',
    },
  },
  difficultyField: {
    backgroundColor: '#FADBFF',
    '& input': {
      color: '#A545B5',
    },
  },
  typeField: {
    backgroundColor: '#FFDADA',
    '& input': {
      color: '#F94144',
    },
  },
  incrementer: {
    '@media (max-width: 780px)': {
      width: '50%',
    },
  },
  addMoreButton: {
    '@media (max-width: 505px)': {
      width: '40%',
    },
  },
  subject: {
    '@media (max-width: 1274px)': {
      marginRight: '5%',
    },
    '@media (max-width: 959px)': {
      marginRight: '8%',
    },
    '@media (max-width: 825px)': {
      marginRight: '5%',
    },
    '@media (max-width: 631px)': {
      marginRight: '1%',
    },
  },
  totalQuestion: {
    '@media (max-width: 1111px)': {
      marginLeft: '3%',
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
  generatedQuestionDiv: {
    marginLeft: '0%',
    '& p': {
      marginBottom: '0px !important',
      textAlign: 'justify !important',
      maxWidth: '100% !important',
    },
    '& img': {
      maxWidth: '500px !important',
      maxHeight: '350px !important',
      objectFit: 'contain !important',
    },
  },
  noDataQuestion: {
    color: 'red',
    fontWeight: 'bolder',
  },
  textJustify: {
    textAlign: 'justify',
  },
  regenerateManualQuestionModalFiltertext: {
    fontSize: '13px',
  },
  manualQuestion: {
    padding: '8px',
    backgroundColor: '#f3f3f3',
    borderRadius: '12px',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  manualQuestionSelected: {
    border: '2px solid #a5beff',
    backgroundColor: '#dfdfdf',
  },
});
