import React from 'react';
import Layout from '../Layout';
import StudentStrength from '../student-strength';

const Dashboard = () => {
  return (
    <Layout>
      <div>
        <h4> Dashboard </h4>
        <StudentStrength />
      </div>
    </Layout>
  );
};

export default Dashboard;
