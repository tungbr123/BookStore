import Cookies from 'js-cookie';

const initialState = {
    token: Cookies.get('token') || null,
    user: Cookies.get('user') || null,
    userid: Cookies.get('userid') || null,
    role: Cookies.get('role') || null,
    error: null,
    //isLoggedIn: false,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        // case 'LOGIN_SUCCESS':
        //     Cookies.set('token', action.payload, { expires: 0.5 });
        //     return {
        //         ...state,
        //         token: action.payload,
        //         error: null,
        //     };
        // case 'LOGIN_FAILURE':
        //     return {
        //         ...state,
        //         token: null,
        //         error: action.payload,
        //     };
        case 'LOGOUT_SUCCESS':
            Cookies.remove('token');
            return {
                ...state,
                token: null,
                user: null,
                userid: null,
                role: null,
                error: null,
            };
        case 'LOGIN_CLIENT_SUCCESS':
            Cookies.set('token', action.payload.token, { expires: 0.5 });
            //Cookies.set('user', JSON.stringify(action.payload.user), { expires: 0.5 });
            Cookies.set('user', action.payload.user, { expires: 0.5 });
            Cookies.set('userid', action.payload.userid, {expires: 0.5})
            Cookies.set('role', action.payload.role, {expires: 0.5})
            return {
                ...state,
                token: action.payload.token,
                //user: JSON.stringify(action.payload.user),
                user: action.payload.user,
                userid: action.payload.userid,
                role: action.payload.role,
                error: null,
            };
        case 'LOGIN_CLIENT_FAILURE':
            return {
                ...state,
                token: null,
                user: null,
                userid: null,
                role: null,
                error: action.payload,
            };
        case 'LOGOUT_FAILURE':
            return {
                ...state,
                token: null,
                error: null,
                
            };
        case 'UPDATE_LOGGED_IN_STATUS':
            return {
                ...state,
                isLoggedIn: action.payload,
            };
        default:
            return state;
    }
};

export default authReducer;
