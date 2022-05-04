import React from 'react';
import CommonBreadcrumbs from '../../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../../Layout';
import EnrollCourse from '../../../PrincipalDashboard/enrollCourses/enrollCourse';

function EnrollForSelfCourses() {

  return (
    <Layout>
      <div>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Enroll Courses'
          isAcademicYearVisible={true}
        />
        <div style={{ margin: ' 5px 40px 5px 40px' }}>
          <EnrollCourse />
        </div>

      </div>
    </Layout>
  );
}

export default EnrollForSelfCourses;
