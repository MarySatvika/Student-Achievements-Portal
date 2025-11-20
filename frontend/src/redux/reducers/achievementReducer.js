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

// Initial State
const initialState = {
  achievements: [],
  myAchievements: [],
  stats: [],
  loading: false,
  error: null,
};

// Reducer
const achievementReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACHIEVEMENT_CREATE_REQUEST:
    case ACHIEVEMENT_LIST_MY_REQUEST:
    case ACHIEVEMENT_LIST_ALL_REQUEST:
    case ACHIEVEMENT_UPDATE_STATUS_REQUEST:
    case ACHIEVEMENT_STATS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case ACHIEVEMENT_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        achievements: [...state.achievements, action.payload],
      };
      
    case ACHIEVEMENT_LIST_MY_SUCCESS:
      return {
        ...state,
        loading: false,
        myAchievements: action.payload,
      };
      
    case ACHIEVEMENT_LIST_ALL_SUCCESS:
      return {
        ...state,
        loading: false,
        achievements: action.payload,
      };
      
    case ACHIEVEMENT_UPDATE_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        achievements: state.achievements.map(ach =>
          ach._id === action.payload._id ? action.payload : ach
        ),
        myAchievements: state.myAchievements.map(ach =>
          ach._id === action.payload._id ? action.payload : ach
        ),
      };
      
    case ACHIEVEMENT_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        stats: action.payload,
      };
      
    case ACHIEVEMENT_CREATE_FAIL:
    case ACHIEVEMENT_LIST_MY_FAIL:
    case ACHIEVEMENT_LIST_ALL_FAIL:
    case ACHIEVEMENT_UPDATE_STATUS_FAIL:
    case ACHIEVEMENT_STATS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    default:
      return state;
  }
};

export default achievementReducer;