import React from 'react';
import ClassIcon from '@material-ui/icons/Class';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ForumIcon from '@material-ui/icons/Forum';
import EditIcon from '@material-ui/icons/Edit';
import MessageIcon from '@material-ui/icons/Message';
import SmsIcon from '@material-ui/icons/Sms';
import EmailIcon from '@material-ui/icons/Email';

const menuIcon = (name) => {
  let icon = '';
  switch (name) {
    case 'Take Class': {
      icon = '';
      break;
    }
    case 'View Class': {
      icon = <ClassIcon />;
      break;
    }
    case 'Create Class': {
      icon = <AddCircleIcon />;
      break;
    }
    case 'Online Class': {
      icon = <ClassIcon />;
      break;
    }
    case 'Communication': {
      icon = <ForumIcon />;
      break;
    }
    case 'Add Group': {
      icon = <AddCircleIcon />;
      break;
    }
    case 'View&Edit Group': {
      icon = <EditIcon />;
      break;
    }
    case 'Send Message': {
      icon = <MessageIcon />;
      break;
    }
    case 'Add SMS Credit': {
      icon = <SmsIcon />;
      break;
    }
    case 'SMS&Email Log': {
      icon = EmailIcon;
      break;
    }

    default:
      break;
  }
  return icon;
};

export default menuIcon;
