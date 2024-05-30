import React from 'react';
import { Alert } from 'reactstrap';

const ErrorAlerts = ({ errors }) => {
    return (
        <div>
            {errors.length > 0 && (
                <Alert color="danger">
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error.message}</li>
                        ))}
                    </ul>
                </Alert>
            )}
        </div>
    );
};

export default ErrorAlerts;