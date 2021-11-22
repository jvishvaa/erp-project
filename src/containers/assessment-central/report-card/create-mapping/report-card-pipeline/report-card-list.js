import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import TabPanel from '../../../../../components/tab-panel';
import ReportPipelineTable from './report-pipeline-table';
import ReportStatusTable from './report-status-table';

const ReportCardList = ({ setLoading, isMobile, widerWidth, moduleId }) => {
  const [tabValue, setTabValue] = useState(0);

  const renderFormOrTable = () => {
    switch (tabValue) {
      case 0:
        return <ReportPipelineTable setLoading={setLoading} moduleId={moduleId} />;
      case 1:
        return <ReportStatusTable setLoading={setLoading} />;
    }
  };

  return (
    <Grid
      container
      spacing={isMobile ? 3 : 5}
      style={{
        width: widerWidth,
        margin: isMobile ? '10px 0px -10px 0px' : '-20px 0px 20px 8px',
      }}
    >
      <Grid item xs={12}>
        <TabPanel
          tabValue={tabValue}
          setTabValue={setTabValue}
          tabValues={['Pipeline', 'Publish']}
        />
      </Grid>
      <Grid item xs={12}>
        {renderFormOrTable()}
      </Grid>
    </Grid>
  );
};

export default ReportCardList;
