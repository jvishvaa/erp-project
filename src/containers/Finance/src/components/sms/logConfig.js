import { urls } from '../../urls'

let { BRANCHv2, SmsTypes } = urls

const BRANCH = 'Branch'
const SMSTYPE = 'Sms Type'

const ROLES = {
  ADMIN: 'Admin',
  FOE: 'FOE',
  PRINCIPAL: 'Principal',
  EAACADEMICS: 'EA Academics'
}

export const Combination = {
  [ROLES.ADMIN]: [{
    name: BRANCH,
    dependencies: [],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_acad_id',
    output: 'branch_acad_id',
    loadAtStart: true
  },
  {
    name: SMSTYPE,
    dependencies: [],
    url: SmsTypes,
    label: 'sms_type',
    value: 'sms_type_dummy_id',
    output: 'sms_type',
    loadAtStart: true
  }],
  [ROLES.PRINCIPAL]: [{
    name: BRANCH,
    dependencies: [],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_acad_id',
    output: 'branch_acad_id',
    loadAtStart: true,
    single: true
  },
  {
    name: SMSTYPE,
    dependencies: [],
    url: SmsTypes,
    label: 'sms_type',
    value: 'sms_type_dummy_id',
    output: 'sms_type',
    loadAtStart: true
  }],
  [ROLES.FOE]: [{
    name: BRANCH,
    dependencies: [],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_acad_id',
    output: 'branch_acad_id',
    loadAtStart: true,
    single: true
  },
  {
    name: SMSTYPE,
    dependencies: [],
    url: SmsTypes,
    label: 'sms_type',
    value: 'sms_type_dummy_id',
    output: 'sms_type',
    loadAtStart: true
  }],
  [ROLES.EAACADEMICS]: [{
    name: BRANCH,
    dependencies: [],
    url: BRANCHv2,
    label: 'branch_name',
    value: 'branch_acad_id',
    output: 'branch_acad_id',
    loadAtStart: true,
    single: true
  },
  {
    name: SMSTYPE,
    dependencies: [],
    url: SmsTypes,
    label: 'sms_type',
    value: 'sms_type_dummy_id',
    output: 'sms_type',
    loadAtStart: true
  }]
}
