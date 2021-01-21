import { urls } from '../../../urls'
// import { questionLevel } from '../../../_reducers/questionLevel.reducer'
// import { GRADE, SUBJECT, ROLES } from '../../../_components/globalselector/config/constants'
/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/
export const BRANCH = 'Branch'
export const GRADE = 'Grade'
export const SUBJECT = 'Subject'
export const ROLES = { ADMIN: 'Admin', SUBJECTHEAD: 'Subjecthead', PRINCIPAL: 'Principal', ACADEMICCOORDINATOR: 'AcademicCoordinator'
}

let { GRADECHAPTER, BRANCHv2, GRADEMAPPINGv2, SUBJECTMAPPINGv2 } = urls
export const COMBINATIONS = {
  [ROLES.ADMIN]: [{
    name: GRADE,
    dependencies: [SUBJECT],
    url: GRADECHAPTER,
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    loadAtStart: true,
    single: true
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: GRADECHAPTER,
    params: ['grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id'
  }],
  [ROLES.PRINCIPAL]: [{
    name: GRADE,
    dependencies: [SUBJECT],
    url: GRADECHAPTER,
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    loadAtStart: true,
    single: true
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: GRADECHAPTER,
    params: ['grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id'
  }],
  [ROLES.ACADEMICCOORDINATOR]: [{
    name: GRADE,
    dependencies: [SUBJECT],
    url: GRADECHAPTER,
    label: 'grade_name',
    output: 'grade_id',
    value: 'grade_id',
    loadAtStart: true,
    single: true
  },
  {
    name: SUBJECT,
    dependencies: [],
    url: GRADECHAPTER,
    params: ['grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id'
  }],
  [ROLES.SUBJECTHEAD]: [
    {
      name: BRANCH,
      dependencies: [SUBJECT],
      url: BRANCHv2,
      label: 'branch_name',
      value: 'branch_id',
      output: 'branch_id',
      loadAtStart: true,
      single: true
    },
    {
      name: SUBJECT,
      dependencies: [GRADE],
      url: SUBJECTMAPPINGv2,
      label: 'subject_name',
      value: 'subject_id',
      output: 'subject_id',
      single: true
    },
    {
      name: GRADE,
      dependencies: [],
      url: GRADEMAPPINGv2,
      params: ['branch_id', 'acad_session', 'subject_id'],
      label: 'grade_name',
      value: 'grade_id',
      output: 'grade_id',
      single: true
    }
  ]
}
