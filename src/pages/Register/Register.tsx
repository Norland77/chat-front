import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {chatAPI} from "../../services/ChatServices";

const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [register, {}] = chatAPI.useRegisterMutation();

    const registerFunc = () => {
        register({username, password});
        setPassword('');
        setUsername('');
    }

    return (
        <div>
            <h1>Register</h1>
            <div>
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => {setUsername(e.target.value)}}/>
                <label>Password</label>
                <input type="text" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                <button onClick={() => registerFunc()}>Register</button>
                <Link to={"/login"}>Switch to login</Link>
            </div>
        </div>
    );
};

export default Register;