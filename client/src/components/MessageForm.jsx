import { useState } from 'react';

export function MessageForm({ addMessageToHistory }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!message) return;

        addMessageToHistory(message);

        setMessage('');
    }

    return (
        <form className="input-form row justify-content-center align-content-center" onSubmit={ handleSubmit }>
            <div className="col-8">
                <div className="d-flex justify-content-center">
                    <input
                        className="form-control mx-1"
                        type="text"
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type="submit" className="input-btn btn btn-primary mx-1 px-5">Submit</button>
                </div>
            </div>
        </form>
    )
}