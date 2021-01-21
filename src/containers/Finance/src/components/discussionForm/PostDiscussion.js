import React, { useState, useEffect } from 'react'
import { Grid, TextField, MenuItem, Button } from '@material-ui/core'
import axios from 'axios'
import PostTabs from './PostTabs/postTabs'
import { discussionUrls } from '../../urls'
import Loader from '../discussion_form/loader'

// const currencies = [
//   {
//     value: 'USD',
//     label: '$'
//   },
//   {
//     value: 'EUR',
//     label: '€'
//   },
//   {
//     value: 'BTC',
//     label: '฿'
//   },
//   {
//     value: 'JPY',
//     label: '¥'
//   }
// ]

const INITIAL_STATE = {
  community: '',
  category: '',
  subCategory: '',
  subSubCategory: ''
}
const PostDiscussion = ({ alert, user, postSuccess, branch, grade, section }) => {
//   const [currency, setCurrency] = React.useState('EUR')
  const [auth] = useState(JSON.parse(localStorage.getItem('user_profile')))

  // const authForm = JSON.parse(localStorage.getItem('discussion_form_Login'))

  const [ categorySelection, setCategorySelection ] = useState(INITIAL_STATE)
  const [tinyMceData, setTinyMceData] = useState('')
  const [title, setTitle] = useState('')
  const [categories, setCategories] = useState([])
  const [subcats, setSubCats] = useState([])
  const [subSubCats, setSubSubCats] = useState([])
  const [loading, setloading] = useState(false)

  let loader = null
  if (loading) {
    loader = <Loader open />
  }

  const handleChange = (event) => {
    setCategorySelection(inputs => ({ ...inputs, [event.target.name]: event.target.value }))
  }

  const handleAnswerChange = (content, id) => {
    setTinyMceData(content)
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }
  useEffect(() => {
    setloading(true)
    axios
      .get(`${discussionUrls.CategoryApi}`, {
        headers: {
          Authorization: 'Bearer ' + auth.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 200) {
          setloading(false)
          setCategories(res.data)
          // alert.success('Sucessfull Posted')
        //   this.refreshComponent()
        } else {
          setloading(false)
          // alert.warning(JSON.stringify(res.data))
        }
      })
      .catch(error => {
        setloading(false)
        console.log(error)
        console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
      })
  }, [auth.personal_info.token, user])

  useEffect(() => {
    setloading(true)
    axios
      .get(`${discussionUrls.SubCategoryApi}?category_id=${categorySelection.category}`, {
        headers: {
          Authorization: 'Bearer ' + auth.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 200) {
          setSubCats(res.data)
          setloading(false)
          // alert.success('Sucessfull Posted')
        //   this.refreshComponent()
        } else {
          setloading(false)
          // alert.warning(JSON.stringify(res.data))
        }
      })
      .catch(error => {
        setloading(false)
        console.log(error)
        console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
      })
  }, [auth.personal_info.token, categorySelection.category])

  useEffect(() => {
    setloading(true)
    categorySelection.category !== '' && categorySelection.subCategory !== '' &&
    axios
      .get(`${discussionUrls.SubSubCategoryApi}?category_id=${categorySelection.category}&sub_category_id=${categorySelection.subCategory}`, {
        headers: {
          Authorization: 'Bearer ' + auth.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 200) {
          setSubSubCats(res.data)
          setloading(false)
          // alert.success('Sucessfull Posted')
        //   this.refreshComponent()
        } else {
          setloading(false)
          // alert.warning(JSON.stringify(res.data))
        }
      })
      .catch(error => {
        setloading(false)
        console.log(error)
        console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
      })
  }, [auth.personal_info.token, categorySelection.category, categorySelection.subCategory])

  const dataPost = () => {
    if (auth.personal_info.role === 'Principal' && branch.length === 0) {
      alert.warning('Select Branch')
      return
    }
    if (grade.length === 0 && auth.personal_info.role !== 'Student') {
      alert.warning('Select Grade')
      return
    }
    if (!categorySelection.category) {
      alert.warning('Select Category')
      return
    }
    if (!title) {
      alert.warning('Enter Title')
      return
    }
    if (!tinyMceData) {
      alert.warning('Enter description')
      return
    }
    // let formData = new FormData()
    // formData.append('description', tinyMceData)
    // formData.append('title', title)
    let data = {
      description: tinyMceData,
      title: title
    }

    if (grade) {
      data.grades = grade
    }
    if (branch) {
      data.branches = branch
    }
    if (section.length !== 0) {
      data.sections = section
    }
    if (categorySelection.category) {
      data.category = categorySelection.category
    }
    if (categorySelection.subCategory) {
      data.sub_category = categorySelection.subCategory
    }
    if (categorySelection.subSubCategory) {
      data.sub_sub_category = categorySelection.subSubCategory
    }
    if (auth.personal_info.role !== 'Principal') {
      delete data.branches
    }
    setloading(true)
    axios
      .post(discussionUrls.PostDiscussion, data, {
        headers: {
          Authorization: 'Bearer ' + auth.personal_info.token
        }
      })
      .then(res => {
        if (res.status === 201) {
          postSuccess()
          setloading(false)
          alert.success('Posted Successfully')
          //   this.refreshComponent()
        } else {
          alert.warning(JSON.stringify(res.data))
          setloading(false)
        }
      })
      .catch(error => {
        setloading(false)
        // alert.error(JSON.stringify(error))
        console.log(error)
        console.log("Error: Couldn't fetch data from " + discussionUrls.PostDiscussion)
      })
  }
  return (
    <>
      <h3>Create a Topic</h3>
      <Grid container spacing={2} style={{ 'marginBottom': '20px' }}>
        {/* <Grid item xs={3}>
          <TextField
            fullWidth
            id='filled-select-currency'
            select
            name='community'
            label='Choose a Community'
            value={categorySelection.community}
            onChange={handleChange}
            variant='filled'
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid> */}
        <Grid item xs={3}>
          <TextField
            fullWidth
            id='filled-select-currency'
            select
            name='category'
            label='Category'
            value={categorySelection.category}
            onChange={handleChange}
            variant='filled'
          >
            {categories.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.title}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            id='filled-select-currency'
            select
            name='subCategory'
            label='Sub Category'
            value={categorySelection.subCategory}
            onChange={handleChange}
            variant='filled'
          >
            {subcats.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.title}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            id='filled-select-currency'
            select
            name='subSubCategory'
            label='Sub sub category'
            value={categorySelection.subSubCategory}
            onChange={handleChange}
            variant='filled'
          >
            {subSubCats.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.title}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <PostTabs getTinyMce={handleAnswerChange} getTitle={handleTitleChange} />
      <div style={{ float: 'right' }}>
        <Button variant='contained' color='secondary' style={{ marginRight: '10px' }}>Cancel</Button>
        <Button variant='contained' color='primary' onClick={dataPost}>Post</Button>
      </div>
      {loader}
    </>
  )
}

export default PostDiscussion
