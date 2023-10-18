import axios from 'axios';
import { useEffect, useState } from 'react';

export function NodesMessagesTable() {
    const [nodesMessages, setNodesMessages] = useState({});
    const maxMessageCount = Math.max(...Object.values(nodesMessages).map(messages => messages.length));
    const tableRows = [];

    const refreshTable = () => {
        axios.get('http://localhost:3000/api/messages/all')
            .then(({ data }) => {
                setNodesMessages(data);
            })
            .catch(({ response, message }) => {
                console.error(response?.data.status || message)
            });
    }

    useEffect(() => {
        refreshTable();
    }, []);

    for (let i = 0; i < maxMessageCount; i++) {
        const rowCells = Object.keys(nodesMessages).map((node, index) => (
            <td className="text-center" key={ index }>
                { nodesMessages[node][i] || '' }
            </td>
        ));

        tableRows.push(
            <tr key={ i }>
                <th scope="row" className="text-center">{ i + 1 }</th>
                { rowCells }
            </tr>
        );
    }

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center my-4">
            <table className="table table-hover">
                <thead className="table-light">
                    <tr>
                        <th scope="col" className="text-center text-uppercase">#</th>
                        {
                            Object.keys(nodesMessages).map((node, index) => <th scope="col" className="text-center text-uppercase" key={ index }>{ node }</th>)
                        }
                    </tr>
                </thead>
                <tbody>
                    { tableRows }
                </tbody>
            </table>
            <button className="btn btn-primary my-1 px-5" onClick={ refreshTable }>
                Refresh
            </button>
        </div>
    )
}