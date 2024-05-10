import React, {useEffect, useState} from 'react';
import {Link, Navigate, useNavigate} from "react-router-dom";
import {setId, setName, setToken} from "../../store/reducers/UserSlice";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {jwtDecode} from "jwt-decode";
import styles from './login.module.scss'
import {authAPI} from "../../services/AuthServices";
import {IUser} from "../../interfaces/IUser";
import SignIn from "../../components/Login/SignIn/SignIn";
import Accounts from "../../components/Login/Accounts/Accounts";

const Login = () => {


    const [login, {data: accessToken}] = authAPI.useLoginMutation();
    const {data: users} = authAPI.useGetAllAccountQuery(null);
    const [loginAgent, {data: accessTokenAgent, error: loginAgentError}] = authAPI.useLoginAgentMutation();
    const {username} = useAppSelector(state => state.userReducer);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isShowAccounts, setIsShowAccounts] = useState(false);
    const [isShowErrorMsg, setIsShowErrorMsg] = useState(false);

    const loginMutFunc = (email: string, password: string) => login({email, password})
    const loginAgentFunc = (id: string) => loginAgent({id: id})

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
                <SignIn loginMutFunc={loginMutFunc}
                        setIsShowAccounts={setIsShowAccounts}
                        isShowErrorMsg={isShowErrorMsg}
                />
                :
                <Accounts setIsShowAccounts={setIsShowAccounts}
                          loginAgentFunc={loginAgentFunc}
                          users={users}
                />
          }
      </div>
    );
};

export default Login;