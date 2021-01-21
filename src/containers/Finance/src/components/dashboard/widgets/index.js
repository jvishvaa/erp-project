
import React from 'react'
import StudentReport from './studentReport'
import CountData from './countData'
import CircularCount from './circularCount'
import StudentLoginCount from './studentLoginCount'
import StaffLoginCount from './staffLoginCount'
import TeacherReportCount from './teacherReportCount'
import GeneralDiaryCount from './generalDiaryCount'
import BranchWiseTeacherReportCount from './branchwiseTeacherReportCount'
import BranchWiseCircularCount from './branchWiseCircularCount'
import BranchWiseGeneralDiaryCount from './branchWiseGeneralDiaryCount'
import PrincipalLoginTeacherReportCount from './principalLoginTeacherReportCount'
import ParentReport from './parentReport'
import UniformReport from './uniformReport'
import { ROLES } from './constants'

let defaultWidgets = {
  [ROLES.ADMIN]: [
    {
      title: 'Count',
      component: <CountData />
    },
    {
      title: 'Staff Login Count ',
      component: <StaffLoginCount />
    },
    {
      title: 'Student Login Count',
      component: <StudentLoginCount />
    },
    {
      title: 'Teacher Report Count',
      component: <TeacherReportCount />
    },
    {
      title: 'Circular Count ',
      component: <CircularCount />
    },
    {
      title: 'General Diary Count',
      component: <GeneralDiaryCount />

    },
    {
      title: 'Branch Wise Teacher Report Count',
      component: <BranchWiseTeacherReportCount />
    },
    {
      title: 'Branch Wise Circular Count',
      component: <BranchWiseCircularCount />
    },
    {
      title: 'Branch Wise General Diary Count',
      component: <BranchWiseGeneralDiaryCount />
    }],
  [ROLES.MIS]: [
    {
      title: 'Count',
      component: <CountData />
    },
    {
      title: 'Staff Login Count ',
      component: <StaffLoginCount />
    },
    {
      title: 'Student Login Count',
      component: <StudentLoginCount />
    },
    {
      title: 'Teacher Report Count',
      component: <TeacherReportCount />
    },
    {
      title: 'Circular Count ',
      component: <CircularCount />
    },
    {
      title: 'General Diary Count',
      component: <GeneralDiaryCount />

    },
    {
      title: 'Branch Wise Teacher Report Count',
      component: <BranchWiseTeacherReportCount />
    },
    {
      title: 'Branch Wise Circular Count',
      component: <BranchWiseCircularCount />
    },
    {
      title: 'Branch Wise General Diary Count',
      component: <BranchWiseGeneralDiaryCount />
    }],
  [ROLES.STUDENT]: [{ title: 'Student Details',
    component: <StudentReport />
  }, { title: 'Parent Details',
    component: <ParentReport />
  }, { title: 'Uniform Details',
    component: <UniformReport />
  }],
  [ROLES.PRINCIPAL]: [{ title: 'Teacher Report Count',
    component: <PrincipalLoginTeacherReportCount />
  }]
}

export default defaultWidgets
