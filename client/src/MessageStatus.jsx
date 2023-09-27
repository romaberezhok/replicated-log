import { useEffect, useState } from 'react';
import axios from 'axios';

export function MessageStatus({ id, message }) {
    const [status, setStatus] = useState('pending');
    const [statusText, setStatusText] = useState('Pending...');

    useEffect(() => {
        axios.post('http://localhost:3000/api/messages', { message })
            .then(({ data, status }) => {
                setStatus(status === 201 ? 'success' : 'fail');
                setStatusText(data.status);
            })
            .catch(({ message }) => {
                setStatus('fail');
                setStatusText(`Failed to add message due to the following error: "${message}"`);
                console.error(message);
            });
    }, []);

    return (
        <p>Message: "{message}", status: "{statusText}"</p>
    )
}