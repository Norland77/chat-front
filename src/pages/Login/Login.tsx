import React from 'react';
import {Link} from "react-router-dom";

const Login = () => {
    return (
        <div>
            <h1>Login</h1>
            <div>
                <label>Username</label>
                <input type="text"/>
                <label>Password</label>
                <input type="text"/>
                <button>Register</button>
                <Link to={"/"}>Switch to register</Link>
            </div>
        </div>
    );
};

export default Login;