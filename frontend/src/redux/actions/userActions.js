import { userAPI } from '../../services/api';

// Action Types
const USER_LIST_REQUEST = 'USER_LIST_REQUEST';
const USER_LIST_SUCCESS = 'USER_LIST_SUCCESS';
const USER_LIST_FAIL = 'USER_LIST_FAIL';

const USER_DETAILS_REQUEST = 'USER_DETAILS_REQUEST';
const USER_DETAILS_SUCCESS = 'USER_DETAILS_SUCCESS';
const USER_DETAILS_FAIL = 'USER_DETAILS_FAIL';

const USER_UPDATE_REQUEST = 'USER_UPDATE_REQUEST';
const USER_UPDATE_SUCCESS = 'USER_UPDATE_SUCCESS';
const USER_UPDATE_FAIL = 'USER_UPDATE_FAIL';

// Action Creators
export const listUsers = () => async (dispatch) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });
    
    const { data } = await userAPI.getAll();
    
    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data,
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    
    throw error;
  }
};

export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    
    const { data } = await userAPI.getById(id);
    
    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    
    throw error;
  }
};

export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });
    
    const { data } = await userAPI.update(id, userData);
    
    dispatch({
      type: USER_UPDATE_SUCCESS,
      payload: data,
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    
    throw error;
  }
};