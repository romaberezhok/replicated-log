import { useState } from 'react';

export function MessageForm({ addMessageToHistory }) {
    const [message, setMessage] = useState('');
    const [writeConcern, setWriteConcern] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!message) return;

        addMessageToHistory(message, writeConcern);

        setMessage('');
    }

    return (
        <div className="message-form d-flex justify-content-center align-items-center">
            <div className="container row">
                <form className="col-5 mx-auto" onSubmit={ handleSubmit }>
                        <div className="d-flex flex-column align-items-center">
                            <input
                                className="form-control my-1"
                                type="text"
                                placeholder="Message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <input
                                className="form-control my-1"
                                type="number"
                                min="1"
                                placeholder="Write Concern"
                                value={writeConcern}
                                onChange={(e) => setWriteConcern(parseInt(e.target.value))}
                                data-toggle="tooltip"
                                data-placement="right"
                                title="Specifies how many ACKs the master should receive from secondaries before responding to the client"
                            />
                            <button type="submit" className="input-btn btn btn-primary my-1 px-5">Submit</button>
                        </div>
                </form>
            </div>
        </div>
    )
}
