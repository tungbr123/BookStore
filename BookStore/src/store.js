import {thunk} from 'redux-thunk';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import userReducer from "./ApiProcess/Action/userReducer"
import authReducer from "./ApiProcess/Action/authReducer"

const initialState = {};
const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
});

// Check if 'window' is defined (browser environment) before using Redux DevTools
const composeEnhancer =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk))
);
export default store;
