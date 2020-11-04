import * as Yup from 'yup';

const validationSchema = Yup.object({
  academic_year: Yup.object('').required('Required').nullable(),
  branch: Yup.object('').required('Required').nullable(),
  grade: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.mixed(),
        grade_name: Yup.string(),
      })
    )
    .required('Required'),
  section: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.mixed(),
        section_name: Yup.string(),
      })
    )
    .required('Required'),
  subjects: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.mixed(),
        subject_name: Yup.string(),
      })
    )
    .required('Required'),
});

export default validationSchema;
