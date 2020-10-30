import * as Yup from 'yup';

const validationSchema = Yup.object({
  father_first_name: Yup.string().required('Required'),
  father_middle_name: Yup.string().required('Required'),
  father_last_name: Yup.string().required('Required'),
  mother_first_name: Yup.string().required('Required'),
  mother_middle_name: Yup.string().required('Required'),
  mother_last_name: Yup.string().required('Required'),
  father_email: Yup.string().email('Provide a valid email').required('Required'),
  mother_email: Yup.string().email('Provide a valid email').required('Required'),
  father_mobile: Yup.string().required('Required'),
  mother_mobile: Yup.string().required('Required'),
  address: Yup.string().required('Required'),
});

export default validationSchema;
