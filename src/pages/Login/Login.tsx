import React, {useEffect, useState} from 'react';
import {Link, Navigate, useNavigate} from "react-router-dom";
import {setId, setName, setToken} from "../../store/reducers/UserSlice";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {jwtDecode} from "jwt-decode";
import styles from './login.module.scss'
import {authAPI} from "../../services/AuthServices";
import {IUser} from "../../interfaces/IUser";

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [login, {data: accessToken}] = authAPI.useLoginMutation();
    const {data: users} = authAPI.useGetAllAccountQuery(null);
    const [deleteAgent, {}] = authAPI.useDeleteAgentMutation();
    const [loginAgent, {data: accessTokenAgent, error: loginAgentError}] = authAPI.useLoginAgentMutation();
    const {username} = useAppSelector(state => state.userReducer);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowAccounts, setIsShowAccounts] = useState(false);
    const [isShowErrorMsg, setIsShowErrorMsg] = useState(false);
    const loginFunc = () => {
        login({email, password});
        setPassword('');
        setEmail('');
    }

    useEffect(() => {
        if (users && users.length > 0) {
            setIsShowAccounts(true)
        }
    }, [users]);

    useEffect(() => {
        // @ts-ignore
        if(loginAgentError?.data.message === 'Unauthorized') {
            setIsShowAccounts(false);
            setIsShowErrorMsg(true);
        }
    }, [loginAgentError]);

    useEffect(() => {
        if (accessToken) {
            dispatch(setToken(accessToken.accessToken));
            const user: IUser = jwtDecode(accessToken.accessToken);
            dispatch(setName(user.username))
            dispatch(setId(user.id))
            return navigate('/home')
        }
        if (accessTokenAgent) {
            dispatch(setToken(accessTokenAgent.accessToken));
            const user: IUser = jwtDecode(accessTokenAgent.accessToken);
            dispatch(setName(user.username))
            dispatch(setId(user.id))
            return navigate('/home')
        }
    }, [accessToken, accessTokenAgent])
    if (username) {
        return (
            <Navigate to={'/home'} replace />
        )
    }

    return (
      <div className={styles.login}>
          <div className={styles.login_switch}>
              <span>Don't have an account? <Link to={"/"}>Sign up</Link></span>
              <span className={styles.login_switch_down}>Forget your user ID or password?</span>
          </div>
          {
              !isShowAccounts ?
                <div className={styles.login_body}>
                    {
                        isShowErrorMsg && <span>Your access has expired, please log in again</span>
                    }
                    <h1 className={styles.login_title}>Sign In</h1>
                    <div className={styles.login_body_down}>
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => {
                            setEmail(e.target.value)
                        }}/>
                        <label>Password</label>
                        <div className={styles.password}>
                            <input type={isShowPassword ? "text" : "password"} value={password} onChange={(e) => {
                                setPassword(e.target.value)
                            }}/>
                            <button onClick={() => setIsShowPassword(!isShowPassword)}>{isShowPassword
                              ?
                              <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M22 12C22 12 21.3082 13.3317 20 14.8335M10 5.23552C10.3244 5.15822 10.6578 5.09828 11 5.05822C11.3254 5.02013 11.6588 5 12 5C14.8779 5 17.198 6.43162 18.8762 8M12 9C12.3506 9 12.6872 9.06015 13 9.17071C13.8524 9.47199 14.528 10.1476 14.8293 11C14.9398 11.3128 15 11.6494 15 12M3 3L21 21M12 15C11.6494 15 11.3128 14.9398 11 14.8293C10.1476 14.528 9.47202 13.8524 9.17073 13C9.11389 12.8392 9.07037 12.6721 9.0415 12.5M4.14701 9C3.83877 9.34451 3.56234 9.68241 3.31864 10C2.45286 11.1282 2 12 2 12C2 12 5.63636 19 12 19C12.3412 19 12.6746 18.9799 13 18.9418" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              :
                              <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M22 12C22 12 18.3636 19 12 19C5.63636 19 2 12 2 12C2 12 5.63636 5 12 5C14.8779 5 17.198 6.43162 18.8762 8M9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                            }</button>
                        </div>
                        <button onClick={() => loginFunc()}>Sign In</button>
                        <button onClick={() => {setIsShowAccounts(true)}}>Saved accounts</button>
                    </div>
                </div>
                :
                <div className={styles.acconts}>
                    <h3>Login as</h3>
                    {
                      users && users.map(user=> (
                        <div className={styles.acconts_body}>
                            <div onClick={() => loginAgent({id: user.user.id})}>
                                <span>{ user.user.username }</span>
                                { user.user.avatar_url ? <img src={user.user.avatar_url} alt="avatar"/> : <div>{user.user.username[0]}</div>}
                            </div>
                            <svg onClick={() => {deleteAgent({id: user.user.id})}} width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M20.5 6H3.49988" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5M18.8334 8.5L18.6334 11.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M9.5 11L10 16" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M14.5 11L14 16" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </div>

                      ))
                    }
                    <button onClick={() => {setIsShowAccounts(false)}}>Login to another account</button>
                </div>
          }
      </div>
    );
};

export default Login;