import React from 'react';
import { Alert } from 'reactstrap';

const SuccessAlerts = ({ success }) => {
    return (
        <div>
            {success.length > 0 && (
                <Alert color="primary">
                    <ul>
                        {success.map((succes, index) => (
                            <li key={index}>{succes.message}</li>
                        ))}
                    </ul>
                </Alert>
            )}
        </div>
    );
};

export default SuccessAlerts;