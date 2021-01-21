import { urls } from '../../urls'

let { BRANCHv2, SECTIONMAPPINGv2, GRADEMAPPINGv2, DEPARTMENT, BranchClassGroup } = urls

const BRANCH = 'Branch'
const GRADE = 'Grade'
const SECTION = 'Section'
const CLASSGROUP = 'ClassGroup'
const ROLES = {
  ADMIN: 'Admin',
  FOE: 'FOE',
  PRINCIPAL: 'Principal',
  EAACADEMICS: 'EA Academics'
}

export const CombinationStudent = {
  [ROLES.ADMIN]: [{
    name: BRANCH,
    dependencies: [GRADE, CLASSGROUP],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true
  }, {
    name: CLASSGROUP,
    dependencies: [],
    url: BranchClassGroup,
    params: ['branch_id'],
    label: 'class_group_name',
    value: 'class_group_id',
    output: 'class_group_id'
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id'
  }, {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_mapping_id',
    output: 'section_mapping_id'
  }],
  [ROLES.PRINCIPAL]: [{
    name: BRANCH,
    dependencies: [GRADE, CLASSGROUP],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true
  }, {
    name: CLASSGROUP,
    dependencies: [],
    url: BranchClassGroup,
    params: ['branch_id'],
    label: 'class_group_name',
    value: 'class_group_id',
    output: 'class_group_id'
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id'
  }, {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_mapping_id',
    output: 'section_mapping_id'
  }],
  [ROLES.FOE]: [{
    name: BRANCH,
    dependencies: [GRADE, CLASSGROUP],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true
  }, {
    name: CLASSGROUP,
    dependencies: [],
    url: BranchClassGroup,
    params: ['branch_id'],
    label: 'class_group_name',
    value: 'class_group_id',
    output: 'class_group_id'
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id'
  }, {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  }],
  [ROLES.EAACADEMICS]: [{
    name: BRANCH,
    dependencies: [GRADE, CLASSGROUP],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true
  }, {
    name: CLASSGROUP,
    dependencies: [],
    url: BranchClassGroup,
    params: ['branch_id'],
    label: 'class_group_name',
    value: 'class_group_id',
    output: 'class_group_id'
  }, {
    name: GRADE,
    dependencies: [SECTION],
    url: GRADEMAPPINGv2,
    params: ['branch_id'],
    label: 'grade_name',
    value: 'acad_branch_grade_mapping_id',
    output: 'acad_branch_grade_mapping_id'
  }, {
    name: SECTION,
    dependencies: [],
    url: SECTIONMAPPINGv2,
    params: ['acad_branch_grade_mapping_id', 'branch_id', 'grade_id'],
    label: 'section_name',
    value: 'section_id',
    output: 'section_mapping_id'
  }]

}

export const CombinationTeacher = {
  [ROLES.ADMIN]: [{
    name: BRANCH,
    dependencies: ['Department'],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true
  }, {
    name: 'Department',
    dependencies: [],
    url: DEPARTMENT,
    label: 'department_name',
    value: 'department_id',
    output: 'department_id'
  }],
  [ROLES.PRINCIPAL]: [{
    name: BRANCH,
    dependencies: ['Department'],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true
  }, {
    name: 'Department',
    dependencies: [],
    url: DEPARTMENT,
    label: 'department_name',
    value: 'department_id',
    output: 'department_id'
  }],
  [ROLES.FOE]: [{
    name: BRANCH,
    dependencies: ['Department'],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true
  }, {
    name: 'Department',
    dependencies: [],
    url: DEPARTMENT,
    label: 'department_name',
    value: 'department_id',
    output: 'department_id'
  }],
  [ROLES.EAACADEMICS]: [{
    name: BRANCH,
    dependencies: ['Department'],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_id',
    output: 'branch_id',
    loadAtStart: true,
    single: true
  }, {
    name: 'Department',
    dependencies: [],
    url: DEPARTMENT,
    label: 'department_name',
    value: 'department_id',
    output: 'department_id'
  }]
}
