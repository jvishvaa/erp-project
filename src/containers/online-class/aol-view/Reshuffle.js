import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
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
    SvgIcon
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
import unfiltered from '../../../assets/images/unfiltered.svg';
import selectfilter from '../../../assets/images/selectfilter.svg';
import './style.css'

const Reshuffle = () => {
    const [openReshuffleModal, setOpenReshuffleModal] = useState(false);
    const [studentName, setStudentName] = useState([])
    const [modalData, setModalData] = useState({})
    const [reshuffleFlag, setReshuffleFlag] = useState(false)
    const { id } = useParams()
    const history = useHistory()
    const handleShuffle = (data) => {
        setModalData(data)
        setOpenReshuffleModal(true);
    }
    useEffect(() => {
        axiosInstance.get(`${endpoints.onlineCourses.studentList}?batch_id=${id}&is_aol=1`)
            .then((result) => {
                setStudentName(result.data.data)
            })
    }, [reshuffleFlag])

    const handleBack = () => {
        history.goBack();
    }
    return (
        <Layout>
            <div className='breadcrumb-container'>
                <CommonBreadcrumbs componentName='Online Class' childComponentName='Reshuffle Batch' />
            </div>
            <div>
                <Button style={{ backgroundColor: 'lightgray', width: '16rem' }} onClick={handleBack}>BACK</Button>
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
                        {studentName && studentName.length > 0 ?
                            (<TableBody>
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

                            </TableBody>)
                            : (<div className='reshuffleDataUnavailable'>
                                <SvgIcon
                                    component={() => (
                                        <img
                                            style={
                                                // isMobile
                                                //   ? { height: '100px', width: '200px' }
                                                // :
                                                { height: '160px', width: '290px' }
                                            }
                                            src={unfiltered}
                                        />
                                    )}
                                />
                                <SvgIcon
                                    component={() => (
                                        <img
                                            style={
                                                // isMobile
                                                //   ? { height: '20px', width: '250px' }
                                                //   : 
                                                { height: '50px', width: '400px', marginLeft: '5%' }
                                            }
                                            src={selectfilter}
                                        />
                                    )}
                                />
                            </div>)}
                    </Table>
                </TableContainer>
            </div>
            <ReshuffleModal
                openReshuffleModal={openReshuffleModal}
                setOpenReshuffleModal={setOpenReshuffleModal}
                // studentName={studentName}
                modalData={modalData}
                id={id}
                reshuffleFlag={reshuffleFlag}
                setReshuffleFlag={setReshuffleFlag}
            />
        </Layout>

    )
}

export default Reshuffle
