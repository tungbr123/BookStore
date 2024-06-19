import { list } from "@chakra-ui/react";

const initialState = {
    error: null,
    list: null,
    user: null
  };
  
  const userReducer = (state = initialState, action) => {
      switch (action.type) {
        case 'GET_USER_LIST_SUCCESS':
          return {
            ...state,
            list: action.payload,
          };
        case 'GET_USER_LIST_FAILURE':
          return state;
        case 'GET_DETAIL_USER_SUCCESS':
          return {
            ...state,
            user: action.payload,
          };
        case 'GET_DETAIL_USER_FAILURE':
          return state;
        case 'GET_USER_PERMISSION_LIST_SUCCESS':
          return {
            ...state,
            list: action.payload,
          };
        case 'GET_USER_PERMISSION_LIST_FAILURE':
          return state;
        default:
          return state;
      }
    };
    
    export default userReducer;
  