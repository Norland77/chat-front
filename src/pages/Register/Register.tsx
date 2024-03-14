import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import styles from './register.module.scss'
import {authAPI} from "../../services/AuthServices";

const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [register, {}] = authAPI.useRegisterMutation();
    const [isShowPassword, setIsShowPassword] = useState(false)

    const navigate = useNavigate()

    const registerFunc = () => {
        register({username, password});
        setPassword('');
        setUsername('');
        navigate('/login')
    }

    return (
        <div className={styles.register}>
            <h1 className={styles.register_title}>Register</h1>
            <div className={styles.register_body}>
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => {
                    setUsername(e.target.value)
                }}/>
                <label>Password</label>
                <input type={isShowPassword ? "text" : "password"} value={password} onChange={(e) => {
                    setPassword(e.target.value)
                }}/>
                <button onClick={() => setIsShowPassword(!isShowPassword)}>{isShowPassword ? "Hide" : "Show"}</button>
                <button onClick={() => registerFunc()}>Register</button>
                <Link to={"/login"}>Switch to login</Link>
            </div>
        </div>
    );
};

export default Register;