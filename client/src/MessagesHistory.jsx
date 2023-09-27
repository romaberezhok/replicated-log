import { MessageStatus } from "./MessageStatus.jsx";

export function MessagesHistory({ messagesHistory }) {
    return (
        <ul>
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
        </ul>
    )
}