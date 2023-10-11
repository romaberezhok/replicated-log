export function NodesMessagesTable() {
    const nodesMessages = {
        "master": ["msg1", "msg2", "msg3"],
        "secondary 1": ["msg1", "msg2", "msg3", "msg4"],
        "secondary 2": ["msg1", "msg2", "msg3"],
    }

    const maxMessageCount = Math.max(...Object.values(nodesMessages).map(messages => messages.length));
    const tableRows = [];

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
        <table className="table table-hover table-primary">
            <thead>
                <tr>
                    <th scope="col" className="text-center">#</th>
                    {
                        Object.keys(nodesMessages).map((node, index) => <th scope="col" className="text-center" key={ index }>{ node }</th>)
                    }
                </tr>
            </thead>
            <tbody>
                { tableRows }
            </tbody>
        </table>
    )
}