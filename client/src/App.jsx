import { useState } from 'react';
import { NodesMessagesTable } from './components/NodesMessagesTable.jsx';
import { MessageForm } from './components/MessageForm.jsx';
import { MessagesHistory } from './components/MessagesHistory.jsx';

export default function App() {
    const [messagesHistory, setMessagesHistory] = useState([]);

    const addMessageToHistory = (message, writeConcern) => {
        setMessagesHistory(prevMessages => {
            return [
                {id: crypto.randomUUID(), createdAt: Date.now(), message, writeConcern},
                ...prevMessages,
            ]
        })
    }

    return (
        <>
            <MessageForm addMessageToHistory={addMessageToHistory} />
            <MessagesHistory messagesHistory={messagesHistory} />
            <NodesMessagesTable />
        </>
    )
}
