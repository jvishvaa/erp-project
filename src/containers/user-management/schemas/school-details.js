import * as Yup from 'yup';

const validationSchema = Yup.object({
  academic_year: Yup.object('').required('Required').nullable(),
  branch: Yup.object('').required('Required').nullable(),
  grade: Yup.object('').required('Required').nullable(),
  section: Yup.object('').required('Required').nullable(),
  subjects: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.mixed(),
        section__section_name: Yup.string(),
      })
    )
    .required('Required'),
});

export default validationSchema;
