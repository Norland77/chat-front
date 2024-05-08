import React, {Dispatch, SetStateAction, useState} from 'react';
import styles from "../../../pages/Register/register.module.scss";

interface PropsType {
  email: string
  setEmail: Dispatch<SetStateAction<string>>
  confirmCodeFunc: (email: string, code: string) => void
  isConfirmLoading: boolean
}

const ConfirmCode = ({email, setEmail, confirmCodeFunc, isConfirmLoading}: PropsType) => {
  const [code, setCode] = useState('');

  return (
    <div className={styles.register_body}>
      <h1 className={styles.register_title}>Create an account</h1>
      <div className={styles.register_body_down}>
        <label>Email</label>
        <input disabled type="email" value={email} onChange={(e) => {
          setEmail(e.target.value)
        }}/>
        <label>Code</label>
        <input type="code" value={code} onChange={(e) => {
          setCode(e.target.value)
        }}/>
        <button disabled={isConfirmLoading} onClick={() => confirmCodeFunc(email, code)}>{isConfirmLoading ? 'Loading...' : 'Confirm code'}</button>
      </div>
    </div>
  );
};

export default ConfirmCode;