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
        <form className="row justify-content-center align-content-center" onSubmit={ handleSubmit } style={{height: '60vh'}}>
            <div className="col-8">
                <div className="d-flex justify-content-center">
                    <input
                        className="form-control mx-1"
                        type="text"
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary mx-1 px-5">Submit</button>
                </div>
            </div>
        </form>
    )
}