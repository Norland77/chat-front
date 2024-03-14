import React from 'react';
import {Navigate} from "react-router-dom";

interface PropsType {
    user: string,
    redirectPath: string,
    isLoading: boolean,
    isError: boolean,
    children: JSX.Element
}

const ProtectedRoute = ({ user, redirectPath, children, isLoading, isError }: PropsType) => {
    if ( !user) {
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;