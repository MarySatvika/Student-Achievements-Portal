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

// Initial State
const initialState = {
  users: [],
  user: null,
  loading: false,
  error: null,
};

// Reducer
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
    case USER_DETAILS_REQUEST:
    case USER_UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case USER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
      
    case USER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };
      
    case USER_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map(user =>
          user._id === action.payload._id ? action.payload : user
        ),
        user: action.payload,
      };
      
    case USER_LIST_FAIL:
    case USER_DETAILS_FAIL:
    case USER_UPDATE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    default:
      return state;
  }
};

export default userReducer;