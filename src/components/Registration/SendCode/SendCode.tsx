import React, {Dispatch, SetStateAction} from 'react';
import styles from "../../../pages/Register/register.module.scss";
import {authAPI} from "../../../services/AuthServices";

interface PropsType {
  email: string
  setEmail: Dispatch<SetStateAction<string>>
  sendEmailFunc: (email: string) => void
  isSendLoading: boolean
}

const SendCode = ({email, setEmail, sendEmailFunc, isSendLoading}: PropsType) => {
  return (
    <div className={styles.register_body}>
      <h1 className={styles.register_title}>Create an account</h1>
      <div className={styles.register_body_down}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => {
          setEmail(e.target.value)
        }}/>
        <button disabled={isSendLoading} onClick={() => sendEmailFunc(email)}>{isSendLoading ? 'Loading...' : 'Send confirmation code'}</button>
      </div>
    </div>
  );
};

export default SendCode;