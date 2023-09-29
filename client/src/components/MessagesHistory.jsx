import { MessageStatus } from './MessageStatus.jsx';

export function MessagesHistory({ messagesHistory }) {
    return (
        <div className="toast-container position-absolute top-0 end-0 p-3">
            {
                messagesHistory.map((message) => {
                    return (
                        <MessageStatus
                            {...message}
                            key={message.id}
                        />
                    )
                })
            }
        </div>
    )
}
