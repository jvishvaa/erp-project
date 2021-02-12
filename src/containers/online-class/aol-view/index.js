import React from 'react';
import Layout from '../../Layout';
import UpcomingClasses from './UpcomingClasses';
import CreateclassProvider from '../create-class/create-class-context/create-class-state';
import {useLocation} from 'react-router-dom';

const AOLClassView = () => {
  const location = useLocation();
  return (
    <div>
      <Layout>
        <CreateclassProvider>
          {location.pathname === '/online-class/attend-class'? (
            <StudentClasses />
          ) : (
            <UpcomingClasses />
          )}
        </CreateclassProvider>
      </Layout>
    </div>
  );
};

export default AOLClassView;
