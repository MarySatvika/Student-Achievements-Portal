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

// Initial State
const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Reducer
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
    case AUTH_REGISTER_REQUEST:
    case AUTH_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case AUTH_LOGIN_SUCCESS:
    case AUTH_REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
      
    case AUTH_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
      
    case AUTH_LOGIN_FAIL:
    case AUTH_REGISTER_FAIL:
    case AUTH_PROFILE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
      };
      
    case AUTH_LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
      
    default:
      return state;
  }
};

export default authReducer;