import React from 'react';
import ClassIcon from '@material-ui/icons/Class';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ForumIcon from '@material-ui/icons/Forum';
import EditIcon from '@material-ui/icons/Edit';
import MessageIcon from '@material-ui/icons/Message';
import SmsIcon from '@material-ui/icons/Sms';
import EmailIcon from '@material-ui/icons/Email';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import WebAsset from '@material-ui/icons/WebAsset';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import SupervisorAccountOutlinedIcon from '@material-ui/icons/SupervisorAccountOutlined';

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
    case 'SMS & Email Log': {
      icon = <EmailIcon />;
      break;
    }
    case 'Homework': {
      icon = <HomeWorkIcon />;
      break;
    }
    case 'Lesson Plan': {
      icon = <ImportContactsIcon />;
      break;
    }
    case 'Blogs': {
      icon = <WebAsset />;
      break;
    }
    case 'Master Management': {
      icon = <SupervisorAccountOutlinedIcon />;
      break;
    }
    case 'User Management': {
      icon = <PeopleIcon />;
      break;
    }
    case 'Role Management': {
      icon = <AssignmentIndIcon />;
      break;
    }
    default:
      break;
  }
  return icon;
};

export default menuIcon;
