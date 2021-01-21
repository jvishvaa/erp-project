import React from 'react'
import { SpringGrid, measureItems, makeResponsive } from 'react-stonecutter'
import TextField from '@material-ui/core/TextField'
import horizontal from './layouts/horizontal'
import CardItem from './card'
import { urls } from '../../urls'

const ResponsiveGrid = makeResponsive(measureItems(SpringGrid), {
  measureImages: true,
  maxWidth: 1920,
  minPadding: 8
})
function SubmissionPage ({ contentManager, isEvaluated, cards, data, id, remarks, setRemarks, overallRemarks, setOverallRemarks, attemptedOverallRemarks }) {
  let ids = cards.filter((card) => {
    if (card.media) {
      let extension = card.media.split('.').pop().toLowerCase()
      if (extension === 'jpg' || extension === 'png' || extension === 'jpeg') {
        return true
      }
    }
    return false
  }).map(card => card.id)
  let link = `${urls.HomeWorkImageEvaluation}?hw_submission_id=${ids.join(',')}`
  return <><ResponsiveGrid
    component='div'
    columnWidth={345}
    gutterWidth={16}
    gutterHeight={16}
    layout={horizontal}
    itemHeight={382}
    springConfig={{ stiffness: 170, damping: 26 }}
  >
    {cards && cards.map(card => {
      return <div itemHeight={card.type === 'folder' ? 212 : 345} it key={`${card.id}_${card.type}`}>
        <CardItem contentManager={contentManager} link={link} onClick={() => console.log('Not handled')} remarks={remarks} setRemarks={setRemarks} card={card} />
      </div>
    })}
  </ResponsiveGrid>
    {attemptedOverallRemarks ? 'Overall Remarks : ' + attemptedOverallRemarks : (!isEvaluated ? <TextField
      id='outlined-multiline-static'
      label='Overall Remarks'
      onChange={(e) => {
        setOverallRemarks(e.target.value)
      }}
      value={overallRemarks}
      multiline
      fullWidth
      rows={4}
      variant='outlined'
    /> : '')}
  </>
}

export default SubmissionPage
