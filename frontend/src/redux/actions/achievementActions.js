import { achievementAPI } from '../../services/api';

// Action Types
const ACHIEVEMENT_CREATE_REQUEST = 'ACHIEVEMENT_CREATE_REQUEST';
const ACHIEVEMENT_CREATE_SUCCESS = 'ACHIEVEMENT_CREATE_SUCCESS';
const ACHIEVEMENT_CREATE_FAIL = 'ACHIEVEMENT_CREATE_FAIL';

const ACHIEVEMENT_LIST_MY_REQUEST = 'ACHIEVEMENT_LIST_MY_REQUEST';
const ACHIEVEMENT_LIST_MY_SUCCESS = 'ACHIEVEMENT_LIST_MY_SUCCESS';
const ACHIEVEMENT_LIST_MY_FAIL = 'ACHIEVEMENT_LIST_MY_FAIL';

const ACHIEVEMENT_LIST_ALL_REQUEST = 'ACHIEVEMENT_LIST_ALL_REQUEST';
const ACHIEVEMENT_LIST_ALL_SUCCESS = 'ACHIEVEMENT_LIST_ALL_SUCCESS';
const ACHIEVEMENT_LIST_ALL_FAIL = 'ACHIEVEMENT_LIST_ALL_FAIL';

const ACHIEVEMENT_UPDATE_STATUS_REQUEST = 'ACHIEVEMENT_UPDATE_STATUS_REQUEST';
const ACHIEVEMENT_UPDATE_STATUS_SUCCESS = 'ACHIEVEMENT_UPDATE_STATUS_SUCCESS';
const ACHIEVEMENT_UPDATE_STATUS_FAIL = 'ACHIEVEMENT_UPDATE_STATUS_FAIL';

const ACHIEVEMENT_STATS_REQUEST = 'ACHIEVEMENT_STATS_REQUEST';
const ACHIEVEMENT_STATS_SUCCESS = 'ACHIEVEMENT_STATS_SUCCESS';
const ACHIEVEMENT_STATS_FAIL = 'ACHIEVEMENT_STATS_FAIL';

// Action Creators
export const createAchievement = (achievementData) => async (dispatch) => {
  try {
    dispatch({ type: ACHIEVEMENT_CREATE_REQUEST });
    
    const { data } = await achievementAPI.create(achievementData);
    
    dispatch({
      type: ACHIEVEMENT_CREATE_SUCCESS,
      payload: data,
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: ACHIEVEMENT_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    
    throw error;
  }
};

export const listMyAchievements = () => async (dispatch) => {
  try {
    dispatch({ type: ACHIEVEMENT_LIST_MY_REQUEST });
    
    const { data } = await achievementAPI.getMyAchievements();
    
    dispatch({
      type: ACHIEVEMENT_LIST_MY_SUCCESS,
      payload: data,
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: ACHIEVEMENT_LIST_MY_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    
    throw error;
  }
};

export const listAllAchievements = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: ACHIEVEMENT_LIST_ALL_REQUEST });
    
    const { data } = await achievementAPI.getAll(params);
    
    dispatch({
      type: ACHIEVEMENT_LIST_ALL_SUCCESS,
      payload: data,
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: ACHIEVEMENT_LIST_ALL_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    
    throw error;
  }
};

export const updateAchievementStatus = (id, statusData) => async (dispatch) => {
  try {
    dispatch({ type: ACHIEVEMENT_UPDATE_STATUS_REQUEST });
    
    const { data } = await achievementAPI.updateStatus(id, statusData);
    
    dispatch({
      type: ACHIEVEMENT_UPDATE_STATUS_SUCCESS,
      payload: data,
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: ACHIEVEMENT_UPDATE_STATUS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    
    throw error;
  }
};

export const getAchievementStats = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: ACHIEVEMENT_STATS_REQUEST });
    
    const { data } = await achievementAPI.getStats(params);
    
    dispatch({
      type: ACHIEVEMENT_STATS_SUCCESS,
      payload: data,
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: ACHIEVEMENT_STATS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    
    throw error;
  }
};