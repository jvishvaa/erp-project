import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
function TrainingReportNew() {
  return (
    <div>
      <Card
        style={{ minWidth: '100%', border: '2px solid whitesmoke', marginBottom: '10px' }}
      >
        <CardContent>
          <Typography
            style={{ marginBottom: '10px', fontWeight: '1000', fontSize: '12px' }}
          >
            Training Report
          </Typography>
          <Card
            style={{
              minWidth: '100%',
              border: '2px solid whitesmoke',
              backgroundColor: '#F5EEEE',
            }}
          >
            <CardContent>
              <div style={{ display: 'flex', textAlign: 'center' }}></div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

export default TrainingReportNew;
