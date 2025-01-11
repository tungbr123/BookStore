
import api from './../api';
import { toast, useToast } from 'react-toastify';
import showToast from '../../hooks/useToast';
import { Router } from 'react-router';
import { useRouter } from 'next/navigation';

export const loginClient = (email, password) => {
    return async (dispatch) => {
        try {
            // Gọi API đăng nhập bên client
            const response = await api.post('authenticate', {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            if (response.status === 200) {
                const data = await response.data;
                
                const token = data.data.accessToken;
                // console.log(data.data?.user);
                // localStorage.setItem('user', JSON.stringify(data.data?.user));
                dispatch({ type: 'LOGIN_CLIENT_SUCCESS', payload: {
                    token: token,
                    user: data.data.name,
                    userid: data.data.userid,
                    role: data.data.role
                } });
                return data.data.role;
            } else {
                const message = 'Failed to login';
                showToast(message, 1);
                throw new Error(message);
            }
        } catch (error) {

            dispatch({ type: 'LOGIN_CLIENT_FAILURE', payload: error.message });
            const message = 'Check your account or password!';
            showToast(message, 1);
             return 0;
        }
    };
};


export const logout = (token) => {
    return async (dispatch) => {
        try{
            dispatch({ type: 'LOGOUT_SUCCESS', payload: token });
        }catch(error) {
            dispatch({ type: 'LOGOUT_FAILURE', payload: error.message });
            return false;
        }
    }
}
export const register = (firstName, lastName, email, password, phone, CMND) => {
    return async (dispatch) => {
        try {
            // Gọi API đăng ký
            const response = await api.post('register', {
                firstname: firstName,
                lastname: lastName,
                email: email,
                password: password,
                phone: phone,
                cmnd: CMND,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const data = await response.data;
                const token = data.data.accessToken;
                dispatch({ type: 'REGISTER_SUCCESS', payload: token });
                showToast('Sign up successfully');
                return true;
            } else {
                const message = 'Failed to register';
                showToast(message, 1);
                throw new Error(message);
            }
        } catch (error) {
            dispatch({ type: 'REGISTER_FAILURE', payload: error.message });
            const message = 'Errors while registering. Please try again';
            showToast(message, 1);
            return false;
        }
    };
}

export const send_forgot_password = (email) => {
    return async (dispatch) => {
        try {
            // Gọi API lấy mã code
            const response = await api.post('reset-password', {
                email: email,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                showToast('View your email to receive your code');
                return true;
            } 
        } catch (error) {
            const message = 'Check your email!';
            showToast(message, 1);
            return false;
        }
    }
}


export const reset_password = (token, newPassword) => {
    return async (dispatch) => {
        try {
            // Gọi API đặt lại mật khẩu
            const response = await api.post('confirm-password', {
                token: token,
                newPassword: newPassword
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                showToast('Password reset successully!');
                return true;
            } 
        } catch (error) {
            const message = 'Please check your code accurately!';
            showToast(message, 1);
            return false;
        }
    }
}
