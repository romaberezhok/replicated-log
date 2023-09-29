import { useState } from 'react';
import { MessageForm } from './components/MessageForm.jsx';
import { MessagesHistory } from './components/MessagesHistory.jsx';

export default function App() {
    const [messagesHistory, setMessagesHistory] = useState([]);

    const addMessageToHistory = (message) => {
        setMessagesHistory(prevMessages => {
            return [
                {id: crypto.randomUUID(), createdAt: Date.now(), message},
                ...prevMessages,
            ]
        })
    }

    return (
        <div className="container">
            <MessageForm addMessageToHistory={addMessageToHistory} />
            <MessagesHistory messagesHistory={messagesHistory} />
        </div>
    )
}
