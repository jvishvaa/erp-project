import * as Yup from 'yup';
import { Profanity } from 'components/file-validation/Profanity';

const phoneRegExp = /^\+?1?\d{10,10}$/;

const validationSchema = (validateParent, validateGuardian) => {
  const parentValidationObj = Yup.object({
    father_first_name: Yup.string().required('Required'),
    father_first_name: Yup.string().test(
      'profanity',
      'First Name contains banned words, please check.',
      (value) => !Profanity(value)
    ),

    father_middle_name: Yup.string().test(
      'profanity',
      'Middle name contains banned words, please check.',
      (value) => !value || !Profanity(value) // Allow if empty or doesn't contain profanity
    ),

    father_last_name: Yup.string().required('Required'),
    father_last_name: Yup.string().test(
      'profanity',
      'Last Name contains banned words, please check.',
      (value) => !Profanity(value)
    ),

    mother_first_name: Yup.string().required('Required'),
    mother_first_name: Yup.string().test(
      'profanity',
      'First Name contains banned words, please check.',
      (value) => !Profanity(value)
    ),

    mother_middle_name: Yup.string().test(
      'profanity',
      'Middle name contains banned words, please check.',
      (value) => !value || !Profanity(value) // Allow if empty or doesn't contain profanity
    ),

    mother_last_name: Yup.string().required('Required'),
    mother_last_name: Yup.string().test(
      'profanity',
      'Last Name contains banned words, please check.',
      (value) => !Profanity(value)
    ),

    father_email: Yup.string().email('Provide a valid email').required('Required'),
    mother_email: Yup.string().email('Provide a valid email').required('Required'),
    father_country_code: Yup.string().required('Required'),
    father_mobile: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Required'),
    mother_country_code: Yup.string().required('Required'),
    mother_mobile: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Required'),
    address: Yup.string().required('Required'),
    address: Yup.string().test(
      'profanity',
      'Address contains banned words, please check.',
      (value) => !Profanity(value)
    ),
  });

  const guardianValidationObj = Yup.object({
    guardian_first_name: Yup.string().required('Required'),
    guardian_first_name: Yup.string().test(
      'profanity',
      'First Name contains banned words, please check.',
      (value) => !Profanity(value)
    ),

    guardian_middle_name: Yup.string().test(
      'profanity',
      'Middle name contains banned words, please check.',
      (value) => !value || !Profanity(value) // Allow if empty or doesn't contain profanity
    ),

    guardian_last_name: Yup.string().required('Required'),
    guardian_last_name: Yup.string().test(
      'profanity',
      'Last Name contains banned words, please check.',
      (value) => !Profanity(value)
    ),

    guardian_email: Yup.string().email('Provide a valid email').required('Required'),
    guardian_country_code: Yup.string().required('Required'),
    guardian_mobile: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Required'),
  });

  const parentGuardianValidationObj = Yup.object({
    father_first_name: Yup.string().required('Required'),
    father_first_name: Yup.string().test(
      'profanity',
      'First Name contains banned words, please check.',
      (value) => !Profanity(value)
    ),

    father_middle_name: Yup.string().test(
      'profanity',
      'Middle name contains banned words, please check.',
      (value) => !value || !Profanity(value) // Allow if empty or doesn't contain profanity
    ),

    father_last_name: Yup.string().required('Required'),
    father_last_name: Yup.string().test(
      'profanity',
      'Last Name contains banned words, please check.',
      (value) => !Profanity(value)
    ),

    mother_first_name: Yup.string().required('Required'),
    mother_first_name: Yup.string().test(
      'profanity',
      'First Name contains banned words, please check.',
      (value) => !Profanity(value)
    ),

    mother_middle_name: Yup.string().test(
      'profanity',
      'Middle name contains banned words, please check.',
      (value) => !value || !Profanity(value) // Allow if empty or doesn't contain profanity
    ),

    mother_last_name: Yup.string().required('Required'),
    mother_last_name: Yup.string().test(
      'profanity',
      'Last Name contains banned words, please check.',
      (value) => !Profanity(value)
    ),

    father_email: Yup.string().email('Provide a valid email').required('Required'),
    mother_email: Yup.string().email('Provide a valid email').required('Required'),
    father_country_code: Yup.string().required('Required'),
    father_mobile: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Required'),
    mother_country_code: Yup.string().required('Required'),
    mother_mobile: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Required'),

    address: Yup.string().required('Required'),
    address: Yup.string().test(
      'profanity',
      'Address contains banned words, please check.',
      (value) => !Profanity(value)
    ),

    guardian_first_name: Yup.string().required('Required'),
    guardian_first_name: Yup.string().test(
      'profanity',
      'First Name contains banned words, please check.',
      (value) => !Profanity(value)
    ),

    guardian_middle_name: Yup.string().test(
      'profanity',
      'Middle name contains banned words, please check.',
      (value) => !value || !Profanity(value) // Allow if empty or doesn't contain profanity
    ),

    guardian_last_name: Yup.string().required('Required'),
    guardian_last_name: Yup.string().test(
      'profanity',
      'Last Name contains banned words, please check.',
      (value) => !Profanity(value)
    ),

    guardian_email: Yup.string().email('Provide a valid email').required('Required'),
    guardian_country_code: Yup.string().required('Required'),
    guardian_mobile: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Required'),
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
