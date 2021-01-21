/**
 * @type {Array}
 * @description - Combination of mapping for different roles.
 */
export const combinations = {
  Teacher: [
    {
      name: 'Branch',
      dependencies: ['Grade'],
      keep: true
    },
    {
      name: 'Grade',
      dependencies: ['Subject', 'Section'],
      keep: false
    },
    {
      name: 'Section',
      dependencies: [],
      keep: false
    },
    {
      name: 'Subject',
      dependencies: [],
      keep: false
    }
  ],
  LeadTeacher: [
    {
      name: 'Branch',
      dependencies: ['Grade'],
      keep: true
    },
    {
      name: 'Grade',
      dependencies: ['Subject', 'Section'],
      keep: false
    },
    {
      name: 'Section',
      dependencies: [],
      keep: false
    },
    {
      name: 'Subject',
      dependencies: [],
      keep: false
    }
  ],
  AcademicCoordinator: [
    {
      name: 'Branch',
      dependencies: ['Grade'],
      keep: true
    },
    {
      name: 'Grade',
      dependencies: ['Subject', 'Section'],
      keep: false
    },
    {
      name: 'Section',
      dependencies: [],
      keep: false
    },
    {
      name: 'Subject',
      dependencies: [],
      keep: false
    }
  ],
  Planner: [
    {
      name: 'Branch',
      dependencies: ['Grade'],
      keep: false
    },
    {
      name: 'Grade',
      dependencies: ['Subject'],
      keep: false
    },
    {
      name: 'Subject',
      dependencies: []
    }
  ],
  Reviewer: [
    {
      name: 'Branch',
      dependencies: ['Grade'],
      keep: false
    },
    {
      name: 'Grade',
      dependencies: ['Subject'],
      keep: false
    },
    {
      name: 'Subject',
      dependencies: []
    }
  ],
  Subjecthead: [
    {
      name: 'Subject',
      dependencies: []
    }
  ],
  Principal: [],
  Admin: [],
  MIS: [],
  BDM: [{
    name: 'Branch',
    dependencies: [],
    keep: false
  }],
  CFO: [],
  Cleaner: [],
  Driver: [],
  Gardener: [],
  FOE: [],
  Janitor: [],
  Maid: [],
  Executive: [],
  Analyst: [],
  Head: [],
  Incharge: [],
  Telecaller: [],
  'Bus Attendant': [],
  'EA Academics': [],
  'Head Maid': [],
  'Office Assistant': [],
  'Security Guard': [],
  'Assistant Campus Incharge': [],
  'Campus Incharge': [],
  'EA Operations': [],
  'Janitor Supervisor': [],
  'Assistant Manager': [],
  'Senior Manager': [],
  'Head of School': [],
  'Cluster Counsellor': [],
  'Cluster Head': [],
  'Head Admission Counsellor': [],
  'Senior Admission Counsellor': [],
  'Team leader': [],
  'Tele Counsellor': [],
  'Branch Accountant': [],
  'Floater Branch Accountant': [],
  // 'Academic Coordinator': [],
  // FinanceAdmin: [],
  FinanceAccountant: [],
  'Online Class Admin': [],
  PRO: [],
  CIC: [],
  InfrastructureManager: [],
  InfrastructureAdmin: [{
    name: 'Branch',
    dependencies: [],
    keep: false
  }],
  StoreAdmin: [],
  HR: [],
  ExaminationHead: [],
  AdmissionCounsellor: [],
  'HomeWork Admin': [],
  'Blog Admin': []
}
