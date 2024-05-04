import { Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllSalaries, setSalaryEdit, timekeepingAPI, updateSalaryAPI } from '../../../redux/reducers/SalaryReducer'
import { setComponentsAction } from '../../../redux/reducers/FunctionPopupReducer'
import { API_DOMAIN, STATUS_CODE } from '../../../utils/constants/settingSystem'


export default function SalaryInformation(props) {

    const columns = [
        {
            title: 'Employee ID',
            dataIndex: 'user_id',
            key: 'user_id',
        },
        {
            title: 'Employee Name',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: 'Salary',
            dataIndex: 'salary_per_date',
            key: 'salary_per_date',
        },
        {
            title: 'KPI',
            dataIndex: 'min_kpi',
            key: 'min_kpi',
        },
        {
            title: 'Rate Salary',
            dataIndex: 'rate_sa',
            key: 'rate_sa',
        },
        {
            title: 'Work Day',
            dataIndex: 'working_date',
            key: 'working_date',
        },
        {
            title: 'Total Salary',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Action',
            key: 'action',
            width: '15%',
            render: (text, record) => (
                <Space size="middle">
                    <button className='btn btn-warning' onClick={() => {
                        const data = {
                            ...record,
                            working_date: record.working_date + 1
                        }
                        dispatch(updateSalaryAPI(data))
                    }}>Checkin</button>
                    <button className='btn btn-danger' onClick={() => {
                        const data = {
                            ...record,
                            working_date: record.working_date - 1
                        }
                        dispatch(updateSalaryAPI(data))
                    }}>UnCheckin</button>
                    <button className='btn btn-primary' onClick={() => {
                        // set edit salary
                        dispatch(setSalaryEdit(record))
                        const action = {
                            type: "ModalReducer/setModalOpen",
                            title: "Edit Salary",
                            contentComponentType: "FormEditSalary",
                        };
                        dispatch(action);
                    }}>Edit</button>
                </Space>
            ),
        }
    ]

    const dispatch = useDispatch()

    const { salaryList } = useSelector((state) => state.SalaryReducer)

    useEffect(() => {
        let Components = []
        dispatch(setComponentsAction(Components))
        dispatch(getAllSalaries())
    }, [])

    return (
        <div>
            <h5><i className='fa fa-dollar' /> Salary Information</h5>
            <Table rowKey={(record) => record.id} dataSource={salaryList} columns={columns} />
            <div className='text-end'>
                <button className='btn btn-success' onClick={() => {
                    dispatch(timekeepingAPI())
                }}>Timekeeping</button>
                <button className='btn btn-primary ml-2' onClick={async () => {
                    const response = await fetch(`${API_DOMAIN}/salaries/NewMonth`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                        }
                    })
                    if (response.status === STATUS_CODE.SUCCESS) {
                        const blob = await response.blob();
                        const downloadUrl = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = downloadUrl;
                        const month = new Date().getMonth() + 1;
                        const year = new Date().getFullYear();
                        a.download = `salary_report_${month}-${year}.xlsx`; // Thay thế 'filename.xlsx' bằng tên file bạn muốn
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(downloadUrl);
                        dispatch(getAllSalaries())
                    }
                }}>New Month</button>
            </div>
        </div>
    )
}