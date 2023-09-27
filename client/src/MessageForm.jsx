import { useState } from "react";

export function MessageForm({ addMessageToHistory }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!message) return;

        addMessageToHistory(message);

        setMessage('');
    }

    return (
        <form onSubmit={ handleSubmit }>
            <input
                id="message"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button className="btn">Hello 3</button>
        </form>
    )
}