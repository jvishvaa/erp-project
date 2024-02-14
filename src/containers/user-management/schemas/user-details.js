import * as Yup from 'yup';
import { Profanity } from 'components/file-validation/Profanity';

const phoneRegExp = /^\+?1?\d{10,10}$/;
// const erpAlphaNumericRegExp = /^[A-Za-z0-9_]{10,15}$/;
const lower = /^[0-9]{10,11}[_]{1}[A-Z]{3}$/;
// [A-Z0-9]{5,16}[_]{1}[A-Z]{3}$"
const validationSchema = Yup.object({
  first_name: Yup.string().required('Required'),
  first_name: Yup.string().test(
    'profanity',
    'First Name contains banned words, please check.',
    (value) => !Profanity(value)
  ),

  middle_name: Yup.string().test(
    'profanity',
    'Middle name contains banned words, please check.',
    (value) => !value || !Profanity(value) // Allow if empty or doesn't contain profanity
  ),

  last_name: Yup.string().required('Required'),
  last_name: Yup.string().test(
    'profanity',
    'Last Name contains banned words, please check.',
    (value) => !Profanity(value)
  ),

  gender: Yup.string().required('Required'),
  student_country_code: Yup.string().required('Required'),
  contact: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('Required'),
  date_of_birth: Yup.mixed().required('Required'),
  email: Yup.string().email('Provide a valid email').required('Required'),
  address: Yup.string().required('Required'),
  address: Yup.string().test(
    'profanity',
    'Address contains banned words, please check.',
    (value) => !Profanity(value)
  ),

  username: Yup.string().matches(
    lower,
    'Please provide the correct format for username. Ex: 2021000001_XYZ'
  ),
  username: Yup.string().test(
    'profanity',
    'Username contains banned words, please check.',
    (value) => !Profanity(value)
  ),
  // erp_user: Yup.string()
  // .required('Please Enter ERP_ID')
  // .matches(
  //   erpAlphaNumericRegExp,
  //   "Must Contain 10 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
  // ),
});

export default validationSchema;
