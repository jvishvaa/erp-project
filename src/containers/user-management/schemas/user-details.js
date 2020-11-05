import * as Yup from 'yup';

const phoneRegExp = /^\+?1?\d{9,15}$/;

const validationSchema = Yup.object({
  first_name: Yup.string().required('Required'),
  last_name: Yup.string().required('Required'),
  gender: Yup.string().required('Required'),
  contact: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('Required'),
  date_of_birth: Yup.mixed().required('Required'),
  email: Yup.string().email('Provide a valid email').required('Required'),
});

export default validationSchema;
