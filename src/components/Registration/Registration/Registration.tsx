import React, {Dispatch, SetStateAction} from 'react';
import styles from "../../../pages/Register/register.module.scss";
import {authAPI} from "../../../services/AuthServices";
import {useNavigate} from "react-router-dom";

interface PropsType {
  username: string
  setUsername: Dispatch<SetStateAction<string>>
  email: string
  setEmail: Dispatch<SetStateAction<string>>
  password: string
  setPassword: Dispatch<SetStateAction<string>>
  isShowPassword: boolean
  setIsShowPassword: Dispatch<SetStateAction<boolean>>
}

const Registration = ({isShowPassword, password, setIsShowPassword, setPassword, setUsername, username, setEmail, email}: PropsType) => {
  const [register, {}] = authAPI.useRegisterMutation();
  const navigate = useNavigate()
  const registerFunc = () => {
    register({username, password, email});
    setPassword('');
    setUsername('');
    navigate('/login')
  }

  return (
    <div className={styles.register_body}>
      <h1 className={styles.register_title}>Create an account</h1>
      <div className={styles.register_body_down}>
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => {
          setUsername(e.target.value)
        }}/>
        <label>Email</label>
        <input disabled type="email" value={email} onChange={(e) => {
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
        <button onClick={() => registerFunc()}>Register</button>
      </div>
    </div>
  );
};

export default Registration;