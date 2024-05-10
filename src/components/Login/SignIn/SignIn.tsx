import React, {Dispatch, SetStateAction, useState} from 'react';
import styles from "../../../pages/Login/login.module.scss";
import {authAPI} from "../../../services/AuthServices";

interface PropsType {
  loginMutFunc: (email: string, password: string) => void;
  isShowErrorMsg: boolean;
  setIsShowAccounts: Dispatch<SetStateAction<boolean>>
}

const SignIn = ({loginMutFunc, isShowErrorMsg, setIsShowAccounts}: PropsType) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [login, {data: accessToken}] = authAPI.useLoginMutation();
  const loginFunc = () => {
    loginMutFunc(email, password)
    setPassword('');
    setEmail('');
  }

  return (
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
  );
};

export default SignIn;