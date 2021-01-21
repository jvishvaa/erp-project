import { urls } from '../../../urls'

let { BRANCHv2, SECTIONMAPPINGv2, GRADEMAPPINGv2, SUBJECTMAPPINGv2 } = urls

const BRANCH = 'Branch'
const GRADE = 'Grade'
const SECTION = 'Section'
const SUBJECT = 'Subject'
const ROLES = { ADMIN: 'Admin',
  TEACHER: 'Teacher',
  SUBJECTHEAD: 'Subjecthead',
  PLANNER: 'Planner',
  LEADTEACHER: 'LeadTeacher',
  EXAMINATIONHEAD: 'ExaminationHead'
}

export const COMBINATIONS = {
  [ROLES.ADMIN]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    single: true,
    loadAtStart: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'grade_id',
    single: true,
    value: 'acad_branch_grade_mapping_id'
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    output: 'section_id',
    single: true,
    value: 'section_id'
  }],
  [ROLES.EXAMINATIONHEAD]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    single: true,
    loadAtStart: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'grade_id',
    single: true,
    value: 'acad_branch_grade_mapping_id'
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    output: 'section_id',
    single: true,
    value: 'section_id'
  }],
  [ROLES.TEACHER]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    single: true,
    loadAtStart: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'grade_id',
    single: true,
    value: 'acad_branch_grade_mapping_id'
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    single: true,
    output: 'section_id'
  }],
  [ROLES.LEADTEACHER]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    single: true,
    loadAtStart: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    output: 'grade_id',
    single: true,
    value: 'acad_branch_grade_mapping_id'
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    single: true,
    output: 'section_id'
  }],
  [ROLES.PLANNER]: [{
    name: BRANCH,
    dependencies: [GRADE],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    single: true,
    loadAtStart: true
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    single: true,
    value: 'acad_branch_grade_mapping_id',
    output: 'grade_id'
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    single: true,
    output: 'section_id'
  }],
  [ROLES.SUBJECTHEAD]: [{
    name: BRANCH,
    dependencies: [],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    loadAtStart: true,
    single: true,
    output: 'branch_id'
  },
  {
    name: SUBJECT,
    dependencies: [GRADE],
    url: SUBJECTMAPPINGv2,
    label: 'subject_name',
    value: 'subject_id',
    loadAtStart: true,
    single: true
  },
  {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id', 'acad_session', 'subject_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    single: true,
    output: 'grade_id'
  },
  {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['branch_id', 'acad_branch_grade_mapping_id'],
    label: 'section_name',
    value: 'section_id',
    single: true,
    output: 'section_id'
  }]
}
