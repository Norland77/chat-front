import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import styles from './register.module.scss'
import {authAPI} from "../../services/AuthServices";
import Registration from "../../components/Registration/Registration/Registration";
import SendCode from "../../components/Registration/SendCode/SendCode";
import ConfirmCode from "../../components/Registration/ConfirmCode/ConfirmCode";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmCode, {data: isConfirm, isLoading: isConfirmLoading}] = authAPI.useConfirmCodeMutation();
    const [sendEmail, {data: isSend, isLoading: isSendLoading}] = authAPI.useSendCodeMutation();
    const [isShowPassword, setIsShowPassword] = useState(false);

    const sendEmailFunc = (email: string) => {
        sendEmail({email});
    }

    const confirmCodeFunc = (email: string, code: string) => {
        confirmCode({email, code})
    }

    useEffect(() => {
        console.log(isConfirm, isSend)
    }, [isConfirm, isSend]);

    return (
        <div className={styles.register}>
            <div className={styles.register_switch}>
                <span>Already have an account? <Link to={"/login"}>Log in</Link></span>
                <span className={styles.register_switch_down}>Forget your user ID or password?</span>
            </div>
            {
                isSend === undefined ? <SendCode email={email}
                                                 setEmail={setEmail}
                                                 sendEmailFunc={sendEmailFunc}
                                                 isSendLoading={isSendLoading}
                  /> :
                  isSend === true && isConfirm === undefined ? <ConfirmCode email={email}
                                                                            setEmail={setEmail}
                                                                            confirmCodeFunc={confirmCodeFunc}
                                                                            isConfirmLoading={isConfirmLoading}
                    /> :
                    isConfirm === true ? <Registration username={username}
                                                       setUsername={setUsername}
                                                       email={email}
                                                       setEmail={setEmail}
                                                       password={password}
                                                       setPassword={setPassword}
                                                       isShowPassword={isShowPassword}
                                                       setIsShowPassword={setIsShowPassword}
                    /> : <></>
            }
        </div>
    );
};

export default Register;