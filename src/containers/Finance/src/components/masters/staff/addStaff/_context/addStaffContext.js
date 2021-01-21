import React, {
  createContext,
  useState,
  useEffect
} from 'react'
import moment from 'moment'
import axios from 'axios'
import _ from 'lodash'
import {
  combinations
} from './combination'
import { leadTeacherCombination } from './step2Combination'
import { urls } from '../../../../../urls'
import { authHeader } from '../../../../../_helpers'

export const Context = createContext({})

export const Provider = props => {
  const [branch, setBranch] = useState()
  const [designation, setDesignation] = useState()
  const [role, setRole] = useState()
  const [department, setDepartment] = useState()
  const [firstTime, setFirstTime] = useState(false)
  const [ selectorData, setSelectorData ] = useState({})
  const [signaturePreview, setSignaturePreview] = useState()
  const [photoPreview, setPhotoPreview] = useState()
  const [staffData, setStaffData] = useState()
  const [ usePowerSelector, setUsePowerSelector ] = useState()
  const [initialLoad, setInitialLoad] = useState(true)
  const { children, alert } = props
  const [checkedvalue, setcheckedValue] = useState({ checkeddata: 'true' })
  const [formFields, setFormFields] = useState({
    date_of_joining: new Date('2014-08-18T21:11:54'),
    name: '',
    address: '',
    contact_no: '',
    email: '',
    alt_email: '',
    erp_code: '',
    emergency_no: '',
    qualification: '',
    password: '',
    employee_photo: null,
    sign: null
  })
  const [rows, setRows] = useState([])
  const [rowData, setRowData] = useState([])
  const [stepTwoRows, setStepTwoRows] = useState([])
  const [stepTwoRowData, setStepTwoRowData] = useState([])

  // eslint-disable-next-line no-unused-vars
  const [currenStep, setCurrentStep] = useState(0)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function setRoleWrapper (newRole) {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    function initializeSelector (role) {
      let newRowData = []
      /* converting data to support dropdown format */
      newRowData = combinations && combinations[role].map(relation => ({
        label: relation.name,
        options: []
      }))

      /* set data for each row being appended while adding mapping */
      setRowData([...rowData, newRowData])
      setOptions(rows && rows.length > 0 ? rows.length : 0, 0, newRowData)
      async function setOptions (rowIndex, selectorIndex, newRowData) {
        if (newRowData.length > 0 && newRowData[selectorIndex].label === 'Branch') {
          let actualRows = rows && rows.length > 0
            ? _.concat(_.cloneDeep(rows), [_.cloneDeep(newRowData)])
            : [_.cloneDeep(newRowData)]
          if (branch.label === 'Central') {
            let branches = await getBranches()
            let branchItems = branches.data
            actualRows[rowIndex][selectorIndex].options = branchItems.map(item => ({
              value: item.id,
              label: item.branch_name
            }))
          } else {
            actualRows[rowIndex][selectorIndex].value = branch
            let grades = (await axios.get(`${urls.GradeMapping}?branch=${branch.value}`, requestOptions)).data
            let data = grades.map(grade => ({
              label: grade.grade.grade,
              value: grade.id
            }))
            actualRows[rowIndex][selectorIndex + 1].options = data
          }
          setRows(actualRows)
        } else if (newRowData.length > 0 && newRowData[selectorIndex].label === 'Subject') {
          let subjects = await getSubjects()
          let subjectItems = subjects.data
          let actualRows = rows && rows.length > 0
            ? _.concat(_.cloneDeep(rows), [_.cloneDeep(newRowData)])
            : [_.cloneDeep(newRowData)]
          actualRows[rowIndex][selectorIndex].options = subjectItems.map(item => ({
            value: item.id,
            label: item.subject_name
          }))
          setRows(actualRows)
        }
      }
      function getBranches () {
        return axios.get(urls.BRANCH, requestOptions)
      }
      function getSubjects () {
        return axios.get(urls.SUBJECT, requestOptions)
      }
    }
    function initializeLeadTeacherSelector (role) {
      let newRowData = []
      /* converting data to support dropdown format */
      newRowData = leadTeacherCombination[role].map(relation => ({
        label: relation.name,
        options: []
      }))

      /* set data for each row being appended while adding mapping */
      setStepTwoRowData([...stepTwoRowData, newRowData])
      setStepTwoOptions(stepTwoRows && stepTwoRows.length > 0 ? stepTwoRows.length : 0, 0, newRowData)
      async function setStepTwoOptions (rowIndex, selectorIndex, newRowData) {
        if (newRowData.length > 0 && newRowData[selectorIndex].label === 'Branch') {
          let actualRows = stepTwoRows && stepTwoRows.length > 0
            ? _.concat(_.cloneDeep(stepTwoRows), [_.cloneDeep(newRowData)])
            : [_.cloneDeep(newRowData)]
          if (role === 'LeadTeacher') {
            let branches = await getBranches()
            let branchItems = branches.data
            actualRows[rowIndex][selectorIndex].options = branchItems.map(item => ({
              value: item.id,
              label: item.branch_name
            }))
          } else {
            actualRows[rowIndex][selectorIndex].value = branch
            let grades = (await axios.get(`${urls.GradeMapping}?branch=${branch.value}`, requestOptions)).data
            let data = grades.map(grade => ({
              label: grade.grade.grade,
              value: grade.id
            }))
            actualRows[rowIndex][selectorIndex + 1].options = data
          }
          setStepTwoRows(actualRows)
        } else if (newRowData.length > 0 && newRowData[selectorIndex].label === 'Subject') {
          let subjects = await getSubjects()
          let subjectItems = subjects.data
          let actualRows = stepTwoRows && stepTwoRows.length > 0
            ? _.concat(_.cloneDeep(stepTwoRows), [_.cloneDeep(newRowData)])
            : [_.cloneDeep(newRowData)]
          actualRows[rowIndex][selectorIndex].options = subjectItems.map(item => ({
            value: item.id,
            label: item.subject_name
          }))
          setStepTwoRows(actualRows)
        }
      }
      function getBranches () {
        return axios.get(urls.BRANCH, requestOptions)
      }
      function getSubjects () {
        return axios.get(urls.SUBJECT, requestOptions)
      }
    }
    if (currenStep !== 2) {
      initializeSelector(newRole.label)
    } else {
      initializeLeadTeacherSelector(newRole.label)
    }
  }

  function setStep (step) {
    setCurrentStep(step)
  }

  useEffect(() => {
    setRows([])
  }, [role])

  useEffect(() => {
    /**
     * @description Sets the row data for the first time and adds a single row.
     * @param  {} role
     */
    if (firstTime) {
      setRoleWrapper(role)
      setFirstTime(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstTime, role, setRoleWrapper])

  useEffect(() => {
    if (currenStep === 2) {
      setRoleWrapper(role)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currenStep])

  useEffect(() => {
    function createMapping (mapping) {
      let rowData = combinations[role.label].map(relation => ({
        label: relation.name,
        options: []
      }))

      var data
      if (role.label === 'Teacher') {
        data = {
          Branch: { value: mapping.branch_id, label: mapping.branch_name + `(${mapping.acad_session})` },
          Grade: { value: mapping.grademapping_id, label: mapping.grade_name },
          Section: { value: mapping.sectionmapping_id, label: mapping.section_name },
          Subject: { value: mapping.subjectmapping_id, label: mapping.subject_name }
        }
      } else if (role.label === 'Reviewer' || role.label === 'Planner') {
        data = {
          Branch: { value: mapping.branch_id, label: mapping.branch_name + `(${mapping.acad_session})` },
          Grade: { value: mapping.grade_id, label: mapping.grade_name },
          Subject: { value: mapping.subjectmapping_id, label: mapping.subject_name }
        }
      } else if (role.label === 'Subjecthead') {
        data = {
          Subject: { value: mapping.subject_id, label: mapping.subject_name }
        }
      } else if (role.label === 'BDM') {
        data = {
          Branch: { value: mapping.branch_id, label: mapping.branch_name }
        }
      } else if (role.label === 'InfrastructureAdmin') {
        data = {
          Branch: { value: mapping.branch_id, label: mapping.branch_name }
        }
      } else if (role.label === 'AcademicCoordinator') {
        data = {
          Branch: { value: mapping.branch_id, label: mapping.branch_name + `(${mapping.acad_session})` },
          Grade: { value: mapping.grademapping_id, label: mapping.grade_name },
          Section: { value: mapping.sectionmapping_id, label: mapping.section_name },
          Subject: { value: mapping.subjectmapping_id, label: mapping.subject_name }

        }
      } else if (role.label === 'LeadTeacher') {
        data = {
          Branch: { value: mapping.branch_id, label: mapping.branch_name + `(${mapping.acad_session})` },
          Grade: { value: mapping.grademapping_id, label: mapping.grade_name },
          Section: { value: mapping.sectionmapping_id, label: mapping.section_name },
          Subject: { value: mapping.subjectmapping_id, label: mapping.subject_name }
        }
      }

      rowData.map(map => {
        map.value = data[map.label]
      })
      console.log(rowData)
      return rowData
    }
    function createLeadTeacherMapping (mapping) {
      let tabTwoRowData = leadTeacherCombination[role.label].map(relation => ({
        label: relation.name,
        options: []
      }))
      let data
      if (role.label === 'LeadTeacher') {
        data = {
          Branch: { value: mapping.branch_id, label: mapping.branch_name },
          Grade: { value: mapping.grademapping_id, label: mapping.grade_name },
          Subject: { value: mapping.subjectmapping_id, label: mapping.subject_name }
        }
      }
      tabTwoRowData.map(map => {
        map.value = data[map.label]
      })
      console.log(rowData)
      return tabTwoRowData
    }
    let aMapping = []
    let leadTeacherMapping = []

    if (staffData && role && role.label !== 'LeadTeacher') {
      staffData.mappings && staffData.mappings.mappings && staffData.mappings.mappings.map(map => {
        let row = createMapping(map)
        aMapping.push(row)
      })
    } else if (staffData && role && role.label === 'LeadTeacher') {
      staffData.mappings && staffData.mappings.mappings && staffData.mappings.mappings.map(map => {
        let row = createMapping(map)
        aMapping.push(row)
      })
      staffData.mappings && staffData.mappings.can_review && staffData.mappings.can_review.map(map => {
        let row = createLeadTeacherMapping(map)
        leadTeacherMapping.push(row)
      })
    }

    setRows(aMapping, ...rows)
    setStepTwoRows(leadTeacherMapping, ...stepTwoRows)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffData])

  // useEffect(() => {
  //   /**
  //    * @description Sets the row data for the first time and adds a single row.
  //    * @param  {} role
  //    */

  //   function initializeSelector (role) {
  //     let rowData = []
  //     /* converting data to support dropdown format */
  //     rowData = combinations[role].map(relation => ({
  //       label: relation.name,
  //       options: []
  //     }))
  //     /* set data for each row being appended while adding mapping */
  //     setRowData(rowData)
  //     /* add a single row at the starting */
  //     setRows([rowData])
  //     setOptions(0, 0, rowData)
  //     async function setOptions (rowIndex, selectorIndex, rowData) {
  //       if (rowData.length > 0 && selectorIndex === 0) {
  //         let branches = await getBranches()
  //         let branchItems = branches.data
  //         let actualRows = rows && rows.length > 0 ? _.cloneDeep(rows) : [_.cloneDeep(rowData)]
  //         actualRows[rowIndex][selectorIndex].options = branchItems.map(item => ({
  //           value: item.id,
  //           label: item.branch_name
  //         }))
  //         actualRows[rowIndex][selectorIndex].value = branch
  //         setRows(actualRows)
  //         // onChange(branch, rowIndex, selectorIndex)
  //       }
  //     }
  //     function getBranches () {
  //       const requestOptions = {
  //         method: 'GET',
  //         headers: authHeader()
  //       }
  //       return axios.get(urls.BRANCH, requestOptions)
  //     }
  //   }
  //   if (role) {
  //     if (firstTime) {
  //       initializeSelector(role.label)
  //       setFirstTime(false)
  //     }
  //   }
  // }, [branch, firstTime, role, rows])

  function getStaffData (id) {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    axios
      .get(urls.StaffV2 + id + '/', requestOptions)
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          let staffData = res.data
          let newFormFields = {
            ...formFields
          }
          setBranch({
            value: staffData.branch_id,
            label: staffData.branch_name
          })
          setDepartment({
            value: staffData.department_id,
            label: staffData.department_name
          })
          setDesignation({
            value: staffData.designation_id,
            label: staffData.designation_name
          })
          setRole({
            value: staffData.role_id,
            label: staffData.role
          })
          newFormFields['name'] = staffData.staff_name
          newFormFields['erp_code'] = staffData.erp_code
          newFormFields['address'] = staffData.address
          newFormFields['contact_no'] = staffData.contact_no
          newFormFields['email'] = staffData.email
          newFormFields['alt_email'] = staffData.alt_email
          newFormFields['emergency_no'] = staffData.emergency_no
          newFormFields['qualification'] = staffData.qualification
          newFormFields['date_of_joining'] = staffData.date_of_joining
          if (staffData.employee_photo && !staffData.employee_photo.includes('no-img.jpg')) {
            setPhotoPreview(staffData.employee_photo)
          }
          if (staffData.sign && !staffData.sign.includes('no-img.jpg')) {
            setSignaturePreview(staffData.sign)
          }
          setFormFields(newFormFields)
          setStaffData(staffData)
        }
      })
      .catch(function (error) {
        if (error.response && error.response.status === 404) alert.error(error.response.data)
        else alert.error('Error Occured')
        console.log("Error: Couldn't fetch data from " + urls.Staff + error)
      })
  }

  /**
   * @description add a row to the list of mappings.
   * @param  {} row
   */
  function addRow () {
    setRoleWrapper(role)
  }

  /**
   * @description remove row from the list of mappings.
   */
  function removeRow (index, step) {
    let rowsAfterRemoval = rows.filter((item, itemIndex) => index !== itemIndex)
    if (step === 1) {
      rowsAfterRemoval = rows.filter((item, itemIndex) => index !== itemIndex)
      setRows(rowsAfterRemoval)
    } else if (step === 2) {
      rowsAfterRemoval = stepTwoRows.filter((item, itemIndex) => index !== itemIndex)
      setStepTwoRows(rowsAfterRemoval)
    }
  }

  /**
   * @param  {} event
   */
  function setField (event) {
    let newFormFields = {
      ...formFields
    }
    newFormFields[event.target.id] = event.target.value
    setFormFields(newFormFields)
  }

  function setchecked (event) {
    let newChecked = {
      ...checkedvalue
    }
    newChecked[event.target.id] = event.target.value.toString()
    setcheckedValue(newChecked)
  }

  /**
   * @param  {} event
   * @param  {} rowIndex
   * @param  {} selectorIndex
   */
  function onChange (event, rowIndex, selectorIndex, step) {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    /* Deep copy the rows */
    let copiedRows = currenStep !== 2 ? _.cloneDeep(rows) : _.cloneDeep(stepTwoRows)
    let combination = currenStep !== 2 ? combinations : leadTeacherCombination
    /* Set the value for the row */
    copiedRows[rowIndex][selectorIndex].value = event
    /* Set options for the dependencies */
    let dependencyIndices = combination[role.label][selectorIndex].dependencies.map(dependency => {
      return combination[role.label].findIndex((item) => item.name === dependency)
    })

    let loadedDependencies = 0
    dependencyIndices.forEach(async (dependencyIndex) => {
      let data = []
      let dependencyName = combination[role.label][dependencyIndex].name

      if (dependencyName === 'Grade') {
        let grades = (await axios.get(`${urls.GradeMapping}?branch=${event.value}`, requestOptions)).data
        data = grades.map(grade => ({
          label: grade.grade.grade,
          value: grade.id
        }))
      } else if (dependencyName === 'Subject') {
        let subjects = (await axios.get(`${urls.SubjectMapping}?acad_branch_grade_mapping_id=${event.value}`, requestOptions)).data
        data = subjects.map(subject => ({
          label: subject.subject.subject_name,
          value: subject.id
        }))
      } else if (dependencyName === 'Section') {
        let grades = (await axios.get(`${urls.SectionMapping}?acad_branch_grade_mapping_id=${event.value}`, requestOptions)).data
        data = grades.map(section => ({
          label: section.section.section_name,
          value: section.id
        }))
      }

      copiedRows[rowIndex][dependencyIndex].options = data
      copiedRows[rowIndex][dependencyIndex].value = null
      loadedDependencies++
      if (loadedDependencies === dependencyIndices.length && currenStep !== 2) {
        setRows(copiedRows)
      } else if (loadedDependencies === dependencyIndices.length && currenStep === 2) {
        setStepTwoRows(copiedRows)
      }
    })
    if (dependencyIndices.length === 0 && currenStep !== 2) {
      setRows(copiedRows)
    } else if (dependencyIndices.length === 0 && currenStep === 2) {
      setStepTwoRows(copiedRows)
    }
  }

  function handleValidation (id) {
    console.log(designation)

    const mobileFormat = /^(\+\d{1,3}[- ]?)?\d{10}$/
    const mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

    // for below designation removed email validation
    const notMandatoryEmailRoles = [
      'Maid',
      'Head Maid',
      'Janitor',
      'Janitor Supervisor',
      'Security Guard',
      'Driver',
      'Gardener',
      'Bus Attendant',
      'Office Assistant',
      'Office Assistant',
      'PRO',
      'Cleaner',
      'Maid - Marketing',
      'Care Taker',
      'Helpers'
    ]
    if (designation && notMandatoryEmailRoles.includes(designation.label)) {
      if (((branch && branch.value) && (role && role.value) &&
          (department && department.value) &&
         formFields.name && formFields.address && formFields.contact_no &&
         formFields.contact_no.match(mobileFormat) &&
         (id || formFields.password)) || (formFields.emergency_no && formFields.emergency_no.match(mobileFormat))
      ) {
        setFirstTime(true)
        return true
      }
      return false
    } else if (((branch && branch.value) && (role && role.value) &&
          (department && department.value) &&
         formFields.name && formFields.address && formFields.contact_no &&
         formFields.contact_no.match(mobileFormat) && formFields.email &&
         formFields.email.match(mailFormat) &&
         (id || formFields.password)) || (formFields.emergency_no && formFields.emergency_no.match(mobileFormat))
    ) {
      setFirstTime(true)
      return true
    }
    return false
  }

  function handleFinish (id) {
    let method = 'post'
    let url = urls.StaffV2
    if (id) {
      method = 'put'
      url = urls.StaffV2 + id + '/'
    }

    let data = parseToFormData()

    axios({
      method: method,
      url: url,
      headers: { 'Content-Type': 'multipart/form-data', ...authHeader() },
      data: data
    }).then(res => {
      console.log(res.status, method)
      if (res.status === 201 && method === 'post') {
        alert.success('Staff Created  and email sent successfully')
      } else if (res.status === 200 && method === 'post') {
        alert.success('Staff Created but Failed to send email')
      } else if (res.status === 200 && method === 'put') {
        alert.success('Staff updated successfully')
      }
    }).catch(res => {
      if (res.response) alert.error(res.response.data)
      else alert.error('Error Occured')
    })
  }

  function parseToFormData () {
    console.log(checkedvalue.checked, 'checked')
    let formData = new FormData()
    formData.set('name', formFields.name)
    formData.set('first_name', formFields.name)
    formData.set('password', formFields.password)
    formData.set('branch', branch.value)
    formData.set('role', role.value)
    formData.set('designation', designation.value)
    formData.set('erp_code', formFields.erp_code)
    if (formFields.alt_email) formData.set('alt_email', formFields.alt_email.trim().toLowerCase())
    formData.set('emergency_no', formFields.emergency)
    formData.set('qualification', formFields.qualification)
    formData.set('department', department.value)
    formData.set('date_of_joining', moment(formFields.date_of_joining).format('YYYY-MM-DD'))
    if (formFields.employee_photo) formData.append('employee_photo', formFields.employee_photo)
    if (formFields.sign) formData.append('sign', formFields.sign)
    formData.set('address', formFields.address)
    formData.set('contact_no', formFields.contact_no)
    formData.set('emergency_no', formFields.emergency_no)
    formData.set('email', formFields.email.trim().toLowerCase())
    formData.set('new_staff', checkedvalue.checkeddata)
    //  mapping
    if (role.label === 'Teacher') {
      formData.set('teacher_mappings', getMapping())
    } else if (role.label === 'Planner' || role.label === 'Reviewer') {
      formData.set('subjectmappings', getMapping())
    } else if (role.label === 'Subjecthead') {
      formData.set('subject_ids', getMapping())
    } else if (role.label === 'BDM') {
      formData.set('branches_assigned', getMapping().toString())
    } else if (role.label === 'AcademicCoordinator') {
      formData.set('teacher_mappings', getMapping().toString())
    } else if (role.label === 'LeadTeacher') {
      formData.set('teacher_mappings', getMapping())
      formData.set('subject_mappings', getMapping(true))
    }
    return formData
  }

  function getMapping (mapOnlySubjects) {
    let newMappings = []
    let subjectMapping = []
    if (role.label === 'LeadTeacher' && staffData) {
      for (let i = staffData.mappings.mappings && staffData.mappings.mappings.length; i < rows.length; i++) {
        newMappings.push(rows[i])
      }
      for (let i = staffData.mappings.mappings && staffData.mappings.can_review.length; i < stepTwoRows.length; i++) {
        subjectMapping.push(stepTwoRows[i])
      }
    } else if (staffData && staffData.mappings.length) {
      for (let i = staffData.mappings.mappings && staffData.mappings.length; i < rows.length; i++) {
        newMappings.push(rows[i])
      }
      console.log('Staff data exists', newMappings)
    } else {
      newMappings = _.cloneDeep(rows)
      subjectMapping = _.cloneDeep(stepTwoRows)
    }

    if (role.label === 'Teacher' || role.label === 'LeadTeacher' || role.label === 'AcademicCoordinator') {
      var trueMapping = []
      var oTeacherMapping = []
      let mappings = mapOnlySubjects ? subjectMapping : newMappings

      mappings.forEach(row => {
        var count = 0
        row.forEach(item => {
          if (item.label === 'Subject' && item.value) {
            count++
          }
          if (item.label === 'Section' && item.value) {
            count++
          }
        })
        if (count === 2 || (role.label === 'LeadTeacher' && count >= 1)) {
          trueMapping.push(row)
        }
        count = 0
      })
      trueMapping.forEach(row => {
        let mapping = {}
        row.forEach(item => {
          if (item.label === 'Subject' && item.value) {
            mapping['subjectmapping'] = item.value.value
          }
          if (item.label === 'Section' && item.value) {
            mapping['sectionmapping'] = item.value.value
          }
        })
        oTeacherMapping.push(mapping)
      })

      return JSON.stringify(oTeacherMapping)
    } else if (role.label === 'Planner' || role.label === 'Reviewer' || role.label === 'Subjecthead') {
      var mapping = []
      if (!usePowerSelector) {
        newMappings.forEach(row => {
          row.forEach(item => {
            if (item.label === 'Subject' && item.value) {
              mapping.push(item.value.value)
            }
          })
        })
      } else {
        mapping = selectorData.subjects
      }
      return JSON.stringify(mapping)
    } else if (role.label === 'BDM') {
      mapping = []
      newMappings.forEach(row => {
        row.forEach(item => {
          if (item.label === 'Branch' && item.value) {
            mapping.push(item.value.value)
          }
        })
      })
      return JSON.stringify(mapping)
    }
    // else if (role.label === 'AcademicCoordinator') {
    // var trueMapping = []
    // var oTeacherMapping = []
    // newMappings.forEach(row => {
    //   var count = 0
    //   row.forEach(item => {
    //     if (item.label === 'Branch' && item.value) {
    //       count++
    //     }
    //     if (item.label === 'Grade' && item.value) {
    //       count++
    //     }
    //   })
    //   if (count === 2) {
    //     trueMapping.push(row)
    //   }
    //   count = 0
    // })
    // trueMapping.forEach(row => {
    //   let mapping = {}
    //   row.forEach(item => {
    //     if (item.label === 'Branch' && item.value) {
    //       mapping['branchtmapping'] = item.value.value
    //     }
    //     if (item.label === 'Grade' && item.value) {
    //       mapping['grademapping'] = item.value.value
    //     }
    //   })
    //   oTeacherMapping.push(mapping)
    // })
    // return JSON.stringify(oTeacherMapping)
    //   mapping = []
    //   newMappings.forEach(row => {
    //     row.forEach(item => {
    //       // if (item.label === 'Branch' && item.value) {
    //       //   bmap.push(item.value.value)
    //       // }
    //       if (item.label === 'Grade' && item.value) {
    //         mapping.push(item.value.value)
    //       }
    //       if (item.label === 'Section' && item.value) {
    //         mapping.push(item.value.value)
    //       }
    //       if (item.label === 'Branch' && item.value) {
    //         mapping.push(item.value.value)
    //       }
    //     })
    //   })
    //   console.log(mapping)

    //   return JSON.stringify(mapping)
    // }
  }

  function deleteRow (id, rowIndex) {
    let data = { 'role': role.value }

    let mappings = staffData.mappings.mappings
    console.log(mappings)

    staffData && mappings.map((map, index) => {
      console.log(map)

      if (index === rowIndex) {
        if (role.label === 'Teacher') {
          data['teacher_subject_sectionmapping_id'] = map.teacher_subject_sectionmapping_id
        } else if (role.label === 'Subjecthead') {
          data['subject_id'] = map.subject_id
        } else if (role.label === 'Planner' || role.label === 'Reviewer') {
          data['subject_mapping_id'] = map.subjectmapping_id
        } else if (role.label === 'BDM') {
          data['subject_mapping_id'] = map.branch_id
        } else if (role.label === 'AcademicCoordinator') {
          data['teacher_subject_sectionmapping_id'] = map.teacher_subject_sectionmapping_id
        } else if (role.label === 'LeadTeacher') {
          data['teacher_subject_sectionmapping_id'] = map.teacher_subject_sectionmapping_id
        }

        axios({
          method: 'delete',
          url: urls.StaffV2 + id + '/',
          headers: { ...authHeader() },
          data: data
        }).then(res => {
          console.log(res)

          alert.success('staff mappings has been deleted')
          if (res.status === 200) {
            let mappings = staffData.mappings.mappings
            mappings.splice(index, 1)
            setStaffData(staffData)
            removeRow(rowIndex, 1)
          }
        })
          .catch(err => {
            console.log(err)
          })
      }
    })
  }

  function deleteStepTwoRows (id, rowIndex) {
    let data = { 'role': role.value }
    staffData && staffData.mappings.can_review.map((map, index) => {
      if (index === rowIndex) {
        if (role.label === 'LeadTeacher') {
          data['can_review_subject_mapping'] = map.subjectmapping_id
        }
        axios({
          method: 'delete',
          url: urls.StaffV2 + id + '/',
          headers: { ...authHeader() },
          data: data
        }).then(res => {
          alert.success(res.data)
          if (res.status === 200) {
            staffData.mappings.can_review.splice(index, 1)
            setStaffData(staffData)
            removeRow(rowIndex, 2)
          }
        })
      }
    })
  }

  const addStaffContext = {
    branch,
    setBranch,
    designation,
    setDesignation,
    role,
    setRole,
    rows,
    department,
    setDepartment,
    formFields,
    setField,
    addRow,
    removeRow,
    rowData,
    onChange,
    handleFinish,
    handleValidation,
    getStaffData,
    photoPreview,
    setPhotoPreview,
    signaturePreview,
    setSignaturePreview,
    staffData,
    deleteRow,
    deleteStepTwoRows,
    alert,
    initialLoad,
    setInitialLoad,
    usePowerSelector,
    setUsePowerSelector,
    selectorData,
    setSelectorData,
    setStep,
    stepTwoRows,
    stepTwoRowData,
    setchecked
  }

  // pass the value in provider and return
  return <Context.Provider value={
    addStaffContext} > {
      children
    } </Context.Provider>
}

export const {
  Consumer
} = Context
