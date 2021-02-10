import React from 'react';
import Layout from '../Layout';
// import StudentStrength from '../student-strength';
import StudentIdCard from '../student-Id-Card';

const Dashboard = () => {
  return (
    <Layout>
      <div>
        {/* <h4> Dashboard </h4> */}
        {/* <StudentStrength /> */}
        <StudentIdCard />
      </div>
    </Layout>
  );
};

export default Dashboard;
