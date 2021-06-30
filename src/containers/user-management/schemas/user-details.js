import * as Yup from 'yup';

const phoneRegExp = /^\+?1?\d{10,11}$/;
// const erpAlphaNumericRegExp = /^[A-Za-z0-9_]{10,15}$/;
const lower = /^[0-9]{5,16}_+([A-Z]{3})?$/;

const validationSchema = Yup.object({
  first_name: Yup.string().required('Required'),
  last_name: Yup.string().required('Required'),
  gender: Yup.string().required('Required'),
  student_country_code:Yup.string().required("Required"),
  contact: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('Required'),
  date_of_birth: Yup.mixed().required('Required'),
  email: Yup.string().email('Provide a valid email').required('Required'),
  address: Yup.string().required('Required'),

  username: Yup.string().matches(
    lower,
    'Please provide the correct format for username. Ex: 2021000001_XYZ'
  ),
  // erp_user: Yup.string()
  // .required('Please Enter ERP_ID')
  // .matches(
  //   erpAlphaNumericRegExp,
  //   "Must Contain 10 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
  // ),
});

export default validationSchema;
