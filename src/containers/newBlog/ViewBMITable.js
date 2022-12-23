import Layout from 'containers/Layout'
import React, {
    useState,
    useEffect,
    useContext
} from 'react';
import { Button as ButtonAnt, Table, Modal, Row, Col, Input,message } from 'antd';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import { FileAddOutlined, EditOutlined, CloudDownloadOutlined, EyeOutlined } from '@ant-design/icons';
import endpoints from '../../config/endpoints';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import axios from 'axios';
import moment from 'moment';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';


const ViewBMITableCustom = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openBigModal, setOpenBigModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false)
    const { setAlert } = useContext(AlertNotificationContext);
    // const boardListData = useSelector((state) => state.commonFilterReducer?.branchList)
    const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
    let dataes = JSON?.parse(localStorage?.getItem('userDetails')) || {};
    const newBranches = JSON?.parse(localStorage?.getItem('ActivityManagementSession')) || {};
    const user_level = dataes?.user_level;
    const [totalSubmitted, setTotalSubmitted] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sourceData, setSourceData] = useState([])
    const [checkBMIData, setCheckBMIData] = useState([])
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [bmi, setBmi] = useState('')
    const [bmiDetails, setBmiDetails] = useState([])
    const [editData, setEditData] = useState([])
    const [rowData, setRowData] = useState([])





    const columns = [
        {
            title: <span className='th-white th-fw-700 '> Student Name</span>,
            dataIndex: 'student_name',
            key: 'student_name',
            align: 'center',
            // render: (text) => <a>{text}</a>,
        },
        {
            title: <span className='th-white th-fw-700 '>ERP ID</span>,
            dataIndex: 'erp_id',
            key: 'erp_id',
            align: 'center'
        },
        {
            title: <span className='th-white th-fw-700 '>Action</span>,
            dataIndex: 'actions',
            key: 'actions',
            align: 'center',
            render: (text, row, index) => (
                <>
                    <span style={{ margin: '0.5rem 1rem' }}>
                        <ButtonAnt type="primary"
                            icon={<FileAddOutlined />}
                            size={'medium'}
                            onClick={() => CheckBMIFun(row)}
                        >
                            Add BMI
                        </ButtonAnt>
                    </span>
                    <span style={{ margin: '0.5rem 1rem' }}>
                        <ButtonAnt type="primary"
                            icon={<EyeOutlined />}
                            size={'medium'}
                            // onClick={showBigModal}
                            onClick={() => showBigModal(row)}
                        >
                            View
                        </ButtonAnt>
                    </span>
                </>
            )
        },
    ];


    const showModal = () => {
        setIsModalOpen(true);
    };

    const editModal = (data) => {
        setIsEdit(true)
        setOpenBigModal(false)
        if (data) {
            showModal()
            setHeight(data?.bmi_details?.height)
            setWeight(data?.bmi_details?.weight)
            setBmi(data?.bmi_details?.bmi)
            setEditData(data)

        }

    }


    const showBMITable = (data) => {
        setLoading(true)
        axios
            .get(`${endpoints.newBlog.getStudentBMIApi}?student_id=${data?.id}`, {
                headers: {
                    Authorization: `${token}`,
                    'X-DTS-HOST': X_DTS_HOST,
                }
            })
            .then((res) => {
                if (res.data?.status_code == 200) {
                    setBmiDetails(res?.data?.result)
                    setLoading(false)
                    setAlert('success', res?.data?.message)
                    setOpenBigModal(true)

                } else if (res?.data?.status_code == 400) {
                    setOpenBigModal(false)
                    setAlert('error', res?.data?.message)
                    setLoading(false)
                    setOpenBigModal(false)
                }
            })

    }

    const showBigModal = (data) => {
        if (data) {
            EditCheckBMIFun(data)
            setRowData(data)
        }
    }

    const handleOk = () => {
        if (isEdit) {
            if(!height){
                message.error("Please Add Height");
                return
            }else if(!weight){
                message.error("Please Add Weight");
                return
            }else{
                const requestData = {
                    id: editData?.bmi_details?.id,
                    height: height,
                    weight: weight,
                    bmi: bmi,
                };
                const options = {
                    headers: {
                        'X-DTS-HOST': X_DTS_HOST,
                        Authorization: `${token}`,
    
                    }
                }
                axios
                    .post(`${endpoints.newBlog.addBMIApi}`, requestData, options)
                    .then((res) => {
                        if (res?.data?.status_code === 200) {
                            setAlert('success', res?.data?.message)
                            setIsEdit(false)
                            setIsModalOpen(false);
                            showBMITable(editData?.student)
    
    
                        } else {
                            setAlert('error', res?.data?.message)
                            setIsModalOpen(false);
    
                        }
    
                    })


            }


        } else {
            if(!height){
                message.error("Please Add Height");
                return
            }else if(!weight){
                message.error("Please Add Weight");
                return
            }else{
                const requestData = {
                    student_id: checkBMIData?.id,
                    height: height,
                    weight: weight,
                    bmi: bmi,
                };
                const options = {
                    headers: {
                        'X-DTS-HOST': X_DTS_HOST,
                        Authorization: `${token}`,
                    }
                }
                axios
                    .post(`${endpoints.newBlog.addBMIApi}`, requestData, options)
                    .then((res) => {
                        if (res?.data?.status_code === 200) {
                            setAlert('success', res?.data?.message)
                            setIsEdit(false)
                            setIsModalOpen(false);
    
                        } else {
                            setAlert('error', res?.data?.message)
                            setIsModalOpen(false);
    
                        }
    
                    })

            }

        }

    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsEdit(false)
    };

    const goDownload = () => {
        //will implement soon
    }


    const columnsBigTable = [
        {
            title: <span className='th-white th-fw-700 '>Height(in meters)</span>,
            dataIndex: 'height',
            key: 'height',
            align: 'center',
            render: (text, row, index) => <a>{row?.bmi_details?.height}</a>,
        },
        {
            title: <span className='th-white th-fw-700 '>Weight(in kgs)</span>,
            dataIndex: 'weight',
            key: 'weight',
            align: 'center',
            render: (text, row, index) => <a>{row?.bmi_details?.weight}</a>
        },
        {
            title: <span className='th-white th-fw-700 '>BMI</span>,
            dataIndex: 'bmi',
            key: 'bmi',
            align: 'center',
            render: (text, row, index) => <a>{row?.bmi_details?.bmi}</a>

        },
        {
            title: <span className='th-white th-fw-700 '>Date</span>,
            dataIndex: 'date',
            key: 'date',
            align: 'center',
            render: (text, row, index) => <a>{moment(row?.bmi_details?.created_at).format("MMM Do YY")}</a>

        },
        {
            title: <span className='th-white th-fw-700 '>Action</span>,
            dataIndex: 'actions',
            key: 'actions',
            align: 'center',
            render: (text, row, index) => (
                <>
                    <span style={{ margin: '0.5rem 1rem' }}>
                        <ButtonAnt type="primary"
                            icon={<EditOutlined />}
                            size={'medium'}
                            // onClick={editModal}
                            onClick={() => editModal(row)}
                        // onClick={showModal}
                        >
                            Edit
                        </ButtonAnt>
                    </span>
                </>
            )
        },
    ];

    const erpAPI = () => {
        axios
            .get(`${endpoints.newBlog.erpDataStudentsAPI}?section_mapping_id=${props?.setSubjectName}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setSourceData(response?.data?.result)
                setTotalSubmitted(response?.data?.result)
                // ActivityManagement(response?.data?.result)
                props.setFlag(false);
                setAlert('success', response?.data?.message)
                setLoading(false);
            });

    }

    useEffect(() => {
        if (props.selectedBranch === undefined || props.selectedGrade === undefined) {
            setTotalSubmitted([])
        }
    }, [props.selectedBranch, props.selectedGrade, props.flag])

    useEffect(() => {
        if (props.flag) {
            getTotalSubmitted();
        }
    }, [props.selectedBranch, props.selectedGrade, props.flag, currentPage]);

    const CheckBMIFun = (data) => {
        if (data) {
            setBmi('')
            setHeight('')
            setWeight('')
            showModal()
            setLoading(true)
            axios
                .get(`${endpoints.newBlog.checkBMIApi}?erp_id=${data?.erp_id}&user_level=${13}`, {
                    headers: {
                        Authorization: `${token}`,
                        'X-DTS-HOST': X_DTS_HOST,
                    }
                })
                .then((response) => {
                    setCheckBMIData(response?.data?.result)
                    // setAlert('success', response?.data?.message)
                    setLoading(false);
                })

        }

    }
    const EditCheckBMIFun = (data) => {
        if (data) {
            setLoading(true)
            axios
                .get(`${endpoints.newBlog.checkBMIApi}?erp_id=${data?.erp_id}&user_level=${13}`, {
                    headers: {
                        Authorization: `${token}`,
                        'X-DTS-HOST': X_DTS_HOST,
                    }
                })
                .then((response) => {
                    setCheckBMIData(response?.data?.result)
                    showBMITable(response?.data?.result)
                    setAlert('success', response?.data?.message)
                    setLoading(false);
                })

        }

    }


    const getTotalSubmitted = () => {
        if (props) {
            setLoading(true)
            erpAPI()
            setLoading(false)

        }
    };

    const calculateBMI = (height, weight) => {
        if (height && weight) {
            let parseHeight = parseInt(height)
            let parseWeight = parseInt(weight)
            if (parseHeight === "" || isNaN(parseHeight)) {
                setAlert('error', 'Provide a valid height')
                return
            } else if (parseWeight === "" || isNaN(parseWeight)) {
                setAlert('error', 'Provide a valid weight')
                return
            } else {
                let bmi = (weight / ((height * height) / 10000)).toFixed(2)
                setBmi(bmi)
            }
        } else {

        }
    }

    useEffect(() => {
        if (height && weight) {
            calculateBMI(height, weight)
            return
        } else {
            // setBmi('')
        }
    }, [height, weight])

    const handleInputBMI = (event, target) => {
        if (target == 'height') {
            setHeight(event.target.value)
        } else if (target == 'weight') {
            setWeight(event.target.value)
        }
    }


    return (
        <>
            <div className='row'>
                <div className='col-12'>
                    {totalSubmitted?.length !== 0 ? (

                        <Table
                            style={{ maxHeight: '60vh',OverflowY: 'auto'}}
                            className='th-table'
                            rowClassName={(record, index) => `'th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                            }
                            pagination={false}
                            loading={loading}
                            columns={columns} dataSource={totalSubmitted} />
                    ) : (
                        <div className='row justify-content-center mt-5'>
                            <img src={NoDataIcon} />
                        </div>
                    )}
                </div>
            </div>
            <Modal title={isEdit === true ? "EDIT BMI" : "ADD BMI"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} visible={isModalOpen} okText={'Submit'} width={1000} centered>
                <Row style={{ padding: '0.5rem 1rem' }}>
                    <Col span={8}>
                        <Input style={{ margin: '0.5rem', width: 'auto' }} onChange={(event) => handleInputBMI(event, 'height')} value={height} placeholder="Height(in cm)" />
                    </Col>
                    <Col span={8}>
                        <Input style={{ margin: '0.5rem', width: 'auto' }} value={weight} onChange={(event) => handleInputBMI(event, 'weight')} placeholder="Weight(in kg)" />
                    </Col>
                    <Col span={8}>
                        <Input style={{ margin: '0.5rem', width: 'auto' }} value={bmi} placeholder="BMI" disabled='true' />
                    </Col>
                </Row>
            </Modal>
            <Modal
                title="BMI Details"
                visible={openBigModal}
                centered
                open={openBigModal}
                onOk={() => setOpenBigModal(false)}
                onCancel={() => setOpenBigModal(false)}
                width={1000}
                footer={null}
            >
                <div className='row'>
                    <div className='col-12' style={{ display: 'flex', borderRadius: '10px', padding: '0.5rem 1rem' }}>
                        <div className='col-3'>
                            Name : {rowData?.student_name}
                        </div>
                        <div className='col-3'>
                            ERP ID :{rowData?.erp_id}
                        </div>
                        <div className='col-3'>
                            Branch : {props?.selectedBoardName}
                        </div>
                        <div className='col-3'>
                            Grade: {props?.selectedGradeName}
                        </div>

                    </div>
                    <div className='col-12' style={{ padding: '1rem 1rem' }}>
                        <Table
                            style={{ maxHeight: '50vh', overflowY: 'auto' }}
                            className='th-table'
                            rowClassName={(record, index) => `'th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                            }
                            pagination={false}
                            loading={loading}
                            columns={columnsBigTable} dataSource={bmiDetails} />

                    </div>
                </div>
            </Modal>
        </>


    )
}

export default ViewBMITableCustom