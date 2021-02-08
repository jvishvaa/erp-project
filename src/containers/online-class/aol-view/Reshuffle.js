import React, { useState } from 'react'
import {
    CircularProgress,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
    Chip,
    FormControlLabel,
    Checkbox,
    Switch,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state'
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout'
import ReshuffleModal from './reshuffle-modal';
const Reshuffle = () => {
    const [openReshuffleModal, setOpenReshuffleModal] = useState(false);


    const handleShuffle = () => {
       
        setOpenReshuffleModal(true);
      }
    

    return (

        <Layout>
            <div className='breadcrumb-container'>
                <CommonBreadcrumbs componentName='Online Class' childComponentName='Reshuffle Batch' />
            </div>

                <div className='attendee__management-table'>


                    <TableContainer>
                        <Table className='viewclass__table' aria-label='simple table'>
                            <TableHead className='styled__table-head'>
                                <TableRow>
                                    <TableCell align='center' >
                                        SL_NO.
                </TableCell>
                                    <TableCell align='center'>Student name</TableCell>
                                    <TableCell align='center'>Erp</TableCell>
                                    <TableCell align='center'>Batch Name</TableCell>
                                    <TableCell align='center'>Reshuffle</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                            <TableCell align='center'>
                                   
                                   
                                </TableCell><TableCell align='center'>
                                   
                                   
                                </TableCell><TableCell align='center'>
                                   
                                   
                                </TableCell><TableCell align='center'>
                                   
                                   
                                </TableCell>

                                <TableCell align='center'>
                                    <ShuffleIcon
                                     onClick={handleShuffle}
                                     style={{cursor:'pointer'}}
                                 />
                                </TableCell>





                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>


                <ReshuffleModal
                    openReshuffleModal={openReshuffleModal}
                    setOpenReshuffleModal={setOpenReshuffleModal}
                />
            </Layout>

    )
}

export default Reshuffle
