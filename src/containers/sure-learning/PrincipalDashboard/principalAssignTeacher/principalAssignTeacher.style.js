export default (theme) => ({
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 650,
    marginTop: '2rem',
  },
  paper: {
    overflow: true,
    padding: theme.spacing(1, 2, 1),
    marginTop: '10px',
  },
  modalPaper: {
    overflow: true,
    backgroundColor: 'snow',
    padding: theme.spacing(1, 2, 1),
    marginTop: '10px',
  },
  answerPaper: {
    color: 'lightgray',
    padding: theme.spacing(1, 2, 1),
    marginTop: '10px',
    width: '100%',
  },
  contentBox: {
    color: 'lightgray',
    padding: theme.spacing(1, 2, 1),
    marginTop: '10px',
    width: '100%',
    marginBottom: '5px',
  },
  button: {
    marginTop: '13px',
    fontSize: '10px',
  },
  Deletebutton: {
    marginTop: '10px',
  },
  removeContentButton: {
    marginTop: '20px',
  },
  typography: {
    marginTop: '10px',
    color: 'black',
  },
  Typography: {
    padding: theme.spacing(1, 2, 1),
    backgroundColor: 'snow',
  },
  TypographyDate: {
    padding: theme.spacing(1, 2, 0),
  },
  textField: {
    width: '100%',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mcqmodal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  timer: {
    fontSize: '15px',
  },
  ImageUpload: {
    marginTop: '9px',
    textAlign: 'center',
  },
});
