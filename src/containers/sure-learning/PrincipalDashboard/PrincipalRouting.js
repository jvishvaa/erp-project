import React from 'react';

function PrincipalRouting() {
  const handleSelfDriven = () => {
    localStorage.setItem('principalCourseType', 'self_driven');
    window.location = '/principalDashboard';
  };

  const handleTestDriven = () => {
    localStorage.setItem('principalCourseType', 'trainer_driven');
    window.location = '/trainerDriven';
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        height: '100vh',
        justifyContent: 'center',
      }}
    >
      {localStorage.getItem('Self_Driven_Training')?
      <button
        type="submit"
        style={{
          padding: '1rem 1.2rem',
          marginRight: '1rem',
          color: 'white',
          background: 'linear-gradient(to right ,#43cea2, #185a9d)',
          border: '1px solid transparent',
          borderRadius: '4px',
          boxShadow: '2px 4px 7px grey',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
        onClick={handleSelfDriven}
      >
        Self Driven
      </button>:null}
      
      {localStorage.getItem('Trainer_Driven')?
      <button
        type="submit"
        style={{
          padding: '1rem 1.2rem',
          marginRight: '1rem',
          color: 'white',
          background: 'linear-gradient(to right ,#43cea2, #185a9d)',
          border: '1px solid transparent',
          borderRadius: '4px',
          boxShadow: '2px 4px 7px grey',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
        onClick={handleTestDriven}
      >
        Trainer Driven
      </button>:null}
    </div>
  );
}

export default PrincipalRouting;
