import { urls } from '../../../../urls'

export const BRANCH = 'Branch'
export const GRADE = 'Grade'
export const SUBJECT = 'Subject'
export const CHAPTER = 'Chapter'
export const ROLES = { ADMIN: 'Admin',
  TEACHER: 'Teacher',
  LEADTEACHER: 'LeadTeacher',
  SUBJECTHEAD: 'Subjecthead',
  PLANNER: 'Planner',
  STUDENT: 'Student',
  REVIEWER: 'Reviewer',
  PRINCIPAL: 'Principal'
}

/**
 * @fileoverview Describes selector configurations for different roles.
 */

/**
 * Describes the combination of data for different roles.
 * @typedef {Object} COMBINATIONS
*/

let { GRADECHAPTER, GetChaptersWithQuestionCount: Chapter, BRANCHv2, GetSubjectsWithQuestionCount } = urls

export const COMBINATIONS = {
  [ROLES.ADMIN]: [
    {
      name: BRANCH,
      dependencies: [GRADE],
      url: BRANCHv2,
      label: 'branch_name',
      value: 'branch_id',
      output: 'branch_id',
      loadAtStart: true,
      single: true
    },
    {
      name: GRADE,
      dependencies: [SUBJECT],
      url: GRADECHAPTER,
      label: 'grade_name',
      output: 'grade_id',
      value: 'grade_id',
      single: true
    },
    {
      name: SUBJECT,
      dependencies: [CHAPTER],
      // url: GRADECHAPTER,
      url: GetSubjectsWithQuestionCount,
      params: ['grade_id'],
      // additionalParams: [{ is_global_selector: 'True' }],
      label: 'subject_name',
      output: 'subject_id',
      value: 'subject_id',
      single: true
    }, {
      name: CHAPTER,
      dependencies: [],
      url: Chapter,
      params: ['grade_id', 'subject_id'],
      additionalParams: [{ feature: 'practice_questions' }, { is_hidden: 'False' }, { is_global_selector: 'True' }],
      label: 'chapter_name',
      output: 'id',
      value: 'id',
      single: true
    }],
  [ROLES.TEACHER]: [
    {
      name: BRANCH,
      dependencies: [GRADE],
      url: BRANCHv2,
      label: 'branch_name',
      value: 'branch_id',
      output: 'branch_id',
      loadAtStart: true,
      single: true
    },
    {
      name: GRADE,
      dependencies: [SUBJECT],
      url: GRADECHAPTER,
      label: 'grade_name',
      output: 'grade_id',
      value: 'grade_id',
      single: true
    },
    {
      name: SUBJECT,
      dependencies: [CHAPTER],
      url: GRADECHAPTER,
      params: ['grade_id'],
      label: 'subject_name',
      output: 'subject_id',
      value: 'subject_id',
      single: true
    }, {
      name: CHAPTER,
      dependencies: [],
      url: Chapter,
      params: ['grade_id', 'subject_id'],
      additionalParams: [{ feature: 'practice_questions' }, { is_hidden: 'False' }, { is_global_selector: 'True' }],
      label: 'chapter_name',
      output: 'id',
      value: 'id',
      single: true
    }],
  [ROLES.LEADTEACHER]: [
    {
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
      dependencies: [CHAPTER],
      url: GRADECHAPTER,
      params: ['grade_id'],
      label: 'subject_name',
      output: 'subject_id',
      value: 'subject_id',
      single: true
    }, {
      name: CHAPTER,
      dependencies: [],
      url: Chapter,
      params: ['grade_id', 'subject_id'],
      additionalParams: [{ feature: 'practice_questions' }, { is_hidden: 'False' }, { is_global_selector: 'True' }],
      label: 'chapter_name',
      output: 'id',
      value: 'id',
      single: true
    }],
  [ROLES.PLANNER]: [{
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
    dependencies: [CHAPTER],
    url: GRADECHAPTER,
    params: ['grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id',
    single: true
  }, {
    name: CHAPTER,
    dependencies: [],
    url: Chapter,
    params: ['grade_id', 'subject_id'],
    additionalParams: [{ feature: 'practice_questions' }, { is_hidden: 'False' }, { is_global_selector: 'True' }],
    label: 'chapter_name',
    output: 'id',
    value: 'id',
    single: true
  }],
  [ROLES.SUBJECTHEAD]: [
    {
      name: SUBJECT,
      dependencies: [GRADE],
      url: GRADECHAPTER,
      params: [],
      label: 'subject_name',
      output: 'subject_id',
      value: 'subject_id',
      loadAtStart: true,
      single: true
    }, {
      name: GRADE,
      dependencies: [CHAPTER],
      params: ['subject_id'],
      url: GRADECHAPTER,
      label: 'grade_name',
      output: 'grade_id',
      value: 'grade_id',
      single: true
    },
    {
      name: CHAPTER,
      dependencies: [],
      url: Chapter,
      params: ['grade_id', 'subject_id'],
      additionalParams: [{ feature: 'practice_questions' }, { is_hidden: 'False' }, { is_global_selector: 'True' }],
      label: 'chapter_name',
      output: 'id',
      value: 'id',
      single: true
    }
  ],
  [ROLES.REVIEWER]: [{
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
    dependencies: [CHAPTER],
    url: GRADECHAPTER,
    params: ['grade_id'],
    label: 'subject_name',
    output: 'subject_id',
    value: 'subject_id',
    single: true
  }, {
    name: CHAPTER,
    dependencies: [],
    url: Chapter,
    params: ['grade_id', 'subject_id'],
    additionalParams: [{ feature: 'practice_questions' }, { is_hidden: 'False' }, { is_global_selector: 'True' }],
    label: 'chapter_name',
    output: 'id',
    value: 'id',
    single: true
  }],
  [ROLES.PRINCIPAL]: [
    {
      name: BRANCH,
      dependencies: [GRADE],
      url: BRANCHv2,
      label: 'branch_name',
      value: 'branch_id',
      output: 'branch_id',
      loadAtStart: true,
      single: true
    },
    {
      name: GRADE,
      dependencies: [SUBJECT],
      url: GRADECHAPTER,
      label: 'grade_name',
      output: 'grade_id',
      value: 'grade_id',
      single: true
    },
    {
      name: SUBJECT,
      dependencies: [CHAPTER],
      // url: GRADECHAPTER,
      url: GetSubjectsWithQuestionCount,
      params: ['grade_id'],
      // additionalParams: [{ is_global_selector: 'True' }],
      label: 'subject_name',
      output: 'subject_id',
      value: 'subject_id',
      single: true
    }, {
      name: CHAPTER,
      dependencies: [],
      url: Chapter,
      params: ['grade_id', 'subject_id'],
      additionalParams: [{ feature: 'practice_questions' }, { is_hidden: 'False' }, { is_global_selector: 'True' }],
      label: 'chapter_name',
      output: 'id',
      value: 'id',
      single: true
    }]
}
