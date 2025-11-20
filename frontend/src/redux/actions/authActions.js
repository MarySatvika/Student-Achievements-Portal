import { authAPI } from '../../services/api';

// Action Types
const AUTH_LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST';
const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
const AUTH_LOGIN_FAIL = 'AUTH_LOGIN_FAIL';

const AUTH_REGISTER_REQUEST = 'AUTH_REGISTER_REQUEST';
const AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS';
const AUTH_REGISTER_FAIL = 'AUTH_REGISTER_FAIL';

const AUTH_LOGOUT = 'AUTH_LOGOUT';

const AUTH_PROFILE_REQUEST = 'AUTH_PROFILE_REQUEST';
const AUTH_PROFILE_SUCCESS = 'AUTH_PROFILE_SUCCESS';
const AUTH_PROFILE_FAIL = 'AUTH_PROFILE_FAIL';

// Action Creators
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_LOGIN_REQUEST });
    
    const { data } = await authAPI.login(email, password);
    
    dispatch({
      type: AUTH_LOGIN_SUCCESS,
      payload: data,
    });
    
    localStorage.setItem('token', data.token);
    
    return data;
  } catch (error) {
    dispatch({
      type: AUTH_LOGIN_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    
    throw error;
  }
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_REGISTER_REQUEST });
    
    const { data } = await authAPI.register(userData);
    
    dispatch({
      type: AUTH_REGISTER_SUCCESS,
      payload: data,
    });
    
    localStorage.setItem('token', data.token);
    
    return data;
  } catch (error) {
    dispatch({
      type: AUTH_REGISTER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    
    throw error;
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: AUTH_LOGOUT });
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: AUTH_PROFILE_REQUEST });
    
    const { data } = await authAPI.getProfile();
    
    dispatch({
      type: AUTH_PROFILE_SUCCESS,
      payload: data,
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: AUTH_PROFILE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    
    throw error;
  }
};