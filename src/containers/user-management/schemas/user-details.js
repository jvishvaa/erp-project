import * as Yup from 'yup';

const validationSchema = Yup.object({
  first_name: Yup.string().required('Required'),
  last_name: Yup.string().required('Required'),
  gender: Yup.string().required('Required'),
  contact: Yup.string().required('Required'),
  date_of_birth: Yup.mixed().required('Required'),
  email: Yup.string().email('Provide a valid email').required('Required'),
});

export default validationSchema;
