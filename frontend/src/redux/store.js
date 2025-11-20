import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';

// Import reducers
import authReducer from './reducers/authReducer';
import achievementReducer from './reducers/achievementReducer';
import userReducer from './reducers/userReducer';

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  achievements: achievementReducer,
  users: userReducer,
});

// Initial state
const initialState = {};

// Middleware
const middleware = [thunk];

// Create store with or without dev tools
let store;
if (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
  );
} else {
  store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
  );
}

export default store;