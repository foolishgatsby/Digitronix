import { createSlice } from '@reduxjs/toolkit'
import { processService } from '../services/ProcessService';
import { STATUS_CODE } from '../../utils/constants/settingSystem';

const initialState = {
    processList: [],
    processListLoading: false,
    processByProductId: [],
    processEdit: {}
}

const ProcessReducer = createSlice({
    name: "ProcessReducer",
    initialState,
    reducers: {
        setProcessList: (state, action) => {
            state.processList = action.payload
        },
        setProcessListLoading: (state, action) => {
            state.processListLoading = action.payload
        },
        setProcessByProductId: (state, action) => {
            state.processByProductId = action.payload
        },
        setProcessEdit: (state, action) => {
            state.processEdit = action.payload
        }
    }
});

export const { setProcessEdit, setProcessList, setProcessListLoading, setProcessByProductId } = ProcessReducer.actions

export default ProcessReducer.reducer

// API
export const getProcessByProductId = (productId) => {
    return async (dispatch) => {
        dispatch(setProcessListLoading(true));
        try {
            const result = await processService.getProcessByProductId(productId);
            if (result.status === STATUS_CODE.SUCCESS) {
                dispatch(setProcessByProductId(result.data));
            }
            dispatch(setProcessListLoading(false));
        } catch (error) {
            console.log('error', error);
            dispatch(setProcessListLoading(false));
        }
    }
}

export const createProcessApi = (data) => {
    return async (dispatch) => {
        dispatch(setProcessListLoading(true));
        try {
            const result = await processService.createProcess(data);
            if (result.status === STATUS_CODE.SUCCESS) {
                dispatch(getProcessByProductId(data.product_id));
            }
            dispatch(setProcessListLoading(false));
        } catch (error) {
            console.log('error', error);
            dispatch(setProcessListLoading(false));
        }
    }
}

export const getAllProcessApi = () => {
    return async (dispatch) => {
        dispatch(setProcessListLoading(true));
        try {
            const result = await processService.getAllProcess();
            if (result.status === STATUS_CODE.SUCCESS) {
                dispatch(setProcessList(result.data));
            }
            dispatch(setProcessListLoading(false));
        } catch (error) {
            console.log('error', error);
            dispatch(setProcessListLoading(false));
        }
    }
}

export const getProcessById = (processId) => {
    return async (dispatch) => {
        try {
            const result = await processService.getProcessById(processId);
            if (result.status === STATUS_CODE.SUCCESS) {
                dispatch(setProcessEdit(result.data));
            }
        } catch (error) {
            console.log('error', error);
            dispatch(setProcessListLoading(false));
        }
    }
}