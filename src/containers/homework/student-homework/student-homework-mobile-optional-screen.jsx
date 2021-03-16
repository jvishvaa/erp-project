import React from 'react';
import PropTypes from 'prop-types';
//import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { SvgIcon } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
//import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
//import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
//import PersonIcon from '@material-ui/icons/Person';
//import AddIcon from '@material-ui/icons/Add';
//import { blue } from '@material-ui/core/colors';
import CancelIcon from '../../../assets/images/Cancel-icon.svg';
import './student-homework.css';
//const emails = ['username@gmail.com', 'user02@gmail.com'];
/* const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});
*/
function SimpleDialog(props) {
  //const classes = useStyles();
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
  
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const getSubjectDetiels = (e, name, subjectWise) => {
   let filaJson =[]
    for(let i of subjectWise){
      filaJson.push({
        subject:i[name],
        date: i['date']
      })
    
    }
   
    props.showSubjectWise(filaJson)
  }
  const filtered = props.subject.subjectName.filter(function (el) {
    return el.subject_slag != null;
  });

  
  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <SvgIcon
        component={() => (
          <img
          onClick={handleClose}
            style={{ width: '28px', marginLeft: '225px', marginTop: '7px' }}
            src={CancelIcon}
            alt='CancelIcon'
          />
        )}
      />

      <List className="list-ul">
        { props && props.options !== undefined && props.options ? props.options.map((subName, index) => {
          return (
            <ListItem button onClick={() => handleListItemClick(subName)} key={index}>
                <ListItemText className="list-item-text"
                  onClick={(e)=>getSubjectDetiels(e, subName, props.subjectWise)}
                  primary={subName} style={{ fontSize: '20px' }} />
            </ListItem>

          )
        }
        ): null}

      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  showSubjectWise: PropTypes.func.isRequired,
  subjectWise: PropTypes.string,
  options: PropTypes.string
};

export default function MobileOptional(props) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };
  //  console.log(props.options, "nameofSubject", selectedValue)
  return (
    <div className={"mobile-modal"} id="popUp">
      <Button variant="outlined" color="primary"  onClick={handleClickOpen} className="modal-optional-button-count">
        {props.nameofSubject}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <p className="modal-popup-opt-count">{props.options && props.options.length}</p>
      </Button>
      <SimpleDialog selectedValue={false} open={open} subject={props} 
        subjectWise={props.subject}
        showSubjectWise={props.showSubjectWise} onClose={handleClose}
        options={props.options}
      />
    </div>
  );
}
