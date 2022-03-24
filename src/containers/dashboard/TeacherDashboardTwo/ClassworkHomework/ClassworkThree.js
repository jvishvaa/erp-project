import React, { useState } from 'react';
import Details from './Details';
import Header from './Header';
import Layout from '../../../Layout/index';

function ClassworkThree() {
  const [section, setSection] = useState();
  const [subject, setSubject] = useState();
  const [date, setDate] = useState();

  const pendingDetails = (section, subject, date) => {
    setSection(section);
    setSubject(subject);
    setDate(date);
  };
  return (
    <Layout>
      <Header pendingDetails={pendingDetails} />
      <Details section={section} subject={subject} date={date} />
    </Layout>
  );
}

export default ClassworkThree;
