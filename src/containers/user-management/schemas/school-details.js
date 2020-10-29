import * as Yup from 'yup';

const validationSchema = Yup.object({
  academic_year: Yup.object().required('Required'),
  branch: Yup.object().required('Required'),
  grade: Yup.object().required('Required'),
  section: Yup.object().required('Required'),
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
