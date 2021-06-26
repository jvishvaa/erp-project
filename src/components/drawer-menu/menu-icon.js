import React from 'react';
import ClassIcon from '@material-ui/icons/Class';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ForumIcon from '@material-ui/icons/Forum';
import EditIcon from '@material-ui/icons/Edit';
import MessageIcon from '@material-ui/icons/Message';
import SmsIcon from '@material-ui/icons/Sms';
import EmailIcon from '@material-ui/icons/Email';
import TableChartIcon from '@material-ui/icons/TableChart';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import WebAsset from '@material-ui/icons/WebAsset';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import BookIcon from '@material-ui/icons/Book';
import SupervisorAccountOutlinedIcon from '@material-ui/icons/SupervisorAccountOutlined';
import WifiTetheringIcon from '@material-ui/icons/WifiTethering';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ReceiptRoundedIcon from '@material-ui/icons/ReceiptRounded';
import ViewListIcon from '@material-ui/icons/ViewList';
import FeedbackIcon from '@material-ui/icons/Feedback';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import {
  AccountBalance,
  AccountBalanceWallet,
  AccountBox,
  AlarmOn,
  Assessment,
  AssignmentInd,
  AssignmentTurnedIn,
  AttachMoney,
  BlurCircular,
  Book,
  ConfirmationNumber,
  Contacts,
  CreditCard,
  DateRange,
  EmojiTransportation,
  GroupAdd,
  LibraryAddCheck,
  LocalAtm,
  LocalLibrary,
  Loyalty,
  Money,
  Person,
  Report,
  School,
  Settings,
  ShopTwo,
  Store,
} from '@material-ui/icons';
import AssessmentIcon from '@material-ui/icons/Assessment';

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
      icon = <WifiTetheringIcon />;
      break;
    }
    case 'Time Table': {
      icon = <TableChartIcon />;
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
    case 'Fee Type': {
      icon = <CreditCard />;
      break;
    }
    case 'Fee Plan': {
      icon = <LocalAtm />;
      break;
    }
    case 'Misc. Fee To Class': {
      icon = <Money />;
      break;
    }
    case 'Publication': {
      icon = <LibraryBooksIcon />;
      break; 
    }
    case 'Transport Fees': {
      icon = <EmojiTransportation />;
      break;
    }

    case 'Approvals/Requests': {
      icon = <LibraryAddCheck />;
      break;
    }
    case 'Concession': {
      icon = <AlarmOn />;
      break;
    }
    case 'Reports': {
      icon = <Report />;
      break;
    }
    case 'Expense Management': {
      icon = <AccountBalanceWallet />;
      break;
    }

    case 'Coupons': {
      icon = <ConfirmationNumber />;
      break;
    }

    case 'student': {
      icon = <Person />;
      break;
    }

    case 'Admissions': {
      icon = <Contacts />;
      break;
    }

    case 'Banks & Fee Accounts': {
      icon = <AccountBalance />;
      break;
    }

    case 'Student Wallet': {
      icon = <AccountBalanceWallet />;
      break;
    }
    case 'Bulk Operations': {
      icon = <GroupAdd />;
      break;
    }
    case 'Bulk Operations': {
      icon = <GroupAdd />;
      break;
    }
    case 'Settings': {
      icon = <Settings />;
      break;
    }
    case 'Expanse Management': {
      icon = <AssignmentTurnedIn />;
      break;
    }
    case 'E-Mandate': {
      icon = <DateRange />;
      break;
    }
    case 'Diary': {
      icon = <LocalLibrary />;
      break;
    }
    case 'Circular': {
      icon = <BlurCircular />;
      break;
    }
    case 'Finance': {
      icon = <AttachMoney />;
      break;
    }
    case 'Store': {
      icon = <Store />;
      break;
    }
    case 'Orchadio': {
      icon = <School />;
      break;
    }
    case 'Marketing Admin': {
      icon = <ShopTwo />;
      break;
    }
    case 'Marketing Report': {
      icon = <Assessment />;
      break;
    }
    case 'Aol Sales': {
      icon = <Loyalty />;
      break;
    }
    case 'ID Card': {
      icon = <AccountBox />;
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
    case 'Assessment': {
      icon = <AssessmentIcon />;
      break;
    }
    case 'Discussion Forum': {
      icon = <ForumIcon />;
      break;
    }
    case 'Ebook': {
      icon = <MenuBookIcon />;
      break;
    }
    case 'Calendar & Attendance': {
      icon = <CalendarTodayIcon />;
      break;
    }
    case 'Appointment': {
      icon = <ReceiptRoundedIcon />;
      break;
    }
    case 'Griviences': {
      icon = <FeedbackIcon />;
      break;
    }
    case 'School Strength': {
      icon = <ViewListIcon />;
      break;
    }

    default:
      break;
  }
  return icon;
};

export default menuIcon;
