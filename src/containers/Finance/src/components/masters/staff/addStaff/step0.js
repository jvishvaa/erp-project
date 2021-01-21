import React, { useEffect, useCallback, useContext, useState } from 'react'

import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { Checkbox } from '@material-ui/core'
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers'
import Dropzone from 'react-dropzone'

import MomentUtils from '@date-io/moment'
import { useSelector, useDispatch } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { addStaffContext } from './_context'

import { OmsSelect } from '../../../../ui'
import { apiActions } from '../../../../_actions'

function Step0 ({ match: { params: { id } } }) {
  const userProfile = JSON.parse(localStorage.getItem('user_profile'))
  const loggedInUserRole = userProfile.personal_info.role
  const rolesNotRequired = [
    'Student',
    'Teacher_applicant',
    'Applicant',
    'Parent',
    'Planner',
    'Admin',
    'Subjecthead',
    'Reviewer',
    'BDM',
    'MIS',
    'FinanceAdmin',
    'InfrastructureAdmin',
    'HR',
    'ExaminationHead',
    'CFO',
    'HomeWork Admin',
    'Blog Admin'
    // 'AcademicCoordinator'
  ]
  const CentralBranchRole = [
    'Admin',
    'BDM',
    'FinanceAdmin',
    'HR',
    'InfrastructureAdmin',
    'MIS',
    'Planner',
    'Reviewer',
    'Subjecthead',
    'ExaminationHead',
    'CFO',
    'Online Class Admin',
    'HomeWork Admin',
    'Blog Admin'
  ]
  const mobileFormat = /^(\+\d{1,3}[- ]?)?\d{10}$/
  const mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  const [branches, designations, roles, departments] = useSelector(state => (
    [state.branches.items, state.designations.items, state.roles.items, state.department.items]))
  const { branch, setBranch, designation, setDesignation, role, setRole, department,
    setDepartment, setField, formFields, getStaffData, initialLoad, setInitialLoad,
    signaturePreview, setSignaturePreview, photoPreview, setPhotoPreview, setStep, setchecked } = useContext(addStaffContext)
  const [dateOfJoining, setDateOfJoining] = useState(formFields.date_of_joining)
  const [branchData, setBranchData] = useState()
  const [checkedData, setcheckedData] = useState(false)
  const dispatch = useDispatch()

  const getDropdownDatas = useCallback(
    () => {
      dispatch(apiActions.listBranches())
      dispatch(apiActions.listDesignations())
      dispatch(apiActions.listRoles())
      dispatch(apiActions.listDepartments())
    },
    [dispatch]
  )
  useEffect(() => {
    if (loggedInUserRole === 'Principal' || loggedInUserRole === 'EA Academics' || loggedInUserRole === 'AcademicCoordinator') {
      setBranch({
        value: userProfile.academic_profile.branch_id,
        label: userProfile.academic_profile.branch
      })
    } else if (loggedInUserRole === 'BDM') {
      let branchsAssigned = JSON.parse(localStorage.getItem('user_profile')).academic_profile.branchs_assigned
      let bdmBranch = []
      let map = new Map()
      for (const item of branchsAssigned) {
        if (!map.has(item.branch_id)) {
          map.set(item.branch_id, true)
          bdmBranch.push({
            value: item.branch_id,
            label: item.branch_name
          })
        }
      }
      setBranchData(bdmBranch)
    }
    if (id && initialLoad) {
      getStaffData(id)
      setInitialLoad(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, initialLoad])

  useEffect(() => {
    getDropdownDatas()
  }, [getDropdownDatas])

  setStep(0)
  return <div style={{ marginLeft: 24 }} id='step1'>
    <form noValidate autoComplete='off'>
      <Grid container spacing={24}>
        <Grid item>
          <OmsSelect
            defaultValue={branch}
            change={setBranch}
            options={
              loggedInUserRole === 'BDM'
                ? branchData
                : branches && branches.length > 0
                  ? branches.map(branch => ({ value: branch.id, label: branch.branch_name }))
                  : []
            }
            label={'Branch'}
            disabled={loggedInUserRole !== 'Admin' && loggedInUserRole !== 'BDM' && loggedInUserRole !== 'HR' && loggedInUserRole !== 'ExaminationHead' && loggedInUserRole !== 'CFO'}
          />
        </Grid>
        <Grid item>
          <OmsSelect defaultValue={designation} change={setDesignation} options={designations && designations.length > 0 ? designations.map(designation => ({ value: designation.id, label: designation.designation_name })) : []} label={'Designation'} />
        </Grid>
        <Grid item>
          <OmsSelect
            defaultValue={role}
            change={setRole}
            options={roles && roles.length > 0
              ? branch && branch.label === 'Central'
                ? roles.filter(role => CentralBranchRole.includes(role.role_name))
                  .map(role => ({ value: role.id, label: role.role_name }))
                : roles.filter(role => !rolesNotRequired.includes(role.role_name) && role.role_name !== 'Management Admin')
                  .map(role => ({ value: role.id, label: role.role_name }))
              : []
            }
            label={'Role'}
          />
        </Grid>
        <Grid item>
          <OmsSelect defaultValue={department} change={setDepartment} options={departments && departments.length > 0 ? departments.map(department => ({ value: department.id, label: department.department_name })) : []} label={'Department'} />
        </Grid>
      </Grid>
      <Grid container spacing={24}>
        <Grid item>
          <FormControl error={!formFields.name}>
            <InputLabel htmlFor='formatted-text-mask-input'>Name</InputLabel>
            <Input id='name' value={formFields.name} onChange={setField} fullWidth />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl error={!formFields.address}>
            <InputLabel htmlFor='address'>Address</InputLabel>
            <Input id='address' value={formFields.address} onChange={setField} fullWidth />
          </FormControl></Grid>
        <Grid item>
          <FormControl error={!formFields.contact_no || (formFields.contact_no && !formFields.contact_no.match(mobileFormat))}>
            <InputLabel htmlFor='contact_no'>Mobile</InputLabel>
            <Input id='contact_no' value={formFields.contact_no} onChange={setField} />
          </FormControl></Grid>
        <Grid item>
          <FormControl error={!formFields.email || (formFields.email && !formFields.email.match(mailFormat))}>
            <InputLabel >Email</InputLabel>
            <Input type='email' value={formFields.email} onChange={setField} id='email' />
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={24}>
        <Grid item>
          <FormControl error={formFields.alt_email && !formFields.alt_email.match(mailFormat)}>
            <InputLabel >Alternative Email</InputLabel>
            <Input type='email' value={formFields.alt_email} onChange={setField} id='alt_email' />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl error={!id && !formFields.password}>
            <InputLabel htmlFor='password'>Password</InputLabel>
            <Input type='password' autoComplete='new-password' value={formFields.password} onChange={setField} id='password' />
          </FormControl></Grid>

        <Grid item>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              disableFuture
              labelFunc={(e) => {
                return e.format('DD/MM/YYYY')
              }}
              label='Date of Joining'
              onChange={(e) => {
                setDateOfJoining(e)
                setField({
                  target: {
                    id: 'date_of_joining',
                    value: e
                  }
                })
              }}
              value={dateOfJoining}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item>
          <FormControl error={formFields.emergency_no && !formFields.emergency_no.match(mobileFormat)}>
            <InputLabel >Emergency No</InputLabel>
            <Input value={formFields.emergency_no} onChange={setField} id='emergency_no' />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl>
            <InputLabel >Qualification</InputLabel>
            <Input value={formFields.qualification} onChange={setField} id='qualification' />
          </FormControl>
        </Grid>
        <Grid item>
          <div style={{ marginTop: '10px' }}>
            <FormControl>
              {formFields.erp_code.length ? '' : <Checkbox
                title='new staff'
                onChange={(e) => {
                  setcheckedData(e.target.checked)
                  setchecked({
                    target: {
                      id: 'checkeddata',
                      value: !e.target.checked
                    }
                  })
                }}
                checked={checkedData}
              />}

            </FormControl>

            {(checkedData || formFields.erp_code) && <FormControl>
              <InputLabel htmlFor='erp_code'>ERP Code</InputLabel>
              <Input type='number' id='erp_code' value={formFields.erp_code} onChange={setField} disabled={!checkedData || formFields.erp_code.length >= 15} />
            </FormControl>}</div></Grid>{checkedData || formFields.erp_code.length ? '' : <span style={{ marginTop: '20px' }}>Enter ERP Manualy(ERP from MCB)</span>}

      </Grid>
      <Grid container spacing={24}>
        <Grid item>
          <InputLabel htmlFor='erpcode'>Photo</InputLabel>
          <Dropzone onDrop={
            (file) => {
              setPhotoPreview(URL.createObjectURL(file[0]))
              setField({
                target: {
                  value: file[0],
                  id: 'employee_photo'
                }
              })
            }
          }>
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject
            }) => (
              <Card
                elevation={0}
                style={{
                  marginTop: 8,
                  marginBottom: 8,
                  border: '1px solid black',
                  borderStyle: 'dotted',
                  width: '100%'
                }}
                {...getRootProps()}
                className='dropzone'
              >
                <CardContent>
                  <input {...getInputProps()} />
                  <div>
                    {isDragAccept && 'All files will be accepted'}
                    {isDragReject && 'Some files will be rejected'}
                    {!isDragActive && 'Drop your files here.'}
                  </div>
                  <img src={photoPreview} width={400} />
                </CardContent>
              </Card>
            )}
          </Dropzone>
        </Grid>
        {role && role.label === 'Principal' | loggedInUserRole === 'EA Academics' | role.label === 'AcademicCoordinator'
          ? <Grid item>
            <InputLabel htmlFor='sign'>Signature</InputLabel>
            <Dropzone onDrop={
              (file) => {
                setSignaturePreview(URL.createObjectURL(file[0]))
                setField({
                  target: {
                    value: file[0],
                    id: 'sign'
                  }
                })
              }
            }>
              {({
                getRootProps,
                getInputProps,
                isDragActive,
                isDragAccept,
                isDragReject
              }) => (
                <Card
                  elevation={0}
                  style={{
                    marginTop: 8,
                    marginBottom: 8,
                    border: '1px solid black',
                    borderStyle: 'dotted',
                    width: '100%'
                  }}
                  {...getRootProps()}
                  className='dropzone'
                >
                  <CardContent>
                    <input {...getInputProps()} />
                    <div>
                      {isDragAccept && 'All files will be accepted'}
                      {isDragReject && 'Some files will be rejected'}
                      {!isDragActive && 'Drop your files here.'}
                    </div>
                    <img src={signaturePreview} width={400} />
                  </CardContent>
                </Card>
              )}
            </Dropzone>
          </Grid>
          : ''
        }
      </Grid>
    </form>
  </div>
}

export default withRouter(Step0)
