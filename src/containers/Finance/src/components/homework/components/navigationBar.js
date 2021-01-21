import React from 'react'

import { emphasize, withStyles } from '@material-ui/core/styles'
import { Chip, Breadcrumbs } from '@material-ui/core'
import { Home as HomeIcon } from '@material-ui/icons'

import { paths } from '../paths'
import { useHomework } from '../context'

const StyledBreadcrumb = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.grey[300]
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12)
    }
  }
}))(Chip)

export default function NavigationBar ({ handleRouteChange, data }) {
  let homework = useHomework()
  let params = (new URL(document.location)).searchParams
  let path = params.get('path')
  let from = params.get('from')
  let fromParent = params.get('from_parent')
  if (!path) {
    path = 'home'
  }
  function handleClick (path) {
    params.set('path', path)
    if (path === 'home') {
      updateLocation('/homework/')
    } else if (path === 'online_class_homeworks') {
      let onlineClassId = data.homework_details.onlineclass.id
      let onlineClassTitle = data.homework_details.onlineclass.title
      updateLocation('/homework/?path=' + path + '&online_class_id=' + onlineClassId + '&from=' + onlineClassTitle)
    } else if (path === 'nonevaluated_grouped_homeworks') {
      let sectionMappingIds = data.section_mapping_id
      let sectionName = data.section_name
      updateLocation('/homework/?path=' + path + '&section_mapping_ids=' + sectionMappingIds + '&from=' + sectionName)
    } else {
      updateLocation('/homework/?path=' + path)
    }
    homework.setLoading(true)
    handleRouteChange()
  }

  function updateLocation (url) {
    const state = {}
    const title = 'Homeworks'
    window.history.pushState(state, title, url)
  }
  let items = paths.getParents(path)
  console.log(items, 'paths')
  return <Breadcrumbs style={{ padding: 16 }} aria-label='breadcrumb'>
    { items.map((item, index) => {
      if (items.length - 1 === index) {
        return <StyledBreadcrumb
          label={`${item.title}${from && from !== 'All Nonevaluated Submissions' ? `(${from})` : ''}`}
          icon={item.path === 'home' && <HomeIcon fontSize='small' />}
        />
      }
      if (items.length - 2 === index) {
        return <StyledBreadcrumb
          label={`${item.title}${fromParent && fromParent !== 'All Nonevaluated Submissions' ? `(${fromParent})` : ''}`}
          icon={item.path === 'home' && <HomeIcon fontSize='small' />}
          onClick={() => { handleClick(item.path) }}
        />
      }

      return <StyledBreadcrumb
        label={item.title}
        icon={item.path === 'home' && <HomeIcon fontSize='small' />}
        onClick={() => { handleClick(item.path) }}
      />
    })}
  </Breadcrumbs>
}
