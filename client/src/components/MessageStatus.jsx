import axios from 'axios';
import { useEffect, useState } from 'react';

export function MessageStatus({ id, createdAt, message, writeConcern }) {
    const [status, setStatus] = useState('pending');
    const [statusText, setStatusText] = useState('Pending...');
    const statusToColorMapping = {
        pending: '#AAAAAA',
        success: '#4BB543',
        fail: '#FC100D',
    };

    useEffect(() => {
        axios.post('http://localhost:3000/api/messages', { message, writeConcern })
            .then(({ data, status }) => {
                setStatus(status === 201 ? 'success' : 'fail');
                setStatusText(data.status);
            })
            .catch(({ response, message }) => {
                setStatus('fail');
                setStatusText(response?.data.status || message);
            });
    }, []);

    return (
        <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
                <svg className="bd-placeholder-img rounded me-2" width="20" height="20" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false">
                    <rect width="100%" height="100%" fill={ statusToColorMapping[status] }/>
                </svg>
                <strong className="me-auto">{ message }</strong>
                <small className="text-muted">{ new Date(createdAt).toLocaleTimeString() }</small>
                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"/>
            </div>
            <div className="toast-body">
                { statusText }
            </div>
        </div>
    )
}
