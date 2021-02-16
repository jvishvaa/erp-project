import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints'
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout'
import ReshuffleModal from './reshuffle-modal';


const Reshuffle = () => {
    const [openReshuffleModal, setOpenReshuffleModal] = useState(false);
    const [studentName, setStudentName] = useState([])
    const [modalData, setModalData] = useState({})
    const { id } = useParams()
    const handleShuffle = (data) => {
        setModalData(data)
        setOpenReshuffleModal(true);
    }
    useEffect(() => {
        axiosInstance.get(`${endpoints.onlineCourses.studentList}?batch_id=${id}&is_aol=1`)
            .then((result) => {
                setStudentName(result.data.data)
            })
    }, [])
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
                            {studentName?.map((p, index) => {
                                return (
                                    <TableRow key={`banda_${index}`} >
                                        <TableCell align='center'>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align='center'>
                                            {p?.first_name}
                                        </TableCell>
                                        <TableCell align='center'>
                                            {p?.username}
                                        </TableCell>
                                        <TableCell align='center'>
                                            {p?.title}
                                        </TableCell>
                                        <TableCell align='center'>
                                            <ShuffleIcon
                                                onClick={() => handleShuffle(p)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })}

                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <ReshuffleModal
                openReshuffleModal={openReshuffleModal}
                setOpenReshuffleModal={setOpenReshuffleModal}
                // studentName={studentName}
                modalData={modalData}
                id={id}
            />
        </Layout>

    )
}

export default Reshuffle
