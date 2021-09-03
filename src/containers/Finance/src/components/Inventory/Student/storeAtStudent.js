import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import StoreAtAcc from '../BranchAccountant/StoreAtAcc/storeAtAcc'
import Grid from '@material-ui/core/Grid';
import Select from 'react-select';
import { apiActions } from 'containers/Finance/src/_actions';
import Layout from 'containers/Layout';

const StoreAtStudent = (props) => {
  const [erp, setErp] = useState(null)
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const erp = (JSON.parse(localStorage.getItem('userDetails'))).erp
    setErp(erp)
  }, [])

 const handleClickSessionYear = (e) => {
    setSessionData(e);
  };
  return (
    <div>
      <Layout>
        <Grid container spacing={3} wrap='wrap' style={{ padding: '15px' }}>
          <Grid item xs={3}>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Academic Year'
              value={sessionData}
              options={
                props.session
                  ? props.session.session_year.map((session) => ({
                      value: session,
                      label: session,
                    }))
                  : []
              }
              onChange={handleClickSessionYear}
            />
          </Grid>
</Grid>
          {erp && sessionData ? (
            <StoreAtAcc
              session={sessionData.value}
              getData
              erp={erp}
              user={props.user}
              alert={props.alert}
              isStudent
            />
          ) : null}
        
      </Layout>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
})

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions())
});

export default connect(mapStateToProps,mapDispatchToProps)(StoreAtStudent)
