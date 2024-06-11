
import api from './../api';
import { toast } from 'react-toastify';
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
                showToast('Đăng nhập thành công');
                return data.data.role;
            } else {
                const message = 'Đăng nhập thất bại';
                showToast(message, 1);
                throw new Error(message);
            }
        } catch (error) {

            dispatch({ type: 'LOGIN_CLIENT_FAILURE', payload: error.message });
            const message = 'Vui lòng kiểm tra lại tài khoản hoặc mật khẩu!';
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
                showToast('Đăng ký thành công');
                return true;
            } else {
                const message = 'Đăng ký thất bại';
                showToast(message, 1);
                throw new Error(message);
            }
        } catch (error) {
            dispatch({ type: 'REGISTER_FAILURE', payload: error.message });
            const message = 'Đã xảy ra lỗi khi đăng ký tài khoản. Vui lòng thử lại sau.';
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
                showToast('Sang email của bạn để lấy mã code');
                return true;
            } 
        } catch (error) {
            const message = 'Vui lòng kiểm tra lại email!';
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
                showToast('Đặt lại mật khẩu thành công');
                return true;
            } 
        } catch (error) {
            const message = 'Vui lòng kiểm tra lại mã code!';
            showToast(message, 1);
            return false;
        }
    }
}
