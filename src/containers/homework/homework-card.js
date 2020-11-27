import React , { useContext, useEffect, useState } from 'react';
import './homework-card.css'
import { Grid, useTheme, Paper, Typography, Divider} from '@material-ui/core';
import Layout from '../Layout'

const HomeworkCard = () => {

    let arr=[]
    for(let i=0;i<20;i++)
    {
        if(i%5===0)
        arr.push({name:'Sankalp Khanna',marks:'14/50'})
        else
        arr.push({name:'Sankalp Khanna',marks:'34/50'})
    }
    

    return (
        <Layout>
         <Grid container spacing={3}>
            <Grid item sm={8}/>
            <Grid item sm={4} >   
            <Paper className="hwcard">
              <div className="cardHeader">
                <div className='subjectName'>
                    4B : English            
                </div>
                <div>
                    12<sup>th</sup> November            
                </div>
              </div>
              <div className='divider'></div>
              <div className="cardHeaderSub">
                Evaluated students :
              </div>
              <div className="innerBox">
                {arr.map(val=>(
                <div className="cardRow">
                    <div className="studentName">{val.name}</div>
                    <div className='dividerRow'></div>
                    {val.marks==='14/50'?
                    <div className="studentMarks" style={{color:'#fe6b6b'}}>{val.marks}</div>
                    :<div className="studentMarks" style={{color: '#014B7E'}}>{val.marks}</div>}
                </div>
                ))}
              </div>
              <div className="cardHeaderSub">
                Submitted students :
              </div>
              <div className="innerBox">
                {arr.slice(0,4).map(val=>(
                <div className="cardRow">
                    <div className="studentName">{val.name}</div>
                </div>
                ))}
              </div>
            </Paper>
            </Grid>
            </Grid>
        </Layout>    
    )
}

export default HomeworkCard