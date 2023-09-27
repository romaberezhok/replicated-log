import { useState } from 'react';
import { MessageForm } from './MessageForm.jsx';
import { MessagesHistory } from './MessagesHistory.jsx';

export default function App() {
    const [messagesHistory, setMessagesHistory] = useState([]);

    const addMessageToHistory = (message) => {
        setMessagesHistory(prevMessages => {
            return [
                ...prevMessages,
                {id: crypto.randomUUID(), message},
            ]
        })
    }

    return (
        <>
            <MessageForm addMessageToHistory={addMessageToHistory} />
            <MessagesHistory messagesHistory={messagesHistory} />
        </>
    )
}

