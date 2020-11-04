import * as Yup from 'yup';

const validationSchema = (validateParent, validateGuardian) => {
  const parentValidationObj = Yup.object({
    father_first_name: Yup.string().required('Required'),
    father_last_name: Yup.string().required('Required'),
    mother_first_name: Yup.string().required('Required'),
    mother_last_name: Yup.string().required('Required'),
    father_email: Yup.string().email('Provide a valid email').required('Required'),
    mother_email: Yup.string().email('Provide a valid email').required('Required'),
    father_mobile: Yup.string().required('Required'),
    mother_mobile: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
  });

  const guardianValidationObj = Yup.object({
    guardian_first_name: Yup.string().required('Required'),
    guardian_last_name: Yup.string().required('Required'),
    guardian_email: Yup.string().email('Provide a valid email').required('Required'),
    guardian_mobile: Yup.string().required('Required'),
  });

  const parentGuardianValidationObj = Yup.object({
    father_first_name: Yup.string().required('Required'),
    father_last_name: Yup.string().required('Required'),
    mother_first_name: Yup.string().required('Required'),
    mother_last_name: Yup.string().required('Required'),
    father_email: Yup.string().email('Provide a valid email').required('Required'),
    mother_email: Yup.string().email('Provide a valid email').required('Required'),
    father_mobile: Yup.string().required('Required'),
    mother_mobile: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    guardian_first_name: Yup.string().required('Required'),
    guardian_last_name: Yup.string().required('Required'),
    guardian_email: Yup.string().email('Provide a valid email').required('Required'),
    guardian_mobile: Yup.string().required('Required'),
  });

  if (validateParent && validateGuardian) {
    return parentGuardianValidationObj;
  }
  if (validateParent) {
    return parentValidationObj;
  }
  return guardianValidationObj;
};

export default validationSchema;
