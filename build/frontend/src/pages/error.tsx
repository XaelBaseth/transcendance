import React from 'react';
import { useParams } from "react-router-dom";
import '../styles/Error.css'

const ErrorPage = () => {
    const { status } = useParams();

    let errorMsg = '';
    switch (status) {
        case '400':
            errorMsg = 'Bad  Request';
            break ;
        case '401':
            errorMsg = 'Unauthorized';
            break ;
        case '403':
            errorMsg = 'Forbidden';
            break ;
        case '404':
            errorMsg = 'Page  Not  Found';
            break ;
        case '500':
            errorMsg = 'Internal  Server  Error';
            break ;
    default:
        errorMsg = 'Ressource Not  Found';
    }

    return (
        <div className="Error">
            <div className="background" />
            <form className="connection-error-form">
                <h1>Error {status}</h1>
                <p className="error-message">{errorMsg}</p>
            </form>
        </div>
    );
};

export default ErrorPage;