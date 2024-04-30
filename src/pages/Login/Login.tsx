import React, {useEffect, useState} from 'react';
import {Link, Navigate, useNavigate} from "react-router-dom";
import {setId, setName, setToken} from "../../store/reducers/UserSlice";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {jwtDecode} from "jwt-decode";
import styles from './login.module.scss'
import {authAPI} from "../../services/AuthServices";
import {IUser} from "../../interfaces/IUser";

const Login = () => {

    const [name, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [login, {data: accessToken}] = authAPI.useLoginMutation();
    const {username} = useAppSelector(state => state.userReducer)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isShowPassword, setIsShowPassword] = useState(false)
    const loginFunc = () => {
        login({username: name, password});
        setPassword('');
        setUsername('');
    }

    useEffect(() => {
        if (accessToken) {
            dispatch(setToken(accessToken.accessToken));
            const user: IUser = jwtDecode(accessToken.accessToken);
            dispatch(setName(user.username))
            dispatch(setId(user.id))
            return navigate('/home')
        }
    }, [accessToken])
    if (username) {
        return (
            <Navigate to={'/home'} replace />
        )
    }

    return (
        <div className={styles.login}>
            <h1 className={styles.login_title}>Login</h1>
            <div className={styles.login_body}>
                <label>Username</label>
                <input type="text" value={name} onChange={(e) => {
                    setUsername(e.target.value)
                }}/>
                <label>Password</label>
                <input type={isShowPassword ? "text" : "password"} value={password} onChange={(e) => {
                    setPassword(e.target.value)
                }}/>
                <button onClick={() => setIsShowPassword(!isShowPassword)}>{isShowPassword ? "Hide" : "Show"}</button>
                <button onClick={() => loginFunc()}>Login</button>
                <Link to={"/"}>Switch to register</Link>
            </div>
        </div>
    );
};

export default Login;