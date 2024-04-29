import { createSlice } from '@reduxjs/toolkit'
import { customerService } from '../services/CustomerService';
import { STATUS_CODE } from '../../utils/constants/settingSystem';
import { setModalCancel } from './ModalReducer';

const initialState = {
    customerList: [],
    customerDetails: {},
}

const CustomerReducer = createSlice({
    name: "CustomerReducer",
    initialState,
    reducers: {
        setCustomerList: (state, action) => {
            state.customerList = action.payload
        },
        setCustomerDetails: (state, action) => {
            state.customerDetails = action.payload
        },
        setCustomerFavorite: (state, action) => {
            const list = state.customerList.sort((a, b) => {
                if (a.order.length > b.order.length) {
                    return -1;
                }
                if (a.order.length <= b.order.length) {
                    return 1;
                }
            })
            state.customerList = list.split(0, 5)
        }
    }
});

export const { setCustomerList, setCustomerDetails, setCustomerFavorite } = CustomerReducer.actions

export default CustomerReducer.reducer

// Customer API
// Get All customers
export const getAllCustomersAPI = () => {
    return async (dispatch) => {
        try {
            const response = await customerService.getAllCustomers();
            if (response.status === STATUS_CODE.SUCCESS) {
                dispatch(setCustomerList(response.data));
            }
        } catch (error) {
            console.log('error', error);
        }
    }
}

export const getCustomerDetailsAPI = (customerId) => {
    return async (dispatch) => {
        try {
            const response = await customerService.getCustomerDetails(customerId);
            if (response.status === STATUS_CODE.SUCCESS) {
                dispatch(setCustomerDetails(response.data));
            }
        } catch (error) {
            console.log('error', error);
        }
    }
}

export const createCustomerAPI = (data) => {
    return async (dispatch) => {
        try {
            const response = await customerService.createCustomer(data);
            if (response.status === STATUS_CODE.SUCCESS) {
                alert('Create customer success');
                dispatch(getAllCustomersAPI());
                dispatch(setModalCancel())
            }
        } catch (error) {
            console.log('error', error);
        }
    }
}

// update customer
export const updateCustomerAPI = (data) => {
    return async (dispatch) => {
        try {
            const response = await customerService.updateCustomer(data);
            if (response.status === STATUS_CODE.SUCCESS) {
                alert('Update customer success');
                dispatch(getCustomerDetailsAPI(data.id));
                dispatch(setModalCancel())
            }
        } catch (error) {
            console.log('error', error);
        }
    }
}

export const deleteCustomerAPI = (customerId) => {
    return async (dispatch) => {
        try {
            const response = await customerService.deleteCustomer(customerId);
            if (response.status === STATUS_CODE.SUCCESS) {
                alert('Delete customer success');
                dispatch(getAllCustomersAPI());
            }
        } catch (error) {
            console.log('error', error);
        }
    }
}
