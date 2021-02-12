import React from 'react';
import Layout from '../Layout';
import StudentStrength from '../student-strength';
import StudentIdCard from '../student-Id-Card';
import SignatureUpload from '../signature-upload';

const Dashboard = () => {
  return (
    <Layout>
      <div style={{ width: '100%', overflow: 'hidden' }}>
        {/* <h4> Dashboard </h4> */}
        <StudentStrength />
        <StudentIdCard />
        <SignatureUpload />
      </div>
    </Layout>
  );
};

export default Dashboard;
